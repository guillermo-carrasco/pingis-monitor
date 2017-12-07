const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const baseConfig = require('./webpack.config.base')

const config = Object.assign({}, baseConfig)

config.devtool = 'source-map'
config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new ExtractTextPlugin('style.css')
  )

  // Production rules
config.module.rules.push(
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader?modules=true&camelCase=true&localIdentName=[hash:base64:5]!postcss-loader!sass-loader',
    }),
  }
)

module.exports = config
