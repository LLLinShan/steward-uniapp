<template>
  <view class="apply apply--flex apply--flex-column">
    <scroll-view scroll-y class="apply--flex-1" style="height: 0">
      <view class="apply-group" v-if="houseInfo.auditStatus !== '0'">
        <view class="apply-group__body">
          <u-cell-group :border="false">
            <u-cell-item
              title="审核结果"
              :arrow="false"
              :value="$utils.getDicLabel('auditStatus', houseInfo.auditStatus)"
            ></u-cell-item>
            <u-cell-item
              v-if="houseInfo.auditStatus === '2'"
              :border-bottom="false"
              title="驳回原因"
              :arrow="false"
              :value="houseInfo.rejection || $Data().defaultStr"
            ></u-cell-item>
            <u-cell-item
              :border-bottom="false"
              title="审核时间"
              :arrow="false"
              :value="houseInfo.auditTime || $Data().defaultStr"
            ></u-cell-item>
          </u-cell-group>
        </view>
      </view>

      <view class="apply-group">
        <view class="apply-group__header"> 入住房屋</view>
        <view class="apply-group__body">
          <u-cell-group :border="false">
            <u-cell-item
              title="居住地址"
              :arrow="false"
              :value="houseInfo.neighName || $Data().defaultStr"
            ></u-cell-item>
            <u-cell-item
              :border-bottom="false"
              title="房屋名称"
              :arrow="false"
              :value="houseInfo.houseAddress || $Data().defaultStr"
            ></u-cell-item>
          </u-cell-group>
        </view>
      </view>
      <view class="apply-group">
        <view class="apply-group__header"> 申请人信息</view>
        <view class="apply-group__body">
          <u-cell-group :border="false">
            <u-cell-item
              title="姓名"
              :arrow="false"
              :value="houseInfo.applyName || $Data().defaultStr"
            ></u-cell-item>
            <u-cell-item
              :border-bottom="false"
              title="账号"
              :arrow="false"
              :value="houseInfo.applyAccount || $Data().defaultStr"
            ></u-cell-item>
          </u-cell-group>
        </view>
      </view>

      <view class="apply-group">
        <view class="apply-group__header"> 续租人员信息</view>
        <view class="apply-group__body">
          <view
            class="tenant-item apply--flex"
            icon-size="25"
            size="40"
            :active-color="$Data().primaryColor"
            v-for="item in houseInfo.renewHouseholdDetailList"
            :key="item.id"
            @click="goDetail(item.personId, item.houseId, item.exist)"
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
              <view class="apply--flex-1 apply--flex apply--flex-sb">
                <view class="tenant-item__name u-line-1">{{
                  item.name || $Data().defaultStr
                }}</view>
                <view class="tenant-item__datetimes"
                  >{{ item.rentStartTime || $Data().defaultStr }}至{{
                    item.rentEndTime || $Data().defaultStr
                  }}</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="apply-group">
        <view class="apply-group__header">续租情况</view>
        <view class="apply-group__body">
          <u-cell-group :border="false">
            <u-cell-item
              title="续租时间"
              :arrow="false"
              :value="houseInfo.renewDateDetail || $Data().defaultStr"
            ></u-cell-item>
            <u-cell-item
              :border-bottom="false"
              title="续租说明"
              :arrow="false"
              :value="houseInfo.renewDescription || $Data().defaultStr"
            ></u-cell-item>
            <u-cell-item
              :border-bottom="false"
              title="申请时间"
              :arrow="false"
              :value="houseInfo.applyTime || $Data().defaultStr"
            ></u-cell-item>
          </u-cell-group>
        </view>
      </view>
    </scroll-view>

    <view class="apply-submit" v-if="houseInfo.auditStatus === '0'">
      <u-button class="apply-submit__btn" type="error" @click="showSubmit = true">驳回</u-button>
      <u-button class="apply-submit__btn" type="primary" @click="handelSubmit"> 通过 </u-button>
    </view>

    <u-modal
      v-model="showSubmit"
      title="驳回原因"
      @confirm="onReject"
      @cancel="onCancel"
      :show-cancel-button="true"
    >
      <view class="apply-reject">
        <u-input
          v-model="rejection"
          type="textarea"
          maxlength="100"
          :customStyle="inputStyle"
          height="256"
          :clearable="false"
        ></u-input>
        <view class="input-tip">
          <text class="input-tip__length">{{ tipText }}</text
          >/100
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 居住人信息
      houseInfo: {
        renewHouseholdDetailList: []
      },
      auditId: undefined,
      rejection: '',
      showSubmit: false
    }
  },
  computed: {
    tipText() {
      return this.rejection.length < 100 ? this.rejection.length : 100
    }
  },
  onLoad({ auditId }) {
    this.auditId = auditId
    this.getHouseInfo()
  },
  methods: {
    // 请求租户数据
    async getHouseInfo() {
      const res = await this.$request.renewApplyDetail({
        id: this.auditId
      })
      if (res.result === '1') {
        this.houseInfo = res.data
      }
    },
    // 图片预览
    handelPreview(url) {
      url &&
        uni.previewImage({
          urls: [url]
        })
    },
    async onReject() {
      const res = await this.$request.renewAudit({
        id: this.auditId,
        auditStatus: '2',
        dataVersion: this.houseInfo.dataVersion,
        rejection: this.rejection
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
      setTimeout(() => {
        uni.navigateBack()
      }, 300)
    },
    onCancel() {
      this.rejection = ''
    },
    // 提交表单
    async handelSubmit() {
      const res = await this.$request.renewAudit({
        id: this.auditId,
        auditStatus: '1',
        dataVersion: this.houseInfo.dataVersion
      })
      if (res.result !== '1') return
      uni.showToast({
        icon: 'none',
        mask: true,
        title: res.message
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 100)
    },
    goDetail(personId, houseId, exist) {
      if (exist) {
        uni.navigateTo({
          url: `/pages/home/manage/detail?memberId=${personId}&houseId=${houseId}&rerent=0`
        })
      } else {
        uni.showToast({
          icon: 'none',
          mask: true,
          title: '该人员已不在当前住家'
        })
      }
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
  &-reject {
    background: #fff;
    position: relative;
    margin: 0 20rpx;
    .input-tip {
      font-size: 28rpx;
      color: $u-tips-color;
      position: absolute;
      bottom: 24rpx;
      right: 32rpx;
      .input-tip__length {
        color: #00c8cf;
      }
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
    @include leelen-bottom(12);
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 30rpx;
    margin-top: 16rpx;
    u-button {
      width: 250rpx;
    }
    u-button:first-child {
      margin-right: 20rpx;
    }
  }
}
</style>
