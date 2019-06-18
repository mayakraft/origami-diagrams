// import minify from "rollup-plugin-babel-minify";
import { string } from "rollup-plugin-string";
import cleanup from "rollup-plugin-cleanup";

module.exports = {
  input: "src/index.js",
  output: {
    name: "OrigamiDiagrams",
    file: "origami-diagrams.js",
    format: "umd",
    banner: "/* Origami Diagrams v0.1 (c) Robby Kraft, MIT License */",
  },
  plugins: [
    cleanup({
      comments: "none",
      maxEmptyLines: 0,
    }),
    // json({}),
    // minify( {
    //  bannerNewLine: true,
    //  comments: false
    // } ),
    string({
      include: ["**/*.css", "**/*.fold"], // import css like modules
    }),
  ],
};
