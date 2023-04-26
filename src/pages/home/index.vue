<template>
  <view class="home">
    <view class="home-hd">
      <u-cell-group :border="false">
        <u-cell-item border-top :border-bottom="false" @click="showNeigh" icon="map" :arrow="false">
          <template slot="title">
            <text style="margin-right: 20rpx">{{ neighName }}</text>
            <u-icon name="arrow-right" />
          </template>
        </u-cell-item>
      </u-cell-group>
    </view>
    <view class="home-banner">
      <u-swiper :list="bannerList" mode="dot" height="270"></u-swiper>
    </view>
    <view class="home-section" v-if="auth">
      <!-- <u-section title="物业服务" :right="false" :show-line="false" font-size="32" /> -->
      <view class="home-section__list">
        <u-row>
          <u-col
            v-for="item in serviceList"
            :key="item.path"
            span="3"
            text-align="center"
            @click="navigate(item.path)"
          >
            <u-image width="64" height="64" mode="64" :src="item.src" />
            <view class="title">{{ item.title }}</view>
          </u-col>
        </u-row>
      </view>
    </view>
    <view class="home-menu">
      <u-row>
        <u-col
          v-for="item in menuList"
          :key="item.path"
          span="6"
          text-align="center"
          @click="navigate(item.path)"
        >
          <view class="home-menu__list">
            <u-image width="64" height="64" mode="64" :src="item.src" />
            <view class="title">{{ item.title }}</view>
          </view>
        </u-col>
      </u-row>
    </view>
    <u-action-sheet :list="list" @click="tellPhone" v-model="actionShow"></u-action-sheet>
    <u-tabbar :list="tabbar" :mid-button="true" :mid-button-size="160" />
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      visible: false,
      defaultValue: [0],
      bannerList: [
        require('img/home/banner1.png'),
        require('img/home/banner2.png'),
        require('img/home/banner3.png')
      ],
      list: [{ text: '呼叫 4001001000' }],
      actionShow: false
    }
  },
  computed: {
    ...mapState({
      neighName: state => state.user.neighName,
      neighNo: state => state.user.neighNo,
      auth: state => state.user.auth,
      tabbar: state => state.user.tabbar
    }),
    serviceList() {
      let serviceList = [
        {
          src: require('img/home/houseHome.png'),
          title: '房屋管理',
          path: '/pages/home/house/index',
          auth: 'pms:house'
        },
        {
          src: require('img/home/verify.png'),
          title: '住户审核',
          path: '/pages/home/audit/index',
          auth: 'pms:appHouseHoldCheck'
        },
        {
          src: require('img/home/openDoor.png'),
          title: '远程开门',
          path: '/pages/home/opendoor/index',
          auth: 'pms:remoteOpen'
        },
        {
          src: require('img/home/monitor.png'),
          title: '查看监控',
          path: '/pages/home/monitor/index',
          auth: 'pms:monitor'
        }
      ]
      serviceList = serviceList.filter(item => {
        return this.auth?.includes(item.auth)
      })
      return serviceList
    },
    menuList() {
      let menuList = [
        {
          src: require('img/home/rent.png'),
          title: '我要出租',
          path: '/pages/home/rent/index',
          auth: 'pms:toRent'
        },
        {
          src: require('img/home/information.png'),
          title: '公告发布',
          path: '/pages/home/information/index',
          auth: 'pms:information'
        },
        {
          src: require('img/home/inOutHome.png'),
          title: '出入记录',
          path: '/pages/home/inout/index',
          auth: 'pms:record'
        },
        {
          src: require('img/home/alarm.png'),
          title: '告警记录',
          path: '/pages/home/alarm/index',
          auth: 'pms:alarmRecord'
        },
        {
          src: require('img/home/timeOut.png'),
          title: '到期管理',
          path: '/pages/home/manage/index',
          auth: 'pms:expire'
        },
        {
          src: require('img/home/rentReport.png'),
          title: '出租屋报备',
          path: '/pages/my/house/index',
          auth: 'pms:rental'
        },
        {
          src: require('img/home/repair.png'),
          title: '故障报修',
          path: '/null',
          auth: 'pms:repair'
        },
        {
          src: require('img/home/helpCenter.png'),
          title: '帮助中心',
          path: '/pages/my/help/index',
          auth: 'pms:help'
        }
      ]
      menuList = menuList.filter(item => {
        return this.auth?.includes(item.auth)
      })
      return menuList
    }
  },
  methods: {
    tellPhone(index) {
      console.log(`点击了第${index + 1}项，内容为：${this.list[index].text}`)
      uni.makePhoneCall({
        phoneNumber: '4001001000', //电话号码
        success: function (e) {
          console.log(e)
        },
        fail: function (e) {
          console.log(e)
        }
      })
    },
    navigate(path) {
      if (!this.neighNo) {
        return uni.showModal({
          content: '您当前未绑定小区',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: this.$Data().primaryColor
        })
      }
      if (path === '/null') {
        this.actionShow = true
        return false
      }
      uni.navigateTo({ url: path })
    },
    showNeigh() {
      uni.navigateTo({
        url: '/pages/home/changeNeigh'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-banner {
    padding: 0 32rpx 32rpx;
    background-color: #f9fafa;
  }
  &-section {
    // margin-top: 24rpx;
    padding: 0rpx 32rpx 20rpx;
    background-color: #f9fafa;
    overflow: hidden;
    &__list {
      margin-top: 32rpx;
      font-size: 24rpx;
      ::v-deep .u-image {
        margin: 0 auto;
      }
      .title {
        margin-bottom: 32rpx;
      }
    }
  }
  &-menu {
    padding: 0 32rpx;
    background-color: #f9fafa;
    &__list {
      margin-bottom: 32rpx;
      background-color: #fff;
      position: relative;
      background-color: #fff;
      height: 100rpx;
      border-radius: 20rpx;
      ::v-deep .u-image {
        position: absolute;
        left: 20rpx;
        top: 20rpx;
      }
      .title {
        position: absolute;
        left: 100rpx;
        top: 30rpx;
      }
    }
  }
}
</style>
