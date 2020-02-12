// -----------------------------------------------------------------------------
// This configuration file is a common config used in development and production
// You can make changes to this file to suit your development and production need
// Please refer to this webpack documentation for further information
// https://webpack.js.org/concepts/configuration/#simple-configuration
// -----------------------------------------------------------------------------
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: {
    bundle: "./src/index.js"
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(gif|png|jpg|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              context: path.resolve(__dirname, "./src/img"),
              name: "[path][name].[ext]",
              useRelativePath: false,
              outputPath: "img/"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: true
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "src/index.html" }),
    new VueLoaderPlugin()
  ]
};
