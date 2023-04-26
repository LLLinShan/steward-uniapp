<template>
  <view class="loading">
    <view class="loading-brand">
      <u-image class="loading-brand__img" width="80" height="80" :src="src" />
      <u-loading size="96" :color="color">loading</u-loading>
    </view>
    <view class="loading-text">
      {{ text }}<text class="loading-text__dot">{{ '.'.repeat(dot) }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '加载中'
    }
  },
  data() {
    return {
      interval: null,
      dot: 0,
      src: require('img/brand.png'),
      color: this.$Data().primaryColor
    }
  },
  created() {
    this.interval = setInterval(() => {
      if (this.dot === 3) this.dot = 0
      else this.dot++
    }, 600)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 300rpx;
  &-brand {
    position: relative;
    &__img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &-text {
    margin-top: 30rpx;
    color: #666;
    padding-right: 10rpx;
    position: relative;
    &__dot {
      position: absolute;
      padding-left: 5rpx;
      letter-spacing: 4rpx;
    }
  }
}
</style>
