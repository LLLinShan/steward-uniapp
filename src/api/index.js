import Http from '_u/request'

const http = new Http()
const requireModules = require.context('./module', true, /\.js$/)
const apiList = {}
requireModules.keys().forEach(path => {
  const apiObj = requireModules(path).default
  const a = Object.keys(apiObj).length
  const b = Object.keys(apiList).length
  Object.assign(apiList, apiObj)
  const c = Object.keys(apiList).length
  if (c !== a + b) throw `${path}中存在重复的api`
})

// 请求对象
const Request = {}
for (const key in apiList) {
  Request[key] = async (data = {}) => {
    const { apiLoading, apiReject, ...params } = data
    let res = null
    try {
      res = await http.request({ ...apiList[key], loading: apiLoading, data: params })
    } catch (err) {
      if (/request:fail/.test(err.errMsg)) err.errMsg = '网络不佳'
      res = err
    }
    if (
      (!apiReject || (typeof apiReject === 'string' && res.result !== apiReject)) &&
      res.result !== '1'
    ) {
      uni.showToast({
        icon: 'none',
        title: res.errMsg || res.message
      })
    }
    if (res.result === '1') console.log(`${apiList[key].title}成功`, res)
    else console.error(`${apiList[key].title}失败`, res, params)
    return res
  }
}

export default Request
