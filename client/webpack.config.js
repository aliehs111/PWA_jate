const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        title: 'PWA_text_editor',
      }),
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
        exclude: [/\.map$/, /manifest.*\.js(?:on)?$/, /index\.html$/],
      }),
      new WebpackPwaManifest({
        name: 'PWA_text_editor',
        short_name: 'PWA_text_editor',
        description: 'PWA_text_editor',
        background_color: '#ffffff',
        crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
        start_url: '/',
        display: 'standalone',
        publicPath: '/',
        inject: true,
        fingerprints: true,
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
            destination: path.join('assets', 'icons')
          }
          
        ]
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ],
    },
  };
};
