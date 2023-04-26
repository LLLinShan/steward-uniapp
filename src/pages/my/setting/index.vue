<template>
  <view class="page">
    <u-cell-group class="page-content">
      <navigator url="/pages/webview/index?type=0" hover-class="none">
        <u-cell-item title="用户协议" :arrow="true"></u-cell-item
      ></navigator>
      <navigator url="/pages/webview/index?type=1" hover-class="none">
        <u-cell-item title="隐私协议" :arrow="true"></u-cell-item
      ></navigator>
    </u-cell-group>
    <u-button ripple class="my-logout" @click="logout">退出登录</u-button>
  </view>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      const that = this
      uni.showModal({
        title: '请确定退出',
        showCancel: true,
        async success(options) {
          if (options.confirm) {
            await that.$request.logout()
            // 清空缓存
            that.$store.commit('RESET')
            // 回退登录页
            uni.reLaunch({ url: '/pages/login/index' })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  padding-top: 24rpx;
}
.my-logout {
  ::v-deep .u-btn {
    height: 104rpx !important;
    margin-top: 48rpx;
    border-radius: 0;
    color: $u-type-primary;
    &::after {
      display: none;
    }
  }
}
</style>
