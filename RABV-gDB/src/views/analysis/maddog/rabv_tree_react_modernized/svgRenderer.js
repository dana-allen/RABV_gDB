import { layoutVisibleTree } from "./treeCalculations";

const C = { surface: "#ffffff", text: "#0b0b0b", text2: "#52514e", muted: "#8a8984", hl: "#c2185b", band: "#fff1c2", bandStrong: "#ffd666" };
const FONT = '"DejaVu Sans", Verdana, "Segoe UI", sans-serif';
const esc = value => String(value).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
const f1 = value => Math.round(value * 10) / 10;

export function renderTree({ data: D, index, collapsed, highlightCounts: hlCount, highlightedTotal: hlTotal, focusTip, pathNodes, wrap, zoom, row }) {
  const N = D.nodes, SC = D.subclades, MJ = D.majors, LIN = D.lin;
  const { x: X, depth, maxX } = index;
  const isHlTip = i => hlCount[i] > 0 && !N[i].c.length;
  const allHl = i => hlTotal > 0 && hlCount[i] === N[i].nt;
  const majorName = i => i >= 0 ? MJ[i].name : "mixed";
  // const majorColor = i => i >= 0 ? MJ[i].color : D.unknown;
  const majorColor = i => i >= 0 && MJ[i] ? MJ[i].color : (D.unknown || "#999999");
  const minorName = i => { if (i < 0) return "mixed"; const s = SC[i]; return s.major >= 0 && MJ[s.major].name === s.name ? "—" : s.name; };
  const groupName = n => {
    if (!n.pt) return majorName(n.mj);
    const sub = n.ps !== undefined ? SC[n.ps].name : majorName(n.mj);
    return n.lin ? `${sub} · ${n.lin}` : sub;
  };

  function draw() {
    if (!N.length) return null;
    const L = layoutVisibleTree(D, collapsed);
    const Y = L.y;
    const W = wrap.clientWidth, rowH = +row, scaleZoom = +zoom;
    const colW = [W >= 640 ? 120 : 92, W >= 640 ? 90 : 70, W >= 640 ? 130 : 96];
    const colTotal = colW[0] + colW[1] + colW[2];
    const labelRoom = Math.min(280, Math.max(140, W * 0.22));
    const fs = Math.max(8, Math.min(12, rowH * 0.72));
    const triangleMax = maxX * 0.1;
    const treePx = Math.max(180, W - colTotal - labelRoom - 24) * scaleZoom;
    const k = treePx / (maxX + triangleMax);
    const left = 10, top = 30;
    const svgW = Math.max(W, left + treePx + labelRoom + colTotal + 12);
    const colX = [svgW - colTotal, svgW - colTotal + colW[0], svgW - colTotal + colW[0] + colW[1]];
    const svgH = top + L.rows * rowH + 56;
    const px = x => left + x * k, py = y => top + y * rowH;
    const bands = [], lines = [], hlLines = [], shapes = [], texts = [], hits = [];
    const strong = i => allHl(i) || pathNodes.has(i);
    const branchW = i => strong(i) ? 3 : 1.2;
    const branchC = i => strong(i) ? C.hl : majorColor(N[i].mj);
    const cols = (y, a, b, c, bold, color) => {
      const w = bold ? "700" : "400";
      texts.push(`<text x="${f1(colX[0])}" y="${f1(y)}" font-size="${fs}" font-weight="${w}" fill="${color}" dominant-baseline="central">${esc(a)}</text>`);
      texts.push(`<text x="${f1(colX[1])}" y="${f1(y)}" font-size="${fs}" font-weight="${w}" fill="${bold ? C.text : C.text2}" dominant-baseline="central">${esc(b)}</text>`);
      if (c) texts.push(`<text x="${f1(colX[2])}" y="${f1(y)}" font-size="${fs}" font-weight="${w}" fill="${bold ? C.text : C.muted}" dominant-baseline="central">${esc(c)}</text>`);
    };

    for (const i of L.visible) {
      const n = N[i], x = px(X[i]), y = py(Y[i]);

      if (!n.c.length) {
        const hl = isHlTip(i), focus = i === focusTip;
        if (hl || focus) bands.push(`<rect x="0" y="${f1(y - rowH / 2)}" width="${svgW}" height="${rowH}" fill="${focus ? C.bandStrong : C.band}"/>`);
        shapes.push(`<circle data-i="${i}" cx="${f1(x)}" cy="${f1(y)}" r="${focus ? 5.5 : (hl ? 4 : 2.6)}" fill="${focus ? C.hl : majorColor(n.mj)}" stroke="${C.surface}" stroke-width="1"/>`);
        texts.push(`<text data-i="${i}" x="${f1(x + (focus ? 9 : 6))}" y="${f1(y)}" font-size="${fs}" font-weight="${hl || focus ? 700 : 400}" fill="${hl || focus ? C.text : C.text2}" dominant-baseline="central">${esc(n.n)}</text>`);
        cols(y, majorName(n.mj), minorName(n.sc), n.li ? LIN[n.li] : "", hl || focus, majorColor(n.mj));
        continue;
      }

      if (collapsed.has(i)) {
        const h = hlCount[i], all = allHl(i);
        const d = Math.min(Math.max(depth[i], maxX * 0.012), triangleMax) * k, half = 0.62 * rowH;
        if (h) bands.push(`<rect x="0" y="${f1(y - 0.85 * rowH)}" width="${svgW}" height="${f1(1.7 * rowH)}" fill="${C.band}"/>`);
        const label = groupName(n) + (n.dp ? ` (${n.dp}%)` : "") + `  ·  ${n.nt.toLocaleString()} seqs` +
          (h && !all ? `  ·  ${h.toLocaleString()} highlighted` : "");
        shapes.push(`<g class="grp" data-i="${i}" data-act="expand"><polygon points="${f1(x)},${f1(y)} ${f1(x + d)},${f1(y - half)} ${f1(x + d)},${f1(y + half)}" fill="${majorColor(n.mj)}" fill-opacity="${h ? 0.85 : 0.35}" stroke="${h ? C.hl : majorColor(n.mj)}" stroke-width="${h ? 2 : 0.8}"/>` +
          `<text x="${f1(x + d + 6)}" y="${f1(y)}" font-size="${fs + 1}" font-weight="700" fill="${C.text}" dominant-baseline="central">${esc(label)}</text></g>`);
        const minor = n.ps !== undefined ? minorName(n.ps) : minorName(n.sc);
        cols(y, majorName(n.mj), minor, n.lin || "", true, majorColor(n.mj));
        continue;
      }

      const ys = n.c.map(c => py(Y[c]));
      (strong(i) ? hlLines : lines).push(`<line x1="${f1(x)}" y1="${f1(Math.min(...ys))}" x2="${f1(x)}" y2="${f1(Math.max(...ys))}" stroke="${branchC(i)}" stroke-width="${branchW(i)}"/>`);
      for (const c of n.c) {
        const yc = py(Y[c]);
        (strong(c) ? hlLines : lines).push(`<line x1="${f1(x)}" y1="${f1(yc)}" x2="${f1(px(X[c]))}" y2="${f1(yc)}" stroke="${branchC(c)}" stroke-width="${branchW(c)}"/>`);
      }
      if (i !== 0) hits.push(`<circle class="hit" data-i="${i}" data-act="collapse" cx="${f1(x)}" cy="${f1(y)}" r="6"/>`);
    }

    const length = Math.pow(10, Math.floor(Math.log10(maxX * 0.2)));
    const sbX = left + 4, sbY = svgH - 22;
    const scale = `<line x1="${f1(sbX)}" y1="${sbY}" x2="${f1(sbX + length * k)}" y2="${sbY}" stroke="${C.text2}" stroke-width="1.2"/>` +
      `<text x="${f1(sbX)}" y="${sbY - 5}" font-size="11" fill="${C.text2}">${+length.toPrecision(3)} subs/site</text>`;
    const head = (x, label) => `<text x="${f1(x)}" y="14" font-size="12" font-weight="700" fill="${C.text}" dominant-baseline="central">${esc(label)}</text>`;

    wrap.innerHTML =
      `<svg id="tree" xmlns="http://www.w3.org/2000/svg" width="${f1(svgW)}" height="${f1(svgH)}" font-family='${FONT}'>` +
      `<rect width="100%" height="100%" fill="${C.surface}"/>` + bands.join("") +
      `<g stroke-linecap="round">${lines.join("")}${hlLines.join("")}${shapes.join("")}${texts.join("")}${hits.join("")}</g>` +
      head(colX[0], "Major clade") + head(colX[1], "Minor clade") + head(colX[2], "Lineage") + `</svg>`;
    return { ...L, py };
  }

  return draw();
}
