import * as d3 from "d3";

// ========================= Config =========================
const EDGE_TYPES = ["call", "use", "module-procedure-of", "binds-to", "uses-type"];
const TYPE_ALIAS = new Map([["module_procedure_of", "module-procedure-of"]]); // tolerate underscores

const EDGE_COLORS = {
  "call":               "#6aa0ff",
  "use":                "#7bd389",
  "module-procedure-of":"#f59e0b",
  "binds-to":           "#ef4444",
  "uses-type":          "#a78bfa"
};

// Base (screen-space) size for arrowheads; we’ll rescale with 1/zoom.k.
const ARROW_BASE = 8;      // px-ish (markerWidth/Height)
const ARROW_REFX = 10;     // how far tip sits from end of line (we’ll scale it too)

// ========================= Data ===========================
const deps = await fetch("./deps.json").then(r => r.json());

// ========================= DOM ============================
const svg = d3.select("#viz");
const gMain  = svg.append("g");
const gDefs  = svg.append("defs");   // markers live here
const gLinks = gMain.append("g");
const gNodes = gMain.append("g");
const gLabels= gMain.append("g");

const info   = document.querySelector("#info");
const edgeTypeSel = document.querySelector("#edgeType");
const filterInput = document.querySelector("#filter");
const labelsToggle = document.querySelector("#labels");
const legendEl = document.querySelector("#legend");

// build interactive legend with checkboxes
const selectedTypes = new Set(EDGE_TYPES);
function makeLegend() {
  legendEl.innerHTML = "";
  for (const t of EDGE_TYPES) {
    const row = document.createElement("div"); row.className = "row";

    const sw = document.createElement("div");
    sw.className = "swatch"; sw.style.background = EDGE_COLORS[t];
    legendEl.appendChild(sw);

    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = selectedTypes.has(t);
    cb.dataset.type = t;
    cb.addEventListener("change", () => {
      if (cb.checked) selectedTypes.add(t); else selectedTypes.delete(t);
      // If nothing selected, prevent empty graph: keep at least one on.
      if (selectedTypes.size === 0) { selectedTypes.add(t); cb.checked = true; }
      run(currentEdgeMode(), filterInput.value);
    });
    const name = document.createElement("span");
    name.className = "name"; name.textContent = t;
    label.appendChild(cb); label.appendChild(name);
    legendEl.appendChild(label);
  }
}
makeLegend();

// enable/disable legend depending on edgeTypeSel
function syncLegendEnablement() {
  const isAll = edgeTypeSel.value === "all";
  legendEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.disabled = !isAll;
    // If not "all", reflect the single selected type visually.
    if (!isAll) {
      cb.checked = (cb.dataset.type === edgeTypeSel.value);
    } else {
      cb.checked = selectedTypes.has(cb.dataset.type);
    }
  });
}
function currentEdgeMode() {
  if (edgeTypeSel.value === "all") return [...selectedTypes];
  return [edgeTypeSel.value];
}

// ========================= Helpers ========================
const colorByType = t => EDGE_COLORS[t] || "#999";
const colorByKind = d3.scaleOrdinal()
  .domain(["module","program","subroutine","function","interface","generic","type","unknown"])
  .range(d3.schemeTableau10);

function normType(t) { return TYPE_ALIAS.get(t) || t; }
function nodeKey(d){ return d.id; }

function filterNodes(nodes, q) {
  if (!q) return nodes;
  const t = q.toLowerCase();
  return nodes.filter(n =>
    (n.id||"").toLowerCase().includes(t) ||
    (n.name||"").toLowerCase().includes(t) ||
    (n.scope||"").toLowerCase().includes(t) ||
    (n.kind||"").toLowerCase().includes(t)
  );
}

function buildGraph(types, query) {
  const nodesById = new Map(deps.nodes.map(n => [n.id, { ...n }]));
  const want = new Set(types);

  // collect links; allow parallel edges with different types
  const uniq = new Set();
  const links = [];

  for (const l of deps.links) {
    const t = normType(l.type);
    if (!want.has(t)) continue;
    const s = typeof l.source === "string" ? l.source : l.source?.id;
    const tId = typeof l.target === "string" ? l.target : l.target?.id;
    if (!nodesById.has(s) || !nodesById.has(tId)) continue;

    const key = `${s}\t${tId}\t${t}`;
    if (uniq.has(key)) continue;
    uniq.add(key);
    links.push({ source: nodesById.get(s), target: nodesById.get(tId), etype: t });
  }

  // filter nodes -> induced subgraph
  const keep = new Set(filterNodes([...nodesById.values()], query).map(n => n.id));
  const filteredLinks = links.filter(l => keep.has(l.source.id) || keep.has(l.target.id));
  const used = new Set();
  for (const l of filteredLinks) { used.add(l.source.id); used.add(l.target.id); }
  const nodes = [...used].map(id => nodesById.get(id));

  // degree for sizing
  const deg = new Map([...used].map(id => [id, 0]));
  for (const l of filteredLinks) {
    deg.set(l.source.id, (deg.get(l.source.id)||0) + 1);
    deg.set(l.target.id, (deg.get(l.target.id)||0) + 1);
  }
  for (const n of nodes) n.degree = deg.get(n.id) || 0;

  return { nodes, links: filteredLinks };
}

