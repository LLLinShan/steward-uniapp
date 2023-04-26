<template>
  <view>
    <view class="row" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
      <view class="row-type">
        <u-image width="180" height="180" v-if="item.coverImage" :src="item.coverImage" />
        <u-image width="180" height="180" v-else :src="require('img/home/defaultPicture.png')" />
      </view>
      <view class="row-content">
        <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']"
          >{{ item.title || $Data().defaultStr }}
        </text>
        <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']">
          {{ $moment(item.createTime, 1) || $Data().defaultStr }}</text
        >
        <text class="row-content__status" :class="['row-content__' + item.status]"
          >{{ $utils.getDicLabel('infoStatus', item.status) }}
        </text>
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
     * 去住户详情
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/home/information/detail?id=${item.id}`
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
  height: 246rpx;
  position: relative;
  &-type {
    position: absolute;
  }
  &-content {
    font-size: 28rpx;
    position: absolute;
    left: 240rpx;
    &__value {
      display: block;
      width: 400rpx;
      margin-bottom: 8rpx;
    }
    &__status {
      width: 100%;
      padding: 5rpx 12rpx;
      background: #d4cdcd;
      color: #666666;
    }
    &__1 {
      background: #fff4ed;
      color: #fc944f;
    }
    &__2 {
      background: #e5fafa;
      color: #00c8cf;
    }
  }
}
</style>
