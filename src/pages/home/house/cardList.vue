<template>
  <view class="page">
    <view v-for="(_item, _index) in list" :key="_index" class="card">
      <view class="card-name">{{ _item.floor }}楼</view>
      <u-row>
        <u-col
          v-for="(item, index) in _item.houseCardList"
          :key="index"
          span="6"
          @click="toDetail(item)"
        >
          <view class="row">
            <view class="row-content">
              <text class="row-content__value font" :class="[!hasSearch ? 'u-line-1' : '']">
                {{ item.houseCode + '室' || $Data().defaultStr }}
              </text>
              <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']"
                >居住人数: {{ item.count }} 人
              </text>
            </view>
            <view class="row-access">
              <text class="row-access__value" :class="['row-access__' + item.houseState]">{{
                $utils.getDicLabel('miniAppsRentalHouseStatus', item.houseState)
              }}</text>
            </view>
          </view>
        </u-col>
      </u-row>
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
        url: `/pages/home/house/detail?structId=${item.structId}&houseId=${item.id}&houseName=${item.houseCode}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  padding: 20rpx;
  &-name {
    margin-bottom: 16rpx;
    margin-left: 10rpx;
  }
}
.row {
  background: #ffffff;
  padding: 30rpx 32rpx;
  border-bottom: 1rpx solid #eeeeee;
  height: 170rpx;
  position: relative;
  margin-bottom: 15rpx;
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
  &-access {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    &__value {
      font-size: 12pt;
      padding: 5rpx 10rpx;
      border-radius: 10rpx;
      background: #d4cdcd;
      color: #666666;
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
  }
}
</style>
