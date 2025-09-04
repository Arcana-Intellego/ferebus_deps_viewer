import * as d3 from "d3";

// ---------- Edge types & colors ----------
const EDGE_TYPES = ["call", "use", "module-procedure-of", "binds-to", "uses-type"];
const TYPE_ALIAS = new Map([["module_procedure_of", "module-procedure-of"]]);
const EDGE_COLORS = {
  "call":               "#6aa0ff",
  "use":                "#7bd389",
  "module-procedure-of":"#f59e0b",
  "binds-to":           "#ef4444",
  "uses-type":          "#a78bfa"
};

// active types for the legend (all on by default)
const activeTypes = new Set(EDGE_TYPES);

// ---------- Load data ----------
const deps = await fetch("./deps.json").then(r => r.json());

// ---------- DOM refs ----------
const svg = d3.select("#viz");
const gMain  = svg.append("g");
const gDefs  = svg.append("defs");        // for markers
const gLinks = gMain.append("g");
const gNodes = gMain.append("g");
const gLabels= gMain.append("g");

const info   = document.querySelector("#info");
const edgeTypeSel = document.querySelector("#edgeType");
const filterInput = document.querySelector("#filter");
const labelsToggle = document.querySelector("#labels");
const legendEl = document.querySelector("#legend");

// ---------- Helpers ----------
const colorByType = (t) => EDGE_COLORS[t] || "#999";
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

function buildGraph(edgeType, query) {
  const nodesById = new Map(deps.nodes.map(n => [n.id, { ...n }]));

  // Decide which link types to include
  let types;
  if (edgeType === "all") {
    types = [...activeTypes];
  } else {
    types = [edgeType];
  }

  // Collect links (allow parallel edges of different types)
  const uniq = new Set();
  const links = [];
  for (const l of deps.links) {
    const t = normType(l.type);
    if (!types.includes(t)) continue;

    const sId = typeof l.source === "string" ? l.source : l.source?.id;
    const tId = typeof l.target === "string" ? l.target : l.target?.id;
    if (!nodesById.has(sId) || !nodesById.has(tId)) continue;

    const key = `${sId}\t${tId}\t${t}`;
    if (uniq.has(key)) continue;
    uniq.add(key);
    links.push({ source: nodesById.get(sId), target: nodesById.get(tId), etype: t });
  }

  // Induced subgraph by filter query
  const keep = new Set(filterNodes([...nodesById.values()], query).map(n => n.id));
  const filtered = links.filter(l => keep.has(l.source.id) || keep.has(l.target.id));

  // Nodes actually used
  const used = new Set();
  for (const l of filtered) { used.add(l.source.id); used.add(l.target.id); }
  const nodes = [...used].map(id => nodesById.get(id));

  // Degree for sizing
  const deg = new Map([...used].map(id => [id, 0]));
  for (const l of filtered) {
    deg.set(l.source.id, (deg.get(l.source.id)||0)+1);
    deg.set(l.target.id, (deg.get(l.target.id)||0)+1);
  }
  for (const n of nodes) n.degree = deg.get(n.id) || 0;

  return { nodes, links: filtered };
}

// ---------- Legend (checkbox toggles) ----------
function renderLegend() {
  legendEl.innerHTML = ""; // rebuild fresh
  const inAllMode = edgeTypeSel.value === "all";

  for (const t of EDGE_TYPES) {
    const row = document.createElement("div");
    row.className = "row";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = activeTypes.has(t);
    cb.disabled = !inAllMode;
    cb.addEventListener("change", () => {
      if (cb.checked) activeTypes.add(t); else activeTypes.delete(t);
      run(edgeTypeSel.value, filterInput.value); // live update
    });

    const label = document.createElement("label");
    if (!inAllMode) label.classList.add("disabled");
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = EDGE_COLORS[t];
    label.appendChild(swatch);
    label.appendChild(document.createTextNode(t));

    row.appendChild(cb);
    row.appendChild(label);
    legendEl.appendChild(row);
  }
}

// ---------- SVG arrow markers (per edge type), scale-proof ----------
const markerBase = { width: 10, height: 10, refX: 12 }; // logical base (graph units with userSpaceOnUse)

function ensureMarkers() {
  gDefs.selectAll("marker").remove();
  for (const t of EDGE_TYPES) {
    gDefs.append("marker")
      .attr("id", `arrow-${t}`)
      .attr("markerUnits", "userSpaceOnUse") // size in user space; we will rescale on zoom. MDN. :contentReference[oaicite:0]{index=0}
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", markerBase.refX)
      .attr("refY", 0)
      .attr("markerWidth", markerBase.width)
      .attr("markerHeight", markerBase.height)
      .attr("orient", "auto")
      .append("path")
        .attr("d", "M0,-4 L8,0 L0,4 Z")
        .attr("fill", EDGE_COLORS[t]);
  }
}

