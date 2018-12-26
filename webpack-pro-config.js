/**
 * 产品模式下的webpack配置
 *
 * 注意。两种模式的配置有较大差异！！
 */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// webpack中生成HTML的插件，

const { description, keywords } = require('./package.json');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
  // 文件入口配置
    index: './src/js/index',
    // 为了优化，切割代码，提取第三方库（实际上,，我们将会引入很多第三方库）
  },
  // 页面入口文件配置

  output: {
  // 文件输出配置

    path: path.join(__dirname, 'dist'),
    // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它.

    publicPath: '',
    // 模板、样式、脚本、图片等资源对应的server上的路径

    // filename: '[name][chunkhash:8].js'
    // 命名生成的JS
    filename: 'assets/js/[name].js',
    chunkFilename: 'chunk/[name].js',
  },

  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),

    new BundleAnalyzerPlugin(),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      // html模板的路径

      title: 'Hyn博客',

      meta: {
        keywords: keywords.join(),
        description,
      },

      filename: 'index.html',
      // 文件名以及文件将要存放的位置

      favicon: './src/favicon.ico',
      // favicon路径

      inject: 'body',
      // js插入的位置，true/'head'  false/'body'

      // chunks: [ 'index', 'vendor' ],
      // 指定引入的chunk，根据entry的key配置，不配置就会引入所有页面的资源

      hash: true,
      // 这样每次客户端页面就会根据这个hash来判断页面是否有必要刷新
      // 在项目后续过程中，经常需要做些改动更新什么的，一但有改动，客户端页面就会自动更新！

      minify: {
      // 压缩HTML文件
        removeComments: true,
        // 移除HTML中的注释

        collapseWhitespace: true,
        // 删除空白符与换行符
      },
    }),
  ],

  resolve: {
    // 针对 import 'react'之类不是绝对路径也不是相对路径的写法，减少递归搜索
    modules: [path.resolve(__dirname, 'node_modules')],
    // 实际就是自动添加后缀，默认是当成js文件来查找路径
    // 空字符串在此是为了resolve一些在import文件时不带文件扩展名的表达式
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
        loaders: ['babel-loader?cacheDirectory'],
        exclude: /node_modules/,
      },

      {
        test: /\.jsx$/,
        loaders: ['babel-loader?cacheDirectory'],
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
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
