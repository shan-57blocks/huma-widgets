const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')

module.exports = (webpackConfig) => {
  const { mode, module, resolve } = webpackConfig
  const { rules } = module
  return {
    ...webpackConfig,
    resolve: {
      ...resolve,
      alias: {
        '@uniswap/widgets': path.resolve(__dirname, 'dist/'),
      },
    },
    module: {
      rules: [
        ...rules,
        {
          test: /\.json$/i,
          type: 'javascript/auto',
          use: ['json-loader'],
        },
      ],
    },
    plugins: [
      new RollupPlugin({
        config: rollupConfig,
        assetConfigs,
        watch: mode !== 'production',
      }),
      new HtmlWebpackPlugin(),
    ],
    stats: 'errors-warnings',
  }
}
