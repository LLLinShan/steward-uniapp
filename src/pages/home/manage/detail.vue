<template>
  <view class="page">
    <u-cell-group>
      <u-cell-item title="房屋地址" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
      <u-cell-item :title="detailInfo.address || $Data().defaultStr" :arrow="false"></u-cell-item>
    </u-cell-group>
    <u-cell-group class="page-title">
      <u-cell-item title="住户信息" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
    </u-cell-group>
    <u-cell-group class="page-form">
      <view class="page-img__title">头像照片</view>
      <view class="page-img">
        <u-image
          v-if="detailInfo.szPhotoPath && detailInfo.szPhotoPath.length"
          :src="detailInfo.szPhotoPath"
          @click="onPreview([detailInfo.szPhotoPath])"
        />
        <text class="empty-up" v-else>未上传</text>
      </view>
      <u-cell-item
        title="姓名"
        :value="detailInfo.name || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="人员类型"
        :value="$utils.getDicLabel('personType', detailInfo.identityType)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        v-if="detailInfo.identityType === '2'"
        title="租凭开始"
        :value="detailInfo.szValidBegin || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        v-if="detailInfo.identityType === '2'"
        title="租凭结束"
        :value="detailInfo.szValidEnd || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="性别"
        :value="$utils.getDicLabel('gender', detailInfo.gender)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="民族"
        :value="$utils.getDicLabel('nation', detailInfo.nation)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="出生日期"
        :value="detailInfo.birthDate || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="户籍类型"
        :value="$utils.getDicLabel('householdRegistType', detailInfo.permanentType)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="户籍地址"
        :value="detailInfo.permanentAddress || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="政治面貌"
        :value="$utils.getDicLabel('politicalStatus', detailInfo.politicalStatus)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="详细地址"
        :value="detailInfo.szAddress || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="联系方式"
        :value="detailInfo.phone || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="证件类型"
        :value="$utils.getDicLabel('certificateType', detailInfo.certType)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="证件号码"
        :value="detailInfo.certNum || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <view class="page-img__title">证件照片</view>
      <view class="page-img">
        <view class="page-img__wrap">
          <u-image
            v-if="detailInfo.idCardPhotoPath && detailInfo.idCardPhotoPath.length"
            :src="detailInfo.idCardPhotoPath"
            @click="onPreview([detailInfo.idCardPhotoPath])"
          />
          <text class="empty-up" v-else>未上传</text>
          <text class="page-img__name">证件正面</text>
        </view>
        <view class="page-img__wrap">
          <u-image
            v-if="detailInfo.idCardBackPhotoPath && detailInfo.idCardBackPhotoPath.length"
            :src="detailInfo.idCardBackPhotoPath"
            @click="onPreview([detailInfo.idCardBackPhotoPath])"
          />
          <text class="empty-up" v-else>未上传</text>
          <text class="page-img__name">证件反面</text>
        </view>
      </view>
      <view class="page-img__title">住房证明</view>
      <view class="page-img page-img__housingCert">
        <template v-if="detailInfo.housingCert && detailInfo.housingCert.length">
          <u-image
            v-for="url in detailInfo.housingCert"
            :key="url"
            :src="url"
            @click="onPreview([url])"
          />
        </template>
        <text class="empty-up" v-else>未上传</text>
      </view>
      <u-cell-item
        title="门禁生效时间"
        :value="detailInfo.accessEffectTime || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="门禁失效时间"
        :value="detailInfo.accessExpireTime || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="开通App/小程序功能权限"
        :value="$utils.getDicLabel('appOpenStatus', detailInfo.appOpenStatus)"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        v-if="detailInfo.appOpenStatus === '1'"
        title="开通权限手机号"
        :value="detailInfo.realPhone || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="登记时间"
        :value="detailInfo.registerTime || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
    </u-cell-group>
    <div class="page-button" v-if="rerent === 1">
      <u-button type="error" :ripple="true" :loading="loading" @click="onDel">删除</u-button>
      <u-button
        type="primary"
        v-if="detailInfo.blockStatus === '1' && detailInfo.accessTimeState === '4'"
        :ripple="true"
        @click="onChangeBlock(0, '解冻')"
        >解冻凭证</u-button
      >
      <u-button
        type="primary"
        v-if="detailInfo.blockStatus === '0' && detailInfo.accessTimeState === '1'"
        :ripple="true"
        @click="onChangeBlock(1, '冻结')"
        >冻结凭证</u-button
      >
      <u-button type="primary" :ripple="true" @click="edit(detailInfo.address)">编辑</u-button>
    </div>
  </view>
