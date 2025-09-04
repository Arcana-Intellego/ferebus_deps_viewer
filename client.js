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

/* =========== Small utilities =========== */
function debounce(fn, wait = 200) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* =========== Data =========== */
const deps = await fetch("./deps.json").then(r => r.json());

/* =========== DOM refs & layers =========== */
const svg = d3.select("#viz");
const gMain   = svg.append("g");
/* Order: links above nodes so strokes sit over the node’s white hover ring */
const gLinks  = gMain.append("g");
const gNodes  = gMain.append("g");
const gArrows = gMain.append("g");   // arrow overlay above nodes
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

function nodeRadius(d) { return 3 + Math.sqrt(1 + (d.degree || 0)); }

function buildGraph(edgeType, query) {
  const nodesById = new Map(deps.nodes.map(n => [n.id, { ...n }]));

  const types = edgeType === "all" ? [...activeTypes] : [edgeType];

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
let zoomK = 1;               // current zoom (for screen-constant arrows)
let onZoomRepaint = null;    // assigned by run() to refresh arrows immediately
let rafQueued = false;
const rafRepaint = () => {
  if (rafQueued) return;
  rafQueued = true;
  requestAnimationFrame(() => { rafQueued = false; onZoomRepaint && onZoomRepaint(); });
};

/* Disable zoom while typing in search or when pointer is on a node. */
const zoom = d3.zoom()
  .filter((event) => {
    if (document.activeElement === filterInput) return false;
    const target = event.target;
    return !(target && target.closest && target.closest(".node"));
  }) // official zoom filter hook. :contentReference[oaicite:2]{index=2}
  .on("zoom", (ev) => {
    zoomK = ev.transform.k;
    gMain.attr("transform", ev.transform);
    rafRepaint(); // throttle to rAF for smoothness. :contentReference[oaicite:3]{index=3}
  });
svg.call(zoom);

/* Track the current simulation so we can stop it on rerun */
let currentSim = null;
/* Whether the info panel is pinned (click to pin/unpin) */
let infoPinned = false;

/* =========== Main render / simulation =========== */
function run(edgeType = "all", query = "") {
  if (currentSim) currentSim.stop(); // prevent competing ticks

  renderEdgeLegend();
  renderNodeKindLegend();

  const { nodes, links } = buildGraph(edgeType, query);

  const sim = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(d => (d.kind === "module" ? -300 : -140)))
    .force("link", d3.forceLink(links).id(nodeKey).distance(d => 42 + 2*Math.min(d.source.degree,d.target.degree)).strength(0.15))
    .force("collide", d3.forceCollide().radius(d => 6 + Math.sqrt(2 + d.degree)).iterations(2))
    .force("x", d3.forceX().strength(0.00))
    .force("y", d3.forceY().strength(0.00));
  currentSim = sim;

  // --- joins ---
  const linkSel = gLinks.selectAll("line").data(links, d => d.source.id + "→" + d.target.id + ":" + d.etype);
  linkSel.exit().remove();
  const linkEnter = linkSel.enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", 1.2);
  const link = linkEnter.merge(linkSel).attr("stroke", d => colorByType(d.etype));

  const nodeSel = gNodes.selectAll("circle").data(nodes, nodeKey);
  nodeSel.exit().remove();
  const nodeEnter = nodeSel.enter().append("circle")
    .attr("class", "node")
    .attr("r", d => nodeRadius(d))
    .attr("fill", d => colorByKind(d.kind))
    .attr("stroke", "#0b0e12")
    .attr("stroke-width", 0.75)
    .on("pointerdown", (ev) => ev.stopPropagation())  // drag wins over zoom. :contentReference[oaicite:4]{index=4}
    .call(
      d3.drag()
        .on("start", (ev, d) => {
          ev.sourceEvent?.stopPropagation();
          if (!ev.active) sim.alphaTarget(0.2).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag",  (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
        .on("end",   (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    )
    .on("mouseenter", (_, d) => { if (!infoPinned) showInfo(d, links); })
    .on("mousemove", (ev, d) => maybeHighlight(d))
    .on("mouseleave", () => { if (!infoPinned) clearHighlight(); })
    .on("click", (_, d) => { infoPinned = !infoPinned; if (infoPinned) showInfo(d, links); });
  const node = nodeEnter.merge(nodeSel);

  // Arrowheads as overlay triangles (above nodes)
  const arrowSel = gArrows.selectAll("path").data(links, d => d.source.id + "→" + d.target.id + ":" + d.etype);
  arrowSel.exit().remove();
  const arrow = arrowSel.enter().append("path")
    .attr("pointer-events", "none")
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

  // --- info panel (elegant card) ---
  function showInfo(d, links) {
    const incoming = links.filter(l => l.target.id === d.id);
    const outgoing = links.filter(l => l.source.id === d.id);

    const counts = (arr) => {
      const m = new Map(); for (const l of arr) m.set(l.etype, (m.get(l.etype)||0)+1); return m;
    };
    const inBy = counts(incoming), outBy = counts(outgoing);

    const badge = (txt) => `<span class="badge">${txt}</span>`;
    const chip  = (txt) => `<span class="chip">${txt}</span>`;
    const dot   = (t) => `<span class="dot" style="background:${colorByType(t)}"></span>`;

    const sig = [
      d.result ? `${d.result}` : null,
      Array.isArray(d.dummies) && d.dummies.length ? `(${d.dummies.map(x => x.name || x).join(", ")})` : null
    ].filter(Boolean).join(" ");

    const fileLine = d.file ? `${d.file}${d.line ? `:${d.line}` : ""}` : "";

    info.innerHTML = `
      <div class="info-title">${d.name || d.id}</div>
      <div class="row">
        ${d.kind ? badge(d.kind) : ""} ${d.scope ? badge(`scope: ${d.scope}`) : ""} ${d.visibility ? badge(d.visibility) : ""}
      </div>
      ${sig ? `<div class="row" style="margin-top:6px"><span class="kv">signature:</span> ${chip(sig)}</div>` : ""}
      ${fileLine ? `<div class="row" style="margin-top:6px"><span class="kv">location:</span> ${chip(fileLine)}</div>` : ""}
      <div class="counts">
        ${EDGE_TYPES.map(t => `
          <div>${dot(t)}in ${t}</div><div>${inBy.get(t) || 0}</div>
          <div>${dot(t)}out ${t}</div><div>${outBy.get(t) || 0}</div>
        `).join("")}
      </div>
    `;
  }

  // --- geometry helpers (used by tick & zoom repaint) ---
  function endpoints(d) {
    // REVERSED DIRECTION: line drawn TARGET → SOURCE
    const vx = d.source.x - d.target.x;
    const vy = d.source.y - d.target.y;
    const L  = Math.hypot(vx, vy) || 1;
    const ux = vx / L, uy = vy / L;

    const x1 = d.target.x + ux * nodeRadius(d.target);
    const y1 = d.target.y + uy * nodeRadius(d.target);
    const x2 = d.source.x - ux * nodeRadius(d.source);
    const y2 = d.source.y - uy * nodeRadius(d.source);

    return { x1, y1, x2, y2, ux, uy };
  }

  function arrowPath(d, ends) {
    const ARW   = 6 / zoomK;     // length (screen-constant)
    const HALF  = 3.6 / zoomK;   // half width
    const bx = ends.x2 - ends.ux * ARW;
    const by = ends.y2 - ends.uy * ARW;
    const px = -ends.uy, py = ends.ux;

    const b1x = bx + px * HALF, b1y = by + py * HALF;
    const b2x = bx - px * HALF, b2y = by - py * HALF;
    return `M${ends.x2},${ends.y2} L${b1x},${b1y} L${b2x},${b2y} Z`;
  }

  function repaint() {
    // links & arrows
    link
      .attr("x1", d => { const e = (d._e = endpoints(d)); return e.x1; })
      .attr("y1", d => d._e.y1)
      .attr("x2", d => d._e.x2)
      .attr("y2", d => d._e.y2);
    arrow.attr("d", d => arrowPath(d, d._e));

    // nodes & labels
    node.attr("cx", d => d.x).attr("cy", d => d.y);
    label.attr("x", d => d.x).attr("y", d => d.y);
  }

  sim.on("tick", repaint);
  onZoomRepaint = repaint;

  label.attr("opacity", labelsToggle.checked ? 1 : 0);

  // click on empty background to unpin
  svg.on("click", (ev) => {
    if (ev.target === svg.node()) { infoPinned = false; }
  });

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
filterInput.addEventListener("input", debounce(() => run(edgeTypeSel.value, filterInput.value), 200));
labelsToggle.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));

/* =========== Boot =========== */
run(edgeTypeSel.value, filterInput.value);
