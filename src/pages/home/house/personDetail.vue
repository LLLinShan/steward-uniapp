<template>
  <view class="page">
    <!-- 列表数据 -->
    <scroll-view class="page-list" scroll-y>
      <u-row>
        <u-col
          v-for="item in serviceList"
          :key="item.path"
          :span="this.btnStatus ? '3' : '6'"
          text-align="center"
          @click="$uni.navigateTo({ url: item.path })"
        >
          <view class="page-btns">{{ item.title }}</view>
        </u-col>
      </u-row>
      <view class="row" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
        <view class="row-type">
          <u-image width="180" height="226" v-if="item.facePhotoUrl" :src="item.facePhotoUrl" />
          <u-image width="180" height="226" v-else :src="require('img/home/defaultPhoto.png')" />
          <text class="row-type__value" :class="['row-type__' + item.personType]">
            {{ $utils.getDicLabel('personType', item.personType) }}</text
          >
        </view>
        <view class="row-content">
          <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']"
            >{{ item.personName }}
          </text>
          <text v-if="item.sex" class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']"
            >{{ $utils.getDicLabel('gender', item.sex) }}
          </text>
          <text
            v-if="item.phoneNumber"
            class="row-content__value"
            :class="[!hasSearch ? 'u-line-1' : '']"
          >
            {{ item.phoneNumber || $Data().defaultStr }}</text
          >
          <text
            class="row-content__value"
            v-if="item.personType === 2 && item.rentStartTime"
            :class="[!hasSearch ? 'u-line-1' : '']"
          >
            {{ item.rentStartTime || $Data().defaultStr }}至{{
              item.rentEndTime || $Data().defaultStr
            }}</text
          >
        </view>
        <view class="row-access">
          <text class="row-access__value" :class="['row-access__' + item.accessTimeState]">{{
            $utils.getDicLabel('accessControlTime', item.accessTimeState)
          }}</text>
        </view>
      </view>
      <u-empty mode="data" v-if="list.length === 0"></u-empty>
    </scroll-view>
    <!-- <div class="page-button" v-if="btnStatus">
      <u-button type="error" :ripple="true" @click="quit">退租</u-button>
      <u-button type="primary" :ripple="true" @click="recent">续租</u-button>
    </div> -->
  </view>
</template>

<script>
export default {
  props: {
    structId: {
      type: String,
      default: ''
    },
    houseId: {
      type: String,
      default: ''
    },
    houseName: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    btnStatus: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    serviceList() {
      let serviceList = [
        {
          title: '新增住户',
          path: `/pages/home/register/house?structId=${this.structId}&address=${this.houseName}`,
          auth: true
        },
        {
          title: '换房',
          path: `/pages/home/house/changeHouse?houseId=${this.houseId}&structId=${this.structId}`,
          auth: true
        },
        {
          title: '续租',
          path: `/pages/home/house/rerentApply?houseId=${this.houseId}&structId=${this.structId}&houseName=${this.houseName}`,
          auth: this.btnStatus
        },
        {
          title: '退租',
          path: `/pages/home/house/quitApply?houseId=${this.houseId}&structId=${this.structId}&houseName=${this.houseName}`,
          auth: this.btnStatus
        }
      ]
      serviceList = serviceList.filter(item => item.auth)
      return serviceList
    }
  },
  methods: {
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/home/house/householdTabs?memberId=${item.personId}&houseId=${this.houseId}&structId=${this.structId}&realPhone=${item.realPhone}`
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
      width: calc(100vw - 100rpx);
      margin-bottom: 8rpx;
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
      background: #d4cdcd;
      color: #666666;
    }
    &__3 {
      background: #fff4ed;
      color: #fc944f;
    }
  }
}

.page {
  height: calc(100vh - 80rpx);
  display: flex;
  flex-direction: column;
  padding-top: 16rpx;
  &-list {
    height: 0;
    flex: 1;
  }
  &-btns {
    padding: 26rpx 0px;
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
  }
  &-button {
    @include leelen-bottom();
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 30rpx;
    background: #fff;
    u-button {
      width: 250rpx;
    }
    u-button:first-child {
      margin-right: 20rpx;
    }
  }
}
</style>
