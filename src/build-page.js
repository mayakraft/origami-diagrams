/**
 * turn an array of fold objects into a step by step diagram
 * each fold object should contain diagram frames (see: readme)
 */

import FOLD_SVG from "../include/fold-svg";
import { bounding_rect, flatten_frame, clone } from "./graph";

const findFinal = function (fold_file, frame_class) {
  // if it exists, get the user-supplied final fold
  const finalCP = fold_file.file_frames
    .filter(f => f.frame_classes.includes("final")
      && f.frame_classes.includes(frame_class)).shift();
  if (finalCP !== undefined) { return finalCP; }
  // get
  const final_frame = fold_file.file_frames[fold_file.file_frames.length - 1];
  if ("frame_classes" in final_frame === true
    && final_frame.frame_classes.includes(frame_class)) {
    return clone(final_frame);
  }
  if ("file_frames" in final_frame === true) {
    const found_index = final_frame.file_frames
      .map((frame, i) => ("frame_classes" in frame === true
        && frame.frame_classes.includes(frame_class) ? i : undefined))
      .filter(el => el !== undefined)
      .shift();
    if (found_index !== undefined) {
      return clone(flatten_frame(final_frame, found_index + 1));
    }
  }
  return {};
};

const buildPage = function (fold, options) {
  // take care of options.shadows
  const fold_file = JSON.parse(JSON.stringify(fold));

  const file_keys = Object.keys(fold_file)
    .filter(key => key.substring(0, 5) === "file_");
  const meta = {};
  file_keys.forEach((key) => { meta[key] = fold_file[key]; });
  if (meta.file_title == null) { meta.file_title = "Origami"; }
  if (meta.file_author == null) { meta.file_author = ""; }
  if (meta.file_description == null) { meta.file_description = ""; }

  // make SVGs of each step, including diagramming fold and arrows
  const steps = fold_file.file_frames.filter(frame => frame.frame_classes.includes("diagrams"));
  const finalCP = findFinal(fold_file, "creasePattern");
  const finalFoldedForm = findFinal(fold_file, "foldedForm");

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
  const invertedWidth = 1.0 - finishedFormRect[2];
  const invertedHeight = 1.0 - finishedFormRect[3];

  let fold_time = Math.floor(steps.length / 4);
  if (fold_time === 0) { fold_time = 1; }

  const size_ratio_float = (finishedFormRect[2] > finishedFormRect[3]
    ? finishedFormRect[2] : finishedFormRect[3]);
  const size_ratio = `1 : ${size_ratio_float === 1
    ? size_ratio_float
    : size_ratio_float.toFixed(2)}`;


  // build SVGs, the sequence, and 2 for the header the CP and folded form
  const sequenceSVGs = steps
    .map(cp => FOLD_SVG.toSVG(cp, {
      inlineStyle: false,
      diagram: true,
      frame: 1,
      padding: 0.15
    }));
  const cpSVG = FOLD_SVG.toSVG(finalCP, {
    inlineStyle: false,
    diagram: false,
    padding: 0.02
  });
  const finalSVG = FOLD_SVG.toSVG(finalFoldedForm, {
    inlineStyle: false,
    diagram: false,
    padding: 0.02
  });
  finalFoldedForm.file_classes.push("scaled");
  const finalSVGScaled = FOLD_SVG.toSVG(finalFoldedForm, {
    inlineStyle: false,
    diagram: false,
    // padding: 0.02 + invVMax / 2
    viewBox: [finishedFormRect[0], finishedFormRect[1] - invertedHeight, 1, 1]
  });

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
${options.style}
</style>
</head>
<body>
  <div class="page-grid">
    <div class="header">
      ${cpSVG}
      ${finalSVG}
      ${finalSVGScaled}
      <h1 class="title">${meta.file_title}</h1>
      <p class="author">designed by ${meta.file_author}</p>
      <p class="description">${meta.file_description}</p>
      <p class="size-ratio">ratio ${size_ratio}</p>
      <p class="fold-time">fold time<br>${fold_time} ${(fold_time === 1 ? "minute" : "minutes")}</p>
      <p class="attribution small">rabbitEar.org</p>
    </div>
    ${sequenceHTML}
  </div>
</body>
</html>`;
};

export default buildPage;
