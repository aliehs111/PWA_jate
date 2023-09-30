const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: "development", //set build mode to development
    entry: {
      main: "./src/js/index.js", //entry point for app
      install: "./src/js/install.js", //entry point to install
    },
    output: {
      filename: "[name].bundle.js", //output filename placeholder for
      path: path.resolve(__dirname, "dist"), //output directory path
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "index.html",
        title: "PWA_text_editor",
      }),
      new InjectManifest({
        //to generate the service worker
        swSrc: "./src-sw.js", //sw source file
        swDest: "src-sw.js", //sw destination file
        exclude: [/\.map$/, /manifest.*\.js(?:on)?$/, /index\.html$/], //regex used to define files to exclude. such as map files, manifest files, and index.html
      }),
      new WebpackPwaManifest({
        name: "PWA_text_editor",
        short_name: "PWA_text_editor",
        description: "PWA_text_editor",
        background_color: "#ffffff",
        crossorigin: "use-credentials",
        start_url: "/",
        display: "standalone",
        publicPath: "/",
        inject: true,
        fingerprints: false, //disable adding fingerprints to the manifest which is important.  otherwise the logo will not be recognized by the code which does not have the fingerprints.
        icons: [
          {
            src: path.resolve("src/images/logo.png"), //path to app icon
            sizes: [96, 128, 192, 256, 384, 512], // icon - multiple sizes
            destination: path.join("assets", "icons"), //destination directory for icons
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css/i, //regex to match css files
          use: ["style-loader", "css-loader"], //apply style to css loaders
        },
        {
          test: /\.m?js$/, //regex to match js files
          exclude: /node_modules/, //exclude the node modules
          use: {
            loader: "babel-loader", //use babel so that app can be translated to certain browsers that may not interpret newer js
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/transform-runtime",
              ],
            },
          },
        },
      ],
    },
  };
};
