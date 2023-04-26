<template>
  <view class="my">
    <view class="my-info">
      <view class="my-info__avatar">
        <u-image mode="widthFix" width="82" height="94" :src="require('img/my/avatar.png')" />
      </view>
      <view class="my-info__other">
        <view class="my-info__name u-line-1">{{ username }}</view>
        <view class="my-info__phone">{{ secretPhone }}</view>
      </view>
    </view>
    <u-gap height="24" />
    <u-cell-group :border="false">
      <u-cell-item title="我的房屋" @click="$uni.navigateTo({ url: '/pages/my/village/index' })">
        <u-image
          style="margin-right: 10rpx"
          slot="icon"
          mode="widthFix"
          width="36"
          height="36"
          :src="require('img/my/village.png')"
        />
      </u-cell-item>
    </u-cell-group>
    <!-- <u-cell-group :border="false" v-if="neighNo">
      <u-cell-item title="楼栋二维码" @click="$uni.navigateTo({ url: '/pages/my/qrcode/index' })">
        <u-image
          style="margin-right: 10rpx"
          slot="icon"
          mode="widthFix"
          width="36"
          height="36"
          :src="require('img/my/qr.png')"
        />
      </u-cell-item>
    </u-cell-group>
    <u-cell-group :border="false" v-if="neighNo">
      <u-cell-item
        :border-bottom="false"
        title="出租屋报备"
        @click="$uni.navigateTo({ url: '/pages/my/house/index' })"
      >
        <u-image
          style="margin-right: 10rpx"
          slot="icon"
          mode="widthFix"
          width="36"
          height="36"
          :src="require('img/my/house.png')"
        />
      </u-cell-item>
    </u-cell-group>
    <u-gap height="16" />
    <u-cell-group :border="false" v-if="neighNo">
      <u-cell-item title="客服帮助" @click="$uni.navigateTo({ url: '/pages/my/help/index' })">
        <u-image
          style="margin-right: 10rpx"
          slot="icon"
          mode="widthFix"
          width="36"
          height="36"
          :src="require('img/my/help.png')"
        />
      </u-cell-item>
    </u-cell-group> -->
    <u-cell-group :border="false">
      <u-cell-item
        :border-bottom="false"
        title="设置"
        @click="$uni.navigateTo({ url: '/pages/my/setting/index' })"
      >
        <u-image
          style="margin-right: 10rpx"
          slot="icon"
          mode="widthFix"
          width="36"
          height="36"
          :src="require('img/my/setting.png')"
        />
      </u-cell-item>
    </u-cell-group>
    <u-tabbar :list="tabbar" :mid-button="true" :mid-button-size="160" />
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      navBackground: {
        background: 'linear-gradient(rgb(28, 187, 180), rgb(141, 198, 63))'
      }
    }
  },
  computed: {
    ...mapState({
      phone: state => state.user.phone,
      username: state => state.user.username,
      neighNo: state => state.user.neighNo,
      tabbar: state => state.user.tabbar
    }),
    secretPhone() {
      if (this.phone) return `${this.phone.slice(0, 3)}****${this.phone.slice(7)}`
      else return '--'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.my {
  &-info {
    background: linear-gradient(#37e8ee, #00c8cf);
    height: 388rpx;
    padding: 68px 40rpx 46rpx;
    color: #fff;
    display: flex;
    align-items: center;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: -273rpx;
      top: -293rpx;
      width: 740rpx;
      height: 740rpx;
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
    }
    &::after {
      content: '';
      position: absolute;
      right: -27rpx;
      top: -95rpx;
      width: 392rpx;
      height: 392rpx;
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
    }
    &__avatar {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      margin-right: 32rpx;
      background-color: rgba(255, 255, 255, 0.5);
      ::v-deep .u-image {
        margin: 28rpx auto 0;
      }
    }
    &__other {
      width: 0;
      flex: 1;
    }
    &__name {
      font-size: 40rpx;
    }
  }
}
</style>
