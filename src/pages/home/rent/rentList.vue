<template>
  <view>
    <view
      class="row"
      :class="[!item.houseResourceStatus === 2 ? 'opacity' : '']"
      v-for="(item, index) in list"
      :key="index"
      @click="toDetail(item)"
    >
      <view class="row-type">
        <u-image
          width="180"
          height="224"
          v-if="item.houseResourcesPic"
          :src="item.houseResourcesPic"
        />
        <u-image width="180" height="224" v-else :src="require('img/home/defaultPicture.png')" />
        <text
          class="row-type__value"
          :class="['row-type__' + item.houseResourceStatus]"
          v-if="item.houseResourceStatus === 2"
        >
          {{ item.houseResourceStatus === 1 ? '上架' : '已下架' }}</text
        >
      </view>
      <view class="row-content">
        <text class="row-content__value u-line-2">{{ item.neighName }} </text>
        <view class="row-content__status">
          <text v-for="(aaa, index) in item.decorationTagList" :key="index">{{
            $utils.getDicLabel('decorationTag', aaa)
          }}</text>
          <text v-for="(aaa, index) in item.housePointList" :key="index">{{
            $utils.getDicLabel('housePointTag', aaa)
          }}</text>
        </view>
        <view class="row-content__value u-line-1">
          <text class="line" v-if="item.houseShape">
            {{ item.houseShape }}
          </text>
          <text class="line" v-if="item.houseArea"> {{ item.houseArea }}</text>
          <text v-if="item.orientation"> {{ item.orientation }}</text>
        </view>
        <view class="row-access">
          <text class="row-access__value">{{
            item.monthRentType === 1 ? item.monthRent + '元/月' : '面议'
          }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
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
        url: `/pages/home/rent/modifyHouse?id=${item.id}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.opacity {
  opacity: 0.8;
}
.row {
  background: #ffffff;
  padding: 30rpx 32rpx;
  border-bottom: 1rpx solid #eeeeee;
  height: 300rpx;
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
  }
  &-content {
    font-size: 28rpx;
    position: absolute;
    left: 240rpx;
    height: 260rpx;
    &__value {
      display: block;
      width: 500rpx;
      margin-bottom: 8rpx;
      text {
        position: relative;
        margin-right: 30rpx;
      }
      .line {
        &::after {
          content: '';
          position: absolute;
          top: 3rpx;
          bottom: 3rpx;
          right: -16rpx;
          width: 1rpx;
          background: #333333;
        }
      }
    }
    &__status {
      margin-bottom: 10rpx;
      text {
        margin-right: 12rpx;
        height: 36rpx;
        padding: 0 10rpx;
        font-size: 24rpx;
        border-radius: 8rpx;
        text-align: center;
        background-color: #e5fafa;
        color: #00c8cf;
      }
    }
  }
  &-access {
    position: absolute;
    right: 20rpx;
    bottom: 0rpx;
    &__value {
      font-size: 12pt;
      padding: 5rpx 10rpx;
      border-radius: 10rpx;
      color: #f54e56;
    }
  }
}
</style>
