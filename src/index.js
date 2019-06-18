import defaultPageStyle from "./css/montserrat.css";
import defaultCPStyle from "./css/cp.css";
import BuildPage from "./build-page";

// const diagramMaker = Object.create(null);
// diagramMaker

// export default Object.freeze(diagramMaker);

const DiagramMaker = function (fold_file, options = {}) {
  if (fold_file.length === 0) { return ""; }
  const o = {
    pageStyle: options.pageStyle || defaultPageStyle,
    svgStyle: options.svgStyle || defaultCPStyle,
    shadows: options.shadows || false,
  };

  const svgStepOptions = {
    width: 250,
    height: 250,
    frame: 1,
    padding: 0.15,
    diagram: true,
    stylesheet: o.svgStyle,
    shadows: o.shadows
  };

  const svgHeaderCPOptions = {
    width: 280,
    height: 280,
    frame: 0,
    padding: 0.02,
    diagram: false,
    stylesheet: o.svgStyle,
    shadows: o.shadows
  };

  const svgHeaderFoldedOptions = {
    width: 280,
    height: 280,
    frame: 1,
    padding: 0.02, // this changes to size in relation to CP. + invVMax / 2,
    diagram: false,
    stylesheet: o.svgStyle,
    shadows: o.shadows
  };

  return BuildPage(steps);
};

export default DiagramMaker;
