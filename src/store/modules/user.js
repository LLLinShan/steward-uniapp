import Request from '@/api'
import clonedeep from 'lodash.clonedeep'
import { appInfo } from '@/config'

const STATE = {
  accessToken: null,
  // 账号信息
  phone: null,
  username: '物业管家助手',
  // 小区列表
  neighList: [],
  // 当前小区
  neighName: '暂无小区',
  neighNo: undefined,
  // 运营号
  companyNo: undefined,
  // 账号权限
  auth: null,
  // 字典
  dic: [],
  // 省市区
  regionList: [],
  // 不鉴权页面
  whiteList: ['pages/login/index', 'pages/login/manulLogin/index'],
  tabbar: [
    {
      pagePath: '/pages/home/index',
      iconPath: '/static/home.png',
      selectedIconPath: '/static/home_selected.png',
      text: '工作台'
    },
    {
      pagePath: '/pages/my/qrcode/index',
      iconPath: '/static/qr.png',
      selectedIconPath: '/static/qr.png',
      text: '楼栋二维码',
      midButton: true
    },
    {
      pagePath: '/pages/my/index',
      iconPath: '/static/my.png',
      selectedIconPath: '/static/my_selected.png',
      text: '我的'
    }
  ]
}

const user = {
  state: clonedeep(STATE),
  mutations: {
    SET_USERINFO(state, { accessToken, phone }) {
      if (accessToken) state.accessToken = accessToken
      state.phone = phone
    },
    SET_NEIGHLIST(state, list) {
      state.neighList = list
    },
    SET_NEIGH(state, neigh) {
      state.neighName = neigh.name
      state.neighNo = neigh.neighNo
      state.companyNo = neigh.companyNo
    },
    SET_COMPANYNO(state, companyNo) {
      state.companyNo = companyNo
    },
    SET_USERNAME(state, username) {
      state.username = username
    },
    SET_AUTH(state, auth) {
      state.auth = auth
    },
    SET_DIC(state, dic) {
      state.dic = dic
    },
    // 重置state
    RESET(state) {
      Object.assign(state, clonedeep(STATE), { accessToken: state.accessToken })
    },
    // 存储行政区划信息
    SET_REGIONLIST(state, data) {
      state.regionList = data
    }
  },
  actions: {
    async Login({ commit, dispatch, getters, rootState, state }) {
      // 初始化登录
      const code = await new Promise(resolve => {
        uni.login({
          success(res) {
            resolve(res.code)
          }
        })
      })
      // 获取登录状态
      const res = await Request.login({
        loading: true,
        jsCode: code,
        appId: appInfo.appId
      })
      const currentPage = getCurrentPages()
      const currentPath = currentPage[currentPage.length - 1].route
      if (res.result === '1') {
        commit('SET_USERINFO', res.data)
        if (res.data.phone) {
          // 获取小区列表
          await dispatch('GetNeighList')
          // 登录成功后进入初始页面
          if (!rootState.app.defaultPath.includes(currentPath)) {
            uni[getters.defaultPageLocateType]({ url: rootState.app.defaultPath })
          }
        } else if (!state.whiteList.includes(currentPath)) {
          uni.redirectTo({ url: '/pages/login/index' })
        }
      } else uni.redirectTo({ url: '/pages/login/index' })
    },
    async GetNeighList({ commit, dispatch, state }) {
      const res = await Request.getNeighList()
      if (res.result === '1' && res.data.length) {
        commit('SET_NEIGHLIST', res.data || [])
        const selectNeigh = res.data.find(item => item.checkSign)
        // 如果是扫码进入获得的运营号，则不自动选中小区，app.onShow初始化的时候已经记录过运营号了，否则获取后端记录的小区号和运营号
        if (!state.companyNo || state.neighNo) commit('SET_NEIGH', selectNeigh || res.data[0])
        dispatch('GetUserInfo')
        dispatch('GetDictionary')
      } else if (state.companyNo && !state.neighNo) {
        // 如果初始化时没有运营号则尝试获取上一次记录的运营号
        const resp = await Request.getLastCompanyNo()
        if (resp.result === '1' && resp.data) commit('SET_COMPANYNO', resp.data)
      }
    },
    async GetUserInfo({ commit }) {
      const res = await Request.getUserInfo()
      const _res = await Request.getAuth()
      if (res.result === '1') commit('SET_USERNAME', res.data.name)
      let auth = null
      if (_res.result === '1') auth = _res.data.map(item => item.menuCode)
      commit('SET_AUTH', auth)
    },
    async GetDictionary({ commit }) {
      const res = await Request.getDictionary()
      if (res.result === '1') {
        commit('SET_DIC', res.data)
      }
    }
  }
}

export default user
