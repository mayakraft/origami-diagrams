const fs = require("fs");
const OrigamiDiagrams = require("../origami-diagrams");

fs.readFile("./tests/example.fold", (err, data) => {
  const fold_file = JSON.parse(data);
  const diagrams = OrigamiDiagrams(fold_file);
  fs.writeFile("./tests/output/test-output-1.html", diagrams, (err2) => {
    if (err2) { throw err2; }
    console.log("FOLD -> HTML result at output/test-output-1.html");
  });

  fs.readFile("./src/css/montserrat.css", "utf8", (err2, cssData) => {
    const diagrams2 = OrigamiDiagrams(fold_file, { style: cssData });
    fs.writeFile("./tests/output/test-output-2.html", diagrams2, (err3) => {
      if (err3) { throw err3; }
      console.log("FOLD -> HTML result at output/test-output-2.html");
    });
  });
});
