import Vue from 'vue'
import App from './App'
import store from './store'
import Request from '@/api'
import uView from 'uview-ui'
import Moment from '_u/moment'
import { Data } from '_u'
import utils from '_u'

Vue.use(uView).use(Moment)
Vue.prototype.$request = Request
Vue.prototype.$uni = uni
Vue.prototype.$Data = Data
Vue.prototype.$utils = utils
Vue.config.productionTip = false

new Vue({
  store,
  ...App
}).$mount()
