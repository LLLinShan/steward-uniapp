<template>
  <view class="page">
    <view class="page-search">
      <u-search
        placeholder="住家账号查询"
        search-icon-color="#999999"
        action-text="取消"
        :focus="true"
        v-model="name"
        @change="onChange"
        @custom="onCancel"
      ></u-search>
    </view>
    <scroll-view class="page-list" scroll-y @scrolltolower="scrolltolower">
      <!-- 列表数据 -->
      <household-list :list="list" hasSearch />
      <view style="padding-bottom: 24rpx" v-if="list.length">
        <u-loadmore :status="loadStatus" :load-text="loadText" />
      </view>
      <u-empty mode="data" v-show="loadStatus !== 'loading' && !list.length"></u-empty>
    </scroll-view>
  </view>
</template>

<script>
import Utils from '_u'
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
      list: [], // 列表
      totalSize: 0, // 总数
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '已无更多'
      },
      loadStatus: 'nomore', // loadmore / loading / nomore
      name: undefined // 搜索人员姓名
    }
  },

  methods: {
    // 获取人员列表
    async getList() {
      this.loadStatus = 'loading'
      const { result, data } = await this.$request.listHouseholdAccount({
        ...this.page,
        params: {
          realPhone: this.name
        }
      })
      this.loadStatus = 'loadmore'
      if (result === '1') {
        this.list = this.page.pageNum !== 1 ? this.list.concat(data.list) : data.list
        this.totalSize = data.totalSize
        if (this.totalSize === this.list.length) this.loadStatus = 'nomore'
      }
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
      if (this.name && this.name.length) {
        this.getList()
      } else {
        this.list = []
        this.totalSize = 0
      }
    }, 300),

    // 取消
    onCancel() {
      uni.redirectTo({
        url: '/pages/home/houseHold/index'
      })
    },
    /**
     * 去住户详情
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toDetail({ memberId, houseId, realPhone }) {
      uni.navigateTo({
        url: `/pages/home/houseHold/detail?memberId=${memberId}&houseId=${houseId}&realPhone=${realPhone}`
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
  &-search {
    padding: 32rpx 25rpx;
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
}
</style>
