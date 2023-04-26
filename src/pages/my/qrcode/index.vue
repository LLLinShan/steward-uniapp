<template>
  <page-loading v-if="pageLoading" />
  <view v-else class="pass">
    <view class="pass-content">
      <u-cell-group>
        <u-cell-item
          title="人员登记"
          :arrow="false"
          :title-style="{ fontWeight: 'bold' }"
        ></u-cell-item>
      </u-cell-group>
      <view class="pass-section">
        <view class="pass-section__title">微信扫一扫</view>
        <u-image
          width="400rpx"
          height="400rpx"
          v-if="url"
          :src="url"
          @click="onPreview([url])"
        ></u-image>
        <u-image
          width="400rpx"
          height="400rpx"
          v-else
          :src="require('img/home/defaultPicture.png')"
        ></u-image>
      </view>
      <view class="pass-section">
        <view class="pass-section__title">{{ neighName }}</view>
      </view>
      <view class="pass-explain">
        <u-line />
        <view style="padding-top: 24rpx; font-weight: 700">使用说明</view>
        <view style="padding-bottom: 24rpx"
          >1、点击保存二维码或查看二维码长按分享<br />2、适用于当前楼栋入住人员扫码登记</view
        >
      </view>
    </view>
    <u-button ripple class="pass-button" v-if="url" @click="downloadImg">保存二维码</u-button>
    <u-tabbar :list="tabbar" :mid-button="true" :mid-button-size="160" />
  </view>
</template>
<script>
import { mapState } from 'vuex'
import PageLoading from '_c/pageLoading'
export default {
  components: {
    PageLoading
  },
  data() {
    return {
      pageLoading: true,
      url: undefined,
      passcode: {
        qrcode: undefined,
        passcode: undefined,
        facecode: undefined
      }
    }
  },
  computed: {
    ...mapState({
      neighName: state => state.user.neighName,
      tabbar: state => state.user.tabbar
    })
  },
  onShow() {
    this.getQR()
  },
  methods: {
    // 获取人员列表
    async getQR() {
      const { result, data } = await this.$request.neighHouseholdRegister()
      if (result === '1') {
        this.url = data
      }
      this.pageLoading = false
    },
    /**
     * 预览图片
     * @param {String} urls 图片地址
     */
    onPreview(urls) {
      uni.previewImage({
        urls
      })
    },
    // 点击下载图片事件
    downloadImg() {
      uni.showLoading({ title: '加载中...' })
      //wx.downloadFile方法：下载文件资源到本地
      uni.downloadFile({
        url: this.url, //图片地址
        success: res => {
          //wx.saveImageToPhotosAlbum方法：保存图片到系统相册
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath, //图片文件路径
            success: () => {
              uni.hideLoading()
              uni.showToast({ title: '保存成功', duration: 1500 })
            },
            // 接口调用失败的回调函数
            fail: err => {
              if (
                err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' ||
                err.errMsg === 'saveImageToPhotosAlbum:fail auth deny' ||
                err.errMsg === 'saveImageToPhotosAlbum:fail authorize no response'
              ) {
                uni.showModal({
                  title: '提示',
                  content: '需要您授权保存相册',
                  modalType: false,
                  success: () => {
                    uni.openSetting({
                      success(settingdata) {
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          uni.showModal({
                            title: '提示',
                            content: '获取权限成功,再次点击图片即可保存',
                            showCancel: false,
                            confirmText: '确定',
                            confirmColor: this.$Data().primaryColor
                          })
                        } else {
                          uni.showModal({
                            title: '提示',
                            content: '获取权限失败，将无法保存到相册哦~',
                            showCancel: false,
                            confirmText: '确定',
                            confirmColor: this.$Data().primaryColor
                          })
                        }
                      },
                      fail(failData) {
                        console.log('failData', failData)
                      },
                      complete(finishData) {
                        console.log('finishData', finishData)
                      }
                    })
                  }
                })
              }
            },
            complete() {
              uni.hideLoading() //隐藏 loading 提示框
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pass {
  background-color: #22c1c7;
  text-align: center;
  overflow: hidden;
  display: flex;
  height: 100vh;
  flex-direction: column;
  &-content {
    margin: 16pt;
    border-radius: 16rpx;
    background-color: #fff;
    height: 0;
    flex: 1;
    overflow-x: hidden;
  }
  &-head {
    padding: 24rpx 32rpx;
    line-height: 40rpx;
  }
  &-section {
    margin: 32rpx;
    &__title {
      font-size: 32rpx;
    }
    &__subtitle {
      color: $u-tips-color;
      margin-top: 14rpx;
      height: 40rpx;
      line-height: 40rpx;
    }
  }
  &-code {
    color: #1fc6cc;
    font-size: 54rpx;
    height: 76rpx;
    line-height: 76rpx;
    font-weight: bold;
    margin-top: 14rpx;
  }
  &-img ::v-deep image {
    border-radius: 10rpx !important;
    overflow: hidden;
  }
  ::v-deep .u-image {
    margin: 24rpx auto 0;
  }
  &-explain {
    text-align: left;
    padding: 0 32rpx;
    line-height: 58rpx;
    z-index: 1;
    background-color: #fff;
    border-radius: 16rpx;
    font-size: 32rpx;
  }
  &-button {
    // @include leelen-bottom();
    background-color: #fff;
    ::v-deep .u-btn {
      height: 104rpx !important;
      border-radius: 0;
      color: $u-type-primary;
      &::after {
        display: none;
      }
    }
  }
}
</style>
