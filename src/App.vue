<script>
import Qs from 'qs'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      accessToken: state => state.user.accessToken,
      phone: state => state.user.phone,
      whiteList: state => state.user.whiteList
    })
  },
  async onShow(options) {
    console.log('onShow', options)
    // 记录登录后要进入的页面，在登录成功后进入
    const query = Qs.stringify(options.query, { allowDots: true, arrayFormat: 'repeat' })
    // 不鉴权页面可直接进入，所以不用存储
    if (!this.whiteList.includes(options.path)) {
      this.$store.commit('SET_DEFAULTPATH', `${options.path}?${query}`)
    }
    // 处理初始化时携带的参数
    if (options.query?.scene) {
      // 二维码参数处理
      const { companyNo } = Qs.parse(decodeURIComponent(options.query.scene))
      if (companyNo) {
        // 设置运营号并记录到后端，方便下次取用
        this.$store.commit('SET_COMPANYNO', companyNo)
        // 记录运营号时，后端只能记录到手机下，没有手机则要登录后记录
        if (this.phone) this.$request.setLastCompanyNo({ companyNo })
      }
    }
    // 初始化登录
    if (!this.accessToken || !this.phone) await this.$store.dispatch('Login')
  }
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import '@/assets/style/base.scss';
</style>
