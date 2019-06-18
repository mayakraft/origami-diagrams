import defaultPageStyle from "./css/montserrat.css";
import defaultCPStyle from "./css/cp.css";
import BuildPage from "./build-page";

// const diagramMaker = Object.create(null);
// diagramMaker
// export default Object.freeze(diagramMaker);

const DiagramMaker = function (fold_file, options = {}) {
  if (fold_file.length === 0) { return ""; }

  const o = {};
  Object.assign(o, options);
  if (o.shadows == null) { o.shadows = false; }
  if (o.svgStyle == null) { o.svgStyle = defaultCPStyle; }
  if (o.pageStyle == null) { o.pageStyle = defaultPageStyle; }

  return BuildPage(fold_file, o);
};

export default DiagramMaker;
