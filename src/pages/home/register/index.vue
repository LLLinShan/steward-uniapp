<template>
  <view class="page">
    <!-- <u-navbar
      title="住户登记"
      title-color="#333333"
      back-icon-color="#333333"
      :background="{ backgroundColor: '#ffffff' }"
      :customBack="toHome"
    /> -->
    <view class="page-search">
      <u-search
        placeholder="住家查询"
        search-icon-color="#999999"
        disabled
        :show-action="false"
        @click="toSearch"
      ></u-search>
    </view>
    <!-- 选择房屋地址 -->
    <house-cascader class="page-list" @getHouse="toHouse" @getPerson="toPerson" />
  </view>
</template>

<script>
import HouseCascader from '_c/houseCascader'
export default {
  components: {
    HouseCascader
  },
  methods: {
    // 回到首页
    // toHome() {
    //   uni.switchTab({
    //     url: '/pages/home/index'
    //   })
    // },
    // 去搜索住家
    toSearch() {
      uni.navigateTo({
        url: `/pages/home/register/search`
      })
    },
    /**
     * 去登记房屋
     * @param {String} address 房屋地址
     * @param {String} houseId 房屋id
     */
    toHouse({ address, structId }) {
      uni.navigateTo({
        url: `/pages/home/register/house?address=${address}&structId=${structId}`
      })
    },
    /**
     * 去人员详情
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toPerson({ memberId, houseId }) {
      uni.navigateTo({
        url: `/pages/home/manage/detail?memberId=${memberId}&memberId=${houseId}`
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
    padding: 32rpx 25rpx;
    background: #ffffff;
    ::v-deep .u-content {
      padding: 0 32rpx;
      border-radius: 12rpx !important;
    }
  }
  &-list {
    flex: 1;
    height: 0;
  }
}
</style>
