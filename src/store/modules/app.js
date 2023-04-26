import clonedeep from 'lodash.clonedeep'

const STATE = {
  defaultPath: '/pages/home/index'
}

const app = {
  state: clonedeep(STATE),
  getters: {
    defaultPageLocateType(state) {
      const tabPages = ['/pages/home/index', '/pages/my/index']
      const defaultPath = state.defaultPath
      return tabPages.includes(defaultPath.replace(/\?.*$/, '')) ? 'switchTab' : 'redirectTo'
    }
  },
  mutations: {
    SET_DEFAULTPATH(state, path) {
      if (path !== 'pages/login/index') state.defaultPath = `/${path}`
    },
    // 重置state
    RESET(state) {
      Object.assign(state, clonedeep(STATE))
    }
  }
}

export default app
