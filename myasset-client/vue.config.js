module.exports = {
  devServer: {
    host: 'lmyasset.live',
    port: 9710,
    public: 'http://lmyasset.live'
  },
  chainWebpack: config => {
    config.module
      .rule('svg-sprite')
      .use('svgo-loader')
      .loader('svgo-loader');
  }
};
