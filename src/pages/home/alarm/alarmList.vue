<template>
  <view>
    <view class="row" v-for="(item, index) in list" :key="index">
      <view class="row-type">
        <u-image
          mode="widthFix"
          width="180"
          height="180"
          v-if="item.capturePhotoUrl"
          :src="item.capturePhotoUrl"
          @click="handelPreview(item.capturePhotoUrl)"
        />
        <u-image
          mode="widthFix"
          width="180"
          height="180"
          v-else
          :src="require('img/home/defaultPhoto.png')"
        />
      </view>
      <view class="row-content">
        <text class="row-content__value">电动车识别告警</text>
        <text class="row-content__value">{{ item.alarmAddress || $Data().defaultStr }} </text>
        <text class="row-content__value">
          {{ $moment(item.alarmTime, 1) || $Data().defaultStr }}</text
        >
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
    // 图片预览
    handelPreview(url) {
      url &&
        uni.previewImage({
          urls: [url]
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
  height: 235rpx;
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