// neighbors map for highlighting
function getNeighborsMap(links) {
  const nb = new Map();
  for (const l of links) {
    (nb.get(l.source.id) || nb.set(l.source.id, new Set()).get(l.source.id)).add(l.target.id);
    (nb.get(l.target.id) || nb.set(l.target.id, new Set()).get(l.target.id)).add(l.source.id);
  }
  return nb;
}

// ========================= Markers (arrows) =========================
// We use <marker> + marker-end (MDN) and keep size constant by rescaling
// markerWidth/Height/refX by 1 / zoom.k when zooming. We also set
// vector-effect: non-scaling-stroke on links so stroke width stays constant. :contentReference[oaicite:1]{index=1}
function defineMarkers() {
  gDefs.selectAll("marker").remove();
  for (const t of EDGE_TYPES) {
    const m = gDefs.append("marker")
      .attr("id", `arrow-${t}`)
      .attr("viewBox", "0 -4 8 8")
      .attr("markerUnits", "userSpaceOnUse") // absolute units; we’ll rescale on zoom
      .attr("refX", ARROW_REFX)
      .attr("refY", 0)
      .attr("markerWidth", ARROW_BASE)
      .attr("markerHeight", ARROW_BASE)
      .attr("orient", "auto");

    m.append("path")
      .attr("d", "M0,-4 L8,0 L0,4 Z")
      .attr("fill", EDGE_COLORS[t]);
  }
}
function rescaleMarkers(k) {
  // size markers inversely to zoom so they appear constant on screen
  gDefs.selectAll("marker")
    .attr("markerWidth", ARROW_BASE / k)
    .attr("markerHeight", ARROW_BASE / k)
    .attr("refX", ARROW_REFX / k);
}

// ========================= Zoom ===========================
const zoom = d3.zoom()
  .on("zoom", ev => {
    gMain.attr("transform", ev.transform);
    rescaleMarkers(ev.transform.k); // keep arrowheads constant on screen
  });
// d3-zoom is the standard pan/zoom behavior for SVG. :contentReference[oaicite:2]{index=2}
svg.call(zoom);

