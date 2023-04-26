<template>
  <view class="page">
    <!-- 选择房屋地址 -->
    <house-cascader class="page-list" @getHouse="toDetail" />
  </view>
</template>

<script>
import HouseCascader from '_c/houseCascader'
export default {
  components: {
    HouseCascader
  },
  methods: {
    /**
     * 去住户详情6690238293184872448
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toDetail({ structId, address }) {
      console.log(structId, address)
      // uni.redirectTo({
      //   url: `/pages/home/rent/publishHouse?structId=${structId}`
      // })
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        isHouse: 1,
        structId: structId
      })
      uni.navigateBack()
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
    flex: 1;
    height: 0;
  }
}
</style>
