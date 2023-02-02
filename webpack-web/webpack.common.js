const path = require('path')
const common = require('../webpack.common.js')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  entry: path.resolve(__dirname, '..', 'src', 'web', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|jpeg|gif)/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(
        __dirname,
        '..',
        'src',
        'web',
        'public',
        'index.html'
      ),
      inject: true
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'src', 'web', 'public', '**', '*')
        }
      ]
    })
  ]
})
