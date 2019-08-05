// import defaultPageStyle from "./css/montserrat.css";
import defaultPageStyle from "./css/avenir.css";

import BuildPage from "./build-page";

const DiagramMaker = function (fold_file, options = {}) {
  if (fold_file.length === 0) { return ""; }

  const o = {};
  Object.assign(o, options);
  if (o.shadows == null) { o.shadows = false; }
  if (o.style == null) { o.style = defaultPageStyle; }

  return BuildPage(fold_file, o);
};

export default DiagramMaker;
