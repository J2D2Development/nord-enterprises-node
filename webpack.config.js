var path = require('path');

module.exports = {
  entry: './static/js/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static/js/dist')
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
};