// ========================= Simulation & Render =============
function run(typesOrMode, query = "") {
  defineMarkers(); // rebuild (cheap) so colors stay in sync
  const types = Array.isArray(typesOrMode) ? typesOrMode : [typesOrMode];
  const { nodes, links } = buildGraph(types, query);

  // Force simulation (standard d3-force usage). :contentReference[oaicite:3]{index=3}
  const sim = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(d => (d.kind === "module" ? -220 : -90)))
    .force("link", d3.forceLink(links).id(nodeKey).distance(d => 42 + 2*Math.min(d.source.degree,d.target.degree)).strength(0.35))
    .force("collide", d3.forceCollide().radius(d => 4 + Math.sqrt(2 + d.degree)).iterations(2))
    .force("x", d3.forceX().strength(0.06))
    .force("y", d3.forceY().strength(0.06));

  // ----- joins -----
  const linkSel = gLinks.selectAll("line").data(links, d => d.source.id + "→" + d.target.id + ":" + d.etype);
  linkSel.exit().remove();
  const linkEnter = linkSel.enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", 1.2)
    .attr("stroke-linecap", "round");
  const link = linkEnter.merge(linkSel)
    .attr("stroke", d => colorByType(d.etype))
    .attr("marker-end", d => `url(#arrow-${d.etype})`);

  const nodeSel = gNodes.selectAll("circle").data(nodes, nodeKey);
  nodeSel.exit().remove();
  const nodeEnter = nodeSel.enter().append("circle")
    .attr("class", "node")
    .attr("r", d => 3 + Math.sqrt(1 + d.degree))
    .attr("fill", d => colorByKind(d.kind))
    .attr("stroke", "#0b0e12")
    .attr("stroke-width", 0.75)
    .call(
      d3.drag()
        .on("start", (ev, d) => { if (!ev.active) sim.alphaTarget(0.2).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag",  (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
        .on("end",   (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );
  const node = nodeEnter.merge(nodeSel);

  const labelSel = gLabels.selectAll("text").data(nodes, nodeKey);
  labelSel.exit().remove();
  const label = labelSel.enter().append("text")
    .attr("class","label")
    .attr("text-anchor","middle")
    .attr("dy","-0.75em")
    .text(d => d.name || d.id)
    .merge(labelSel);

  // ----- highlighting -----
  const neighbors = getNeighborsMap(links);
  node.on("mouseenter", (_, d) => showInfo(d, links))
      .on("mouseleave", () => clearHighlight())
      .on("mousemove", (ev, d) => maybeHighlight(d));

  function maybeHighlight(d) {
    const nb = neighbors.get(d.id) || new Set();
    node.classed("highlight", n => n.id === d.id || nb.has(n.id))
        .attr("opacity", n => (n.id === d.id || nb.has(n.id)) ? 1 : 0.2);
    link.classed("highlight", l => l.source.id === d.id || l.target.id === d.id)
        .attr("opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 0.9 : 0.12)
        .attr("stroke-width", l => (l.source.id === d.id || l.target.id === d.id) ? 2.2 : 1.2);
    label.attr("opacity", n => (labelsToggle.checked ? ((n.id === d.id || nb.has(n.id)) ? 1 : 0.05) : 0));
  }
  function clearHighlight() {
    node.classed("highlight", false).attr("opacity", 1);
    link.classed("highlight", false).attr("opacity", 0.28).attr("stroke-width", 1.2);
    label.attr("opacity", labelsToggle.checked ? 1 : 0);
  }

  // ----- panel -----
  function showInfo(d, links) {
    const incoming = links.filter(l => l.target.id === d.id);
    const outgoing = links.filter(l => l.source.id === d.id);
    const inCounts  = countByType(incoming);
    const outCounts = countByType(outgoing);
    const details = {
      id: d.id, name: d.name, kind: d.kind, scope: d.scope,
      file: d.file, line: d.line, visibility: d.visibility,
      attrs: d.attrs, result: d.result, dummies: d.dummies,
      in_degree: incoming.length, out_degree: outgoing.length,
      in_by_type:  inCounts, out_by_type: outCounts
    };
    info.innerHTML = `
      <h1>${d.name || d.id}</h1>
      <div class="muted">${d.kind}${d.scope ? ` — scope: ${d.scope}` : ""}</div>
      <div style="margin:8px 0">in: <b>${incoming.length}</b> • out: <b>${outgoing.length}</b></div>
      <pre>${escapeHtml(JSON.stringify(details, null, 2))}</pre>
    `;
  }
  function countByType(arr){ const m={}; for(const l of arr) m[l.etype]=(m[l.etype]||0)+1; return m; }
  function escapeHtml(s){return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  // ----- ticks -----
  sim.on("tick", () => {
    link
      .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    node.attr("cx", d => d.x).attr("cy", d => d.y);
    label.attr("x", d => d.x).attr("y", d => d.y);
  });

  // labels toggle
  label.attr("opacity", labelsToggle.checked ? 1 : 0);

  // fit-on-start (after a short settle)
  if (nodes.length) {
    setTimeout(() => {
      const [minX, minY, maxX, maxY] = extentXY(nodes);
      const w = maxX - minX, h = maxY - minY;
      const vb = [minX - 40, minY - 40, w + 80, h + 80];
      svg.transition().duration(400)
        .call(zoom.transform, d3.zoomIdentity
          .translate(svg.node().clientWidth/2, svg.node().clientHeight/2)
          .scale(Math.min(svg.node().clientWidth/vb[2], svg.node().clientHeight/vb[3]))
          .translate(-(vb[0]+vb[2]/2), -(vb[1]+vb[3]/2))));
    }, 300);
  }
}

function extentXY(nodes){
  let minX=+Infinity,minY=+Infinity,maxX=-Infinity,maxY=-Infinity;
  for (const n of nodes){ if(n.x<minX)minX=n.x; if(n.y<minY)minY=n.y; if(n.x>maxX)maxX=n.x; if(n.y>maxY)maxY=n.y; }
  return [minX,minY,maxX,maxY];
}

// ========================= Controls =======================
edgeTypeSel.addEventListener("change", () => { syncLegendEnablement(); run(currentEdgeMode(), filterInput.value); });
filterInput.addEventListener("input", d3.debounce?.( () => run(currentEdgeMode(), filterInput.value), 200) || (()=>run(currentEdgeMode(), filterInput.value)));
labelsToggle.addEventListener("change", () => run(currentEdgeMode(), filterInput.value));

// boot
syncLegendEnablement();
run(currentEdgeMode(), filterInput.value);

