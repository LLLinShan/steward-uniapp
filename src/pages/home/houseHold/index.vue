<template>
  <view class="page">
    <view class="search">
      <u-search
        class="search-wrap"
        placeholder="住家账号查询"
        search-icon-color="#999999"
        :show-action="false"
        disabled
        @click="toSearchPerson"
      ></u-search>
      <view class="search-house" @click="toSearchHouse">
        房屋筛选
        <u-image mode="widthFix" width="30" height="32" :src="require('img/icon/search.png')" />
      </view>
    </view>
    <scroll-view
      class="page-list"
      scroll-y
      refresher-enabled
      :refresher-triggered="triggered"
      :lower-threshold="100"
      @scrolltolower="scrolltolower"
      @refresherrefresh="refresh"
    >
      <!-- 列表数据 -->
      <household-list :list="list" />
      <view v-if="list.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty mode="data" v-show="loadStatus !== 'loading' && !list.length"></u-empty>
    </scroll-view>
  </view>
</template>

<script>
import householdList from './householdList'
export default {
  components: {
    householdList
  },
  data() {
    return {
      page: {
        // 分页
        pageNum: 0,
        pageSize: 10
      },
      triggered: false, // 是否可下拉刷新
      list: [], // 列表
      totalSize: 0, // 总数
      loadStatus: 'nomore', // loadmore / loading / nomore
      realPhone: undefined, // 搜索人员姓名
      houseStructId: undefined // 房屋节点id
    }
  },
  onShow() {
    this.refresh()
  },
  methods: {
    // 切换Tab
    changeTab(index) {
      this.curTab = index
      this.pageNum = 1
      this.list = []
      this.getList()
    },
    // 上拉刷新
    refresh() {
      if (this.triggered) return
      this.triggered = true
      this.page.pageNum = 1
      this.list = []

      this.getList()
    },
    // 获取人员列表
    async getList() {
      this.loadStatus = 'loading'
      const { result, data } = await this.$request.listHouseholdAccount({
        ...this.page,
        params: {
          realPhone: this.realPhone,
          houseStructId: this.houseStructId
        }
      })
      this.loadStatus = 'loadmore'
      if (result === '1') {
        this.list = this.page.pageNum !== 1 ? this.list.concat(data.list) : data.list
        this.totalSize = data.totalSize
        if (this.totalSize === this.list.length) this.loadStatus = 'nomore'
      }

      if (this.triggered) this.triggered = false
    },
    // 滚动条向下加载
    scrolltolower() {
      if (this.loadStatus !== 'loadmore') return

      this.page.pageNum += 1
      this.getList()
    },
    // 搜索房屋
    toSearchHouse() {
      uni.navigateTo({
        url: '/pages/home/houseHold/searchHouse'
      })
    },
    // 回到首页
    toHome() {
      uni.switchTab({
        url: '/pages/home/index'
      })
    },
    // 搜索住户
    toSearchPerson() {
      uni.navigateTo({
        url: '/pages/home/houseHold/searchPerson'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search {
  display: flex;
  padding: 32rpx 25rpx;
  background: #ffffff;
  margin-bottom: 16rpx;
  &-wrap {
    ::v-deep .u-content {
      width: 520rpx;
      padding: 0 32rpx;
      border-radius: 12rpx !important;
      .u-input {
        margin: 0 10rpx 0 20rpx;
      }
    }
  }

  &-house {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: $u-type-primary;
    margin-left: 16rpx;
    &__icon {
      margin-left: 8rpx;
    }
  }
}
.row {
  background: #ffffff;
  padding: 30rpx 32rpx;
  border-bottom: 1rpx solid #eeeeee;
  &-name {
    margin-bottom: 24rpx;
  }
  &-item {
    display: flex;
    font-size: 32rpx;

    &__label {
      width: 130rpx;
      margin-right: 32rpx;
      color: $u-content-color;
    }
    &__value {
      width: 525rpx;
    }
  }
}

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;

  &-button {
    @include leelen-bottom(32);
    width: 100%;
    padding-top: 32rpx;
    background: #ffffff;
    ::v-deep .u-btn {
      margin: 0 30rpx;
    }
  }
  &-list {
    height: 0;
    flex: 1;
  }
}
</style>
