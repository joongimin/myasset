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

    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@intlify/vue-i18n-loader');
  }
};
