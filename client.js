import * as d3 from "d3";

// ==== Load data ====
const deps = await fetch("./deps.json").then(r => r.json());

// ==== DOM refs ====
const svg = d3.select("#viz");
const gMain = svg.append("g");                  // zoomed group
const gLinks = gMain.append("g");
const gNodes = gMain.append("g");
const gLabels = gMain.append("g");
const info = document.querySelector("#info");
const edgeTypeSel = document.querySelector("#edgeType");
const filterInput = document.querySelector("#filter");
const labelsToggle = document.querySelector("#labels");

// ==== Scales & helpers ====
const color = d3.scaleOrdinal()
  .domain(["module","program","subroutine","function","interface","generic","type","unknown"])
  .range(d3.schemeTableau10);

function nodeKey(d) { return d.id; }

function getNeighborsMap(links) {
  const nb = new Map();
  for (const l of links) {
    (nb.get(l.source.id) || nb.set(l.source.id, new Set()).get(l.source.id)).add(l.target.id);
    (nb.get(l.target.id) || nb.set(l.target.id, new Set()).get(l.target.id)).add(l.source.id);
  }
  return nb;
}

function filterNodes(nodes, q) {
  if (!q) return nodes;
  const t = q.toLowerCase();
  return nodes.filter(n =>
    n.id.includes(t) || (n.name||"").includes(t) || (n.scope||"").includes(t) || (n.kind||"").includes(t)
  );
}

function buildGraph(edgeType, query) {
  // 1) nodes by id (copy because we’ll mutate x/y)
  const nodesById = new Map(deps.nodes.map(n => [n.id, { ...n }]));

  // 2) raw edges (type-filtered)
  const rawEdges = deps.links.filter(l => l.type === edgeType);

  // 3) make unique [source,target] pairs and keep only those whose nodes exist
  const pairs = Array.from(new Set(
    rawEdges.map(l => {
      const s = typeof l.source === "string" ? l.source : l.source?.id;
      const t = typeof l.target === "string" ? l.target : l.target?.id;
      return `${s}\t${t}`;
    })
  )).map(s => {
    const [sId, tId] = s.split("\t");
    return { source: sId, target: tId };
  }).filter(p => nodesById.has(p.source) && nodesById.has(p.target));

  // 4) optional node filter -> induced subgraph
  const keep = new Set(filterNodes([...nodesById.values()], query).map(n => n.id));
  const links = pairs
    .filter(p => keep.has(p.source) || keep.has(p.target))
    .map(p => ({ source: nodesById.get(p.source), target: nodesById.get(p.target) }));

  // 5) collect the final node set that’s actually used
  const used = new Set();
  for (const l of links) { used.add(l.source.id); used.add(l.target.id); }
  const nodes = [...used].map(id => nodesById.get(id));

  // degree for sizing
  const deg = new Map([...used].map(id => [id, 0]));
  for (const l of links) { deg.set(l.source.id, deg.get(l.source.id)+1); deg.set(l.target.id, deg.get(l.target.id)+1); }
  for (const n of nodes) n.degree = deg.get(n.id) || 0;

  return { nodes, links };
}

// ==== Render / Simulation ====
const line = d3.line(); // straight segments (we’ll draw lines, not arcs)

const zoom = d3.zoom().on("zoom", ev => gMain.attr("transform", ev.transform));
svg.call(zoom);

