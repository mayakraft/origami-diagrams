const fs = require("fs");
const OrigamiDiagrams = require("../origami-diagrams");

fs.readFile("./tests/example.fold", (err, data) => {
  const fold_file = JSON.parse(data);
  const diagrams = OrigamiDiagrams(fold_file);
  fs.writeFile("./tests/output/test-output.html", diagrams, (err2) => {
    if (err2) { throw err2; }
    console.log("FOLD -> HTML result at output/test-output.html");
  });
});
