const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: true
    }),
    new CopyPlugin([
      {
        from: 'static',
        to: 'resouces'
      }
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  mode: process.env.NODE_ENV || 'none'
}
