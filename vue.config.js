const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  chainWebpack: config => {
    // 别名
    config.resolve.alias
      // 根目录
      .set('_r', __dirname)
      // 组件目录
      .set('_c', resolve('./src/components'))
      // 图片目录
      .set('img', resolve('./src/assets/img'))
      // 页面级组件目录
      .set('_p', resolve('./src/pages'))
      // 工具类
      .set('_u', resolve('./src/utils'))
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => {
        options.limit = 4000
        return options
      })
      .end()
      .use('@leelen_npm/image-webpack-loader')
      .loader('@leelen_npm/image-webpack-loader')
      .options({
        bypassOnDebug: process.env.NODE_ENV !== 'production',
        disable: process.env.NODE_ENV !== 'production'
      })
    if (process.env.NODE_ENV === 'production') {
      // 删除console
      config.optimization.minimizer('terser').tap(options => {
        options[0].terserOptions.compress.drop_console = true
        return options
      })
    }
  }
}
