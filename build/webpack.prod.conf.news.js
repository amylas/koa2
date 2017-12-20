var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config/index.js')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.news.conf.js')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var ZipPlugin = require('zip-webpack-plugin');

var env = config.news.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.news.productionSourceMap,
      extract: true
    })
  },
  devtool: config.news.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.news.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    })
  ]
})
//-------start
var pages = utils.getEntries('./src/module/news2.0/*.html')
console.dir(pages)
for (var page in pages) {
// 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], //模板路径
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: false,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    chunksSortMode: 'dependency',
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    })
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}
console.log("------------zipName----------");
console.log("zipName: " + config.news.assetsZipName);
console.log("develop zipName:  https://test1-n.dongdong.com/public/" + config.news.assetsZipName + ".zip");
console.log("beta zipName:  https://static1.dongdong.com/node/public/" + config.news.assetsZipName + ".zip");
console.log("master zipName: https://static1.dongdong.com/n/public/" + config.news.assetsZipName + ".zip");

webpackConfig.plugins.push(new ZipPlugin({
  path: path.join(__dirname, '../public'),
  filename: config.news.assetsZipName,
  pathPrefix: config.news.assetsZipName,
}));
//------end

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
