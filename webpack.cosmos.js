module.exports = (webpackConfig) => {
  const { module } = webpackConfig
  const { rules } = module
  return {
    ...webpackConfig,
    module: {
      rules: [
        ...rules,
        {
          test: /\.svg$/i,
          use: ['@svgr/webpack', 'url-loader'],
        },
      ],
    },
  }
}
