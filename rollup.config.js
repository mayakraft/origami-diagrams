import minify from "rollup-plugin-babel-minify";
import babel from "rollup-plugin-babel";
import { string } from "rollup-plugin-string";
import cleanup from "rollup-plugin-cleanup";

module.exports = [{
  input: "src/index.js",
  output: {
    name: "OrigamiDiagrams",
    file: "origami-diagrams.js",
    format: "umd",
    banner: "/* Origami Diagrams v0.1.1 (c) Robby Kraft, MIT License */",
  },
  plugins: [
    cleanup({
      comments: "none",
      maxEmptyLines: 0,
    }),
    babel({
      babelrc: false,
      presets: [["@babel/env", { modules: false }]],
    }),
    string({
      include: "**/*.css", // allows .css files to be imported as a module
    }),
  ],
},
{
  input: "src/index.js",
  output: {
    name: "OrigamiDiagrams",
    file: "origami-diagrams.min.js",
    format: "umd",
    banner: "/* Origami Diagrams v0.1.1 (c) Robby Kraft, MIT License */",
  },
  plugins: [
    cleanup({ comments: "none" }),
    babel({
      babelrc: false,
      presets: [["@babel/env", { modules: false }]],
    }),
    minify({ mangle: { names: false } }),
    string({
      include: "**/*.css", // allows .css files to be imported as a module
    }),
  ],
}];
