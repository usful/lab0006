const webpack = require('webpack');
const path = require('path');

// Use the environment variable to control transpiling:
// For source maps for easy debug...
//
// $ NODE_ENV="dev" webpack
// $ ls ./dev
// abi.min.js
//
// To transpile for production (minified)...
// 
// $ webpack
// $ ls ./prod
// abi.min.js
//
const runEnvironment = process.env.NODE_ENV || 'prod';

const paths = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: runEnvironment !== 'prod' ? "inline-sourcemap" : null,
    entry: "./js/client.js",
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
                }
            }
        ]
    },
    output: {
        path: path.join(__dirname, runEnvironment),
        filename: "abi.min.js"
    },
    plugins: runEnvironment !== 'prod' ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};
