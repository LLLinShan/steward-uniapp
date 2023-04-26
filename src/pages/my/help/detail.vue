<template>
  <view class="page">
    <div v-if="detailInfo">
      <view class="page-title">{{ detailInfo.title }}</view>
      <u-parse class="leelen-rich-style" :html="detailInfo.content"></u-parse>
    </div>
    <div class="page-empty" v-else>
      <u-empty />
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      detailInfo: {}
    }
  },
  onLoad: function ({ id }) {
    this.getDetail(id)
  },
  methods: {
    async getDetail(id) {
      const res = await this.$request.getServiceHelpConfigDetail({ id })
      if (res.result === '1') this.detailInfo = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #fff;
  padding: 18rpx 36rpx;
  @include leelen-bottom(18);
  &-title {
    color: #000;
    font-size: 16pt;
    line-height: 18pt;
    font-weight: bold;
  }
  &-empty {
    padding-top: 300rpx;
  }
}
</style>
