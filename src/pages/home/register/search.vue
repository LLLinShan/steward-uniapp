<template>
  <view class="page">
    <view class="page-search">
      <u-search
        placeholder="住家查询"
        search-icon-color="#999999"
        action-text="取消"
        :focus="true"
        v-model="houseName"
        @change="onChange"
        @custom="onCancel"
      ></u-search>
    </view>
    <scroll-view class="page-list" scroll-y @scrolltolower="scrolltolower">
      <view class="row" v-for="item in list" :key="item.houseAddress" @click="goHouse(item)">
        <text class="row-item row-item__houseName">
          {{ item.houseName || $Data().defaultStr }}</text
        >
        <text class="row-item row-item__houseAddress">
          {{ item.houseAddress || $Data().houseAddress }}</text
        >
      </view>
      <u-empty
        mode="data"
        text="暂无数据"
        v-show="loadStatus !== 'loading' && !list.length"
      ></u-empty>
      <view v-if="list.length">
        <u-loadmore :status="loadStatus" :load-text="loadText" />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Utils from '_u'

export default {
  components: {},
  data() {
    return {
      houseName: undefined, // 住家名称
      page: {
        // 分页
        pageNum: 0,
        pageSize: 15
      },
      list: [], // 列表
      totalSize: 0, // 总数
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '已无更多'
      },
      loadStatus: 'nomore' // loadmore / loading / nomore
    }
  },
  methods: {
    // 获取房屋列表
    async getList() {
      this.loadStatus = 'loading'
      const { result, data } = await this.$request.fuzzySearchHouse({
        ...this.page,
        params: {
          houseName: this.houseName
        }
      })
      this.loadStatus = 'loadmore'
      if (result === '1') {
        this.list = this.page.pageNum !== 1 ? this.list.concat(data.list) : data.list

        this.totalSize = data.totalSize
        if (this.totalSize === this.list.length) this.loadStatus = 'nomore'
      }
    },
    // 滚动条向下
    scrolltolower() {
      if (this.loadStatus !== 'loadmore') return
      this.page.pageNum += 1
      this.getList()
    },
    // 搜索防抖
    onChange: Utils.debounce(function () {
      // 重置为第一页
      this.page.pageNum = 1
      if (this.houseName && this.houseName.length) {
        this.getList()
      } else {
        this.list = []
        this.totalSize = 0
        this.loadStatus = 'nomore'
      }
    }, 100),
    // 取消
    onCancel() {
      uni.redirectTo({
        url: '/pages/home/register/index'
      })
    },
    /**
     * 去住家登记
     * @param {String} houseAddress 房屋地址
     * @param {String} houseName 房屋住家/别墅
     * @param {String} houseId 房屋id
     */
    goHouse({ houseAddress, houseName, structId }) {
      uni.navigateTo({
        url: `/pages/home/register/house?address=${houseAddress}${houseName}&structId=${structId}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  &-search {
    padding: 25rpx 32rpx;
    align-items: center;
    background: #ffffff;
    margin-bottom: 16rpx;
    ::v-deep .u-content {
      width: 598rpx;
      padding: 0 32rpx;
      border-radius: 12rpx !important;
      .u-input {
        margin: 0 10rpx 0 20rpx;
      }
    }
    ::v-deep .u-action {
      color: $u-type-primary;
    }
  }
  &-list {
    flex: 1;
    height: 0;
  }
}
.row {
  background: #ffffff;
  padding: 30rpx 32rpx;
  border-bottom: 1rpx solid #eeeeee;
  &-item {
    display: flex;

    word-break: break-all;
    &__houseName {
      font-size: 30rpx;
      font-weight: bold;
    }
    &__houseAddress {
      font-size: 28rpx;
      color: #999999;
    }
  }
}
</style>
