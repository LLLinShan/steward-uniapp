<template>
  <view>
    <u-navbar
      :title="navbarTitle"
      title-color="#333333"
      back-icon-color="#333333"
      :background="{ backgroundColor: '#ffffff' }"
    >
    </u-navbar>
    <view class="cardDetail">
      <view class="cardDetail-info">
        <u-row gutter="16" justify="space-between">
          <u-col span="3">
            <view class="cardDetail-name">姓名</view>
          </u-col>
          <u-col span="9">
            <view class="cardDetail-name">{{ detailInfo.name }}</view>
          </u-col>
        </u-row>
        <u-row gutter="16" justify="space-between">
          <u-col span="3">
            <view class="cardDetail-name">入住房屋</view>
          </u-col>
          <u-col span="9">
            <view class="cardDetail-name">{{ detailInfo.address }}</view>
          </u-col>
        </u-row>
      </view>
      <view class="cardDetail-list">
        <u-section title="门禁卡卡号" :right="false" :show-line="false" font-size="32" />
        <view class="cardDetail-list__item">
          <u-form :model="params" ref="form" :error-type="['toast']">
            <u-form-item prop="cardNumber" :border-bottom="false" label-width="0">
              <u-input
                v-model="params.cardNumber"
                type="text"
                maxlength="20"
                :clearable="false"
                placeholder="请输入卡号"
                :disabled="disabled"
              />
            </u-form-item>
          </u-form>
        </view>
        <u-line color="rgb(228, 231, 237)" />
      </view>
      <view class="cardDetail-btn">
        <u-button type="primary" @click="addCardNumber">确定添加</u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false,
      // cardNumber: '',
      navbarTitle: '手动输入门禁卡', // 标签名称
      detailInfo: {},
      disabled: false,
      params: {
        cardNumber: ''
      },
      rules: {
        cardNumber: [{ required: true, message: '请输入门禁卡号', max: 20, trigger: 'blur' }]
      }
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  onLoad(option) {
    this.detailInfo = JSON.parse(option.detailInfo)
    if (option.cardNumber) {
      this.params.cardNumber = option.cardNumber
      this.disabled = true
      this.navbarTitle = '添加门禁卡'
    }
  },
  methods: {
    // 确定添加卡号
    async addCardNumber() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.submit()
        }
      })
    },
    async submit() {
      const { result, message } = await this.$request.addAccessCard({
        apiLoading: '添加中',
        houseId: this.detailInfo.houseId,
        personId: this.detailInfo.id,
        cardNum: this.params.cardNumber,
        cardType: 1
      })
      if (result !== '1') return
      uni.showToast({
        title: message,
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack({
          url: `/pages/home/card/detail?memberId=+${this.detailInfo.id}&houseId=${this.detailInfo.houseId}`
        })
      }, 500)
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
  &-btn {
    margin: 54rpx 32rpx 0;
    @include leelen-bottom(50);
  }
}
</style>
