<template>
  <view class="page">
    <view class="search">
      <view class="search-house" @click="show = true">
        筛选
        <u-image mode="widthFix" width="30" height="32" :src="require('img/icon/search.png')" />
      </view>
    </view>
    <view class="search-popup">
      <u-popup v-model="show" mode="top" border-radius="0" width="100%" height="480rpx">
        <u-form ref="form" :error-type="['toast']" label-width="220" :model="params">
          <div class="search">
            <view class="search-house">
              筛选
              <u-image
                mode="widthFix"
                width="30"
                height="32"
                :src="require('img/icon/search.png')"
              />
            </view>
          </div>
          <div class="search-title">告警时间</div>
          <u-form-item>
            <u-input
              placeholder="请选择告警时间"
              type="select"
              :disabled="disabled"
              :value="params.rentTime"
              @click="rentTimePicker = true"
            />
          </u-form-item>
        </u-form>
        <div class="page-button">
          <u-button :ripple="true" @click="resetBtn">重置</u-button>
          <u-button type="primary" :ripple="true" @click="confirmBtn">确定</u-button>
        </div>
      </u-popup>
    </view>
    <u-calendar
      start-text="开始"
      end-text="结束"
      mode="range"
      max-date="2222-01-01"
      toolTip="请选择开始/结束时间"
      :range-color="$Data().primaryColor"
      :active-bg-color="$Data().primaryColor"
      range-bg-color="#F3F5F5"
      safe-area-inset-bottom
      v-model="rentTimePicker"
      @change="confirmRentTime"
    >
    </u-calendar>
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
      <alarm-list :list="list" />
      <view v-if="list.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty mode="data" v-show="loadStatus !== 'loading' && !list.length"></u-empty>
    </scroll-view>
  </view>
</template>

<script>
import Utils from '_u'
import alarmList from './alarmList'
export default {
  components: {
    alarmList
  },
  data() {
    return {
      page: {
        // 分页
        pageNum: 0,
        pageSize: 20
      },
      params: {
        direction: [], //出入口方向
        rentTime: undefined, // 租凭时间
        startTime: undefined, //开始时间
        endTime: undefined //结束时间
      },
      personNameMore: undefined, // 搜索人员姓名
      personName: undefined, // 搜索人员姓名
      rentTimePicker: false, // 显示出入时间的弹框
      triggered: false, // 是否可下拉刷新
      list: [], // 列表
      totalSize: 0, // 总数
      show: false,
      directionList: [],
      loadStatus: 'nomore' // loadmore / loading / nomore
    }
  },
  onReady() {
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
      const { result, data } = await this.$request.electromobileList({
        ...this.page,
        params: {
          startTime: this.params.startTime,
          endTime: this.params.endTime
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
    /**
     * 入住确定
     * @param {String} endDate 结束时间
     * @param {String} startDate 开始时间
     */
    confirmRentTime({ startDate, endDate }) {
      this.params.rentTime = `${startDate}~${endDate}`
      this.params.startTime = startDate + ' 00:00:00'
      this.params.endTime = endDate + ' 23:59:59'
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

    resetBtn() {
      this.params.rentTime = undefined
      this.params.startTime = undefined
      this.params.endTime = undefined
      this.show = false
      this.page.pageNum = 1
      this.list = []
      this.getList()
    },
    // 确定
    confirmBtn() {
      this.show = false
      this.page.pageNum = 1
      this.list = []
      this.getList()
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
  height: 100rpx;
  position: relative;
  &-wrap {
    ::v-deep .u-content {
      width: calc(100vw - 160rpx);
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
    position: absolute;
    right: 20rpx;
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
    ::v-deep .u-load-more-wrap {
      @include leelen-bottom(20);
    }
  }
  &-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 70rpx;
    u-button {
      width: 250rpx;
      margin-right: 20rpx;
    }
  }
}
::v-deep .u-input .u-input__input {
  padding-left: 20rpx;
}
</style>
