const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src", "package", "index.ts"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    library: "@0307kwon/interpolate-matter",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  externals: ["react", "react-dom", "matter-js"],
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  cache: false,
};
