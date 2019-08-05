/**
 * turn an array of fold objects into a step by step diagram
 * each fold object should contain diagram frames (see: readme)
 */

import DrawFOLD from "../include/fold-draw";
import {
  get_file_value,
  add_frame_class,
  bounding_rect,
  final_frame_of_class,
  clone
} from "./helpers";

const buildPage = function (fold, options) {
  // take care of options.shadows
  const fold_file = clone(fold);

  // pull out the parts which will become the steps SVG and header SVGs
  const steps = fold_file.file_frames
    .filter(frame => frame.frame_classes.includes("diagrams"));
  const finalCP = final_frame_of_class(fold_file, "creasePattern");
  const finalFoldedForm = final_frame_of_class(fold_file, "foldedForm");

  steps.forEach(s => add_frame_class(s, "step"));
  add_frame_class(finalCP, "header");
  add_frame_class(finalFoldedForm, "header");

  let fold_time = Math.floor(steps.length / 4);
  if (fold_time === 0) { fold_time = 1; }

  const foldedFormBounds = bounding_rect(finalFoldedForm);
  const size_ratio_float = (foldedFormBounds[2] > foldedFormBounds[3]
    ? foldedFormBounds[2] : foldedFormBounds[3]);
  const size_ratio = `1 : ${size_ratio_float === 1
    ? size_ratio_float
    : size_ratio_float.toFixed(2)}`;

  // build SVGs, the sequence, and 2 for the header the CP and folded form
  const sequenceSVGs = steps
    .map(cp => DrawFOLD.svg(cp, {
      inlineStyle: false,
      diagram: true,
      padding: 0.15
    }));
  const cpSVG = DrawFOLD.svg(finalCP, {
    inlineStyle: false,
    diagram: false,
    padding: 0.02
  });
  const finalSVG = DrawFOLD.svg(finalFoldedForm, {
    inlineStyle: false,
    diagram: false,
    padding: 0.02
  });
  finalFoldedForm.frame_classes.push("scaled");
  const finalSVGScaled = DrawFOLD.svg(finalFoldedForm, {
    inlineStyle: false,
    diagram: false,
    // padding: 0.02 + invVMax / 2
    viewBox: [
      foldedFormBounds[0],
      foldedFormBounds[1] - (1 - foldedFormBounds[3]),
      1, 1]
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
      <h1 class="title">${get_file_value(fold_file, "title")}</h1>
      <p class="author">designed by ${get_file_value(fold_file, "author")}</p>
      <p class="description">${get_file_value(fold_file, "description")}</p>
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