// Update marker size inversely with zoom.k so arrowheads stay constant on screen.
function resizeMarkersForZoom(k) {
  // keep a minimum to avoid zero at extreme zooms
  const w = markerBase.width / k;
  const h = markerBase.height / k;
  const rx = markerBase.refX / k;
  for (const t of EDGE_TYPES) {
    const m = gDefs.select(`#arrow-${t}`);
    m.attr("markerWidth", w).attr("markerHeight", h).attr("refX", rx);
  }
}

// ---------- Zoom / Pan ----------
const zoom = d3.zoom().on("zoom", (ev) => {
  gMain.attr("transform", ev.transform);
  resizeMarkersForZoom(ev.transform.k); // keep arrowheads constant in screen space
});
svg.call(zoom); // D3 zoom API. :contentReference[oaicite:1]{index=1}

// ---------- Main render / simulation ----------
function run(edgeType = "all", query = "") {
  renderLegend();
  ensureMarkers();
  resizeMarkersForZoom(d3.zoomTransform(svg.node()).k); // set initial marker size to current zoom

  const { nodes, links } = buildGraph(edgeType, query);

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
    .attr("stroke-width", 1.2);
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
    )
    .on("mouseenter", (_, d) => showInfo(d, links))
    .on("mouseleave", () => clearHighlight())
    .on("mousemove", (ev, d) => maybeHighlight(d));

  const node = nodeEnter.merge(nodeSel);

  const labelSel = gLabels.selectAll("text").data(nodes, nodeKey);
  labelSel.exit().remove();
  const label = labelSel.enter().append("text")
    .attr("class","label")
    .attr("text-anchor","middle")
    .attr("dy","-0.75em")
    .text(d => d.name || d.id)
    .merge(labelSel);

  // ----- neighbor highlighting -----
  const neighbors = getNeighborsMap(links);
  function getNeighborsMap(links) {
    const nb = new Map();
    for (const l of links) {
      (nb.get(l.source.id) || nb.set(l.source.id, new Set()).get(l.source.id)).add(l.target.id);
      (nb.get(l.target.id) || nb.set(l.target.id, new Set()).get(l.target.id)).add(l.source.id);
    }
    return nb;
  }
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

  // ----- side panel info -----
  function showInfo(d, links) {
    const incoming = links.filter(l => l.target.id === d.id);
    const outgoing = links.filter(l => l.source.id === d.id);

    const details = {
      id: d.id, name: d.name, kind: d.kind, scope: d.scope,
      file: d.file, line: d.line, visibility: d.visibility,
      attrs: d.attrs, result: d.result, dummies: d.dummies,
      in_degree: incoming.length, out_degree: outgoing.length,
      in_by_type:  countByType(incoming),
      out_by_type: countByType(outgoing)
    };
    info.innerHTML = `
      <h1>${d.name || d.id}</h1>
      <div class="muted">${d.kind}${d.scope ? ` — scope: ${d.scope}` : ""}</div>
      <div style="margin:8px 0">in: <b>${incoming.length}</b> • out: <b>${outgoing.length}</b></div>
      <pre>${escapeHtml(JSON.stringify(details, null, 2))}</pre>
    `;
  }
  function countByType(arr){ const m = Object.create(null); for (const l of arr) m[l.etype]=(m[l.etype]||0)+1; return m; }
  function escapeHtml(s){return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  // ----- ticks -----
  sim.on("tick", () => {
    link
      .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);

    node.attr("cx", d => d.x).attr("cy", d => d.y);
    label.attr("x", d => d.x).attr("y", d => d.y);
  });

  label.attr("opacity", labelsToggle.checked ? 1 : 0);

  // Fit view after a brief settle; resize markers to the new zoom afterwards
  if (nodes.length) {
    setTimeout(() => {
      const [minX, minY, maxX, maxY] = extentXY(nodes);
      const w = maxX - minX, h = maxY - minY;
      const vb = [minX - 40, minY - 40, w + 80, h + 80];
      const {clientWidth:CW, clientHeight:CH} = svg.node();
      const k = Math.min(CW/vb[2], CH/vb[3]);

      svg.transition().duration(400)
        .call(zoom.transform, d3.zoomIdentity
          .translate(CW/2, CH/2)
          .scale(k)
          .translate(-(vb[0]+vb[2]/2), -(vb[1]+vb[3]/2)))
        .on("end", () => resizeMarkersForZoom(d3.zoomTransform(svg.node()).k));
    }, 300);
  }
}

function extentXY(nodes){
  let minX=+Infinity,minY=+Infinity,maxX=-Infinity,maxY=-Infinity;
  for (const n of nodes){ if(n.x<minX)minX=n.x; if(n.y<minY)minY=n.y; if(n.x>maxX)maxX=n.x; if(n.y>maxY)maxY=n.y; }
  return [minX,minY,maxX,maxY];
}

// ---------- Wire up controls ----------
edgeTypeSel.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));
filterInput.addEventListener("input", d3.debounce?.(()=>run(edgeTypeSel.value, filterInput.value), 200) || (()=>run(edgeTypeSel.value, filterInput.value)));
labelsToggle.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));

// Boot
run(edgeTypeSel.value, filterInput.value);
