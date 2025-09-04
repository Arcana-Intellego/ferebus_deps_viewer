import * as d3 from "d3";

/* =========== Palettes =========== */
const COLORS = {
  blue:   "#60a5fa",
  green:  "#34d399",
  amber:  "#f59e0b",
  red:    "#ef4444",
  purple: "#a78bfa",
  slate:  "#94a3b8",
  light:  "#cbd5e1"
};

const EDGE_TYPES = ["call", "use", "module-procedure-of", "binds-to", "uses-type"];
const TYPE_ALIAS = new Map([["module_procedure_of", "module-procedure-of"]]);

const EDGE_COLORS = {
  "call":                COLORS.blue,
  "use":                 COLORS.green,
  "module-procedure-of": COLORS.amber,
  "binds-to":            COLORS.red,
  "uses-type":           COLORS.purple
};

// Node palette aligned to edge semantics
function colorByKind(kind) {
  switch ((kind || "unknown").toLowerCase()) {
    case "function":
    case "subroutine": return COLORS.blue;    // aligns with call
    case "module":     return COLORS.green;   // aligns with use
    case "interface":
    case "generic":    return COLORS.amber;   // aligns with module-procedure-of
    case "type":       return COLORS.purple;  // aligns with uses-type
    case "program":    return COLORS.slate;
    default:           return COLORS.light;
  }
}
const colorByType = (t) => EDGE_COLORS[t] || "#999";

/* =========== Data =========== */
const deps = await fetch("./deps.json").then(r => r.json());

/* =========== DOM refs & layers =========== */
const svg = d3.select("#viz");
const gMain   = svg.append("g");
const gLinks  = gMain.append("g");   // under nodes
const gNodes  = gMain.append("g");   // nodes above links
const gArrows = gMain.append("g");   // arrowhead overlay above nodes
const gLabels = gMain.append("g");   // labels on top

const info   = document.querySelector("#info");
const edgeTypeSel = document.querySelector("#edgeType");
const filterInput = document.querySelector("#filter");
const labelsToggle = document.querySelector("#labels");
const legendEl = document.querySelector("#legend");
const legendKindsEl = document.querySelector("#legendKinds");

/* =========== Legends =========== */
const activeTypes = new Set(EDGE_TYPES);

function renderEdgeLegend() {
  legendEl.innerHTML = "";
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
      run(edgeTypeSel.value, filterInput.value);
    });

    const label = document.createElement("label");
    if (!inAllMode) label.classList.add("disabled");
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = colorByType(t);

    label.appendChild(swatch);
    label.appendChild(document.createTextNode(t));
    row.appendChild(cb);
    row.appendChild(label);
    legendEl.appendChild(row);
  }
}

function renderNodeKindLegend() {
  legendKindsEl.innerHTML = "";
  const kinds = [
    ["function / subroutine", colorByKind("function")],
    ["module",                colorByKind("module")],
    ["interface / generic",   colorByKind("interface")],
    ["type",                  colorByKind("type")],
    ["program",               colorByKind("program")],
    ["other / unknown",       colorByKind("unknown")]
  ];
  for (const [name, col] of kinds) {
    const row = document.createElement("div");
    row.className = "row";
    const sw = document.createElement("span");
    sw.className = "swatch";
    sw.style.background = col;
    const lab = document.createElement("label");
    lab.appendChild(sw);
    lab.appendChild(document.createTextNode(name));
    legendKindsEl.appendChild(lab);
  }
}

/* =========== Helpers =========== */
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

function nodeRadius(d) {
  return 3 + Math.sqrt(1 + (d.degree || 0));
}

function buildGraph(edgeType, query) {
  const nodesById = new Map(deps.nodes.map(n => [n.id, { ...n }]));

  let types;
  if (edgeType === "all") types = [...activeTypes];
  else types = [edgeType];

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

  const keep = new Set(filterNodes([...nodesById.values()], query).map(n => n.id));
  const filtered = links.filter(l => keep.has(l.source.id) || keep.has(l.target.id));

  const used = new Set();
  for (const l of filtered) { used.add(l.source.id); used.add(l.target.id); }
  const nodes = [...used].map(id => nodesById.get(id));

  // degree for sizing
  const deg = new Map([...used].map(id => [id, 0]));
  for (const l of filtered) {
    deg.set(l.source.id, (deg.get(l.source.id)||0)+1);
    deg.set(l.target.id, (deg.get(l.target.id)||0)+1);
  }
  for (const n of nodes) n.degree = deg.get(n.id) || 0;

  return { nodes, links: filtered };
}

/* =========== Zoom / Pan =========== */
let zoomK = 1; // keep current zoom to size arrowheads in screen px
const zoom = d3.zoom().on("zoom", (ev) => {
  zoomK = ev.transform.k;
  gMain.attr("transform", ev.transform);
});
svg.call(zoom);

