
export const get_file_value = function (fold_file, key_suffix) {
  // key_suffix is something like "title" or "author" (to become "file_title")
  if (fold_file[`file_${key_suffix}`] == null) { return ""; }
  return fold_file[`file_${key_suffix}`];
};

export const add_frame_class = function (frame, class_name) {
  if (frame.frame_classes == null) { frame.frame_classes = []; }
  if (!frame.frame_classes.includes(class_name)) {
    frame.frame_classes.push(class_name);
  }
};

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

export const final_frame_of_class = function (fold_file, frame_class) {
  // "frame_class" is something like "foldedForm", or "creasePattern"
  // if it exists, get the user-supplied final fold
  const matching_frames = fold_file.file_frames
    .filter(f => f.frame_classes.includes(frame_class));

  if (matching_frames.length === 0) { return {}; }

  const matching_final = matching_frames
    .filter(f => f.frame_classes.includes("final"))
    .shift();
  if (matching_final !== undefined) { return matching_final; }

  return matching_frames[matching_frames.length - 1];
};

export const clone = function (o) {
  // from https://jsperf.com/deep-copy-vs-json-stringify-json-parse/5
  let newO;
  let i;
  if (typeof o !== "object") {
    return o;
  }
  if (!o) {
    return o;
  }
  if (Object.prototype.toString.apply(o) === "[object Array]") {
    newO = [];
    for (i = 0; i < o.length; i += 1) {
      newO[i] = clone(o[i]);
    }
    return newO;
  }
  newO = {};
  for (i in o) {
    if (o.hasOwnProperty(i)) {
      newO[i] = clone(o[i]);
    }
  }
  return newO;
};
