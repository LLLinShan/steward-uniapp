<template>
  <web-view :src="src"></web-view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        // 用户协议
        'https://iot.leelen.com/document/privacypolicy/2_1_4_48.html',
        // 隐私政策
        'https://iot.leelen.com/document/privacypolicy/2_1_1_49.html'
      ],
      src: ''
    }
  },
  onLoad(options) {
    if (options?.type) this.src = this.list[Number(options.type)]
    else {
      uni.showToast({
        title: '参数错误',
        icon: 'error',
        duration: 3000,
        success() {
          setTimeout(() => {
            uni.navigateBack()
          }, 2800)
        }
      })
    }
  }
}
</script>
