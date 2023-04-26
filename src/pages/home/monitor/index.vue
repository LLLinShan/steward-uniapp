<template>
  <view class="page">
    <u-row>
      <u-col v-for="(item, index) in list" :key="index" span="6" @click="toDetail(item)">
        <view class="row">
          <u-image
            class="row-image"
            width="100%"
            height="226"
            :src="require('img/home/defaultPhoto.png')"
          />
          <view>{{ item.name }}</view>
        </view>
      </u-col>
    </u-row>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { name: '南门围墙机' },
        { name: '东门围墙机' },
        { name: '17型主机' },
        { name: '北门围墙机' }
      ]
    }
  },
  methods: {
    toDetail(item) {
      console.log(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  padding: 20rpx;
  background: #fff;
}
.row {
  padding: 20rpx;
  text-align: center;
  ::v-deep .u-image {
    border-radius: 20rpx;
  }
}
</style>
