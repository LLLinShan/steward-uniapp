<template>
  <view class="login">
    <view>
      <u-image
        class="login-logo"
        mode="widthFix"
        width="160"
        height="160"
        :src="require('img/logo.png')"
      />
      <view class="login-app">立林智慧管家</view>
    </view>
    <u-form :model="params" ref="form" :error-type="['message']">
      <u-form-item prop="phone" :border-bottom="false" label-width="0">
        <u-input
          v-model="params.phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号码"
          height="68"
        />
      </u-form-item>
      <u-form-item prop="verifyCode" :border-bottom="false" label-width="0">
        <u-input
          v-model="params.verifyCode"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
          height="68"
        />
        <u-verification-code
          start-text="发送验证码"
          change-text="Xs"
          ref="uCode"
          unique-key="manulLogin"
          @end="waitCountDown = false"
          keep-running
          @change="codeChange"
        />
        <view
          slot="right"
          @click="getCaptcha"
          class="login-captcha"
          :class="{ 'login-captcha__await': waitCountDown }"
          >{{ tips }}</view
        >
      </u-form-item>
    </u-form>
    <u-button ripple type="primary" @click="bind" :disabled="lock">登录</u-button>
    <view class="login-agreement">
      登录即代表您同意
      <navigator url="/pages/webview/index?type=0" hover-class="none">《用户协议》</navigator>
      与
      <navigator url="/pages/webview/index?type=1" hover-class="none">《隐私政策》</navigator>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { matchMobile } from '_u/regExp'

export default {
  data() {
    return {
      params: {
        phone: uni.getStorageSync('phone'),
        verifyCode: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: matchMobile, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' },
          { min: 6, message: '请输入6位验证码', trigger: 'blur' }
        ]
      },
      tips: '',
      waitCountDown: false,
      lock: false
    }
  },
  computed: {
    ...mapState({
      phone: state => state.user.phone,
      defaultPath: state => state.app.defaultPath,
      companyNo: state => state.user.companyNo,
      neighNo: state => state.user.neighNo
    })
  },
  onShow() {
    if (this.phone) uni.switchTab({ url: '/pages/home/index' })
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  methods: {
    // 获取验证码
    async getCaptcha() {
      if (this.waitCountDown) {
        uni.showToast({
          icon: 'none',
          title: '倒计时结束后再发送'
        })
      } else {
        if (matchMobile.test(this.params.phone)) {
          uni.setStorageSync('phone', this.params.phone)
          const res = await this.$request.sendCode({ phone: this.params.phone })
          if (res.result === '1') {
            uni.showToast({ title: res.msg })
            this.$refs.uCode.start()
          }
        } else {
          uni.showToast({
            icon: 'none',
            title: this.params.phone ? '请输入正确的手机号码' : '请输入11位手机号码'
          })
        }
      }
    },
    // 监听验证码按钮
    codeChange(text) {
      if (text !== '发送验证码') this.waitCountDown = true
      this.tips = text
    },
    // 绑定
    async bind() {
      this.lock = true
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await this.$request.manulBind(this.params)
          if (res.result === '1') {
            this.$store.commit('SET_USERINFO', this.params)
            // 登录后如果是扫码的运营号，则记录
            if (this.companyNo && !this.neighNo) {
              this.$request.setLastCompanyNo({ companyNo: this.companyNo })
            }
            await this.$store.dispatch('GetNeighList')
            uni[this.$store.getters.defaultPageLocateType]({ url: this.defaultPath })
          }
        }
        this.lock = false
      })
    }
  }
}
</script>

<style>
page {
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 100rpx;
  &-logo {
    width: 160rpx;
    height: 160rpx;
    ::v-deep .u-image {
      margin: 0 auto;
    }
  }
  &-app {
    margin: 24rpx 0;
    font-size: 28rpx;
  }
  &-agreement {
    padding-bottom: 100rpx;
    margin-top: 24rpx;
    font-size: 26rpx;
    color: $u-tips-color;
    navigator {
      color: $u-type-primary;
      display: inline-block;
    }
  }
  ::v-deep .u-btn {
    width: 680rpx;
    margin-top: 28rpx;
    &--default {
      &::after {
        border: none;
      }
    }
  }
  &-captcha {
    height: 68rpx;
    line-height: 68rpx;
    color: $u-type-primary;
    &__await {
      color: $u-tips-color;
    }
  }
  ::v-deep .u-form {
    width: 680rpx;
    .u-form-item {
      &__body {
        background-color: #f3f5f5;
        padding: 10rpx 30rpx;
        border-radius: 12rpx;
        overflow: hidden;
        .u-input__input {
          font-size: 28rpx !important;
        }
      }
      &__message {
        text-indent: 30rpx;
      }
    }
  }
}
</style>
