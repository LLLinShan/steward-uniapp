<template>
  <view class="page">
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
      <rent-list :list="list" />
      <view v-if="list.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty
        mode="list"
        text="暂无发布记录"
        v-show="loadStatus !== 'loading' && !list.length"
      ></u-empty>
    </scroll-view>
    <div class="page-button">
      <u-button type="primary" :ripple="true" @click="toAddHouse">发布房源</u-button>
    </div>
  </view>
</template>

<script>
import Utils from '_u'
import rentList from './rentList'
export default {
  components: {
    rentList
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
      const { result, data } = await this.$request.houseResourceList()
      this.loadStatus = 'loadmore'
      if (result === '1') {
        this.list = this.page.pageNum !== 1 ? this.list.concat(data.list) : data.list
        let tempList = this.list.map(item => {
          let houseShapeTemp = null
          if (item.houseShape !== null) {
            let temp = item.houseShape.split(',')
            houseShapeTemp = temp[0] + '室' + temp[1] + '厅' + temp[2] + '卫'
          } else houseShapeTemp = ''
          let houseAreaTemp = null
          if (item.houseArea !== null) {
            houseAreaTemp = item.houseArea + 'm²'
          } else houseAreaTemp = ''
          if (item.orientation === null) item.orientation = ''
          let housePointListTemp = null
          if (item.housePointList.length > 2 && item.decorationTagList.length) {
            housePointListTemp = item.housePointList.slice(0, 2)
          } else {
            housePointListTemp = item.housePointList
          }
          return {
            ...item,
            houseShape: houseShapeTemp,
            houseArea: houseAreaTemp,
            housePointList: housePointListTemp
          }
        })
        this.list = tempList
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
    toAddHouse() {
      uni.navigateTo({
        url: '/pages/home/rent/publishHouse'
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
    margin-top: 16rpx;
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
