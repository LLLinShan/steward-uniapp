<template>
  <view class="card">
    <!-- <u-navbar
      title="人员查询"
      title-color="#333333"
      back-icon-color="#333333"
      :background="{ backgroundColor: '#ffffff' }"
      :customBack="toParentPath"
    >
    </u-navbar> -->
    <view class="card-search">
      <u-search
        placeholder="人员姓名查询"
        search-icon-color="#999999"
        action-text="取消"
        :focus="true"
        v-model="name"
        @change="onChange"
        @custom="onCancel"
      ></u-search>
    </view>
    <view class="card-list">
      <u-loading v-if="list === null" mode="circle" size="50"></u-loading>
      <u-empty v-else-if="list.length === 0" />
      <scroll-view v-else scroll-y @scrolltolower="scrolltolower">
        <card-list :list="list" hasSearch />
        <u-loadmore :status="status" />
      </scroll-view>
    </view>
  </view>
</template>

<script>
import Utils from '_u'
import cardList from './cardList'
export default {
  components: {
    cardList
  },
  data() {
    return {
      name: null,
      houseStructId: undefined,
      pageNum: 1,
      pageSize: 10,
      status: 'loadmore',
      list: [] //列表
    }
  },
  onLoad(option) {
    console.log('路由参数', option)
  },
  methods: {
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
    },
    // 搜索防抖
    onChange: Utils.debounce(function () {
      // 重置为第一页
      this.pageNum = 1
      if (this.name && this.name.length) {
        this.loadmore()
      } else {
        this.list = []
        this.totalSize = 0
      }
    }, 300),
    // 取消
    onCancel() {
      uni.redirectTo({
        url: '/pages/home/card/index'
      })
    },
    // 回到父级页面
    toParentPath() {
      uni.navigateTo({
        url: '/pages/home/card/index'
      })
    },
    // 跳转详情
    gotoPath(item) {
      uni.setStorageSync('accessDetail', item)
      console.log(item)
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
  height: 100vh;
  &-search {
    padding: 32rpx 25rpx;
    background: #ffffff;
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
      &-name {
        font-size: 32rpx;
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
