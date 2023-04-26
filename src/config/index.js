// 小程序信息
export const appInfo = uni.getAccountInfoSync().miniProgram

// 系统信息
export const systemInfo = uni.getSystemInfoSync()

console.log('小程序信息', appInfo)
console.log('系统信息', systemInfo)
console.log(process.env)

let env = ''

if (process.env.NODE_ENV === 'development') {
  if (appInfo.envVersion === 'trial') env = 'pre'
  else env = 'dev'
} else env = 'pro'
export const baseENV = env

// 请求地址
export const baseUrlList = {
  // 开发环境
  dev: 'https://saas-dev86.leelen.net/',
  // dev: 'http://10.173.173.54',
  // 开发环境
  dev36: 'https://iotdev-saas.leelen.net',
  dev54: 'https://saasdev-54.leelen.net',
  // 测试环境
  test32: 'http://10.160.0.32',
  test49: 'https://saas-test49.leelen.net',
  // 主线测试
  pre: 'https://zhsq.leelen.com',
  // 预生产环境
  preview: 'https://saaspre.leelen.net',
  // 生产环境
  pro: 'https://community.leelen.com'
}

const cacheEnv = baseENV === 'pre' && uni.getStorageSync('env')
// 测试环境通过命令行配置
export const BASE_URL = baseUrlList[cacheEnv || process.env.VUE_APP_MODE || baseENV]

console.log(`${baseENV}_BASE_URL`, BASE_URL)
// api请求配置
export const apiConfig = { version: require('_r/package.json').apiVersion }
