import {
    createTreeIndex,
    createSubcladeCollapse,
    createMajorCladeCollapse,
    countVisibleTips,
    calculateHighlightCounts,
    revealAncestors,
    getPathToRoot
} from "./treeCalculations";

import {
    buildCladeOptions,
    buildAccessionIndex,
    findCladeOption,
    findAccession,
    findCladeTips
} from "./treeSearch";

import { renderTree } from "./svgRenderer";

/**
 * Mounts only the SVG tree into the supplied canvas element.
 * React owns the surrounding controls, legend, messages and metadata card.
 */
export function mountRabvTree(root, D, {
    zoom = 1,
    rowSpacing = 15,
    onCardChange = () => {},
    onMessage = () => {},
    onLegendSelect = () => {}
} = {}) {
    if (!root || !D) {
        return {
            destroy() {},
            clear() {},
            selectClade() {},
            selectAccession() {},
            viewSub() {},
            viewMajor() {},
            expandAll() {},
            setZoom() {},
            setRowSpacing() {},
            download() {}
        };
    }

    const N = D.nodes || [];
    const SC = D.subclades || [];
    const MJ = D.majors || [];
    const META = D.meta || [];
    const MV = D.metaValues || [];
    const LIN = D.lin || [];

    const esc = value => String(value ?? "").replace(/[&<>"]/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    }[ch]));

    const majorName = i => i >= 0 && MJ[i] ? MJ[i].name : "mixed";
    const majorColor = i => i >= 0 && MJ[i] ? MJ[i].color : (D.unknown || "#999");
    const minorName = i => {
        if (i < 0 || !SC[i]) return "mixed";
        const subclade = SC[i];
        return subclade.major >= 0 && MJ[subclade.major]?.name === subclade.name
            ? "—"
            : subclade.name;
    };
    const lineageOf = node => node.li ? LIN[node.li] : "not assigned";
    const metaOf = (node, field) => node.m && MV[field]
        ? MV[field][node.m[field]]
        : "";
    const metaLabel = value => value.replace(/^collection_/, "").replace(/_/g, " ");

    const index = createTreeIndex(D);
    const { parent } = index;
    const BIG = 4000;
    const MAJOR_TAG = " (major clade)";
    const cladeOptions = buildCladeOptions(D);
    const accessionIndex = buildAccessionIndex(D);

    let collapsed = createSubcladeCollapse(D);
    let highlightCounts = new Int32Array(N.length);
    let highlightedTotal = 0;
    let focusTip = -1;
    let pathNodes = new Set();
    let geom = null;
    let lastLayout = null;
    let currentZoom = Number(zoom);
    let currentRowSpacing = Number(rowSpacing);
    let destroyed = false;

    function setHighlight(tips) {
        highlightCounts = calculateHighlightCounts(D, parent, tips);
        highlightedTotal = tips.length;
    }

    function render() {
        if (destroyed) return;

        lastLayout = renderTree({
            data: D,
            index,
            collapsed,
            highlightCounts,
            highlightedTotal,
            focusTip,
            pathNodes,
            wrap: root,
            zoom: currentZoom,
            row: currentRowSpacing
        });

        geom = lastLayout ? { py: lastLayout.py } : null;
    }

    function okToDraw(set) {
        const count = countVisibleTips(D, set);
        return count <= BIG || window.confirm(
            `This draws ${count.toLocaleString()} sequences and may be slow. Continue?`
        );
    }

    function scrollToNode(nodeIndex) {
        if (!geom || !lastLayout) return;
        root.scrollTo({
            top: Math.max(
                0,
                geom.py(lastLayout.y[nodeIndex]) - root.clientHeight / 3
            ),
            behavior: "smooth"
        });
    }

    function scrollToHighlight() {
        if (!lastLayout || !highlightedTotal) return;

        let best = -1;
        for (const nodeIndex of lastLayout.leaves) {
            if (
                highlightCounts[nodeIndex] &&
                (best < 0 || highlightCounts[nodeIndex] > highlightCounts[best])
            ) {
                best = nodeIndex;
            }
        }

        if (best >= 0) scrollToNode(best);
    }

    function clear() {
        setHighlight([]);
        focusTip = -1;
        pathNodes = new Set();
        onCardChange(null);
        onMessage("clade", "");
        onMessage("accession", "");
        render();
    }

    function selectClade(value) {
        const query = String(value || "").trim();
        if (!query) return;

        const option = findCladeOption(query, cladeOptions) ||
            findCladeOption(query + MAJOR_TAG, cladeOptions);

        if (!option) {
            onMessage("clade", "No such clade", true);
            return;
        }

        focusTip = -1;
        pathNodes = new Set();
        onCardChange(null);
        onMessage("accession", "");

        const tips = findCladeTips(D, option);
        collapsed = createSubcladeCollapse(D);
        setHighlight(tips);
        render();

        let groups = 0;
        for (const nodeIndex of lastLayout?.leaves || []) {
            if (highlightCounts[nodeIndex]) groups++;
        }

        onMessage(
            "clade",
            `${tips.length.toLocaleString()} sequence${tips.length === 1 ? "" : "s"} highlighted in ${groups} row${groups === 1 ? "" : "s"}`
        );
        scrollToHighlight();
    }

    function showCard(nodeIndex) {
        const node = N[nodeIndex];
        const fields = [
            ["Accession", node.n],
            ["Major clade", majorName(node.mj)],
            ["Minor clade", minorName(node.sc)],
            ["Lineage", lineageOf(node)]
        ];

        if (node.lp) fields.push(["Parent lineage", LIN[node.lp]]);

        META.forEach((column, fieldIndex) => {
            const value = metaOf(node, fieldIndex);
            if (value) fields.push([metaLabel(column), value]);
        });

        onCardChange({
            fields,
            majorColor: majorColor(node.mj)
        });
    }

    function selectAccession(value) {
        const query = String(value || "").trim().toUpperCase();
        if (!query) return;

        const nodeIndex = findAccession(query, accessionIndex);

        if (nodeIndex === undefined) {
            onMessage("accession", "Accession not found in this tree", true);
            onCardChange(null);
            return;
        }

        onMessage("accession", "");
        onMessage("clade", "");
        focusTip = nodeIndex;
        pathNodes = getPathToRoot(parent, nodeIndex);
        showCard(nodeIndex);
        collapsed = createSubcladeCollapse(D);
        revealAncestors(parent, collapsed, nodeIndex);
        setHighlight([nodeIndex]);
        render();
        scrollToNode(nodeIndex);
    }

    function viewSub() {
        collapsed = createSubcladeCollapse(D);
        if (focusTip >= 0) revealAncestors(parent, collapsed, focusTip);
        render();
        scrollToHighlight();
    }

    function viewMajor() {
        collapsed = createMajorCladeCollapse(D);
        render();
        scrollToHighlight();
    }

    function expandAll() {
        const expanded = new Set();
        if (!okToDraw(expanded)) return;
        collapsed = expanded;
        render();
    }

    function setZoom(value) {
        currentZoom = Number(value);
        render();
    }

    function setRowSpacing(value) {
        currentRowSpacing = Number(value);
        render();
    }

    function download() {
        const svg = root.querySelector("svg");
        if (!svg) return;

        const blob = new Blob(
            [new XMLSerializer().serializeToString(svg)],
            { type: "image/svg+xml" }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "phylogenetic_tree.svg";
        link.click();
        URL.revokeObjectURL(url);
    }

    // Tree node click handling remains delegated because the SVG is generated
    // by svgRenderer.js rather than represented as React JSX.
    function handleTreeClick(event) {
        const element = event.target.closest("[data-act]");
        if (!element || !root.contains(element)) return;

        const nodeIndex = Number(element.dataset.i);
        if (!Number.isInteger(nodeIndex)) return;

        if (element.dataset.act === "expand") {
            const next = new Set(collapsed);
            next.delete(nodeIndex);
            if (!okToDraw(next)) return;
            collapsed = next;
        } else if (element.dataset.act === "collapse") {
            collapsed.add(nodeIndex);
        }

        render();
    }

    const tip = document.createElement("div");
    tip.className = "tree-tooltip";
    tip.style.display = "none";
    document.body.appendChild(tip);

    function groupName(node) {
        if (!node.pt) return majorName(node.mj);
        const sub = node.ps !== undefined ? SC[node.ps]?.name : majorName(node.mj);
        return node.lin ? `${sub} · ${node.lin}` : sub;
    }

    function handleMouseMove(event) {
        const element = event.target.closest("[data-i]");
        if (!element || !root.contains(element)) {
            tip.style.display = "none";
            return;
        }

        const nodeIndex = Number(element.dataset.i);
        const node = N[nodeIndex];
        if (!node) return;

        let body;

        if (!node.c.length) {
            body =
                `<b>${esc(node.n)}</b>` +
                `<br><span class="m">major clade</span> <b style="color:${majorColor(node.mj)}">${esc(majorName(node.mj))}</b>` +
                `<br><span class="m">minor clade</span> ${esc(minorName(node.sc))}` +
                `<br><span class="m">lineage</span> ${esc(lineageOf(node))}` +
                (node.lp ? ` <span class="m">(parent ${esc(LIN[node.lp])})</span>` : "") +
                META.map((column, fieldIndex) => {
                    const value = metaOf(node, fieldIndex);
                    return value
                        ? `<br><span class="m">${esc(metaLabel(column))}</span> ${esc(value)}`
                        : "";
                }).join("");
        } else {
            const counts = new Map();

            for (const tipIndex of index.tipsUnder(nodeIndex)) {
                const subclade = N[tipIndex].sc;
                counts.set(subclade, (counts.get(subclade) || 0) + 1);
            }

            const ranked = [...counts].sort((a, b) => b[1] - a[1]);

            body =
                `<b>${esc(node.pt || node.pm ? groupName(node) : `${node.nt.toLocaleString()} sequences`)}</b>` +
                (node.pt || node.pm
                    ? `<br>${node.nt.toLocaleString()} sequences${node.dp ? ` · ${node.dp}% share the name` : ""}`
                    : "") +
                `<br><span class="m">sub-clades</span> ${ranked.slice(0, 6).map(([subclade, count]) =>
                    `${esc(subclade >= 0 ? SC[subclade]?.name : "?")} (${count})`
                ).join(", ")}${ranked.length > 6 ? ` +${ranked.length - 6}` : ""}` +
                (node.s ? `<br><span class="m">support</span> ${esc(node.s)}` : "") +
                `<br><span class="m">${collapsed.has(nodeIndex) ? "Click to expand" : "Click to collapse"}</span>`;
        }

        tip.innerHTML = body;
        tip.style.display = "block";
        tip.style.left = `${Math.min(event.clientX + 14, window.innerWidth - tip.offsetWidth - 8)}px`;
        tip.style.top = `${Math.min(event.clientY + 14, window.innerHeight - tip.offsetHeight - 8)}px`;
    }

    function hideTooltip() {
        tip.style.display = "none";
    }

    root.addEventListener("click", handleTreeClick);
    root.addEventListener("mousemove", handleMouseMove);
    root.addEventListener("mouseleave", hideTooltip);

    let lastWidth = 0;
    const resizeObserver = typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (root.clientWidth !== lastWidth) {
                lastWidth = root.clientWidth;
                render();
            }
        })
        : null;

    if (resizeObserver) resizeObserver.observe(root);

    render();

    return {
        selectClade,
        selectAccession,
        clear,
        viewSub,
        viewMajor,
        expandAll,
        setZoom,
        setRowSpacing,
        download,
        selectMajor: majorIndex => {
            const major = MJ[majorIndex];
            if (major) {
                onLegendSelect(major.name);
                selectClade(`${major.name}${MAJOR_TAG}`);
            }
        },
        destroy() {
            destroyed = true;
            resizeObserver?.disconnect();
            root.removeEventListener("click", handleTreeClick);
            root.removeEventListener("mousemove", handleMouseMove);
            root.removeEventListener("mouseleave", hideTooltip);
            tip.remove();
            root.replaceChildren();
        }
    };
}
