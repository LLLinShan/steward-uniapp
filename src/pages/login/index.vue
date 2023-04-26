<template>
  <view class="login">
    <page-loading v-if="!accessToken || phone" />
    <template v-else>
      <view class="login-upper">
        <u-image
          class="login-logo"
          mode="widthFix"
          width="160"
          height="160"
          :src="require('img/logo.png')"
          :show-menu-by-longpress="false"
          @longpress="showEnvSelect = true"
        />
        <view class="login-app">立林智慧管家</view>
        <u-button
          ripple
          type="primary"
          open-type="getPhoneNumber"
          @getphonenumber="bindphonenumber"
          :disabled="lock"
          @click="lock = true"
          v-if="canUseAutoLogin"
          >微信授权登录</u-button
        >
        <u-button
          ripple
          :type="canUseAutoLogin ? 'default' : 'primary'"
          :plain="canUseAutoLogin"
          @click="$uni.navigateTo({ url: '/pages/login/manulLogin/index' })"
          >手机号验证码登录</u-button
        >
      </view>
      <!-- 体验版可切换环境使用 -->
      <u-select
        v-if="baseENV === 'pre'"
        v-model="showEnvSelect"
        :list="envList"
        safe-area-inset-bottom
        @confirm="selectEnv"
        title="环境选择"
      />
      <view class="login-agreement">
        登录即代表您同意
        <navigator url="/pages/webview/index?type=0" hover-class="none">《用户协议》</navigator>
        与
        <navigator url="/pages/webview/index?type=1" hover-class="none">《隐私政策》</navigator>
      </view>
    </template>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import PageLoading from '_c/pageLoading'
import { systemInfo, baseENV, baseUrlList } from '@/config'

export default {
  components: {
    PageLoading
  },
  data() {
    return {
      baseENV,
      baseUrlList,
      showEnvSelect: false, // 体验版可切换环境使用
      lock: false,
      canUseAutoLogin: this.$utils.compareVersion(systemInfo.SDKVersion, '2.21.1') > 0
    }
  },
  computed: {
    ...mapState({
      accessToken: state => state.user.accessToken,
      phone: state => state.user.phone,
      defaultPath: state => state.app.defaultPath,
      companyNo: state => state.user.companyNo,
      neighNo: state => state.user.neighNo
    }),
    // 可供切换的环境列表
    envList() {
      const envList = []
      for (const key in this.baseUrlList) {
        envList.push({
          value: key,
          label: `${this.baseUrlList[key]}(${key})`
        })
      }
      return envList
    }
  },
  onShow() {
    if (this.phone) uni.switchTab({ url: '/pages/home/index' })
  },
  methods: {
    async bindphonenumber(e) {
      console.log('用户授权', e)
      if (!e.detail.code) {
        this.lock = false
        return
      }
      // 一键绑定微信手机号
      const { code } = e.detail
      const res = await this.$request.bind({ code })
      if (res.result === '1') {
        this.$store.commit('SET_USERINFO', { phone: res.data })
        // 登录后如果是扫码的运营号，则记录
        if (this.companyNo && !this.neighNo) {
          this.$request.setLastCompanyNo({ companyNo: this.companyNo })
        }
        await this.$store.dispatch('GetNeighList')
        uni[this.$store.getters.defaultPageLocateType]({ url: this.defaultPath })
      } else this.lock = false
    },
    // 改变缓存已切换环境
    selectEnv([{ value: env }]) {
      uni.setStorageSync('env', env)
      uni.showToast({
        icon: 'none',
        title: '请点击右上角菜单，重启小程序完成切换环境'
      })
    }
  }
}
</script>

<style>
page {
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 150rpx;
  &-upper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &-logo {
    width: 160rpx;
    height: 160rpx;
  }
  &-app {
    margin: 24rpx 0 138rpx;
    font-size: 28rpx;
  }
  &-agreement {
    padding-bottom: 100rpx;
    margin-top: 160rpx;
    font-size: 26rpx;
    color: $u-tips-color;
    navigator {
      color: $u-type-primary;
      display: inline-block;
    }
  }
  ::v-deep .u-btn {
    width: 680rpx;
    margin-top: 32rpx;
    &--default {
      &::after {
        border: none;
      }
    }
  }
}
</style>
