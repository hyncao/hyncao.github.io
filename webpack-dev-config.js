/**
 * 开发模式下的webpack配置
 * 在整个项目开发过程中，几乎99%的时间都是在这个模式下进行的
 * 注意。两种模式的配置有较大差异！！
 */

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const path = require('path');

const { description, keywords } = require('./package.json');

export default {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  entry: [
    './src/webpack-public-path', // 服务器静态资源路径配置，保证首先载入
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?reload=true',
    path.resolve(__dirname, 'src/js/index'),
  ],
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: `${__dirname}/src`, // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
      __DEV__: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({ // Create HTML file that includes references to bundled CSS and JS.
      template: 'src/index.html',
      title: 'Hyn博客',
      meta: {
        keywords: keywords.join(),
        description,
      },
      favicon: './src/favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      hash: true,
      // 这样每次客户端页面就会根据这个hash来判断页面是否有必要刷新
      // 在项目后续过程中，经常需要做些改动更新什么的，一但有改动，客户端页面就会自动更新！
      inject: 'body',
    }),
  ],
  resolve: {
    extensions: ['*', '.web.js', '.js', '.json', '.jsx'],

    // 路径别名, 懒癌福音
    alias: {
      app: path.resolve(__dirname, 'src/js'),
      // 以前你可能这样引用 import { Nav } from '../../components'
      // 现在你可以这样引用 import { Nav } from 'app/components'

      style: path.resolve(__dirname, 'src/style'),
      // 以前你可能这样引用 import "../../../style/mixins.scss"
      // 现在你可以这样引用 import "style/mixins.scss"
      // 注意：别名只能在.js文件中使用。
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },

      {
        test: /\.jsx$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },

      {
        test: /^((?!-normal).)*.scss$/,
        include: path.resolve(__dirname, 'src/js'),
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            sourceMap: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]--[hash:base64:5]',
          },
        }, 'sass-loader'],
      },

      {
        test: /-normal.scss$/,
        include: path.resolve(__dirname, 'src/js'),
        loader: 'style-loader!css-loader!sass-loader',
      },

      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/style'),
        loader: 'style-loader!css-loader!sass-loader',
      },
      // 公有样式，不需要私有化，单独配置

      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'node_modules'),
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            sourceMap: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]--[hash:base64:5]',
          },
        }],
      },

      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url-loader?limit=10000',
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url-loader?limit=10000',
      },
    ],
  },
};
