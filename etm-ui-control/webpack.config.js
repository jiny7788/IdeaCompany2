const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const port = process.env.PORT || 8080;

module.exports = {
    mode: 'development', // 1
    entry: './src/index.js', // 2
    output: { // 3
      filename: 'bundle.[hash].js' // 4
    },

    module: {
        rules: [
          { // 1
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-react'
                ]
              }
            },
          },
          { // 2
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: {
                  minimize: true,
                },
              },
            ],
          },
          {
            test: /\.css$/,
            use: [
              { loader: "style-loader" },
              { loader: "css-loader" ,
                options: {
                  sourceMap: true,
                }
              }
              ]
          },
        ],
    },

  plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        new HtmlWebpackPlugin({
          template: 'public/index.html',
        }),
        new MiniCssExtractPlugin({ filename: 'App.css' })
    ],

  devServer: {
        allowedHosts: "all",
        host: 'localhost',        
        port: port,
        open: true,
        historyApiFallback: true,
    },
};