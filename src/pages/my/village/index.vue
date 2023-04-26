<template>
  <view class="village page">
    <u-empty v-if="!neighList.length" margin-top="200" mode="list" />
    <view class="village-item" v-for="item in neighList" :key="item.neighNo">
      <u-image
        v-if="item.pictures"
        class="village-item__img"
        width="100%"
        height="340"
        border-radius="10"
        :src="item.pictures"
      />
      <u-cell-group :border="false">
        <u-cell-item :border-bottom="false" title="社区名称" :value="item.name" :arrow="false" />
        <u-cell-item
          :border-bottom="false"
          title="详细地址"
          :value="item.detailedAddress"
          :arrow="false"
        />
      </u-cell-group>
    </view>
    <!-- <scroll-view
      class="page-list"
      scroll-y
      refresher-enabled
      :refresher-triggered="triggered"
      :lower-threshold="100"
      @scrolltolower="scrolltolower"
      @refresherrefresh="refresh"
    >
      <view class="village-item" v-for="item in list" :key="item.neighNo">
        <u-image
          v-if="item.pictures"
          class="village-item__img"
          width="100%"
          height="340"
          border-radius="10"
          :src="item.pictures"
        />
        <u-cell-group :border="false">
          <u-cell-item :border-bottom="false" title="社区名称" :value="item.name" :arrow="false" />
          <u-cell-item
            :border-bottom="false"
            title="详细地址"
            :value="item.detailedAddress"
            :arrow="false"
          />
        </u-cell-group>
      </view>
      <view v-if="list.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty mode="data" v-show="loadStatus !== 'loading' && !list.length"></u-empty>
    </scroll-view> -->
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      neighList: state => state.user.neighList
    })
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
      houseAddress: undefined // 搜索人员姓名
    }
  },
  onShow() {
    // this.refresh()
  },
  methods: {
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
      const { result, data } = await this.$request.getPageNeigh({
        ...this.page
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
    }
  }
}
</script>

<style lang="scss" scoped>
.village {
  overflow: hidden;
  &-item {
    margin-top: 32rpx;
    background-color: #fff;
    padding: 0 32rpx 24rpx;
    overflow: hidden;
    &__img {
      display: block;
      margin-top: 32rpx;
    }
    ::v-deep .u-cell {
      align-items: start;
      padding: 24rpx 0 0 !important;
      min-height: auto;
      &_title {
        color: #666;
        margin-right: 20rpx;
      }
      &__value {
        color: #333;
        text-align: left;
        font-size: 32rpx;
      }
    }
  }
}
// .page {
//   height: 100vh;
//   display: flex;
//   flex-direction: column;
//   &-list {
//     height: 0;
//     flex: 1;
//   }
// }
</style>
