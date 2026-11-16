/** Search-index construction and lookup helpers shared by virus trees. */
export function buildCladeOptions(data) {
  const options = [];
  data.subclades.forEach((subclade, sub) => {
    options.push({
      value: subclade.name,
      label: `${subclade.major >= 0 ? data.majors[subclade.major].name : ""} · ${subclade.n} seqs`,
      sub,
    });
  });
  data.majors.forEach((major, index) => {
    options.push({ value: `${major.name} (major clade)`, label: `${major.n} seqs`, major: index });
  });
  return options.sort((a, b) => a.value.localeCompare(b.value));
}

export function buildAccessionIndex(data) {
  const exact = new Map();
  const base = new Map();
  data.nodes.forEach((node, index) => {
    if (!node.c.length) {
      const accession = node.n.toUpperCase();
      exact.set(accession, index);
      base.set(accession.replace(/\.\d+$/, ""), index);
    }
  });
  return { exact, base, sorted: [...exact.keys()].sort() };
}

export function suggestAccessions(prefix, index, data, limit = 40) {
  const query = prefix.trim().toUpperCase();
  if (query.length < 2) return [];
  let low = 0;
  let high = index.sorted.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (index.sorted[mid] < query) low = mid + 1;
    else high = mid;
  }
  const matches = [];
  for (let i = low; i < index.sorted.length && matches.length < limit && index.sorted[i].startsWith(query); i++) {
    matches.push(data.nodes[index.exact.get(index.sorted[i])].n);
  }
  return matches;
}

export function findCladeOption(value, options) {
  const query = value.trim().toLowerCase();
  if (!query) return undefined;
  return options.find(option => option.value.toLowerCase() === query);
}

export function findAccession(value, index) {
  const query = value.trim().toUpperCase();
  if (!query) return undefined;
  return index.exact.has(query)
    ? index.exact.get(query)
    : index.base.get(query.replace(/\.\d+$/, ""));
}

export function findCladeTips(data, option) {
  const tips = [];
  data.nodes.forEach((node, index) => {
    if (!node.c.length && (option.major !== undefined ? node.mj === option.major : node.sc === option.sub)) {
      tips.push(index);
    }
  });
  return tips;
}