/* =========== Main render / simulation =========== */
function run(edgeType = "all", query = "") {
  renderEdgeLegend();
  renderNodeKindLegend();

  const { nodes, links } = buildGraph(edgeType, query);

  const sim = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(d => (d.kind === "module" ? -220 : -90)))
    .force("link", d3.forceLink(links).id(nodeKey).distance(d => 42 + 2*Math.min(d.source.degree,d.target.degree)).strength(0.35))
    .force("collide", d3.forceCollide().radius(d => 4 + Math.sqrt(2 + d.degree)).iterations(2))
    .force("x", d3.forceX().strength(0.06))
    .force("y", d3.forceY().strength(0.06));

  // --- joins ---
  const keyLink = d => d.source.id + "→" + d.target.id + ":" + d.etype;

  const linkSel = gLinks.selectAll("line").data(links, keyLink);
  linkSel.exit().remove();
  const linkEnter = linkSel.enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", 1.2);
  const link = linkEnter.merge(linkSel)
    .attr("stroke", d => colorByType(d.etype));

  const nodeSel = gNodes.selectAll("circle").data(nodes, nodeKey);
  nodeSel.exit().remove();
  const nodeEnter = nodeSel.enter().append("circle")
    .attr("class", "node")
    .attr("r", d => nodeRadius(d))
    .attr("fill", d => colorByKind(d.kind))
    .attr("stroke", "#0b0e12")
    .attr("stroke-width", 0.75)
    .call(
      d3.drag()
        .on("start", (ev, d) => {
          ev.sourceEvent?.stopPropagation(); // don't let drag trigger zoom pan
          if (!ev.active) sim.alphaTarget(0.2).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag",  (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
        .on("end",   (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    )
    .on("mouseenter", (_, d) => showInfo(d, links))
    .on("mouseleave", () => clearHighlight())
    .on("mousemove", (ev, d) => maybeHighlight(d));

  const node = nodeEnter.merge(nodeSel);

  // Arrowheads as overlay triangles (above nodes), one per link
  const arrowSel = gArrows.selectAll("path").data(links, keyLink);
  arrowSel.exit().remove();
  const arrow = arrowSel.enter().append("path")
    .attr("pointer-events", "none") // let mouse interactions hit nodes/links beneath
    .merge(arrowSel)
    .attr("fill", d => colorByType(d.etype));

  const labelSel = gLabels.selectAll("text").data(nodes, nodeKey);
  labelSel.exit().remove();
  const label = labelSel.enter().append("text")
    .attr("class","label")
    .attr("text-anchor","middle")
    .attr("dy","-0.75em")
    .text(d => d.name || d.id)
    .merge(labelSel);

  // --- neighbor highlighting ---
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

  // --- info panel ---
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

  // --- ticks ---
  sim.on("tick", () => {
    // REVERSED DIRECTION: draw line from TARGET → SOURCE
    link
      .attr("x1", d => {
        const dx = d.source.x - d.target.x, dy = d.source.y - d.target.y;
        const L = Math.hypot(dx, dy) || 1;
        return d.target.x + (dx / L) * nodeRadius(d.target);
      })
      .attr("y1", d => {
        const dx = d.source.x - d.target.x, dy = d.source.y - d.target.y;
        const L = Math.hypot(dx, dy) || 1;
        return d.target.y + (dy / L) * nodeRadius(d.target);
      })
      .attr("x2", d => {
        const dx = d.source.x - d.target.x, dy = d.source.y - d.target.y;
        const L = Math.hypot(dx, dy) || 1;
        return d.source.x - (dx / L) * nodeRadius(d.source);
      })
      .attr("y2", d => {
        const dx = d.source.x - d.target.x, dy = d.source.y - d.target.y;
        const L = Math.hypot(dx, dy) || 1;
        return d.source.y - (dy / L) * nodeRadius(d.source);
      });

    // Arrowheads: draw small triangle at the line end (toward SOURCE), above nodes.
    // Keep constant screen size: scale by 1/zoomK.
    const ARW = 6 / zoomK;       // triangle length in graph units
    const ARW_W = 3.6 / zoomK;   // half width

    arrow
      .attr("d", d => {
        // direction from target -> source
        const vx = d.source.x - d.target.x;
        const vy = d.source.y - d.target.y;
        const L = Math.hypot(vx, vy) || 1;
        const ux = vx / L, uy = vy / L;

        // tip at source boundary (kissing the node)
        const tipX = d.source.x - ux * nodeRadius(d.source);
        const tipY = d.source.y - uy * nodeRadius(d.source);

        // base center a bit back along the edge
        const baseX = tipX - ux * ARW;
        const baseY = tipY - uy * ARW;

        // perpendicular
        const px = -uy, py = ux;

        const b1x = baseX + px * ARW_W;
        const b1y = baseY + py * ARW_W;
        const b2x = baseX - px * ARW_W;
        const b2y = baseY - py * ARW_W;

        return `M${tipX},${tipY} L${b1x},${b1y} L${b2x},${b2y} Z`;
      });

    node.attr("cx", d => d.x).attr("cy", d => d.y);
    label.attr("x", d => d.x).attr("y", d => d.y);
  });

  label.attr("opacity", labelsToggle.checked ? 1 : 0);

  // Fit view after a brief settle
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
          .translate(-(vb[0]+vb[2]/2), -(vb[1]+vb[3]/2)));
    }, 300);
  }
}

function extentXY(nodes){
  let minX=+Infinity,minY=+Infinity,maxX=-Infinity,maxY=-Infinity;
  for (const n of nodes){ if(n.x<minX)minX=n.x; if(n.y<minY)minY=n.y; if(n.x>maxX)maxX=n.x; if(n.y>maxY)maxY=n.y; }
  return [minX,minY,maxX,maxY];
}

/* =========== Controls =========== */
edgeTypeSel.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));
filterInput.addEventListener("input", d3.debounce?.(()=>run(edgeTypeSel.value, filterInput.value), 200) || (()=>run(edgeTypeSel.value, filterInput.value)));
labelsToggle.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));

/* =========== Boot =========== */
run(edgeTypeSel.value, filterInput.value);