<template>
  <view class="page">
    <!-- 选择房屋地址 -->
    <house-manage class="page-list" @getHouse="toDetail" />
  </view>
</template>

<script>
import HouseManage from '_c/houseManage'
export default {
  components: {
    HouseManage
  },
  methods: {
    /**
     * 去房屋详情
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toDetail({ structId, houseId, label }) {
      uni.navigateTo({
        url: `/pages/home/house/detail?structId=${structId}&houseId=${houseId}&houseName=${label}`
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
    flex: 1;
    height: 0;
  }
}
</style>