</template>

<script>
//blockStatus 0未冻结，1冻结
export default {
  data() {
    return {
      cellItemStyle: {
        fontWeight: 'bold'
      },
      rerent: 1,
      loading: false, //加载
      memberId: undefined, //人员id
      houseId: undefined, //房屋id
      detailInfo: {} // 详情信息
    }
  },
  onLoad: function ({ memberId, houseId, rerent }) {
    this.memberId = memberId
    this.houseId = houseId
    this.rerent = rerent
    this.getDetail()
  },
  methods: {
    // 获取人员详情
    async getDetail() {
      const { result, data } = await this.$request.getHouseholdDetail({
        apiLoading: true,
        memberId: this.memberId,
        houseId: this.houseId
      })
      if (result !== '1') return
      let housingCertList
      if (data.housingCert && data.housingCert !== '') {
        housingCertList = data.housingCert.split(',')
      } else {
        housingCertList = null
      }
      this.detailInfo = {
        ...data,
        housingCert: housingCertList
      }
    },
    // 删除人员请求
    async onDelHome() {
      this.loading = true
      const { result, message } = await this.$request
        .removeHousehold({
          apiLoading: true,
          apiReject: true,
          memberId: this.memberId,
          houseId: this.houseId
        })
        .finally(() => {
          this.loading = false
        })
      if (result !== '1') {
        uni.showModal({
          content: message,
          showCancel: false,
          confirmText: '确定'
        })
        return
      }
      uni.showToast({
        title: message,
        duration: 2000
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 100)
    },
    onChangeBlock(status, name) {
      uni.showModal({
        content: `确认${name}该人员门禁权限？`,
        confirmColor: this.$Data().primaryColor,
        confirmText: '确认',
        success: ({ confirm }) => {
          if (confirm) {
            this.changeBlock(status)
          }
        }
      })
    },
    async changeBlock(status) {
      const { result, message } = await this.$request.blockOrNotHouseholdProof({
        blockStatus: status,
        personId: this.memberId,
        houseId: this.houseId
      })
      if (result !== '1') {
        uni.showModal({
          content: message,
          showCancel: false,
          confirmText: '确定'
        })
        return
      }
      uni.showToast({
        title: message,
        duration: 2000
      })
      const pages = getCurrentPages()
      const num = pages.length
      //当前页面栈总数
      let backnum
      //需要返回的页数
      for (let i = 0; i < num; i++) {
        //循环找到指定页面路由所在的页数
        if (pages[i].route === 'pages/home/manage/index') {
          backnum = num - i - 1
        }
      }
      uni.navigateBack({
        delta: backnum
      })
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
    // 删除人员事件
    onDel() {
      uni.showModal({
        content: '是否确认删除该住户？',
        success: ({ confirm }) => {
          if (confirm) {
            this.onDelHome()
          }
        }
      })
    },
    // 编辑人员事件
    edit(address) {
      uni.navigateTo({
        url: `/pages/home/register/house?address=${address}&structId=${this.houseId}&memberId=${this.memberId}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  padding-top: 16rpx;
  display: flex;
  flex-direction: column;
  &-form {
    ::v-deep .u-cell_title {
      color: $u-content-color !important;
      display: flex;
      align-self: flex-start;
    }
    ::v-deep .u-cell__value {
      color: $u-main-color !important;
    }
  }
  &-title {
    display: block;
    margin-top: 16rpx;
  }
  &-img {
    display: flex;
    align-items: center;
    padding: 16rpx 24rpx 32rpx 32rpx;
    border-bottom: 1rpx solid #eeeeee;
    ::v-deep .u-image {
      width: 145rpx !important;
      height: 145rpx !important;
      border-radius: 10rpx;
    }
    &__housingCert {
      display: flex;
      ::v-deep .u-image {
        margin-right: 28rpx;
      }
    }
    &__wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 28rpx;
    }
    &__name {
      width: 144rpx;
      text-align: center;
      color: $u-tips-color;
      font-size: 24rpx;
      margin-top: 12rpx;
    }
    &__title {
      font-size: 32rpx;
      padding: 24rpx 32rpx 0 32rpx;
    }
  }
  &-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 16rpx;
    padding-top: 30rpx;
    background: #ffffff;
    @include leelen-bottom(12);
    ::v-deep u-button {
      margin: 0 20rpx;
      width: 250rpx;
    }
    ::v-deep u-button:first-child {
      width: 150rpx;
    }
  }
}
.empty-up {
  color: #999999;
  padding: 24rpx 0;
}
</style>
