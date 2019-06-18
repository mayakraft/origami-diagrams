/* Origami Diagrams v0.1 (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.OrigamiDiagrams = factory());
}(this, (function () { 'use strict';

  var defaultPageStyle = "/* @page {\n  size: 8.5in 11in;\n  margin: 70pt 60pt 70pt;\n} */\nhtml, body {\n  width: 100%;\n  margin: 0;\n}\nbody {\n  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n}\n.header {\n  /* -webkit-print-color-adjust: exact; */\n  display: grid;\n  grid-template-columns: 50% 50%;\n  height: 340px;\n  margin-bottom: 4rem;\n}\n.dashbox {\n  padding:1em;\n  border-width: 5px;\n  border-style: dashed;\n  border-color: black;\n  box-shadow: inset 5px 5px 10px #ccc;\n}\n.description {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.grid {\n  display: grid;\n  grid-template-columns: 33% 33% 33%;\n  grid-template-rows: 290px 290px;\n  grid-auto-rows: 350px;\n  font-family: 'Montserrat', sans-serif;\n}\nh1 {\n  font-size: 3.5rem;\n  margin-bottom: 2rem;\n}\np {\n  font-size: 1.5rem;\n  text-align: center;\n  width: 100%;\n  margin: 1rem 0;\n}\n.floating-finished {\n  position: absolute;\n  bottom: 0;\n  right: -100px;\n}\n.small {\n  font-size: 70%;\n  margin-top: 2rem;\n}\n.step {\n  position: relative;\n  text-align: center;\n}\n.step .number {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 2rem;\n  height: 2rem;\n  background-color: white;\n  border: 3px solid black;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.step svg {\n  margin: auto;\n}\n.step:nth-child(15) {\n/*  grid-template-rows: 270px; */\n}";

  var defaultCPStyle = "svg { --crease-width: 0.015; }\nsvg * {\n  stroke-width: var(--crease-width);\n  stroke-linecap: round;\n  stroke: black;\n}\npolygon { fill: none; stroke: none; stroke-linejoin: bevel; }\n.boundary { fill: white; stroke: black; }\n.mark { stroke: #AAA; }\n.mountain { stroke: #000; }\n.valley {\n  stroke: #000;\n  stroke-dasharray:calc(var(--crease-width)*1.333) calc(var(--crease-width)*2);\n}\n.foldedForm .boundary {fill: none; stroke: none;}\n.foldedForm .faces polygon { stroke: #000; }\n.foldedForm .faces .front { fill: linen; }\n.foldedForm .faces .back { fill: peru; }  /* #DDD; */\n.foldedForm .creases line { stroke: none; }\n\n.foldedForm .creases { display: none; opacity: 0; }\n.creasePattern .faces { display: none; opacity: 0; }\n\n.creasePattern .boundary { fill: linen; }";

  const buildPage = function (steps) {
    const diagrams = Array.from(Array(steps.length - 1))
      .map((_, i) => i + 1)
      .map(i => re.core.build_diagram_frame(steps[i]));
    steps.forEach(cp => delete cp["re:diagrams"]);
    Array.from(Array(steps.length - 1))
      .map((_, i) => steps[i])
      .forEach((cp, i) => { cp["re:diagrams"] = [diagrams[i]]; });
    const svgs = steps.map(cp => re.convert.FOLD_SVG.toSVG(cp, svgStepOptions));
    const writtenInstructions = svgs
      .map((svg, i) => steps[i]["re:diagrams"])
      .filter(a => a != null)
      .map(seq => seq.map(a => a["re:instructions"])
        .filter(a => a != null)
        .map(inst => inst.en)
        .join("\n"));
    const cpSVG = re.convert.FOLD_SVG.toSVG(steps[steps.length - 1], svgHeaderCPOptions);
    const finishedFormGraph = re.core.flatten_frame(steps[steps.length - 1], 1);
    const finishedFormRect = re.core.bounding_rect(finishedFormGraph);
    const invVMax = 1.0 - (finishedFormRect[2] > finishedFormRect[3]
      ? finishedFormRect[2] : finishedFormRect[3]);
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

  const DiagramMaker = function (steps, options = {}) {
    if (steps.length === 0) { return ""; }
    const o = {
      pageStyle: options.pageStyle || defaultPageStyle,
      svgStyle: options.svgStyle || defaultCPStyle,
      shadows: options.shadows || false,
    };
    return buildPage(steps);
  };

  return DiagramMaker;

})));
