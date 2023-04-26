<template>
  <view class="page">
    <scroll-view class="page-form" scroll-y>
      <u-cell-group>
        <u-cell-item title="账号信息" :arrow="false" :title-style="cellItemStyle">
          <view class="page-title" @click="changeAccount(detailInfo)">账号变更</view>
        </u-cell-item>
        <u-cell-item
          title="姓名"
          :value="detailInfo.name || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="住家账号"
          :value="detailInfo.realPhone || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item
          title="账号类型"
          :value="$utils.getDicLabel('accountType', detailInfo.accountType)"
          :arrow="false"
        ></u-cell-item>
      </u-cell-group>
      <u-cell-group>
        <u-cell-item title="房屋信息" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
        <u-cell-item
          title="房屋地址"
          :value="detailInfo.address || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
        <u-cell-item title="楼层" :value="detailInfo.floor" :arrow="false"></u-cell-item>
      </u-cell-group>
      <u-cell-group>
        <u-cell-item title="业务功能" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
        <u-cell-item v-for="(item, index) in accountPermissionDTOList" :key="index" :arrow="false">
          <view slot="title"> {{ item.name }}</view>
          <u-switch slot="right-icon" v-model="item.permissionState"></u-switch>
        </u-cell-item>
      </u-cell-group>
    </scroll-view>
    <div class="page-button">
      <u-button type="error" :ripple="true" @click="onUnbind">解除住家</u-button>
      <u-button type="primary" :ripple="true" @click="onSave">保存功能</u-button>
    </div>
  </view>
</template>

<script>
export default {
  props: {
    // 账号
    realPhone: {
      type: String,
      default: ''
    },
    //房屋id
    houseId: {
      type: String,
      default: ''
    },
    //人员id
    memberId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cellItemStyle: {
        fontWeight: 'bold'
      },
      checked: false,
      loading: false, //加载
      // memberId: undefined, //人员id
      // houseId: undefined, //房屋id
      // realPhone: undefined, //账号
      detailInfo: {}, // 详情信息
      accountPermissionDTOList: []
    }
  },
  // onLoad: function ({ memberId, houseId, realPhone }) {
  //   this.memberId = memberId
  //   this.houseId = houseId
  //   this.realPhone = realPhone
  //   console.log('111111111')
  // },
  onShow() {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    if (currPage.data.isChange === 1) {
      this.realPhone = currPage.data.changeAccountValue
    }
    console.log('111111111')
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    // 获取人员详情
    async getDetail() {
      const { result, data } = await this.$request.getHouseholdAccountDetail({
        apiLoading: true,
        memberId: this.memberId,
        houseId: this.houseId,
        realPhone: this.realPhone
      })
      if (result !== '1') return
      this.accountPermissionDTOList = data.accountPermissionDTOList.map(value => {
        return {
          name: this.$utils.getDicLabel('neighPermSign', value.permissionSign),
          permissionSign: value.permissionSign,
          permissionState: value.permissionState === 1 ? true : false
        }
      })
      this.detailInfo = data
      if (data.floor && data.floor !== 0) {
        this.detailInfo.floor = '第' + data.floor + '层'
      } else if (data.floor === 0) {
        this.detailInfo.floor = '第0层'
      } else {
        this.detailInfo.floor = '--'
      }
    },
    async onSave() {
      let accountPermissionDTOList = this.accountPermissionDTOList.map(item => {
        return {
          permissionSign: item.permissionSign,
          permissionState: !item.permissionState ? 2 : 1
        }
      })
      const { result, message } = await this.$request.saveAccountPerm({
        memberId: this.memberId,
        houseId: this.houseId,
        realPhone: this.realPhone,
        accountPermissionDTOList: accountPermissionDTOList
      })
      if (result !== '1') {
        uni.showModal({
          content: message,
          showCancel: false,
          confirmText: '确定'
        })
        return
      }
      uni.showToast({
        title: message,
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 100)
    },
    // 删除人员事件
    onUnbind() {
      uni.showModal({
        content: '解绑住家后该账号将无法使用业务功能!',
        success: ({ confirm }) => {
          if (confirm) {
            this.onUnBindHome()
          }
        }
      })
    },
    // 解绑住家请求
    async onUnBindHome() {
      this.loading = true
      const { result, message } = await this.$request
        .unbindHome({
          apiLoading: true,
          realPhone: this.realPhone,
          memberId: this.memberId,
          houseId: this.houseId
        })
        .finally(() => {
          this.loading = false
        })
      if (result !== '1') {
        uni.showModal({
          content: message,
          showCancel: false,
          confirmText: '确定'
        })
        return
      }
      uni.showToast({
        title: message,
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 100)
    },
    changeAccount({ memberId, houseId, realPhone, accountType }) {
      uni.navigateTo({
        url: `/pages/home/houseHold/changeAccount?memberId=${memberId}&houseId=${houseId}&realPhone=${realPhone}&accountType=${accountType}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  padding-top: 16rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
  &-form {
    height: 0;
    flex: 1;
    ::v-deep .u-cell_title {
      color: $u-content-color !important;
      display: flex;
      align-self: flex-start;
    }
    ::v-deep .u-cell__value {
      color: $u-main-color !important;
    }
  }
  &-title {
    display: block;
    color: $u-type-primary;
  }
  &-button {
    @include leelen-bottom(32);
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 16rpx;
    padding-top: 32rpx;
    background: #fff;
    u-button {
      width: 250rpx;
      margin-right: 20rpx;
    }
  }
}
</style>
