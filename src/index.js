/**
 * turn an array of fold objects into a step by step diagram
 * each fold object should contain diagram frames (see: Rabbit Ear)
 */

import defaultPageStyle from "css/montserrat.css";
import defaultCPStyle from "css/cp.css";

export default function (steps, options = {}) {
  if (steps.length === 0) { return ""; }
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


  const makeDiagrams = function (steps) {
    // convert "re:construction" into "re:diagrams"
    const diagrams = Array.from(Array(steps.length - 1))
      .map((_, i) => i + 1)
      .map(i => re.core.build_diagram_frame(steps[i]));
    steps.forEach(cp => delete cp["re:diagrams"]); // clear old data if exists
    Array.from(Array(steps.length - 1))
      .map((_, i) => steps[i])
      .forEach((cp, i) => { cp["re:diagrams"] = [diagrams[i]]; });

    // console.log(steps);
    // console.log(diagrams);

    // make SVGs of each step, including diagramming fold and arrows
    const svgs = steps.map(cp => re.convert.FOLD_SVG.toSVG(cp, svgStepOptions));

    // get the written instructions (in english)
    const writtenInstructions = svgs
      .map((svg, i) => steps[i]["re:diagrams"])
      .filter(a => a != null)
      .map(seq => seq.map(a => a["re:instructions"])
        .filter(a => a != null)
        .map(inst => inst.en)
        .join("\n"));

    const cpSVG = re.convert.FOLD_SVG.toSVG(steps[steps.length - 1], svgHeaderCPOptions);
    const finishedFormGraph = re.core.flatten_frame(steps[steps.length - 1], 1);
    // console.log("finishedFormGraph", finishedFormGraph);
    const finishedFormRect = re.core.bounding_rect(finishedFormGraph);
    // console.log("finishedFormRect", finishedFormRect);
    const invVMax = 1.0 - (finishedFormRect[2] > finishedFormRect[3]
      ? finishedFormRect[2] : finishedFormRect[3]);
    // console.log("invVMax", invVMax);
    svgHeaderFoldedOptions.padding = 0.02 + invVMax / 2;

    const finishedSVG = re.convert.FOLD_SVG.toSVG(steps[steps.length - 1], svgHeaderFoldedOptions);
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
<style>${o.pageStyle}</style>
</head>
<body>
${innerHTML}
</body>
</html>`;
  };

  return makeDiagrams(steps);
};
