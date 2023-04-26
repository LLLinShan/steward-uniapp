<template>
  <view class="page">
    <u-cell-group>
      <u-cell-item title="人员信息" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
      <view class="page-img">
        <u-image
          v-if="detailInfo.imageUrl && detailInfo.imageUrl.length"
          :src="detailInfo.imageUrl"
          @click="onPreview([detailInfo.imageUrl])"
        />
        <u-image width="180" height="180" v-else :src="require('img/home/defaultPhoto.png')" />
      </view>
      <u-cell-item title="姓名" :value="detailInfo.personName" :arrow="false"></u-cell-item>
      <u-cell-item
        title="性别"
        :value="$utils.getDicLabel('gender', detailInfo.gender)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="年龄"
        :value="detailInfo.age || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="人员类型"
        :value="$utils.getDicLabel('commonPersonType', detailInfo.personType)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="证件号码"
        :value="detailInfo.certNo || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
    </u-cell-group>
    <u-cell-group class="page-form">
      <u-cell-item title="出入信息" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
      <u-cell-item
        title="出租屋名称"
        :value="detailInfo.rentalHouse || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="出入地点"
        :value="detailInfo.addr || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="出入方向"
        :value="$utils.getDicLabel('direction', detailInfo.direction)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="出入时间"
        :value="$moment(detailInfo.eventTime, 1) || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="识别方式"
        :value="$utils.getDicLabel('recognitionType', detailInfo.recognitionType)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="识别结果"
        :value="$utils.getDicLabel('eventResult', detailInfo.eventResult)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="相似度"
        :value="detailInfo.similarity || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
    </u-cell-group>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cellItemStyle: {
        fontWeight: 'bold'
      },
      loading: false, //加载
      id: undefined, //门禁记录id
      detailInfo: {} // 详情信息
    }
  },
  onLoad: function ({ id }) {
    this.id = id
    this.getDetail()
  },
  methods: {
    // 获取人员详情
    async getDetail() {
      const { result, data } = await this.$request.entranceLimitDetail({
        apiLoading: true,
        data: this.id
      })
      if (result !== '1') return
      this.detailInfo = data
    },
    /**
     * 预览图片
     * @param {String} urls 图片地址
     */
    onPreview(urls) {
      uni.previewImage({
        urls
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  padding-top: 16rpx;
  &-img {
    display: flex;
    align-items: center;
    padding: 16rpx 24rpx 32rpx 32rpx;
    border-bottom: 1rpx solid #eeeeee;
    ::v-deep .u-image {
      width: 145rpx !important;
      height: 145rpx !important;
      border-radius: 10rpx;
    }
    &__wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 28rpx;
    }
    &__name {
      width: 144rpx;
      text-align: center;
      color: $u-tips-color;
      font-size: 24rpx;
      margin-top: 12rpx;
    }
    &__title {
      font-size: 32rpx;
      padding: 24rpx 32rpx 0 32rpx;
    }
  }
  &-base {
    text-align: center;
    background: #fff;
    padding-top: 16rpx;
    u-image {
      position: relative;
      left: calc((100vw - 180rpx) / 2);
    }
    &__value {
      position: absolute;
      top: 30rpx;
      left: calc((100vw - 180rpx) / 2);
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
  &-form {
    display: block;
    margin-top: 16rpx;
    @include leelen-bottom();
    ::v-deep .u-cell_title {
      color: $u-content-color !important;
      display: flex;
      align-self: flex-start;
    }
    ::v-deep .u-cell__value {
      color: $u-main-color !important;
    }
  }
}
.empty-up {
  color: #999999;
  padding: 24rpx 0;
}
.page-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 70rpx;
  u-button {
    width: 250rpx;
  }
}
</style>
