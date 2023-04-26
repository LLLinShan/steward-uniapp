<template>
  <view>
    <view class="row" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
      <view class="row-content">
        <text class="row-content__value font" :class="[!hasSearch ? 'u-line-1' : '']">
          {{ item.realPhone || $Data().defaultStr }}</text
        >
        <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']"
          >{{ $utils.getDicLabel('accountType', item.accountType) }}
        </text>
        <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']">
          {{ item.address || $Data().defaultStr }}</text
        >
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 是否为搜索模式
    hasSearch: {
      type: Boolean,
      default: false
    },
    // 列表数据
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    /**
     * 去房屋详情
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/home/houseHold/detail?memberId=${item.memberId}&houseId=${item.houseId}&realPhone=${item.realPhone}&reload=1`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  background: #ffffff;
  padding: 30rpx 32rpx;
  border-bottom: 1rpx solid #eeeeee;
  height: 250rpx;
  position: relative;
  &-type {
    position: absolute;
    &__value {
      position: absolute;
      top: 0;
      background: #d4cdcd;
      color: #666666;
      padding: 0rpx 5rpx;
      border-bottom-right-radius: 20rpx;
    }
    &__1 {
      background: #e5fafa;
      color: #00c8cf;
    }
    &__2 {
      background: #fff4ed;
      color: #fc944f;
    }
    &__3 {
      background: #d4cdcd;
      color: #666666;
    }
    &__4 {
      background: #d4cdcd;
      color: #666666;
    }
  }
  &-content {
    font-size: 28rpx;
    position: absolute;
    &__value {
      display: block;
      width: 500rpx;
      margin-bottom: 12rpx;
    }
    .font {
      font-weight: 700;
    }
  }
}
</style>
