const webpack = require('webpack');

const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import '@/styles/_variables.scss';
        `,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"',
        },
      }),
    ],
    experiments: {
      topLevelAwait: true
    }
  },
  publicPath: process.env.VUE_APP_PROJECT_DIRECTION_PATH,
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8111',
        secure: false,
        logLevel: 'debug',
        changeOrigin: true,
      },
      '/app-back/sso/login': {
        target: 'http://127.0.0.1:8111',
        secure: false,
        logLevel: 'debug',
        changeOrigin: true,
        headers: {
          'Connection': 'keep-alive',
          'Origin': 'http://localhost:3000'
        }
      }
    },
  },
};
