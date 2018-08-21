const path = require('path');

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, './common'),

  entry: {
    javascript: './index.jsx'
  },

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/build'),
  },

  resolve: {
    alias: {
      react: path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ],
  },
};
