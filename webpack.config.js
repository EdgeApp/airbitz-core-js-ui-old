/*eslint-disable no-var */

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    abcuiloader: './src/abcui-loader.js',
    abcui: './src/abcui.js'
  },
  output: {
    filename: '[name].js',
    // Export the library as a global var:
    libraryTarget: "var",
    // Name of the global var:
    library: "[name]"
  },

  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: [ 'es2015', 'react' ] }
      }
    ]
  },
}
