<template>
  <page-loading v-if="pageLoading" />

  <view v-else class="apply apply--flex apply--flex-column">
    <scroll-view scroll-y class="apply--flex-1" style="height: 0">
      <view class="apply-group">
        <view class="apply-group__body">
          <u-cell-group :border="false">
            <u-cell-item title="房号" :arrow="false" :value="houseInfo.address"></u-cell-item>
          </u-cell-group>
        </view>
      </view>

      <view class="apply-group">
        <view class="apply-group__header">居住人信息</view>
        <view class="apply-group__body apply--pl-32" v-if="houseInfo.renewHouseholdList.length > 0">
          <u-checkbox-group wrap shape="circle" class="tenant">
            <u-checkbox
              class="tenant-item apply--flex"
              icon-size="25"
              size="40"
              label-disabled
              :active-color="$Data().primaryColor"
              v-for="item in houseInfo.renewHouseholdList"
              :key="item.memberId"
              v-model="item.checked"
            >
              <view class="apply--flex-1 apply--flex">
                <view class="tenant-item__avatar" @click.stop>
                  <u-image
                    width="96rpx"
                    height="108rpx"
                    border-radius="8rpx"
                    :src="item.szPhotoPath"
                    :error-icon="require('img/home/defaultPhoto.png')"
                    @click.stop="handelPreview(item.szPhotoPath)"
                  ></u-image>
                </view>
                <view class="apply--flex-1 apply--flex apply--flex-sb" @click="toDetail(item)">
                  <view class="tenant-item__name u-line-1">{{ item.name }}</view>
                  <view class="tenant-item__datetimes" v-if="item.rentStartTime"
                    >{{ item.rentStartTime }}至{{ item.rentEndTime }}</view
                  >
                </view>
              </view>
            </u-checkbox>
          </u-checkbox-group>
        </view>
        <u-empty class="apply-group__body apply--pl-32" v-else />
      </view>
    </scroll-view>

    <view class="apply-submit">
      <u-button class="apply-submit__btn" type="primary" @click="handelSubmit"> 提交 </u-button>
    </view>
  </view>
</template>

<script>
import PageLoading from '_c/pageLoading'
export default {
  components: {
    PageLoading
  },
  data() {
    return {
      pageLoading: true,
      params: {
        renewHouseholdList: [] // 居住人信息
      },
      // 居住人信息
      houseInfo: {
        renewHouseholdList: []
      },
      houseId: undefined,
      structId: undefined
    }
  },
  onLoad: function ({ houseId, structId, houseName }) {
    this.houseId = houseId
    this.structId = structId
    this.houseName = houseName
    this.getHouseInfo()
  },
  methods: {
    // 请求租户数据
    async getHouseInfo() {
      const res = await this.$request.getHouseRentalInfo({
        houseId: this.houseId
      })
      if (res.result === '1') {
        res.data.renewHouseholdList = res.data.renewHouseholdList.map(item => {
          item.checked = false
          return item
        })
        this.houseInfo = res.data
      }
      this.pageLoading = false
    },
    // 图片预览
    handelPreview(url) {
      url &&
        uni.previewImage({
          urls: [url]
        })
    },
    // 提交表单
    handelSubmit() {
      const renewHouseholdList = this.houseInfo.renewHouseholdList
        .filter(item => item.checked)
        .map(item => {
          return {
            memberId: item.memberId
          }
        })
      const that = this
      // 判断下有没有选择居住人
      if (!renewHouseholdList.length) {
        return uni.showToast({
          icon: 'none',
          mask: true,
          title: '请选择退租人员'
        })
      } else {
        uni.showModal({
          content: '确认为选择住户退租？',
          showCancel: true,
          confirmText: '确定',
          confirmColor: '#4277FF',
          success: res => {
            if (res.confirm) {
              that.batchUnRentApply(renewHouseholdList)
            }
          }
        })
      }
    },
    async batchUnRentApply(renewHouseholdList) {
      this.params.renewHouseholdList = renewHouseholdList
      const res = await this.$request.batchUnRentApply({
        unRentHouseholdList: renewHouseholdList,
        houseId: this.houseId
      })
      if (res.result !== '1') {
        uni.showModal({
          content: res.message,
          showCancel: false,
          confirmText: '确定'
        })
        return
      }
      uni.showToast({
        icon: 'none',
        mask: true,
        title: res.message
      })
      const pages = getCurrentPages()
      const num = pages.length
      //当前页面栈总数
      let backnum
      //需要返回的页数
      for (let i = 0; i < num; i++) {
        //循环找到指定页面路由所在的页数
        if (pages[i].route === 'pages/home/house/detail') {
          backnum = num - i - 1
        }
      }
      uni.navigateBack({
        delta: backnum
      })
    },
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/home/manage/detail?memberId=${item.memberId}&houseId=${this.houseId}&rerent=0`
      })
    }
  },
  created() {
    this.params = {
      renewHouseholdList: [] // 居住人信息
    }
    // 居住人信息
    this.houseInfo = {
      renewHouseholdList: []
    }
  }
}
</script>

<style lang="scss" scoped>
.apply {
  height: 100%;
  &--flex {
    display: flex;
    &-column {
      flex-direction: column;
    }
    &-sb {
      flex-direction: column;
      justify-content: Space-between;
    }
    &-1 {
      flex: 1;
    }
  }
  &--pl-32 {
    padding-left: 32rpx;
  }
  &--pr-32 {
    padding-right: 32rpx;
  }
  &--b-b {
    border-bottom: 1rpx solid #eeeeee;
  }
  &--b-t {
    border-top: 1rpx solid #eeeeee;
  }
  &-group {
    background: #fff;
    margin-bottom: 16rpx;
    &__header {
      height: 104rpx;
      line-height: 104rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      border-bottom: 1rpx solid #eeeeee;
      padding-left: 32rpx;
    }
    ::v-deep .u-checkbox__label {
      flex: 1;
      margin: 0;
    }
  }
  // 居住人信息
  .tenant {
    &-item {
      border-bottom: 1rpx solid #eeeeee;
      padding: 24rpx 0;
      &:last-child {
        border-bottom: none;
      }
      &__avatar {
        margin: 0 30rpx 0 32rpx;
      }
      &__name {
        font-size: 32rpx;
        line-height: 36rpx;
        color: #333333;
      }
      &__datetimes {
        font-size: 28rpx;
        line-height: 40rpx;
        color: #999999;
      }
    }
  }
  // 续租情况
  .continue {
    padding-right: 8rpx;
    &__title {
      font-size: 32rpx;
      height: 100rpx;
      line-height: 100rpx;
      color: #333333;
      &--mt {
        margin-top: 8rpx;
      }
    }
    &__textarea {
      position: relative;
      &__total {
        position: absolute;
        right: 52rpx;
        bottom: 42rpx;
        color: #999999;
        font-size: 28rpx;
        line-height: 1;
        text {
          color: #333333;
        }
      }
    }
    &__content {
      padding-bottom: 30rpx;
    }
    &__list {
      display: flex;
      flex-wrap: wrap;
      gap: 24rpx;
    }
    &__item {
      width: calc(100% / 3 - 16rpx);
      height: 60rpx;
      line-height: 60rpx;
      background: #efefef;
      transition: all 0.3s;
      border-radius: 8rpx;
      text-align: center;
      font-size: 24rpx;
      color: #333333;
      &--active {
        background: #00c8cf;
        color: #fff;
        transition: all 0.3s;
      }
    }
  }
  &-submit {
    background: #fff;
    padding: 32rpx;
    @include leelen-bottom(32);
    margin-top: 22rpx;
  }
}
</style>
