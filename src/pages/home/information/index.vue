<template>
  <view class="page">
    <view class="search">
      <u-search
        class="search-wrap"
        placeholder="请输入发布信息标题"
        :show-action="false"
        :clearabled="true"
        v-model="title"
        @change="onChange"
        @clear="onCancel"
      ></u-search>
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
      <info-list :list="list" />
      <view v-if="list.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty mode="data" v-show="loadStatus !== 'loading' && !list.length"></u-empty>
    </scroll-view>
    <div class="page-button">
      <u-button type="primary" :ripple="true" @click="toAddInfo">新增发布</u-button>
    </div>
  </view>
</template>

<script>
import Utils from '_u'
import infoList from './infoList'
export default {
  components: {
    infoList
  },
  data() {
    return {
      page: {
        // 分页
        pageNum: 0,
        pageSize: 10
      },
      title: undefined, // 搜索人员姓名
      triggered: false, // 是否可下拉刷新
      list: [], // 列表
      totalSize: 0, // 总数
      loadStatus: 'nomore' // loadmore / loading / nomore
    }
  },
  onShow() {
    this.refresh()
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
      const { result, data } = await this.$request.infoPage({
        ...this.page,
        params: {
          title: this.title
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
    // 搜索防抖
    onChange: Utils.debounce(function () {
      // 重置为第一页
      this.page.pageNum = 1
      this.list = []
      this.totalSize = 0
      this.getList()
    }, 300),
    // 取消
    onCancel() {
      this.title = ''
    },
    // 新建发布
    toAddInfo() {
      uni.navigateTo({
        url: '/pages/home/information/add'
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
      width: calc(100vw - 50rpx);
      padding: 0 32rpx;
      border-radius: 12rpx !important;
      .u-input {
        margin: 0 10rpx 0 20rpx;
      }
    }
  }
  &-title {
    padding: 10rpx 0 0 20rpx;
    font-weight: 700;
    font-size: 32rpx;
  }
  &-li {
    height: 80rpx;
    padding: 20rpx;
    li {
      float: left;
      background: #efefef;
      color: #333333;
      padding: 8rpx 30rpx;
      margin-right: 10rpx;
      border-radius: 10rpx;
    }
    li.select {
      background-color: #00c8cf;
      color: #fff;
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
  &-list {
    height: 0;
    flex: 1;
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
