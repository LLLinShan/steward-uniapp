<template>
  <view class="detail">
    <!-- 审核结果 -->
    <view v-if="isAudit" class="main">
      <u-cell-group>
        <u-cell-item
          title="审核结果"
          :arrow="false"
          :title-style="cellItemStyle"
          :value="$utils.getDicLabel('auditStatus', detailInfo.auditStatus)"
        >
        </u-cell-item>
        <u-cell-item
          v-if="detailInfo.auditStatus === 2"
          title="驳回原因"
          :arrow="false"
          :title-style="cellItemStyle"
          :value="detailInfo.rejection || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="审核时间"
          :arrow="false"
          :title-style="cellItemStyle"
          :value="detailInfo.auditTime || $Data().defaultStr"
        ></u-cell-item>
      </u-cell-group>
    </view>
    <!-- 房屋地址 -->
    <view class="main">
      <u-cell-group>
        <u-cell-item
          :title="isAudit ? '房屋地址' : '入住房屋'"
          :arrow="false"
          :title-style="cellItemStyle"
        >
        </u-cell-item>
        <u-cell-item
          style="word-break: break-all"
          :title-style="titleValStyle"
          :arrow="false"
          :title="detailInfo.address || $Data().defaultStr"
        >
        </u-cell-item>
      </u-cell-group>
    </view>
    <!-- 基本信息 -->
    <view class="main" :class="{ 'main-basic': isAudit }">
      <u-cell-group>
        <u-cell-item title="基本信息" :arrow="false" :title-style="cellItemStyle"> </u-cell-item>
        <!-- 头像照片 -->
        <view class="main-img__title">头像照片</view>
        <view class="main-img main-img__line">
          <u-image
            v-if="detailInfo.szPhotoPath"
            class="main-img__line-item"
            :src="detailInfo.szPhotoPath || ''"
            width="144"
            height="144"
            border-radius="10"
            @click="previewImage([detailInfo.szPhotoPath])"
          >
            <u-loading slot="loading"></u-loading>
            <view slot="error" style="font-size: 24rpx">加载失败</view>
          </u-image>
          <text v-else>{{ $Data().defaultStr }}</text>
        </view>
        <u-cell-item
          title="姓名"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.name || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="人员类型"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="$utils.getDicLabel('personType', detailInfo.identityType)"
        >
        </u-cell-item>
        <u-cell-item
          v-if="detailInfo.identityType === 2"
          title="租赁开始"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.szValidBegin || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          v-if="detailInfo.identityType === 2"
          title="租赁结束"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.szValidEnd || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="性别"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="$utils.getDicLabel('gender', detailInfo.gender)"
        >
        </u-cell-item>
        <u-cell-item
          title="民族"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="$utils.getDicLabel('nation', detailInfo.nation)"
        >
        </u-cell-item>
        <u-cell-item
          title="政治面貌"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="$utils.getDicLabel('politicalStatus', detailInfo.politicalStatus)"
        >
        </u-cell-item>
        <u-cell-item
          title="出生年份"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.birthDate || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="联系方式"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.phone || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="证件类型"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="$utils.getDicLabel('certificateType', detailInfo.certType)"
        >
        </u-cell-item>
        <u-cell-item
          title="证件号码"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.certNum || $Data().defaultStr"
        >
        </u-cell-item>
        <!-- 证件照片 -->
        <view class="main-img__title">证件照片</view>
        <view class="main-img main-img__line">
          <view v-if="detailInfo.idCardPhotoPath || detailInfo.idCardBackPhotoPath">
            <u-image
              v-if="detailInfo.idCardPhotoPath"
              class="main-img__line-item"
              :src="detailInfo.idCardPhotoPath || ''"
              width="144"
              height="144"
              border-radius="10"
              @click="previewImage([detailInfo.idCardPhotoPath])"
            >
              <u-loading slot="loading"></u-loading>
              <view slot="error" style="font-size: 24rpx">加载失败</view>
            </u-image>
            <u-image
              v-if="detailInfo.idCardBackPhotoPath"
              class="main-img__line-item"
              :src="detailInfo.idCardBackPhotoPath || ''"
              width="144"
              height="144"
              border-radius="10"
              @click="previewImage([detailInfo.idCardBackPhotoPath])"
            >
              <u-loading slot="loading"></u-loading>
              <view slot="error" style="font-size: 24rpx">加载失败</view>
            </u-image>
          </view>
          <text v-else>{{ $Data().defaultStr }}</text>
        </view>

        <u-cell-item
          title="户籍类型"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="$utils.getDicLabel('householdRegistType', detailInfo.permanentType)"
        >
        </u-cell-item>
        <u-cell-item
          title="户籍地址"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.permanentAddress || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="详细地址"
          :title-style="titleStyle"
          :value-style="valueStyle"
          :arrow="false"
          :value="detailInfo.szAddress || $Data().defaultStr"
        >
        </u-cell-item>

        <!-- 住房证明 -->
        <view class="main-img__title">住房证明</view>
        <view class="main-img main-img__line">
          <view v-if="detailInfo.housingCert && detailInfo.housingCert.length">
            <u-image
              class="main-img__line-item"
              v-for="(src, i) in detailInfo.housingCert"
              :key="i"
              :src="src"
              width="144"
              height="144"
              border-radius="10"
              @click="previewImage([src])"
            >
              <u-loading slot="loading"></u-loading>
              <view slot="error" style="font-size: 24rpx">加载失败</view>
            </u-image>
          </view>
          <text v-else>{{ $Data().defaultStr }}</text>
        </view>

        <u-cell-item
          title="开通App/小程序功能权限"
          :arrow="false"
          :value="$utils.getDicLabel('appOpenStatus', detailInfo.appOpenStatus)"
        >
        </u-cell-item>
        <u-cell-item
          title="开通权限手机号"
          :arrow="false"
          :value="detailInfo.realPhone || $Data().defaultStr"
        >
        </u-cell-item>
        <u-cell-item
          title="申请时间"
          :border-bottom="false"
          :value="detailInfo.applyTime || $Data().defaultStr"
          :arrow="false"
        ></u-cell-item>
      </u-cell-group>
    </view>

    <view class="main-submit" v-if="detailInfo.auditStatus === 0">
      <u-button class="main-submit__btn" type="error" @click="showReject = true">驳回</u-button>
      <u-button class="main-submit__btn" type="primary" @click="handelSubmit"> 通过 </u-button>
    </view>

    <u-modal
      v-model="showReject"
      title="驳回原因"
      @confirm="onReject"
      @cancel="onCancel"
      :show-cancel-button="true"
    >
      <view class="main-reject">
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
      isAudit: false, // 审核状态 默认未审核
      detailInfo: {},
      cellItemStyle: {
        fontSize: '32rpx',
        fontWeight: 'bold'
      },
      titleStyle: { background: '#fff', fontSize: '32rpx', color: '#666666' },
      titleValStyle: { background: '#fff', fontSize: '32rpx', color: '#333333' },
      valueStyle: {
        color: '#333333'
      },
      rejection: '',
      showReject: false,
      auditId: ''
    }
  },
  computed: {
    tipText() {
      return this.rejection.length < 100 ? this.rejection.length : 100
    }
  },
  onLoad(option) {
    console.log('option', option)
    this.auditId = option.auditId
    this.getDetail()
  },
  methods: {
    radioGroupChange(e) {
      console.log(e)
    },
    async getDetail() {
      const res = await this.$request.getAuditDetail({
        auditId: this.auditId
      })
      if (res.result === '1') {
        this.detailInfo = res.data
        this.detailInfo.housingCert = this.detailInfo.housingCert
          ? this.detailInfo.housingCert.split(',')
          : []
        this.isAudit = res.data.auditStatus !== 0
      }
    },
    previewImage(urls) {
      uni.previewImage({
        urls
      })
    },
    //驳回
    async onReject() {
      if (!this.rejection) {
        uni.showToast({
          title: '请输入驳回原因',
          icon: 'none'
        })
        return
      }
      const res = await this.$request.audit({
        auditId: this.auditId,
        auditStatus: '2',
        dataVersion: this.detailInfo.dataVersion,
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
      }, 100)
    },
    onCancel() {
      this.rejection = ''
    },
    // 通过
    // onSubmit() {
    //   uni.showModal({
    //     content: '是否确认让租客/亲戚/朋友先完成入住登记？',
    //     showCancel: true,
    //     confirmText: '确定',
    //     confirmColor: '#4277FF',
    //     success: res => {
    //       if (res.confirm) {
    //         this.handelSubmit()
    //       }
    //     }
    //   })
    // },
    async handelSubmit() {
      const res = await this.$request.audit({
        auditId: this.auditId,
        auditStatus: '1',
        dataVersion: this.detailInfo.dataVersion
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
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  .main {
    margin-top: 16rpx;
    &-img {
      padding: 16rpx 32rpx 30rpx 32rpx;
      border-bottom: 1rpx solid #eeeeee;
      &__line {
        display: flex;
        align-items: center;
        &-item {
          flex-wrap: wrap;
          margin-right: 10rpx;
        }
      }
      &__title {
        font-size: 32rpx;
        color: $u-content-color;
        padding: 24rpx 32rpx 0 32rpx;
        &-des {
          position: relative;
          bottom: -2rpx;
          font-size: 24rpx;
          color: $u-tips-color;
          margin-left: 8rpx;
        }
      }
    }
    &-reject {
      background: #fff;
      position: relative;
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
    &.main-basic {
      padding-bottom: 82rpx;
      ::v-deep .u-cell_title {
        color: $u-content-color !important;
        display: flex;
        align-self: flex-start;
      }
    }
  }
}
</style>
