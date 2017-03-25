var path = require('path');

module.exports = {
  entry: {
    adminPage: './static/js/src/admin/page.js',
    adminPages: './static/js/src/admin/pages.js',
    adminDashboard: './static/js/src/admin/dashboard.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/js/dist')
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
};