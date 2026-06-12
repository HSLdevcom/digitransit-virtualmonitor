'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash:8][ext]',
      publicPath: '/',
      clean: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      // Allow bare-specifier ESM imports everywhere
      fullySpecified: false,
      alias: {
        // Mirrors the jest moduleNameMapper "^src/(.*)$" alias
        src: path.resolve(__dirname, 'src'),
      },
    },

    module: {
      rules: [
        // Allow bare-specifier ESM imports inside node_modules
        {
          test: /\.m?js$/,
          include: /node_modules/,
          resolve: { fullySpecified: false },
        },
        // TypeScript / JavaScript (application code only)
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: isProduction ? [] : ['react-refresh/babel'],
            },
          },
        },
        // SVG → React component, preserving the CRA-style named ReactComponent export
        // so existing  import { ReactComponent as X } from './x.svg'  imports keep working
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                exportType: 'named',
                namedExport: 'ReactComponent',
                // Remove width/height attributes from SVG elements so that
                // CSS width/height (including inline styles from Icon.tsx) can
                // properly control the SVG viewport. The viewBox is preserved
                // so aspect-ratio scaling still works correctly.
                dimensions: false,
              },
            },
          ],
        },
        // SCSS / CSS for application source — run through sass-loader
        {
          test: /\.(scss|sass|css)$/,
          exclude: /node_modules/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                // Stay on the legacy API so that ~node_modules tilde imports in
                // main.scss (e.g. @import '~@hsl-fi/design-tokens/css/spacing')
                // continue to resolve through webpack's resolver.
                // silenceDeprecations suppresses the matching Dart Sass warnings
                // without requiring a full @import → @use migration right now.
                sassOptions: {
                  silenceDeprecations: ['import', 'legacy-js-api'],
                },
              },
            },
          ],
        },
        // Plain CSS from node_modules — skip sass-loader to avoid spurious warnings.
        // sideEffects: true overrides any package-level "sideEffects": false so that
        // CSS imports inside packages (e.g. @hsl-fi/site-header) are never tree-shaken.
        {
          test: /\.css$/,
          include: /node_modules/,
          sideEffects: true,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        // Images, fonts and other binary assets
        {
          test: /\.(png|jpg|jpeg|gif|ico|eot|otf|ttf|woff|woff2)$/,
          type: 'asset/resource',
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode ?? 'development'),
        'process.env.REACT_APP_CONFIG': JSON.stringify(process.env.REACT_APP_CONFIG ?? ''),
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'static/css/[name].[contenthash:8].css',
              chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            }),
            new CopyWebpackPlugin({
              patterns: [
                {
                  from: 'public',
                  globOptions: { ignore: ['**/index.html'] },
                },
              ],
            }),
          ]
        : [new ReactRefreshWebpackPlugin()]),
    ],

    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      proxy: [
        {
          // Auth callbacks — rewrite SameSite cookie for local testing
          context: ['/oid_callback', '/oid_waltti_callback'],
          target: 'http://localhost:3001',
          changeOrigin: true,
          onProxyRes(proxyRes) {
            if (
              proxyRes.headers.location === 'http://localhost:3000/' &&
              proxyRes.headers['set-cookie']
            ) {
              proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie =>
                cookie.replace('SameSite=None', 'SameSite=Strict; Secure'),
              );
            }
          },
        },
        {
          context: ['/api', '/hsl-login', '/waltti-login', '/logout'],
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      ],
    },

    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    optimization: {
      splitChunks: { chunks: 'all' },
    },
  };
};
