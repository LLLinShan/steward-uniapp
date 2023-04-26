<template>
  <view class="detail">
    <view v-if="detailInfo.auditStatus === 3" class="error">
      <u-icon class="icon" name="error-circle" color="#F54E56" size="32"></u-icon>
      不通过原因：{{ detailInfo.auditContent }}
    </view>
    <!-- 管理机构 -->
    <view class="main">
      <u-cell-group>
        <u-cell-item
          title="管理机构"
          :arrow="false"
          :title-style="cellItemStyle"
          :value="detailInfo.organizationName || $Data().defaultStr"
        >
        </u-cell-item>
      </u-cell-group>
    </view>
    <!-- 个人信息 -->
    <view class="main main-basic">
      <u-cell-group>
        <u-cell-item title="个人信息" :arrow="false" :title-style="cellItemStyle"> </u-cell-item>
        <u-cell-item
          title="姓名"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.name || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="手机号码"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.phone || $Data().defaultStr"
        >
        </u-cell-item>
        <!-- 证件照片 -->
        <view class="main-img__title">证件照片</view>
        <view class="main-img main-img__line">
          <view v-if="detailInfo.idPhoto && detailInfo.idPhoto.length">
            <view class="main-img__line-item">
              <u-image
                v-if="detailInfo.idPhoto[0]"
                :src="detailInfo.idPhoto[0] || ''"
                width="198"
                height="124"
                border-radius="10"
                @click="previewImage([detailInfo.idPhoto[0]])"
              >
                <u-loading slot="loading"></u-loading>
                <view slot="error" style="font-size: 24rpx">加载失败</view>
              </u-image>
              <view class="main-img__line-item--desc">身份证正面</view>
            </view>
            <view class="main-img__line-item">
              <u-image
                v-if="detailInfo.idPhoto[1]"
                :src="detailInfo.idPhoto[1] || ''"
                width="198"
                height="124"
                border-radius="10"
                @click="previewImage([detailInfo.idPhoto[1]])"
              >
                <u-loading slot="loading"></u-loading>
                <view slot="error" style="font-size: 24rpx">加载失败</view>
              </u-image>
              <view class="main-img__line-item--desc">身份证反面</view>
            </view>
          </view>
          <text v-else>{{ $Data().defaultStr }}</text>
        </view>
      </u-cell-group>
    </view>
    <!-- 出租屋信息 -->
    <view class="main main-basic">
      <u-cell-group>
        <u-cell-item title="出租屋信息" :arrow="false" :title-style="cellItemStyle"> </u-cell-item>
        <u-cell-item
          title="出租屋名称"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.houseName || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="所在地区"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="
            detailInfo.address
              ? `${detailInfo.address[0]}${detailInfo.address[2]}${detailInfo.address[4]}`
              : '--'
          "
        >
        </u-cell-item>
        <u-cell-item
          title="详细地址"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.address ? `${detailInfo.address[6]}` : '--'"
        >
        </u-cell-item>
        <u-cell-item
          title="房间总数"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.roomTotalCount || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="出入口数"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.accessTotalCount || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="楼层数"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.floorTotalCount || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="每楼层房间数"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.roomPerFloorCount || $Data().defaultStr"
        >
        </u-cell-item>
      </u-cell-group>
    </view>
    <!-- 描述 -->
    <view class="describe">
      <view class="describe__title">描述</view>
      <view class="describe__line" v-if="detailInfo.description">
        {{ detailInfo.description }}
      </view>
      <view class="describe__line" v-else>{{ $Data().defaultStr }}</view>
    </view>

    <!-- 产权证明 -->
    <view class="photo">
      <view class="photo__title">产权证明</view>
      <view
        class="photo__line"
        v-if="detailInfo.houseCertificate && detailInfo.houseCertificate.length"
      >
        <u-image
          class="photo__line-item"
          v-for="(src, i) in detailInfo.houseCertificate"
          :key="i"
          :src="src"
          width="144"
          height="144"
          border-radius="10"
          @click="previewImage([src])"
        >
          <u-loading slot="loading"></u-loading>
          <view slot="error" style="font-size: 24rpx">加载失败</view>
        </u-image>
      </view>
      <view v-else class="photo__line">{{ $Data().defaultStr }}</view>
    </view>

    <!-- 委托二房东证明 -->
    <view class="photo">
      <view class="photo__title">委托二房东证明</view>
      <view
        class="photo__line"
        v-if="detailInfo.sublessorCertificate && detailInfo.sublessorCertificate.length"
      >
        <u-image
          class="photo__line-item"
          v-for="(src, i) in detailInfo.sublessorCertificate"
          :key="i"
          :src="src"
          width="144"
          height="144"
          border-radius="10"
          @click="previewImage([src])"
        >
          <u-loading slot="loading"></u-loading>
          <view slot="error" style="font-size: 24rpx">加载失败</view>
        </u-image>
      </view>
      <view v-else class="photo__line">{{ $Data().defaultStr }}</view>
    </view>

    <!-- 提交 审核通过auditStatus为2时不可修改-->
    <view v-if="detailInfo.auditStatus !== 2" class="detail-button">
      <u-button type="primary" :ripple="true" @click="toEdit">修改</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detailInfo: {}, // 详情数据
      cellItemStyle: {
        fontSize: '32rpx',
        fontWeight: 'bold'
      },
      titleStyle: { background: '#fff', fontSize: '32rpx', color: '#666666' },
      valueStyle: {
        color: '#333333'
      },
      houseId: ''
    }
  },
  onLoad(option) {
    this.houseId = option.houseId
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const res = await this.$request.getRentalDetail({
        id: this.houseId
      })
      if (res.result === '1') {
        this.detailInfo = res.data
      }
    },
    toEdit() {
      uni.navigateTo({
        url: `/pages/my/house/edit?houseId=${this.detailInfo.id}&status=${this.detailInfo.auditStatus}`
      })
    },
    previewImage(urls) {
      uni.previewImage({
        urls
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  // 不通过原因
  .error {
    background-color: #f99ea3;
    color: #fff;
    padding: 16rpx 18rpx 16rpx 60rpx;
    position: relative;
    .icon {
      position: absolute;
      left: 20rpx;
      top: 24rpx;
    }
  }
  // 个人信息，出租屋信息
  .main {
    margin-top: 16rpx;
    &-img {
      padding: 24rpx 32rpx 30rpx 32rpx;
      border-bottom: 1rpx solid #eeeeee;
      &__line-item {
        display: inline-block;
        width: 224rpx;
        height: 144rpx;
        border: 1rpx solid #cccccc;
        border-radius: 8rpx;
        margin-right: 28rpx;
        padding: 10rpx 12rpx;
        &--desc {
          margin-top: 16rpx;
          text-align: center;
          font-size: 24rpx;
          color: $u-tips-color;
        }
      }
      &__title {
        font-size: 32rpx;
        color: $u-content-color;
        padding: 30rpx 32rpx 0 32rpx;
      }
    }
    &.main-basic {
      ::v-deep .u-cell_title {
        color: $u-content-color !important;
        display: flex;
        align-self: flex-start;
      }
    }
  }
  // 描述
  .describe {
    margin-top: 16rpx;
    background-color: #fff;
    font-size: 32rpx;
    &__title {
      font-weight: bold;
      color: $u-main-color;
      padding: 30rpx 32rpx 0 32rpx;
    }
    &__line {
      word-break: break-all;
      color: $u-main-color;
      padding: 28rpx 32rpx 30rpx 32rpx;
    }
  }
  // 产权证明,委托二房东证明
  .photo {
    margin-top: 16rpx;
    background-color: #fff;
    font-size: 32rpx;
    &__title {
      font-weight: bold;
      color: $u-main-color;
      padding: 30rpx 32rpx 0 32rpx;
    }
    &__line {
      padding: 16rpx 32rpx 80rpx 32rpx;
      &-item {
        display: inline-block;
        margin-right: 28rpx;
      }
    }
  }
  &-button {
    @include leelen-bottom(68);
    margin-top: 66rpx;
    ::v-deep .u-btn {
      margin: 0 32rpx;
    }
  }
}
</style>
