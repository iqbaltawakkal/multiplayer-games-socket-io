// -------------------------------------------------------------------
// This configuration file is for development use
// You can make changes to this file to suit your development need
// Please refer to this webpack documentation for further information
// https://webpack.js.org/guides/development/
// -------------------------------------------------------------------

const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
