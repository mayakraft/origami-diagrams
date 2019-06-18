/**
 * turn an array of fold objects into a step by step diagram
 * each fold object should contain diagram frames (see: Rabbit Ear)
 */

import FOLD_SVG from "../include/fold-svg";
import { flatten_frame, bounding_rect } from "./graph";

const buildPage = function (fold_file, options) {
  // console.log(steps);
  // console.log(diagrams);

  const svgStepOptions = {
    width: 250,
    height: 250,
    frame: 1,
    padding: 0.15,
    diagram: true,
    stylesheet: options.svgStyle,
    shadows: options.shadows
  };

  const svgHeaderCPOptions = {
    width: 280,
    height: 280,
    frame: 0,
    padding: 0.02,
    diagram: false,
    stylesheet: options.svgStyle,
    shadows: options.shadows
  };

  const svgHeaderFoldedOptions = {
    width: 280,
    height: 280,
    frame: 1,
    padding: 0.02, // this changes to size in relation to CP. + invVMax / 2,
    diagram: false,
    stylesheet: options.svgStyle,
    shadows: options.shadows
  };

  // make SVGs of each step, including diagramming fold and arrows
  const steps = fold_file.file_frames;
  const svgs = steps.map(cp => FOLD_SVG.toSVG(cp, svgStepOptions));

  // get the written instructions (in english)
  const writtenInstructions = svgs
    .map((svg, i) => steps[i]["re:diagrams"])
    .filter(a => a != null)
    .map(seq => seq.map(a => a["re:diagram_instructions"])
      .filter(a => a != null)
      .map(inst => inst.en)
      .join("\n"));

  const cpSVG = FOLD_SVG.toSVG(steps[steps.length - 1], svgHeaderCPOptions);
  const finishedFormGraph = flatten_frame(steps[steps.length - 1], 1);
  // console.log("finishedFormGraph", finishedFormGraph);
  const finishedFormRect = bounding_rect(finishedFormGraph);
  // console.log("finishedFormRect", finishedFormRect);
  const invVMax = 1.0 - (finishedFormRect[2] > finishedFormRect[3]
    ? finishedFormRect[2] : finishedFormRect[3]);
  // console.log("invVMax", invVMax);
  svgHeaderFoldedOptions.padding = 0.02 + invVMax / 2;

  const finishedSVG = FOLD_SVG.toSVG(steps[steps.length - 1], svgHeaderFoldedOptions);
  let fold_time = Math.floor(steps.length / 4);
  if (fold_time === 0) { fold_time = 1; }

  writtenInstructions[svgs.length - 1] = "finished";

  const header = `<div class="header dashbox">
<div style="position: relative; padding: 30px;">
  ${cpSVG}
  <div class="floating-finished">
    ${finishedSVG}
  </div>
</div>
<div class="description">
  <h1>Origami</h1>
  <p>by _____________</p>
  <p>fold time<br>${fold_time} ${(fold_time === 1 ? "minute" : "minutes")}</p>
  <p class="small">RabbitEar.org</p>
</div>
</div>
`;
  // create html blob
  let innerHTML = "";
  innerHTML += header;
  innerHTML += "<div class='grid'>\n";
  innerHTML += svgs
    .reduce((prev, curr, i) => `${prev}
<div class="step"><h3 class="number">${(i + 1)}</h3>
${curr}
<p>${(writtenInstructions[i] || "")}</p>
</div>\n`, "");
  innerHTML += "</div>\n";

  return `<html>
<head>
<title>Rabbit Ear</title>
<style>${options.pageStyle}</style>
</head>
<body>
${innerHTML}
</body>
</html>`;
};

export default buildPage;
