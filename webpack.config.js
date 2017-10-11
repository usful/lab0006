const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['whatwg-fetch', 'babel-polyfill', path.resolve(__dirname, './src/js/client.js')],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'abi.min.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [
            'transform-runtime',
            'react-html-attrs',
            'transform-decorators-legacy',
            'transform-class-properties'
          ],
          presets: ['es2015', 'stage-0', 'react'],
        },
      }
    ],
  },
  plugins: [
  ],
  devtool: 'source-map',
  watch: true,
};
