const Dotenv = require('dotenv-webpack');
const path = require('path');

const plugins = [
  new Dotenv({
    path: path.resolve(__dirname, '.env'),
  }),
]

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins,
  },
  pwa: {
    name: 'Chat bot',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    manifestOptions: {
      display: "fullscreen",
      background_color: '#42B883',
      scope: '/'
    },

    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js",
    }
  }
};