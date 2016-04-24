var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
  name: 'krux-todo-example',
  target: 'web',
  entry: __dirname + '/src/App.js',
  devtool: 'sourcemap',
  output: {
    path: __dirname + '/public/js/',
    filename: 'bundle.js'
  },
  node: {
    globals: true,
    __filename: true,
    __dirname: true
  },
  root: [ path.join(__dirname, 'src'), path.join(__dirname, 'node_modules') ],
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules|lib/ }
    ]
  },
  resolve: {
    alias: {
      'point-one/lib': __dirname + '/../../lib/',
      'point-one': __dirname + '/../../lib/index'
      // react: __dirname + '/node_modules/react/dist/react.min',
      // 'react-dom': __dirname + '/node_modules/react-dom/dist/react-dom.min'
    },
    root:  path.resolve(__dirname, 'src'),
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: {
    root: path.resolve(__dirname, 'node_modules')
  }
};
