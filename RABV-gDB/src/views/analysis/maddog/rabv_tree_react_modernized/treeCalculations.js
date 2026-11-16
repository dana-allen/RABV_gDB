export function createTreeIndex(data) {
    const nodes = data.nodes;
    const parent = new Int32Array(nodes.length).fill(-1);
    const x = new Float64Array(nodes.length);
    const depth = new Float64Array(nodes.length);

    // Calculate parent relationships and root-to-node distances.
    const stack = [0];

    while (stack.length) {
        const i = stack.pop();
        const children = nodes[i].c || [];

        for (const child of children) {
            parent[child] = i;

            const branchLength = Number(nodes[child].b) || 0;
            x[child] = x[i] + branchLength;

            stack.push(child);
        }
    }

    // Calculate the maximum remaining distance to a tip.
    for (let i = nodes.length - 1; i >= 0; i--) {
        const children = nodes[i].c || [];

        for (const child of children) {
            const branchLength = Number(nodes[child].b) || 0;
            depth[i] = Math.max(
                depth[i],
                branchLength + depth[child]
            );
        }
    }

    let maxX = 0;

    for (const value of x) {
        maxX = Math.max(maxX, value);
    }

    function tipsUnder(nodeIndex) {
        const tips = [];
        const stack = [nodeIndex];

        while (stack.length) {
            const current = stack.pop();
            const children = nodes[current].c || [];

            if (!children.length) {
                tips.push(current);
            } else {
                for (let k = children.length - 1; k >= 0; k--) {
                    stack.push(children[k]);
                }
            }
        }

        return tips;
    }

    return { parent, x, depth, maxX, tipsUnder };
}

export function createSubcladeCollapse(data) {
  const collapsed = new Set();
  data.nodes.forEach((node, i) => { if (node.pt) collapsed.add(i); });
  return collapsed;
}

export function createMajorCladeCollapse(data) {
  const collapsed = createSubcladeCollapse(data);
  data.nodes.forEach((node, i) => { if (node.pm) collapsed.add(i); });
  return collapsed;
}

export function layoutVisibleTree(data, collapsed) {
  const nodes = data.nodes;
  const y = new Float64Array(nodes.length);
  const visible = [];
  const leaves = [];
  let row = 0;
  const stack = [[0, false]];

  while (stack.length) {
    const [i, done] = stack.pop();
    const children = nodes[i].c;
    if (done) {
      y[i] = (y[children[0]] + y[children[children.length - 1]]) / 2;
      continue;
    }
    visible.push(i);
    if (!children.length || collapsed.has(i)) {
      const height = children.length ? 1.7 : 1;
      y[i] = row + height / 2;
      row += height;
      leaves.push(i);
      continue;
    }
    stack.push([i, true]);
    for (let k = children.length - 1; k >= 0; k--) stack.push([children[k], false]);
  }
  if (!visible.includes(0)) {
    throw new Error("Tree layout has lost the root node.");
}
  return { y, visible, leaves, rows: row };
}

export function countVisibleTips(data, collapsed) {
  let count = 0;
  const stack = [0];
  while (stack.length) {
    const i = stack.pop();
    const children = data.nodes[i].c;
    if (!children.length) count++;
    else if (!collapsed.has(i)) for (const child of children) stack.push(child);
  }
  return count;
}

export function calculateHighlightCounts(data, parent, tips) {
  const counts = new Int32Array(data.nodes.length);
  for (const tip of tips) counts[tip] = 1;
  for (let i = data.nodes.length - 1; i > 0; i--) counts[parent[i]] += counts[i];
  return counts;
}

export function revealAncestors(parent, collapsed, nodeIndex) {
  for (let i = parent[nodeIndex]; i >= 0; i = parent[i]) collapsed.delete(i);
}

export function getPathToRoot(parent, nodeIndex) {
  const path = new Set();
  for (let i = nodeIndex; i >= 0; i = parent[i]) path.add(i);
  return path;
}
