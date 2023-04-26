<template>
  <view class="page">
    <view class="page-form">
      <u-form ref="form" :error-type="['toast']" label-width="220" :model="params">
        <u-form-item prop="accountNew" label="账号">
          <u-input
            placeholder="请输入姓名"
            maxlength="11"
            type="number"
            trim
            :clearable="false"
            v-model="params.accountNew"
          />
        </u-form-item>
        <u-form-item prop="identityTypeName" label="账号类型">
          <u-input
            placeholder="请选择账号类型"
            type="select"
            :disabled="disabled"
            :value="params.accountTypeName"
            @click="identityTypePicker = true"
          />
          <common-select
            type="accountType"
            title="账号类型"
            v-model="identityTypePicker"
            @confirm="confirmIdentityType"
          />
        </u-form-item>
      </u-form>
    </view>
    <view class="page-button">
      <u-button type="primary" :ripple="true" :loading="loading" @click="onSubmit">保存</u-button>
    </view>
  </view>
</template>

<script>
import commonSelect from '_c/commonSelect'
import { matchMobile } from '_u/regExp'
import { mapState } from 'vuex'
export default {
  components: {
    commonSelect
  },
  computed: {
    ...mapState({
      dic: state => state.user.dic
    }),
    hasPicker() {
      return this.identityTypePicker
    }
  },
  watch: {
    hasPicker(val) {
      if (val) {
        this.disabled = true
        uni.hideKeyboard()
      } else this.disabled = false
    }
  },
  data() {
    return {
      disabled: false,
      params: {
        accountTypeName: undefined,
        accountType: undefined,
        accountNew: undefined
      },
      identityTypePicker: false,
      memberId: undefined, //人员id
      houseId: undefined, //房屋id
      accountOrigin: undefined, //原账号
      realPhone: undefined,
      rules: {
        accountNew: [
          {
            required: false,
            message: '请输入手机号码',
            trigger: ['blur', 'change']
          },
          { pattern: matchMobile, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  onLoad: function ({ memberId, houseId, realPhone, accountType }) {
    this.memberId = memberId
    this.houseId = houseId
    this.accountOrigin = realPhone
    this.realPhone = realPhone
    this.params.accountType = Number(accountType)
    this.params.accountNew = realPhone
    if (Number(accountType) === 1) this.params.accountTypeName = '主账号'
    else this.params.accountTypeName = '子账号'
  },
  methods: {
    /**
     * 账号类型确定
     * @param {Arrray} arr 已选的账号类型
     */
    confirmIdentityType(arr) {
      if (arr[0].value === '1') {
        uni.showModal({
          content: '切换后原主账号将变为子账号',
          showCancel: false,
          confirmText: '确定'
        })
      }
      this.params = {
        ...this.params,
        accountTypeName: arr[0]?.label,
        accountType: arr[0]?.value
      }
    },
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { result, data, message } = await this.$request.changeAccount({
            apiLoading: true,
            memberId: this.memberId,
            houseId: this.houseId,
            accountOrigin: this.accountOrigin,
            accountNew: this.params.accountNew,
            accountType: Number(this.params.accountType)
          })
          if (result !== '1') return
          console.log(data)
          uni.showToast({
            title: message,
            duration: 2000
          })
          let pages = getCurrentPages()
          let prevPage = pages[pages.length - 2]
          prevPage.setData({
            isChange: 1,
            changeAccountValue: this.params.accountNew
          })
          uni.navigateBack()
        }
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
    padding: 0 32rpx;
    background: #ffffff;
    ::v-deep .u-form-item--left {
      min-width: 220rpx !important;
    }
    ::v-deep .u-form-item--left__content {
      color: $u-content-color;
    }
    ::v-deep .u-input__input {
      color: $u-tips-color;
    }
    &__photo {
      ::v-deep .u-form-item__body {
        flex-direction: column !important;
      }
      ::v-deep .u-form-item--left {
        flex: 1 !important;
        width: 220rpx;
      }
    }
    &__card {
      display: flex;
    }
    &__tip {
      color: $u-tips-color;
      font-size: 24rpx;
      margin: 0 10rpx;
    }
  }
  &-button {
    @include leelen-bottom(32);
    margin-top: 30rpx;
    ::v-deep .u-btn {
      margin: 0 30rpx;
    }
  }
  .tips {
    margin-top: 20rpx;
    margin-left: 20rpx;
    font-size: 24rpx;
    color: #999;
  }
}
</style>
