<template>
  <view class="page">
    <u-form class="page-form" ref="form" :error-type="['toast']" label-width="220" :model="params">
      <u-form-item>
        <u-input
          placeholder="请输入标题,必填"
          maxlength="15"
          trim
          :clearable="false"
          v-model="params.title"
        />
      </u-form-item>
      <u-form-item class="content-input">
        <u-input
          placeholder="请输入发布内容,必填"
          maxlength="500"
          type="textarea"
          height="300"
          trim
          :clearable="false"
          v-model="params.content"
        />
        <view class="input-tip">
          <text class="input-tip__length">{{ params.content.length || 0 }}</text
          >/500
        </view>
      </u-form-item>
      <u-form-item class="page-form__photo" label="封面图">
        <div class="page-form__card">
          <common-upload :maxSize="5 * 1024 * 1024" v-model="params.coverImage" />
        </div>
        <span class="page-form__tip">支持jpg格式，单张不超过5M</span>
      </u-form-item>
    </u-form>
    <div class="page-button">
      <u-button type="primary" :ripple="true" @click="release(1)">存草稿</u-button>
      <u-button type="primary" :ripple="true" @click="release(2)">发布</u-button>
    </div>
  </view>
</template>
<script>
import commonUpload from '_c/upload'
export default {
  components: {
    commonUpload
  },
  data() {
    return {
      params: {
        title: undefined,
        content: undefined,
        coverImage: undefined
      }
    }
  },
  watch: {
    'params.content'(newVal) {
      if (newVal && newVal.length) {
        this.params.content = newVal.slice(0, 500)
      }
    }
  },
  methods: {
    // 1：存草稿 2:发布
    async release(status) {
      if (!this.params.title) {
        uni.showToast({
          title: '请输入标题',
          icon: 'none'
        })
        return
      }
      if (!this.params.content) {
        uni.showToast({
          title: '请输入发布内容',
          icon: 'none'
        })
        return
      }
      const { result } = await this.$request.infoAdd({
        apiLoading: true,
        ...this.params,
        coverImage: this.params.coverImage?.[0]?.url ?? undefined,
        status: status
      })
      if (result !== '1') return
      let message = undefined
      if (status === 1) message = '保存成功'
      else message = '保存发布成功'
      uni.showToast({
        title: message,
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 300)
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
    // ::v-deep .u-form-item--left {
    //   min-width: 220rpx !important;
    // }
    // ::v-deep .u-form-item--left__content {
    //   color: $u-content-color;
    // }
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 30rpx;
    u-button {
      width: 250rpx;
    }
    u-button:first-child {
      margin-right: 20rpx;
    }
  }
  .tips {
    margin-top: 20rpx;
    margin-left: 20rpx;
    font-size: 24rpx;
    color: #999;
  }
}
.content-input {
  background: #fff;
  position: relative;
  ::v-deep .u-input__textarea {
    margin: 16rpx 0 64rpx 0 !important;
    padding: 0 !important;
    line-height: 35rpx;
    max-height: 300rpx;
    height: auto !important;
    overflow-y: scroll;
  }
  ::v-deep .u-form-item--left {
    align-items: flex-start !important;
  }
  .input-tip {
    font-size: 28rpx;
    color: $u-tips-color;
    position: absolute;
    bottom: 0rpx;
    right: 32rpx;
    .input-tip__length {
      color: #00c8cf;
    }
  }
}
</style>
