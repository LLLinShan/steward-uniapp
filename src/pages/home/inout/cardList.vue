<template>
  <view>
    <view class="row" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
      <view class="row-type">
        <u-image
          mode="widthFix"
          width="180"
          height="226"
          v-if="item.imageUrl"
          :src="item.imageUrl"
        />
        <u-image
          mode="widthFix"
          width="180"
          height="226"
          v-else
          :src="require('img/home/defaultPhoto.png')"
        />
        <text class="row-type__value" :class="['row-type__' + item.personType]">
          {{ $utils.getDicLabel('commonPersonType', item.personType) }}</text
        >
      </view>
      <view class="row-content">
        <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']"
          >{{ item.personName || $Data().defaultStr }}
        </text>
        <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']"
          >{{ $utils.getDicLabel('recognitionType', item.recognitionType) }}
        </text>
        <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']">
          {{ item.addr || $Data().defaultStr }}</text
        >
        <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']">
          {{ $moment(item.eventTime, 1) || $Data().defaultStr }}</text
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
     * 去住户详情
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/home/inout/detail?id=${item.id}`
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
  height: 280rpx;
  position: relative;
  &-type {
    position: absolute;
    ::v-deep image {
      height: 100% !important;
      background-size: 100% 100%;
    }
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
    left: 240rpx;
    &__value {
      display: block;
      width: 400rpx;
      margin-bottom: 8rpx;
    }
  }
}
</style>
