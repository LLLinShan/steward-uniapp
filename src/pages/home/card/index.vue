<template>
  <view class="card">
    <!-- <u-navbar
      title="门禁卡管理"
      title-color="#333333"
      back-icon-color="#333333"
      :background="{ backgroundColor: '#ffffff' }"
      :customBack="toHome"
    >
    </u-navbar> -->
    <view class="card-search">
      <u-search
        placeholder="人员姓名查询"
        search-icon-color="#999999"
        color="#999999"
        :show-action="false"
        disabled
        @click="toSearchPerson"
      ></u-search>
      <view class="card-search__icon" @click="toSearchHouse">
        房屋筛选
        <u-image mode="widthFix" width="30" height="32" :src="require('img/icon/search.png')" />
      </view>
    </view>
    <view class="card-list">
      <u-loading v-if="list === null" mode="circle" size="50"></u-loading>
      <u-empty v-else-if="list.length === 0" />
      <scroll-view
        v-else
        scroll-y
        refresher-enabled
        :refresher-triggered="triggered"
        @scrolltolower="scrolltolower"
        @refresherrefresh="refresh"
      >
        <card-list :list="list" />
        <u-loadmore :status="status" />
      </scroll-view>
    </view>
  </view>
</template>

<script>
import cardList from './cardList'
export default {
  components: {
    cardList
  },
  data() {
    return {
      background: {
        backgroundColor: '#ffffff'
      },
      isload: false,
      name: null,
      houseStructId: undefined,
      pageNum: 1,
      pageSize: 10,
      triggered: false,
      status: 'loadmore',
      list: [] //列表
    }
  },
  onLoad(option) {
    this.isload = option.isload
    if (!option.isload) this.loadmore()
  },
  onShow() {
    if (this.isload) {
      this.houseStructId = uni.getStorageSync('houseStructId')
      this.refresh()
    } else {
      this.isload = false
    }
  },
  methods: {
    refresh() {
      if (this.triggered) return
      this.triggered = true
      this.pageNum = 1
      this.pageSize = 10
      this.list = []
      this.loadmore()
    },
    scrolltolower() {
      if (this.status !== 'loadmore') return
      this.pageNum++
      this.loadmore()
    },
    async loadmore() {
      this.status = 'loading'
      const { result, data } = await this.$request.listAccessCard({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        params: {
          name: this.name,
          houseStructId: this.houseStructId
        }
      })
      if (result === '1') {
        this.list = this.pageNum !== 1 ? this.list.concat(data.list) : data.list
        if (data.totalSize === this.list.length) this.status = 'nomore'
        else this.status = 'loadmore'
      }
      if (this.triggered) this.triggered = false
    },
    // 房屋搜索
    toSearchHouse() {
      uni.navigateTo({
        url: '/pages/home/card/cardHouseSearch'
      })
    },
    // 搜索人员
    toSearchPerson() {
      uni.navigateTo({
        url: '/pages/home/card/cardPersonSearch'
      })
    },
    // 回到首页
    toHome() {
      uni.switchTab({
        url: '/pages/home/index'
      })
    },
    // 跳转详情
    gotoPath(item) {
      uni.setStorageSync('accessDetail', item)
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/home/card/detail?memberId=+${item.id}&houseId=${item.houseId}`
        })
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  &-search {
    display: flex;
    padding: 32rpx 25rpx;
    background: #ffffff;
    ::v-deep .u-content {
      width: 520rpx;
      padding: 0 32rpx;
      border-radius: 12rpx !important;
      .u-input {
        margin: 0 10rpx 0 20rpx;
      }
    }
    &__icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: $u-type-primary;
      margin-left: 16rpx;
      u-image {
        margin-left: 8rpx;
      }
    }
  }
  &-section {
    margin-top: 16rpx;
    ::v-deep .u-cell {
      padding: 24rpx 32rpx;
      &_title {
        font-size: 32rpx !important;
      }
    }
  }
  &-list {
    margin-top: 16rpx;
    height: 0;
    flex: 1;
    position: relative;
    ::v-deep .u-loading {
      position: absolute;
      top: 40%;
      left: 50%;
      margin: -25rpx 0 0 -25rpx;
    }
    ::v-deep .u-icon__label {
      margin-top: 36rpx !important;
    }
    &__item {
      background-color: #fff;
      padding: 20rpx 32rpx;
      border-bottom: 1px solid #eeeeee;
      position: relative;
      font-size: 32rpx;
      &-name {
        color: $u-content-color;
      }
      &-content {
        margin-bottom: 12rpx;
        word-break: break-all;
      }
      ::v-deep .u-icon {
        position: absolute;
        bottom: 70rpx;
        right: 20rpx;
      }
    }
    ::v-deep .u-load-more-wrap {
      @include leelen-bottom(20);
    }
  }
}

.u-row {
  margin: 40rpx 0;
}
</style>
