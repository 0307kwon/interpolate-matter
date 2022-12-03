const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-source-map",
  devServer: {
    compress: true,
    hot: true,
    port: 9000,
    historyApiFallback: true,
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
});
