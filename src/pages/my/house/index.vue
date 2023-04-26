<template>
  <view class="house">
    <u-navbar
      title="出租屋报备"
      title-color="#333333"
      back-icon-color="#333333"
      :background="{ backgroundColor: '#ffffff' }"
      :customBack="toHome"
    />
    <scroll-view
      class="house-list"
      scroll-y
      refresher-enabled
      :lower-threshold="100"
      :refresher-triggered="triggered"
      @scrolltolower="scrolltolower"
      @refresherrefresh="refresh"
    >
      <!-- 列表数据 -->
      <view
        v-for="item in rentalList"
        :key="item.id"
        @click="viewDetail(item)"
        class="house-list__item"
      >
        <view class="house-list__item-title">
          <view class="house-list__item-title--left">{{ item.houseName }}</view>
          <view
            class="house-list__item-title--right"
            :style="{ color: getStatusColor(item.auditStatus) }"
          >
            {{ getStatusText(item.auditStatus) }}
          </view>
        </view>
        <view class="house-list__item-line">
          <view class="house-list__item-line--left">姓名</view>
          <view class="house-list__item-line--center">{{ item.name }}</view>
        </view>
        <view class="house-list__item-line">
          <view class="house-list__item-line--left">房屋地址</view>
          <view class="house-list__item-line--center u-line-2">{{ item.detailAddress }}</view>
        </view>
        <view class="house-list__item-line">
          <view class="house-list__item-line--left">登记时间</view>
          <view class="house-list__item-line--center u-line-2">{{ item.createTime }}</view>
        </view>
      </view>
      <view v-if="rentalList.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty mode="data" v-show="loadStatus !== 'loading' && !rentalList.length"></u-empty>
    </scroll-view>
    <div class="house-button" v-if="!!companyNo">
      <u-button type="primary" :ripple="true" @click="toAddHouse">添加新出租屋</u-button>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      triggered: false,
      loadStatus: 'nomore', // loadmore / loading / nomore
      pageNum: 0,
      pageSize: 10,
      totalSize: 0, // 总数
      rentalList: [],
      companyNo: undefined // 因为没有运营号的情况，选择不到管理机构，这个管理机构的优先级问题比较复杂，产品就修改了需求，没有运营号的情况就不展示按钮
    }
  },
  created() {
    this.companyNo = this.$store.state?.user?.companyNo
  },
  onShow() {
    this.refresh()
  },
  methods: {
    // 上拉刷新
    refresh() {
      if (this.triggered) return
      this.triggered = true
      this.pageNum = 1
      this.rentalList = []
      this.getList()
    },
    // 获取列表
    async getList() {
      this.loadStatus = 'loading'
      const { result, data } = await this.$request.getRentalList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        params: {}
      })
      this.loadStatus = 'loadmore'
      if (result === '1') {
        this.rentalList = this.pageNum !== 1 ? this.rentalList.concat(data.list) : data.list
        this.totalSize = data.totalSize
        if (this.totalSize === this.rentalList.length) this.loadStatus = 'nomore'
      }
      if (this.triggered) this.triggered = false
    },
    // 滚动条向下加载
    scrolltolower() {
      if (this.loadStatus !== 'loadmore') return
      this.pageNum += 1
      this.getList()
    },
    getStatusText(status) {
      const obj = {
        1: '待审核',
        2: '审核通过',
        3: '不通过'
      }
      return obj[status]
    },
    getStatusColor(status) {
      const obj = {
        1: '#F6AB00',
        2: '#00C8CF',
        3: '#F54E56'
      }
      return obj[status]
    },
    // 查看详情
    viewDetail(item) {
      uni.navigateTo({
        url: `/pages/my/house/detail?houseId=${item.id}&status=${item.auditStatus}`
      })
    },
    // 添加新出租屋
    toAddHouse() {
      uni.navigateTo({
        url: '/pages/my/house/edit'
      })
    },
    // 回到首页
    toHome() {
      uni.switchTab({
        url: '/pages/home/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.house {
  height: 100vh;
  display: flex;
  flex-direction: column;
  &-list {
    height: 0;
    flex: 1;
    margin-top: 16rpx;
    &__item {
      padding: 16rpx 32rpx;
      background-color: #fff;
      margin-bottom: 16rpx;
      &-title {
        padding: 16rpx 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        color: $u-main-color;
        font-size: 32rpx;
        line-height: 40rpx;
        &--left {
          max-width: 500rpx;
          color: $u-main-color;
          font-weight: bold;
        }
        &--right {
          font-size: 28rpx;
          font-weight: bold;
        }
      }
      &-line {
        padding: 16rpx 0;
        display: flex;
        color: $u-main-color;
        font-size: 32rpx;
        line-height: 40rpx;
        &--left {
          flex: 0 0 150rpx;
          color: $u-content-color;
        }
        &--center {
          flex: auto;
          word-break: break-all;
          color: $u-main-color;
        }
      }
    }
  }
  &-button {
    @include leelen-bottom(32);
    width: 100%;
    padding-top: 32rpx;
    background: #ffffff;
    ::v-deep .u-btn {
      margin: 0 30rpx;
    }
  }
}
</style>
