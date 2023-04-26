<template>
  <view class="page">
    <u-form
      class="page-form"
      ref="form"
      :error-type="['toast']"
      label-width="220"
      :model="detailInfo"
    >
      <u-form-item prop="name">
        <u-input
          placeholder="请输入标题"
          maxlength="20"
          trim
          :clearable="false"
          :disabled="detailInfo.status === 2 || detailInfo.status === 3"
          v-model="detailInfo.title"
        />
      </u-form-item>
      <u-form-item prop="content" class="content-input">
        <u-input
          placeholder="请输入发布内容"
          maxlength="500"
          type="textarea"
          height="300"
          trim
          :disabled="detailInfo.status === 2 || detailInfo.status === 3"
          :clearable="false"
          v-model="detailInfo.content"
        />
        <view class="input-tip">
          <text class="input-tip__length">{{ detailInfo.content.length || 0 }}</text
          >/500
        </view>
      </u-form-item>
      <u-form-item class="page-form__photo" label="封面图">
        <div v-if="detailInfo.status === 2 || detailInfo.status === 3">
          <div class="page-form__card">
            <u-image
              width="144"
              height="144"
              v-if="detailInfo.coverImage && detailInfo.coverImage[0].url !== ''"
              :src="detailInfo.coverImage[0].url"
              @click="previewImage([detailInfo.coverImage[0].url])"
            />
            <u-image
              width="144"
              height="144"
              v-else
              :src="require('img/home/defaultPicture.png')"
            />
          </div>
        </div>
        <div v-else>
          <div class="page-form__card">
            <common-upload :maxSize="5 * 1024 * 1024" v-model="detailInfo.coverImage" />
          </div>
          <span class="page-form__tip">支持jpg格式，单张不超过5M</span>
        </div>
      </u-form-item>
    </u-form>
    <div v-if="detailInfo.status !== 3">
      <div class="page-onebtn" v-if="detailInfo.status === 2">
        <u-button type="primary" :ripple="true" @click="onCancel">撤销</u-button>
      </div>
      <div class="page-morebtn" v-else>
        <u-button type="error" :ripple="true" @click="release(4)">删除</u-button>
        <u-button type="primary" :ripple="true" @click="release(1)">保存</u-button>
        <u-button type="primary" :ripple="true" @click="release(2)">发布</u-button>
      </div>
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
      id: undefined,
      detailInfo: {} // 详情信息
    }
  },
  watch: {
    'detailInfo.content'(newVal) {
      if (newVal && newVal.length) {
        this.detailInfo.content = newVal.slice(0, 500)
      }
    }
  },
  onLoad: function ({ id }) {
    this.id = id
    this.getDetail()
  },
  methods: {
    // 获取信息详情
    async getDetail() {
      const { result, data } = await this.$request.infoDetail({
        apiLoading: true,
        id: this.id
      })
      if (result !== '1') return
      this.detailInfo = {
        id: data.id,
        content: data.content,
        title: data.title,
        status: data.status,
        coverImage: [{ url: data.coverImage, fileName: data.coverImage }]
      }
    },
    // 1：存草稿 2:发布
    async release(status) {
      if (!this.detailInfo.title) {
        uni.showToast({
          title: '请输入标题',
          icon: 'none'
        })
        return
      }
      if (!this.detailInfo.content) {
        uni.showToast({
          title: '请输入发布内容',
          icon: 'none'
        })
        return
      }
      const { result } = await this.$request.infoUpdate({
        apiLoading: true,
        ...this.detailInfo,
        coverImage: this.detailInfo.coverImage?.[0]?.url ?? undefined,
        status: status
      })
      if (result !== '1') return
      let message = undefined
      if (status === 1) {
        message = '保存成功'
      } else if (status === 2) {
        message = '保存发布成功'
      } else if (status === 3) {
        message = '撤销成功'
      } else {
        message = '删除成功'
      }
      uni.showToast({
        title: message,
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 300)
    },
    onCancel() {
      const _self = this
      // 确定撤销当前公告？
      uni.showModal({
        content: '确认撤销当前公告?',
        confirmColor: this.$Data().primaryColor,
        success: ({ confirm }) => {
          if (confirm) {
            _self.release(3)
          }
        }
      })
    },
    //预览大图
    previewImage(urls) {
      uni.previewImage({
        urls
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
  &-onebtn {
    @include leelen-bottom(32);
    justify-content: center;
    width: 100%;
    padding-top: 32rpx;
    background: #ffffff;
    ::v-deep .u-btn {
      margin: 0 30rpx;
    }
  }
  &-morebtn {
    @include leelen-bottom(32);
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 32rpx;
    background: #ffffff;
    u-button {
      width: 250rpx;
      margin-right: 20rpx;
    }
    u-button:first-child {
      width: 150rpx;
    }
    u-button:last-child {
      margin-right: 0;
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
