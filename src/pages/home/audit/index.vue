<template>
  <view class="page">
    <u-tabs
      :is-scroll="false"
      bar-width="100"
      :list="tabs"
      :current="curTab"
      @change="changeTab"
      active-color="#00c8cf"
      inactive-color="#666"
    ></u-tabs>
    <view class="search">
      <!-- <view v-if="auditStatus !== null">{{ $utils.getDicLabel('auditStatus', auditStatus) }}</view> -->
      <view class="search-house" @click="show = true">
        筛选
        <u-image mode="widthFix" width="30" height="32" :src="require('img/icon/search.png')" />
      </view>
      <view class="search-popup">
        <u-popup v-model="show" mode="top" border-radius="0" width="100%" height="400rpx">
          <u-form ref="form" :error-type="['toast']" label-width="220" :model="params">
            <div class="search-title">审核状态</div>
            <div class="search-li">
              <ul>
                <li
                  v-for="(item, index) in auditStatusList"
                  :key="index"
                  @click="changeLi(item)"
                  :class="item.select ? 'select' : ''"
                >
                  {{ item.label }}
                </li>
              </ul>
            </div>
          </u-form>
          <div class="page-button">
            <u-button :ripple="true" @click="resetBtn">重置</u-button>
            <u-button type="primary" :ripple="true" @click="confirmBtn">确定</u-button>
          </div>
        </u-popup>
      </view>
    </view>
    <scroll-view
      class="page-list"
      scroll-y
      refresher-enabled
      :lower-threshold="100"
      :refresher-triggered="triggered"
      @scrolltolower="scrolltolower"
      @refresherrefresh="refresh"
    >
      <!-- 列表数据 -->
      <view class="row" v-for="(item, index) in auditList" :key="index" @click="viewDetail(item)">
        <view class="row-type">
          <u-image
            mode="widthFix"
            width="180"
            height="226"
            v-if="item.szPhotoPath"
            :src="item.szPhotoPath"
          />
          <u-image
            mode="widthFix"
            width="180"
            height="226"
            v-else
            :src="require('img/home/defaultPhoto.png')"
          />
        </view>
        <view class="row-content">
          <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']">
            {{ item.name || $Data().defaultStr }}</text
          >
          <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']">
            {{ item.neighName || $Data().defaultStr }}</text
          >
          <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']">
            {{ item.address || $Data().defaultStr }}</text
          >
          <text class="row-content__value" :class="[!hasSearch ? 'u-line-1' : '']">
            {{ item.createTime || $Data().defaultStr }}
          </text>
        </view>
        <view class="row-access">
          <text class="row-access__value" :class="['row-access__' + item.auditStatus]">{{
            $utils.getDicLabel('auditStatus', item.auditStatus)
          }}</text>
        </view>
      </view>
      <view v-if="auditList.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty mode="data" v-show="loadStatus !== 'loading' && !auditList.length"></u-empty>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        {
          name: '入住登记'
        },
        {
          name: '房屋续租'
        }
      ],
      show: false,
      curTab: 0,
      triggered: false,
      loadStatus: 'nomore', // loadmore / loading / nomore
      pageNum: 0,
      pageSize: 10,
      totalSize: 0, // 总数
      auditList: [],
      auditStatusList: [],
      auditStatus: null
    }
  },
  onShow() {
    this.refresh()
    this.getDic()
  },
  methods: {
    // 获取筛选
    getDic() {
      let list
      if (this.curTab === 0) {
        list = this.$utils.getDicList('householdAuditStatus')
      } else {
        list = this.$utils.getDicList('renewAuditStatus')
      }
      this.auditStatusList = list.map(item => ({
        ...item,
        select: false
      }))
    },
    changeLi(item) {
      for (let item of this.auditStatusList) {
        item.select = false
      }
      item.select = !item.select
    },
    // 确定
    confirmBtn() {
      let temp = this.auditStatusList
        .filter(item => item.select)
        .map(item => {
          return Number(item.value)
        })
      this.auditStatus = parseInt(temp)
      this.show = false
      this.pageNum = 1
      this.list = []
      this.getList()
    },
    // 重置
    resetBtn() {
      this.auditStatus = null
      this.getDic()
      this.show = false
      this.pageNum = 1
      this.auditList = []
      this.getList()
    },
    // 切换Tab
    changeTab(index) {
      this.curTab = index
      this.resetBtn()
    },
    // 上拉刷新
    refresh() {
      if (this.triggered) return
      this.triggered = true
      this.pageNum = 1
      this.auditList = []
      this.getList()
    },
    // 获取审核列表
    async getList() {
      this.loadStatus = 'loading'
      const ajax = this.curTab === 0 ? this.$request.getAuditList : this.$request.listRenewAudit
      const { result, data } = await ajax({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        params: {
          auditStatus: this.auditStatus
        }
      })
      this.loadStatus = 'loadmore'
      if (result === '1') {
        this.auditList = this.pageNum !== 1 ? this.auditList.concat(data.list) : data.list
        this.totalSize = data.totalSize
        if (this.totalSize === this.auditList.length) this.loadStatus = 'nomore'
      }
      if (this.triggered) this.triggered = false
    },
    // 滚动条向下加载
    scrolltolower() {
      if (this.loadStatus !== 'loadmore') return
      this.pageNum += 1
      this.getList()
    },
    // 查看详情
    viewDetail(item) {
      if (this.curTab === 0) {
        uni.navigateTo({
          url: `/pages/home/audit/detail?auditId=${item.auditId}`
        })
      } else {
        uni.navigateTo({
          url: `/pages/home/audit/rerentDetail?auditId=${item.auditId}`
        })
      }
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
    margin-top: 16rpx;
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
.search {
  display: flex;
  padding: 16rpx 25rpx;
  background: #ffffff;
  margin-top: 16rpx;
  padding-left: calc((100vw - 60rpx) / 2);
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
    &__icon {
      margin-left: 8rpx;
    }
  }
}
.row {
  background: #ffffff;
  padding: 30rpx 32rpx;
  border-bottom: 1rpx solid #eeeeee;
  height: 280rpx;
  position: relative;
  &-type {
    position: absolute;
    &__value {
      position: absolute;
      top: 0;
      background: #d4cdcd;
      color: #666666;
      padding: 0rpx 5rpx;
      border-bottom-right-radius: 20rpx;
    }
    &__1 {
      background: #e5fafa;
      color: #00c8cf;
    }
    &__2 {
      background: #fff4ed;
      color: #fc944f;
    }
    &__3 {
      background: #d4cdcd;
      color: #666666;
    }
    &__4 {
      background: #d4cdcd;
      color: #666666;
    }
  }
  &-content {
    font-size: 28rpx;
    position: absolute;
    left: 240rpx;
    &__value {
      display: block;
      width: 400rpx;
      margin-bottom: 12rpx;
    }
  }
  &-access {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    &__value {
      font-size: 12pt;
      padding: 5rpx 10rpx;
      border-radius: 10rpx;
      background: #d4cdcd;
      color: #666666;
    }
    &__1 {
      background: #e5fafa;
      color: #00c8cf;
    }
    &__2 {
      background: #fff4ed;
      color: #fc944f;
    }
  }
}
</style>
