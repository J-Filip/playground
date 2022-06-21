// neloš uvodni članak (https://ui.dev/webpack)
// TODO: dev-server za hot reload ?

/** PITANJA:
 * kako najlakše testirati?
 * kako main.top.js funkcionira?
 * što sve gulp radi s JS-om?
 * kako pokrenut gulp?
 */

/**
 * Proces prelaska:
 * - instalirati sve dependencies
 * -  prebaciti samo JS prvo da vidimo jel funkcionira?
 * */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPLugin = require('html-webpack-plugin');
const ConcatPlugin = require('webpack-concat-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'main.top': [
      //  './TEST-assets/js/main/main.js',
      //  './TEST-assets/js/main/mootools-core-1.4.5-full-nocompat-yc.js',
      //  './TEST-assets/js/main/MooTools-More-1.5.1.js',
      './TEST-assets/js/main/jquery.min.js',
      //  './TEST-assets/js/main/jquery-ui.js',
      //  './TEST-assets/js/main/Request.HTML-external-js.js',
      //  './TEST-assets/js/main/modernizr.custom.min.js',
      //  './TEST-assets/js/main/api.js',

      // ! errori
      // ? fix: vidim da se te globals (npr. Browser) nekako definiraju u .jshintrc - istražit
      // './TEST-assets/js/main/api.js',
    ],
    // ie: glob.sync("./TEST-assets/js/ltIE9/*js")

    // glob omogućuje wildcard da možemo izvuć sve .js fileove iz jednog foldera
    // 'main.top': glob.sync("./TEST-assets/js/main/*js"),
  },

  // ovdje završe svi fileovi iz entry
  output: {
    path: path.resolve(__dirname, 'TEST-public/build'),
    filename: 'index_bundle.js',
    // ? zašto takav filename?
    // filename: '[name].[chunkhash:6].js'
  },

  plugins: [
    new ConcatPlugin({
      // examples
      fileName: '[name].[hash:8].js',
      filesToConcat: [
        './TEST-assets/js/main/mootools-core-1.4.5-full-nocompat-yc.js',
        './TEST-assets/js/main/MooTools-More-1.5.1.js',
        './TEST-assets/js/main/jquery.min.js',
        './TEST-assets/js/main/jquery-ui.js',
        './TEST-assets/js/main/Request.HTML-external-js.js',
        './TEST-assets/js/main/modernizr.custom.min.js',
        './TEST-assets/js/main/api.js',
      ],
      attributes: {
        async: true,
      },
    }),

    new HtmlWebpackPLugin({}),

    // The ProvidePlugin makes a package available as a variable in every module compiled through webpack. If webpack sees that variable used, it will include the given package in the final bundle.
    // new webpack.ProvidePlugin({
    //     jQuery: 'jquery',
    //     $: 'jquery',
    //     _: 'lodash'
    // }),
    // new CopyPlugin({
    //       patterns: [
    //         { from: './TEST-assets/img', to: 'img' },
    //         { from: './TEST-assets/img', to: 'img' },
    //         { from: './TEST-assets/js/scripts', to: 'js/pages/[path][name].[hash:8].[ext]' },
    //       ],
    //     }),
    // new WebpackManifestPlugin({
    //   basePath: 'assets',
    //   publicPath: 'build',
    // })
  ],
};
