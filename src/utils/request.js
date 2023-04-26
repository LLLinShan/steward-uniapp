import { BASE_URL, apiConfig } from '@/config'
import store from '@/store'

class Http {
  config() {
    // 基础配置
    const config = {
      // 超时
      timeout: 10000,
      method: 'post',
      header: {
        ...apiConfig,
        'Content-Type': 'application/json',
        accesstoken: store.state.user.accessToken || '',
        companyNo: store.state.user.companyNo || '',
        neighNo: store.state.user.neighNo || ''
      }
    }
    return config
  }

  async request(options) {
    // 请求等待
    let { loading, ...requestOptions } = options
    if (loading) {
      uni.showLoading({
        title: typeof loading === 'string' ? loading : '加载中...',
        mask: true
      })
    }

    // 合并配置
    const config = this.config()
    const header = Object.assign({}, config.header, requestOptions.header)
    requestOptions = Object.assign(config, requestOptions)
    requestOptions.header = header
    if (!/^http/.test(requestOptions.url)) {
      requestOptions.url = `${BASE_URL}${requestOptions.url}`
    }

    // 通过accesstoken判断初始化是否成功，如果未成功则拦截所有请求
    let timeout = 0
    while (
      !requestOptions.header.accesstoken &&
      !requestOptions.accesstokenFree &&
      timeout < requestOptions.timeout
    ) {
      requestOptions.header.accesstoken = await new Promise(resolve => {
        setTimeout(() => {
          resolve(store.state.user.accessToken)
        }, 500)
      })
      timeout += 500
    }
    if (timeout >= requestOptions.timeout) return { errMsg: '程序初始化失败' }
    // uni请求
    return new Promise(function (resolve, reject) {
      uni.request({
        ...requestOptions,
        success(res) {
          loading && uni.hideLoading()
          resolve({ traceId: res.header.traceId, ...res.data })
        },
        fail(err) {
          loading && uni.hideLoading()
          reject(err)
        }
      })
    })
  }
}

export default Http
