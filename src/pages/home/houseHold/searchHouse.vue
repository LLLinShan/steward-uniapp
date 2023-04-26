<template>
  <view class="page">
    <!-- 选择房屋地址 -->
    <house-manage ref="house" class="page-list" hasPerson @getPerson="toDetail" />
  </view>
</template>

<script>
import HouseManage from '_c/houseManage'
export default {
  components: {
    HouseManage
  },
  data() {
    return {
      houseStructId: undefined
    }
  },
  onShow() {
    if (this.houseStructId) {
      let houseStructId = uni.getStorageSync('houseStructId')
      this.$refs.house.getPersonData(houseStructId)
    }
  },
  methods: {
    /**
     * 去房屋详情
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toDetail({ houseId, memberId, realPhone }) {
      this.houseStructId = houseId
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
    flex: 1;
    height: 0;
  }
}
</style>
