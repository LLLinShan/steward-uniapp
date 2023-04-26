<template>
  <view class="page">
    <scroll-view class="page-list" scroll-y>
      <u-cell-group class="page-form">
        <u-cell-item
          title="房号"
          :value="detailInfo.houseCode || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="创建时间"
          :value="detailInfo.createTime || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="房屋楼层"
          :value="detailInfo.floor || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="住家地址"
          :value="detailInfo.houseAddress + detailInfo.houseName || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="呼叫号"
          :value="detailInfo.callNo || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="房屋类别"
          :value="$utils.getDicLabel('houseType', detailInfo.houseType)"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="房屋状态"
          :value="$utils.getDicLabel('miniAppsRentalHouseStatus', detailInfo.houseState)"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="产权人"
          :value="detailInfo.houseOwner || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="建筑面积"
          :value="detailInfo.houseArea || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="使用面积"
          :value="detailInfo.usingArea || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="公摊面积"
          :value="detailInfo.sharedArea || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="房屋户型"
          :value="detailInfo.houseShape || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="房屋朝向"
          :value="detailInfo.orientation || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
      </u-cell-group>
    </scroll-view>
    <div class="page-button">
      <u-button type="primary" :ripple="true" @click="onEdit">编辑</u-button>
    </div>
  </view>
</template>

<script>
export default {
  props: {
    structId: {
      type: String,
      default: ''
    },
    detailInfo: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    onEdit() {
      uni.navigateTo({
        url: `/pages/home/house/houseEdit?structId=${this.structId}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  padding-top: 16rpx;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80rpx);
  &-list {
    height: 0;
    flex: 1;
  }
  &-button {
    @include leelen-bottom(20);
    width: 100%;
    padding-top: 32rpx;
    background: #ffffff;
    ::v-deep .u-btn {
      margin: 0 30rpx;
    }
  }
}
.page-form {
  ::v-deep .u-cell_title {
    color: $u-content-color !important;
    display: flex;
    align-self: flex-start;
  }
  ::v-deep .u-cell__value {
    color: $u-main-color !important;
  }
}
</style>
