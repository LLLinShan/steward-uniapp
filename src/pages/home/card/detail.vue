<template>
  <view class="cardDetail">
    <view class="cardDetail-info">
      <u-row gutter="16" justify="space-between">
        <u-col span="3">
          <view class="cardDetail-name">姓名</view>
        </u-col>
        <u-col span="9">
          <view class="cardDetail-content">{{ detailInfo.name }}</view>
        </u-col>
      </u-row>
      <u-row gutter="16" justify="space-between">
        <u-col span="3">
          <view class="cardDetail-name">入住房屋</view>
        </u-col>
        <u-col span="9">
          <view class="cardDetail-content">{{ detailInfo.address }}</view>
        </u-col>
      </u-row>
      <u-row gutter="16" justify="space-between">
        <u-col span="3">
          <view class="cardDetail-name">登记时间</view>
        </u-col>
        <u-col span="9">
          <view class="cardDetail-content">{{ detailInfo.registerTime }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="cardDetail-list">
      <u-section title="门禁卡列表" :right="false" :show-line="false" font-size="32" />
      <u-line color="rgb(228, 231, 237)" />
      <view v-for="item in detailInfo.cardList" :key="item.cardNum" class="cardDetail-list__item">
        <u-row gutter="16" justify="space-between">
          <u-col span="3">
            <view class="cardDetail-name">卡号</view>
          </u-col>
          <u-col span="8">
            <view class="cardDetail-content">{{ item.cardNum }}</view>
          </u-col>
        </u-row>
        <u-row gutter="16" justify="space-between">
          <u-col span="3">
            <view class="cardDetail-name">下发状态</view>
          </u-col>
          <u-col span="8">
            <view class="cardDetail-content"
              >{{ $utils.getDicLabel('accessState', item.cardIssuingStatus) }}
            </view>
          </u-col>
        </u-row>
        <u-icon
          name="minus-circle-fill"
          size="40rpx"
          color="red"
          @click="onDelete(item.cardNum, item.cardType)"
        ></u-icon>
      </view>
      <view v-if="detailInfo.cardList.length === 0" class="cardDetail-list__item u-text-center">
        暂无门禁卡号
      </view>
    </view>
    <view class="cardDetail-btn">
      <u-button type="primary" @click="handleAddCard">添加</u-button>
    </view>
    <u-popup v-model="showPopup" mode="bottom" border-radius="16">
      <view class="cardDetail-pop">
        <view class="cardDetail-pop__item title"> 请选择 </view>
        <view class="cardDetail-pop__item" @click="goToScanCode">
          扫码添加
          <u-icon name="arrow-right" color="#C5C5C5" size="28"></u-icon>
        </view>
        <view class="cardDetail-pop__item" @click="goToInput">
          手动输入
          <u-icon name="arrow-right" color="#C5C5C5" size="28"></u-icon>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detailInfo: {},
      showPopup: false,
      accessStorage: {},
      delCurrent: {},
      cardIssuingStatus: {},
      isScaning: false,
      cardList: [],
      memberId: undefined,
      houseId: undefined
    }
  },
  onLoad() {
    // let asseee = uni.getStorageSync('accessDetail')
    // this.memberId = asseee.memberId
    // this.houseId = asseee.houseId
    // this.getAccessCardDetail()
  },
  onShow() {
    if (!this.isScaning) {
      this.getAccessCardDetail()
    } else {
      this.isScaning = false
    }
  },
  onHide() {
    console.log('隐藏', this.isScaning)
  },
  methods: {
    async getAccessCardDetail() {
      let asseee = uni.getStorageSync('accessDetail')
      let memberId = asseee.memberId
      let houseId = asseee.houseId
      const { result, data } = await this.$request.getAccessCardDetail({
        apiLoading: true,
        memberId: memberId,
        houseId: houseId
      })
      if (result === '1' && data !== null) {
        this.detailInfo = data
      }
    },
    // 处理添加卡号
    handleAddCard() {
      this.showPopup = true
    },
    // 删除门禁卡卡号
    onDelete(cardNum, cardType) {
      this.isScaning = false
      const _self = this
      // 确定删除门禁卡？
      uni.showModal({
        content: '是否确认删除门禁卡?',
        confirmColor: this.$Data().primaryColor,
        success: ({ confirm }) => {
          if (confirm) {
            _self.delCard(cardNum, cardType)
          }
        }
      })
    },
    // 回调函数
    async delCard(cardNum, cardType) {
      const params = {
        apiLoading: '删除中',
        personId: this.detailInfo.id,
        houseId: this.detailInfo.houseId,
        cardNum: cardNum,
        cardType: cardType
      }
      this.delCurrent = params
      const { result, message } = await this.$request.delAccessCard(params)
      if (result !== '1') return
      uni.showToast({
        title: message,
        icon: 'success'
      })
      this.detailInfo.cardList.map((el, index) => {
        if (el.cardNum === this.delCurrent.cardNum) {
          this.detailInfo.cardList.splice(index, 1)
          uni.showToast({
            title: '删除成功',
            duration: 2000
          })
          return false
        }
      })
    },
    // 添加
    goToAdd() {
      this.showPopup = true
    },
    // 扫码
    goToScanCode() {
      const self = this
      self.isScaning = true
      uni.scanCode({
        success: function (res) {
          self.showPopup = false
          //判断卡号是否有文字
          if (res.result.length <= 20) {
            uni.navigateTo({
              url: `/pages/home/card/manualInput?detailInfo=${JSON.stringify(
                self.detailInfo
              )}&cardNumber=${res.result}`
            })
            self.isScaning = false
          } else {
            uni.showToast({
              title: '卡号最多输入20位',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          console.log(res)
          self.isScaning = true
        }
      })
    },
    // 进入手动输入页面
    goToInput() {
      this.showPopup = false
      uni.navigateTo({
        url: `/pages/home/card/manualInput?detailInfo=${JSON.stringify(this.detailInfo)}`
      })
    },
    goIndex() {
      uni.navigateBack({
        url: `/pages/home/card/index`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cardDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  &-info {
    margin-top: 16rpx;
    background: #ffffff;
    padding: 20rpx 32rpx;
    ::v-deep .u-col {
      font-size: 32rpx;
      margin-bottom: 12rpx;
      word-break: break-all;
    }
  }
  &-list {
    margin-top: 16rpx;
    margin-bottom: 16rpx;
    background-color: #fff;
    &__item {
      padding: 20rpx 32rpx;
      border-bottom: 1px solid #eeeeee;
      position: relative;
    }
    ::v-deep .u-section {
      height: 104rpx;
      padding-left: 32rpx;
    }
    ::v-deep u-icon {
      display: inline !important;
      position: absolute;
      top: 50rpx;
      right: 20rpx;
    }
  }
  &-name {
    color: $u-content-color;
  }
  &-btn {
    @include leelen-bottom(90);
    margin: 54rpx 32rpx 0;
  }
  &-pop {
    height: 300rpx;
    &__item {
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      border-bottom: 1px solid #e7e7e7;
      font-size: 30rpx;
      color: #000000;
      position: relative;
      &.title {
        font-size: 34rpx;
        color: #999999;
      }
      &:last-child {
        border-bottom: none;
      }
      u-icon {
        position: absolute;
        top: 50%;
        right: 30rpx;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
