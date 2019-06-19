
export const bounding_rect = function (graph) {
  if ("vertices_coords" in graph === false
    || graph.vertices_coords.length <= 0) {
    return [0, 0, 0, 0];
  }
  const dimension = graph.vertices_coords[0].length;
  const min = Array(dimension).fill(Infinity);
  const max = Array(dimension).fill(-Infinity);
  graph.vertices_coords.forEach(v => v.forEach((n, i) => {
    if (n < min[i]) { min[i] = n; }
    if (n > max[i]) { max[i] = n; }
  }));
  return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
    ? [0, 0, 0, 0]
    : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};
