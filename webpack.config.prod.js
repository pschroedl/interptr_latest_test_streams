const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const terserPlugin = new TerserPlugin({
  parallel: true,
  terserOptions: {
    parse: {
      ecma: 8,
    },
    compress: {
      comparisons: false,
      ecma: 5,
      inline: 2,
    },
    output: {
      ascii_only: true,
      ecma: 5,
    },
  },
});

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  optimization: {
    minimize: true,
    minimizer: [terserPlugin],
    // splitChunks: {
    //   // chunks: 'async',
    //   chunks: 'all',
    //   name: false,
    //   cacheGroups: {
    //     styles: {
    //       name: 'styles',
    //       test: /\.css$/,
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //   },
    // },
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
};
