/**
 * turn an array of fold objects into a step by step diagram
 * each fold object should contain diagram frames (see: readme)
 */

import FOLD_SVG from "../include/fold-svg";
import { bounding_rect } from "./graph";

const svgOptions = {
  frame: 1,
  padding: 0.15,
  diagram: true,
  inlineStyle: false,
  shadows: false
};

const buildPage = function (fold_file, options) {
  // take care of options.shadows

  // make SVGs of each step, including diagramming fold and arrows
  const steps = fold_file.file_frames.filter(frame => frame.frame_classes.includes("diagrams"));
  const finalCP = fold_file.file_frames
    .filter(f => f.frame_classes.includes("final")
      && f.frame_classes.includes("creasePattern")).shift();
  const finalFoldedForm = fold_file.file_frames
    .filter(f => f.frame_classes.includes("final")
      && f.frame_classes.includes("foldedForm")).shift();
  steps.filter(s => s.file_classes == null)
    .forEach((s) => { s.file_classes = []; });
  if (finalCP.file_classes == null) { finalCP.file_classes = []; }
  if (finalFoldedForm.file_classes == null) {
    finalFoldedForm.file_classes = [];
  }
  steps.forEach(s => s.file_classes.push("step"));
  finalCP.file_classes.push("header");
  finalFoldedForm.file_classes.push("header");


  // const finishedFormGraph = flatten_frame(steps[steps.length - 1], 1);
  // console.log("finishedFormGraph", finishedFormGraph);
  const finishedFormRect = bounding_rect(finalFoldedForm);
  // console.log("finishedFormRect", finishedFormRect);
  const invVMax = 1.0 - (finishedFormRect[2] > finishedFormRect[3]
    ? finishedFormRect[2] : finishedFormRect[3]);
  // console.log("invVMax", invVMax);

  let fold_time = Math.floor(steps.length / 4);
  if (fold_time === 0) { fold_time = 1; }


  // build SVGs, the sequence, and 2 for the header the CP and folded form
  const sequenceSVGs = steps
    .map(cp => FOLD_SVG.toSVG(cp, Object.assign(svgOptions, {
      diagram: true
    })));
  const cpSVG = FOLD_SVG.toSVG(finalCP, Object.assign(svgOptions, {
    diagram: false,
    padding: 0.02
  }));
  const finalSVG = FOLD_SVG.toSVG(finalFoldedForm, Object.assign(svgOptions, {
    diagram: false,
    padding: 0.02 + invVMax / 2
  }));

  // get the written instructions (in english)
  const writtenInstructions = sequenceSVGs
    .map((svg, i) => steps[i]["re:diagrams"])
    .filter(a => a != null)
    .map(seq => seq.map(a => a["re:diagram_instructions"])
      .filter(a => a != null)
      .map(inst => inst.en)
      .join("\n"));

  const sequenceHTML = sequenceSVGs
    .reduce((prev, curr, i) => `${prev}
<div class="step">
  <h3 class="number">${(i + 1)}</h3>
  ${curr}
  <p>${(writtenInstructions[i] || "")}</p>
</div>
`, "");

  return `<html>
<head>
<title>Rabbit Ear</title>
<style>
${options.pageStyle}
</style>
</head>
<body>
  <div class="page-grid">
    <div class="header">
      ${cpSVG}
      ${finalSVG}
      <h1 class="title">Origami</h1>
      <p class="author">by _____________</p>
      <p class="fold-time">fold time<br>${fold_time} ${(fold_time === 1 ? "minute" : "minutes")}</p>
      <p class="attribution small">RabbitEar.org</p>
    </div>
    ${sequenceHTML}
  </div>
</body>
</html>`;
};

export default buildPage;
