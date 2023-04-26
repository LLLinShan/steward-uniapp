const userApi = {
  login: {
    title: '登录',
    accesstokenFree: true,
    url: '/wx/mc/auth/autoLogin'
  },
  bind: {
    title: '一键绑定手机号',
    url: '/wx/mc/auth/loginByWeChat'
  },
  manulBind: {
    title: '验证码登录',
    url: '/wx/mc/auth/loginByVerifyCode'
  },
  sendCode: {
    title: '发送验证码',
    url: '/wx/mc/auth/getVerifyCodeForLogin'
  },
  logout: {
    title: '退出',
    url: '/wx/mc/auth/logout'
  },
  getNeighList: {
    title: '获取小区列表',
    url: '/wx/mc/comm/listNeigh'
  },
  setSelectNeigh: {
    title: '切换小区保存结果',
    url: '/wx/mc/comm/saveNeighSign'
  },
  getUserInfo: {
    title: '获取用户信息',
    url: '/wx/mc/auth/getAuth'
  },
  getAuth: {
    title: '获取用户权限',
    url: '/wx/mc/auth/getAuthPermission'
  },
  getDictionary: {
    title: '获取字典',
    url: '/wx/mc/comm/selectDictionary'
  },
  getLastCompanyNo: {
    title: '查看上一次扫码的运营号',
    url: '/wx/mc/common/qrCode/companyNo'
  },
  setLastCompanyNo: {
    title: '记录扫码的运营号',
    url: '/wx/mc/common/qrCode/record'
  }
}

export default userApi
