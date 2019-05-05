const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = (env) => {
  const isProduction = (env) && (env.production === true) ? true : false;
  const settings = {
    mode: isProduction ? 'production' : 'development',
    output: isProduction ? `${pkg.name}.min.js` : `${pkg.name}.js`,
  };

  return {
    mode: settings.mode,
    entry: `${__dirname}/src/index.js`,
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './lib',
      hot: true,
    },
    output: {
      filename: settings.output,
      path: path.resolve(`${__dirname}/lib`),
      library: pkg.name,
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: "typeof self !== 'undefined' ? self : this",
    },
    module: {
      rules: [
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.global.(s(a|c)ss)$/,
          loader: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                camelCase: true,
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
          ],
        },
        {
          test: /\.global\.s(a|c)ss$/,
          loader: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000',
        },
        {
          test: /(\.jsx|\.js)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /(\.jsx|\.js)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[hash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[hash].css' : '[id].css',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebPackPlugin({
        template: './public/index.html',
        filename: './index.html',
        favicon: './public/favicon.ico',
        manifest: './public.manifest.json',
      }),
    ],
    resolve: {
      modules: ['node_modules'],
      extensions: ['.json', '.js', '.jsx', '.scss'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
  };
};
