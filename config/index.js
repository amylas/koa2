// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var request_config = require('../bin/config');
var zipname = 'news.' + (+new Date());
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../webapp/index.html'),
    assetsRoot: path.resolve(__dirname, '../webapp'),
    assetsSubDirectory: 'static',
    // assetsPublicPath: request_config.staticDomain + "/", //开发&beta

    assetsPublicPath: 'https://static1.dongdong.com/n/', //正式
    // assetsPublicPath: 'https://static1.dongdong.com/node/',//beta
    // assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  news: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../webapp/index.html'),
    assetsRoot: path.resolve(__dirname, '../public/' + zipname),
    assetsZipName: zipname,
    assetsSubDirectory: '',
    assetsPublicPath: '',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/webapp/',
    proxyTable: {
      // 'http://localhost:8080/activity': {
      //   target: 'http://test1-api.dongdong.com',
      //   pathRewrite: {
      //      '^/activity': '/activity'
      //   }
      // }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
