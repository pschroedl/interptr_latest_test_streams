const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed;

// Create an object that maps the environment variables to be accessible in your app
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, '/public/index.html'),
  filename: 'index.html',
  inject: 'body',
  minify: false,
});

const BrotliPluginConfig = new BrotliPlugin({
  asset: '[path].br[query]',
  test: /\.(js|css|html|svg)$/,
  threshold: 10240,
  minRatio: 0.8,
});

const TerserPlugin = require('terser-webpack-plugin');

const TerserPluginConfig = new TerserPlugin({
  parallel: true,
  // minify: TerserPlugin.uglifyJSMinify,
  terserOptions: {
    parse: {
      ecma: 8,
    },
    compress: true,
    // compress: {
    //   comparisons: false,
    //   ecma: 5,
    //   inline: 2,
    // },
    output: {
      ascii_only: true,
      ecma: 5,
    },
  },
  extractComments: true,
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
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  optimization: {
    minimize: true,
    minimizer: [
      TerserPluginConfig,
    ],
    concatenateModules: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/',
    filename: '[name]_bundle.js',
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new webpack.DefinePlugin(envKeys),
  ],
};
