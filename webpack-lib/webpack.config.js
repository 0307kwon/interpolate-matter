const path = require("path");
const common = require("../webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "production",
  entry: path.resolve(__dirname, "..", "src", "package", "index.tsx"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "..", "lib"),
    library: "@0307kwon/interpolate-matter",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  externals: ["react", "react-dom", "matter-js", "lodash-es"],
});