function run(edgeType = "call", query = "") {
  const { nodes, links } = buildGraph(edgeType, query);

  // --- simulation: “disjoint” style (position forces instead of a single center) ---
  // Ref: D3 disjoint example and docs for manyBody/link/collide/forceX/forceY. 
  // The forceLink uses id accessor so links can refer to nodes by string id. :contentReference[oaicite:2]{index=2}
  const sim = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(d => (d.kind === "module" ? -200 : -80))) // repulsion
    .force("link", d3.forceLink(links).id(nodeKey).distance(d => 40 + 2*Math.min(d.source.degree,d.target.degree)).strength(0.3))
    .force("collide", d3.forceCollide().radius(d => 4 + Math.sqrt(2 + d.degree)).iterations(2))  // no overlap. :contentReference[oaicite:3]{index=3}
    .force("x", d3.forceX().strength(0.06)) // position forces rather than a single center (disjoint). :contentReference[oaicite:4]{index=4}
    .force("y", d3.forceY().strength(0.06));

  // --- join ---
  const linkSel = gLinks.selectAll("line").data(links, d => d.source.id + "→" + d.target.id);
  linkSel.exit().remove();
  const linkEnter = linkSel.enter().append("line").attr("class", "link").attr("stroke-width", 1);
  const link = linkEnter.merge(linkSel);

  const nodeSel = gNodes.selectAll("circle").data(nodes, nodeKey);
  nodeSel.exit().remove();
  const nodeEnter = nodeSel.enter().append("circle")
    .attr("class", "node")
    .attr("r", d => 3 + Math.sqrt(1 + d.degree))
    .attr("fill", d => color(d.kind))
    .attr("stroke", "#0b0e12")
    .attr("stroke-width", 0.75)
    .call(d3.drag() // drag behavior for nodes. :contentReference[oaicite:5]{index=5}
      .on("start", (ev, d) => {
        if (!ev.active) sim.alphaTarget(0.2).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on("drag", (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
      .on("end",  (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
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

  // neighbor highlighting on hover
  const neighbors = getNeighborsMap(links);
  function maybeHighlight(d) {
    const nb = neighbors.get(d.id) || new Set();
    node.classed("highlight", n => n.id === d.id || nb.has(n.id))
        .attr("opacity", n => (n.id === d.id || nb.has(n.id)) ? 1 : 0.2);
    link.classed("highlight", l => l.source.id === d.id || l.target.id === d.id)
        .attr("opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 0.9 : 0.1);
    label.attr("opacity", n => (labelsToggle.checked ? ((n.id === d.id || nb.has(n.id)) ? 1 : 0.05) : 0));
  }
  function clearHighlight() {
    node.classed("highlight", false).attr("opacity", 1);
    link.classed("highlight", false).attr("opacity", 0.25);
    label.attr("opacity", labelsToggle.checked ? 1 : 0);
  }

  // side panel info
  function showInfo(d, links) {
    const incoming = links.filter(l => l.target.id === d.id).map(l => l.source.id);
    const outgoing = links.filter(l => l.source.id === d.id).map(l => l.target.id);
    const details = {
      id: d.id, name: d.name, kind: d.kind, scope: d.scope,
      file: d.file, line: d.line, visibility: d.visibility,
      attrs: d.attrs, result: d.result, dummies: d.dummies,
      // compact neighbors
      in_degree: incoming.length, out_degree: outgoing.length
    };
    info.innerHTML = `
      <h1>${d.name || d.id}</h1>
      <div class="muted">${d.kind}${d.scope ? ` — scope: ${d.scope}` : ""}</div>
      <div style="margin:8px 0">in: <b>${incoming.length}</b> • out: <b>${outgoing.length}</b></div>
      <pre>${escapeHtml(JSON.stringify(details, null, 2))}</pre>
    `;
  }
  function escapeHtml(s){return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  // ticks
  sim.on("tick", () => {
    link
      .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);

    node.attr("cx", d => d.x).attr("cy", d => d.y);
    label.attr("x", d => d.x).attr("y", d => d.y);
  });

  // label toggle
  label.attr("opacity", labelsToggle.checked ? 1 : 0);

  // fit view on first run
  if (nodes.length) {
    // let the sim settle a bit, then fit
    setTimeout(() => {
      const [minX, minY, maxX, maxY] = extentXY(nodes);
      const w = maxX - minX, h = maxY - minY;
      const vb = [minX - 40, minY - 40, w + 80, h + 80];
      svg.transition().duration(400)
        .call(zoom.transform, d3.zoomIdentity
          .translate(svg.node().clientWidth/2, svg.node().clientHeight/2)
          .scale(Math.min(svg.node().clientWidth/vb[2], svg.node().clientHeight/vb[3]))
          .translate(-(vb[0]+vb[2]/2), -(vb[1]+vb[3]/2)));
    }, 300);
  }
}

function extentXY(nodes){
  let minX=+Infinity,minY=+Infinity,maxX=-Infinity,maxY=-Infinity;
  for (const n of nodes){ if(n.x<minX)minX=n.x; if(n.y<minY)minY=n.y; if(n.x>maxX)maxX=n.x; if(n.y>maxY)maxY=n.y; }
  return [minX,minY,maxX,maxY];
}

// ==== wire up controls ====
edgeTypeSel.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));
filterInput.addEventListener("input", d3.debounce?.( () => run(edgeTypeSel.value, filterInput.value), 200) || (()=>run(edgeTypeSel.value, filterInput.value)));
labelsToggle.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));

// kick it off
run(edgeTypeSel.value, filterInput.value);
