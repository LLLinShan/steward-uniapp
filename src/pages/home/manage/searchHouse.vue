<template>
  <view class="page">
    <!-- 选择房屋地址 -->
    <house-cascader class="page-list" hasPerson @getPerson="toDetail" />
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
     * 去住户详情
     * @param {String} memberId 人员id
     * @param {String} houseId 房屋id
     */
    toDetail({ memberId, houseId }) {
      uni.navigateTo({
        url: `/pages/home/manage/detail?memberId=${memberId}&houseId=${houseId}`
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
