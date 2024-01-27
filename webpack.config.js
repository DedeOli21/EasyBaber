const path = require('path')
const slsw = require('serverless-webpack')
const webpack = require('webpack')
const { DuplicatesPlugin } = require('inspectpack/plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const IgnoreNotFoundExportPlugin = require('ignore-not-found-export-webpack-plugin')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

const resolve = uri => path.resolve(__dirname, uri)
const firstLower = str => str.charAt(0).toLowerCase() + str.substring(1)

module.exports = (async () => {
  const noServerless = !slsw.lib.serverless
  const accountId = noServerless ? undefined : await slsw.lib.serverless.providers.aws.getAccountId()
  return {
    target: 'node',
    entry: slsw.lib.entries,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'cheap-source-map',
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      modules: [resolve('node_modules')],
      alias: {
        '#domain': resolve('src/1-domain'),
        '#business': resolve('src/2-business'),
        '#controller': resolve('src/3-controller'),
        '#framework': resolve('src/4-framework')
      }
    },
    externals: noServerless ? [] : [
      'aws-sdk',
      'pg-hstore',
      'newrelic'
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.webpack'),
            path.resolve(__dirname, '.serverless')
          ],
          options: {
            transpileOnly: !slsw.lib.webpack.isLocal,
            experimentalFileCaching: true
          }
        },
        {
          loader: path.resolve('./devops/webpack/di-loader.js'),
          options: {
            dependencies: [
              {
                whenImport: /#business\/repositories\/i([\w.]*)/g,
                dependency: (v, $1) =>
                  #framework/repositories/${firstLower($1)}
              },
              {
                whenImport: /#business\/services\/i([\w.]*)/g,
                dependency: (v, $1) =>
                  #framework/services/${firstLower($1)}
              },
            ]
          }
        }
      ]
    },
    plugins: [
      new IgnoreNotFoundExportPlugin(),
      new FilterWarningsPlugin({
        exclude: [
          /Critical dependency/,
          /mysql2/
        ]
      }),
      new webpack.DefinePlugin({ AWS_ACCOUNT_ID: ${accountId} }),
      new DuplicatesPlugin({
        emitErrors: false,
        verbose: false
      }),
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /node_modules/,
        // include specific files based on a RegExp
        // include: /dir/,
        // add errors to webpack instead of warnings
        failOnError: false,
        // allow import cycles that include an asynchronous import,
        // e.g. via import(/* webpackMode: 'weak' */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd()
      })
    ]
  }
})()