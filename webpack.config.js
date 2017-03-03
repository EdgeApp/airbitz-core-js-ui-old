/* eslint-disable no-var */

var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    abcuiloader: './src/abcui-loader.jsx',
    abcui: './src/abcui.js'
  },
  output: {
    filename: 'assets/js/[name].js',
    // Export the library as a global var:
    libraryTarget: 'var',
    // Name of the global var:
    library: '[name]'
  },

  module: {
    loaders: [
      { test: /\.js$/,
        exclude: [/node_modules/, /airbitz-core-js\/dist/],
        loader: 'babel-loader',
        query: { presets: [ 'es2015', 'react' ] }
      },
      { test: /\.jsx$/,
        exclude: [/node_modules/, /airbitz-core-js\/dist/],
        loader: 'babel-loader',
        query: { presets: [ 'es2015', 'react' ] }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}
