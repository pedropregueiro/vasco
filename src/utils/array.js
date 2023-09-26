const indexComparator = (e1, e2) => {
  if (e1 === -1 && e2 === -1) return 0;

  // Single match
  if (e1 === -1) return 1;
  if (e2 === -1) return -1;

  // If both match, pick the first
  if (e1 < e2) return -1;
  if (e1 > e2) return 1;

  return 0;
};

export const comparator = (...sortValueExtractors) => {
  const invert = (n) => {
    if (n === 1) return -1;
    if (n === -1) return 1;
    throw new Error();
  };

  return (e1, e2) => {
    for (const sortValueExtractor of sortValueExtractors) {
      const extractValue =
        typeof sortValueExtractor === "string"
          ? (e) => e[sortValueExtractor]
          : typeof sortValueExtractor === "function"
          ? sortValueExtractor
          : typeof sortValueExtractor.value === "string"
          ? (e) => e[sortValueExtractor.value]
          : sortValueExtractor.value;

      const desc = sortValueExtractor?.order === "desc";
      const type = sortValueExtractor?.type;

      const [v1, v2] = [e1, e2].map(extractValue);

      if (type === "index") {
        const result = indexComparator(v1, v2);
        if (result === 0) continue;
        return desc ? invert(result) : result;
      }

      if (typeof v1 === "boolean") {
        if (v1 === v2) continue;
        if (v1 && !v2) return desc ? 1 : -1;
        if (!v1 && v2) return desc ? -1 : 1;
      }

      if (v1 < v2) return desc ? 1 : -1;
      if (v1 > v2) return desc ? -1 : 1;
    }
    return 0;
  };
};

export const sort = (comparator, list) => [...list].sort(comparator);

export const sortBy = (...args) => {
  const sortValueExtractors = args.slice(0, -1);
  const list = args.slice(-1)[0];
  return sort(comparator(...sortValueExtractors), list);
};
