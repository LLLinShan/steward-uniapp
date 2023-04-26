<template>
  <view class="page">
    <u-cell-group class="page-title">
      <u-cell-item
        title="常见问题"
        :arrow="false"
        :title-style="{ fontWeight: 'bold' }"
      ></u-cell-item>
    </u-cell-group>
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
      <u-cell-group class="page-title" v-for="(item, index) in list" :key="index">
        <u-cell-item :title="item.title" :arrow="true" @click="toDetail(item)"></u-cell-item>
      </u-cell-group>
      <view v-if="list.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty mode="data" v-show="loadStatus !== 'loading' && !list.length"></u-empty>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      page: {
        // 分页
        pageNum: 0,
        pageSize: 13
      },
      triggered: false, // 是否可下拉刷新
      list: [], // 列表
      totalSize: 0, // 总数
      loadStatus: 'nomore', // loadmore / loading / nomore
      name: undefined // 搜索人员姓名
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
      const { result, data } = await this.$request.listServiceHelpConfig({
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
    },
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/my/help/detail?id=${item.id}`
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
  &-list {
    height: 0;
    flex: 1;
  }
}
</style>
