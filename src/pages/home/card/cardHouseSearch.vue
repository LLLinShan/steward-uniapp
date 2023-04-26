<template>
  <view class="page">
    <house-cascader class="page-list" hasPerson @getPerson="toDetail" />
  </view>
</template>

<script>
import HouseCascader from '_c/houseCascader'
export default {
  components: {
    HouseCascader
  },
  data() {
    return {}
  },
  methods: {
    toDetail({ memberId, houseId }) {
      console.log(memberId, houseId)
      uni.setStorageSync('accessDetail', { id: memberId, houseId: houseId })
      uni.navigateTo({
        url: `/pages/home/card/detail?memberId=${memberId}&houseId=${houseId}`
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
  }
}
</style>
