<template>
  <view class="page">
    <page-loading v-if="!hasDynamicField" />
    <template v-else>
      <u-form
        ref="form"
        :error-type="['toast']"
        label-width="220"
        :model="params"
        :border-bottom="false"
      >
        <!-- 管理机构 -->
        <view class="page-form">
          <u-form-item
            class="natural-form"
            prop="organizationName"
            label="管理机构"
            required
            :border-bottom="false"
          >
            <u-input
              placeholder="请选择管理机构"
              type="select"
              disabled
              :value="params.organizationName"
              @click="organizationShow = true"
            />
            <organization-popup v-model="organizationShow" @confirm="confirmOrganization" />
          </u-form-item>
        </view>
        <!-- 个人信息 -->
        <view class="page-form">
          <u-cell-group :border="false">
            <u-cell-item title="个人信息" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
          </u-cell-group>
          <u-form-item
            class="natural-form"
            prop="name"
            label="姓名"
            :required="setFieldRequied('name')"
            v-if="setFieldShow('name')"
          >
            <u-input
              placeholder="请输入姓名"
              maxlength="20"
              trim
              :clearable="false"
              v-model="params.name"
            />
          </u-form-item>
          <u-form-item
            class="natural-form"
            prop="phone"
            label="手机号码"
            :required="setFieldRequied('phone')"
            v-if="setFieldShow('phone')"
          >
            <u-input
              placeholder="请输入手机号码"
              maxlength="11"
              type="number"
              trim
              :clearable="false"
              v-model="params.phone"
            />
          </u-form-item>
          <!-- 证件照片 -->
          <view class="page-form__title-child" v-if="setFieldShow('IdPhoto')">
            <text class="star" v-if="setFieldRequied('IdPhoto')">*</text>
            证件照片
            <text class="text">支持jpg/png格式，单张不超过5M</text>
          </view>
          <view class="certificate-upload" v-if="setFieldShow('IdPhoto')">
            <u-form-item
              prop="IdPhoto1"
              class="certificate-upload__positive"
              :border-bottom="false"
            >
              <common-upload :maxSize="5 * 1024 * 1024" v-model="params.IdPhoto1" />
              <view class="slot-text">身份证正面</view>
            </u-form-item>
            <u-form-item prop="IdPhoto2" class="certificate-upload__back" :border-bottom="false">
              <common-upload :maxSize="5 * 1024 * 1024" v-model="params.IdPhoto2" />
              <view class="slot-text">身份证反面</view>
            </u-form-item>
          </view>
        </view>

        <!--出租屋信息-->
        <view class="page-form">
          <u-cell-group :border="false">
            <u-cell-item
              title="出租屋信息"
              :arrow="false"
              :title-style="cellItemStyle"
            ></u-cell-item>
          </u-cell-group>
          <u-form-item
            class="natural-form"
            prop="houseName"
            label="出租屋名称"
            :required="setFieldRequied('houseName')"
            v-if="setFieldShow('houseName')"
          >
            <u-input
              placeholder="请输入出租屋名称"
              maxlength="20"
              trim
              :clearable="false"
              v-model="params.houseName"
            />
          </u-form-item>
          <u-form-item
            class="natural-form"
            prop="region"
            label="城市地区"
            :required="setFieldRequied('region')"
            v-if="setFieldShow('region')"
          >
            <u-input
              placeholder="请选择"
              type="select"
              disabled
              v-model="params.region"
              @click="regionClick"
            />
            <u-select
              v-model="pickerShow"
              mode="mutil-column-auto"
              :list="regionList"
              confirm-color="#fab400"
              placeholder="请选择地址"
              @confirm="regionConfirm"
            ></u-select>
          </u-form-item>
          <u-form-item
            class="natural-form"
            prop="receiverAddress"
            label="详细地址"
            :required="setFieldRequied('receiverAddress')"
            v-if="setFieldShow('receiverAddress')"
          >
            <u-input
              placeholder="请输入详细地址（**街**号**）"
              maxlength="50"
              trim
              :clearable="false"
              v-model="params.receiverAddress"
            />
          </u-form-item>
          <u-form-item
            class="page-form__number-box natural-form"
            prop="roomTotalCount"
            label="房间总数"
            :required="setFieldRequied('roomTotalCount')"
            v-if="setFieldShow('roomTotalCount')"
          >
            <u-number-box v-model="params.roomTotalCount" :min="1" :max="100000"></u-number-box>
          </u-form-item>
          <u-form-item
            class="page-form__number-box natural-form"
            prop="accessTotalCount"
            label="出入口数"
            :required="setFieldRequied('accessTotalCount')"
            v-if="setFieldShow('accessTotalCount')"
          >
            <u-number-box v-model="params.accessTotalCount" :min="1" :max="1000"></u-number-box>
          </u-form-item>
          <u-form-item
            class="page-form__number-box natural-form"
            prop="floorTotalCount"
            label="楼层数"
            :required="setFieldRequied('floorTotalCount')"
            v-if="setFieldShow('floorTotalCount')"
          >
            <u-number-box v-model="params.floorTotalCount" :min="1" :max="1000"></u-number-box>
          </u-form-item>
          <u-form-item
            class="page-form__number-box natural-form"
            prop="roomPerFloorCount"
            label="每楼层房间数"
            :required="setFieldRequied('roomPerFloorCount')"
            v-if="setFieldShow('roomPerFloorCount')"
            :border-bottom="false"
          >
            <u-number-box v-model="params.roomPerFloorCount" :min="1" :max="1000"></u-number-box>
          </u-form-item>
        </view>

        <!-- 描述 -->
        <view class="page-form" v-if="setFieldShow('description')">
          <view class="page-form__title-child describe">
            <text v-if="setFieldRequied('description')" class="star">*</text>
            <text class="">描述</text>
          </view>
          <u-form-item prop="description" class="describe-input" :border-bottom="false">
            <u-input
              placeholder="具体描述出租屋信息"
              maxlength="100"
              type="textarea"
              height="256"
              :customStyle="inputStyle"
              trim
              :clearable="false"
              v-model="params.description"
            />
            <view class="input-tip">
              <text class="input-tip__length">{{ params.description.length }}</text
              >/100
            </view>
          </u-form-item>
        </view>

        <!-- 产权证明 -->
        <view class="page-form" v-if="setFieldShow('houseCertificate')">
          <view class="page-form__title-child proof-photos">
            <text v-if="setFieldRequied('houseCertificate')" class="star">*</text>
            产权证明
          </view>
          <view class="proof-upload">
            <u-form-item prop="houseCertificate" :border-bottom="false">
              <common-upload
                :maxSize="5 * 1024 * 1024"
                :maxCount="3"
                v-model="params.houseCertificate"
              />
            </u-form-item>
            <view class="proof-upload__tips">最多上传3张，支持jpg/png格式，单张不超过5M</view>
          </view>
        </view>

        <!-- 委托二房东证明 -->
        <view class="page-form" v-if="setFieldShow('sublessorCertificate')">
          <view class="page-form__title-child proof-photos">
            <text v-if="setFieldRequied('sublessorCertificate')" class="star">*</text>
            委托二房东证明
          </view>
          <view class="proof-upload">
            <u-form-item prop="sublessorCertificate" :border-bottom="false">
              <common-upload
                :maxSize="5 * 1024 * 1024"
                :maxCount="3"
                v-model="params.sublessorCertificate"
              />
            </u-form-item>
            <view class="proof-upload__tips">最多上传3张，支持jpg/png格式，单张不超过5M</view>
          </view>
        </view>
      </u-form>

      <view class="page-button">
        <u-button type="primary" :ripple="true" :loading="loading" @click="onSubmit"
          >提交资料</u-button
        >
      </view>

      <!-- 弹出toast提示 -->
      <u-toast ref="uToast" />
    </template>
  </view>
</template>

<script>
import PageLoading from '_c/pageLoading'
import { mapState } from 'vuex'
import { matchMobile } from '_u/regExp'
import CommonUpload from '_c/upload'
import OrganizationPopup from './organizationPopup'
export default {
  components: {
    PageLoading,
    CommonUpload,
    OrganizationPopup
  },
  data() {
    return {
      hasDynamicField: false, // 动态字段是否加载完
      cellItemStyle: {
        fontWeight: 'bold'
      },
      loading: false, //表单的加载
      houseId: undefined, // 编辑id
      status: undefined, // 当前状态
      params: {
        organizationName: undefined, // 管理机构名称
        organization: undefined, // 管理机构id
        name: undefined, // 姓名
        phone: '', // 手机号码
        IdPhoto1: [], // 证件照片正面
        IdPhoto2: [], // 证件照片反面
        houseName: '', // 出租屋名称
        region: undefined, //城市地区
        receiverProvince: undefined, // 省
        receiverCity: undefined, // 市
        receiverDistrict: undefined, // 区
        receiverAddress: undefined, // 详细地址
        provinceCode: undefined, // 省-编码
        cityCode: undefined, // 市-编码
        districtCode: undefined, // 区-编码
        roomTotalCount: 1, // 房间总数
        accessTotalCount: 1, // 出入口数
        floorTotalCount: 1, // 楼层数
        roomPerFloorCount: 1, // 每楼层房间数
        description: '', // 描述信息
        houseCertificate: [], // 产权证明
        sublessorCertificate: [] // 二房东证明
      },
      inputStyle: {
        margin: '0 32rpx',
        padding: '20rpx',
        fontSize: '32rpx',
        color: '#333333',
        maxHeight: '256rpx'
      },
      organizationShow: false, // 显示管理机构的弹框
      pickerShow: false, // 地区选择，三级联动
      dynamicFieldList: [], // 动态字段列表
      rules: {
        organizationName: [
          {
            required: true,
            message: '请选择管理机构',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: false,
            message: '请输入姓名',
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          {
            required: false,
            message: '请输入手机号码',
            trigger: ['blur', 'change']
          },
          { pattern: matchMobile, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        houseName: [
          {
            required: false,
            message: '请输入出租屋名称',
            trigger: ['blur', 'change']
          }
        ],
        region: [
          {
            required: false,
            message: '请选择城市地区',
            trigger: 'change'
          }
        ],
        receiverAddress: [
          {
            required: false,
            message: '请输入详细地址',
            trigger: ['blur', 'change']
          }
        ],
        description: [
          {
            required: false,
            message: '请输入描述',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  async onReady() {
    if (this.regionList.length === 0) {
      const { result, data } = await this.$request.getPosition()
      if (result === '1') {
        this.$store.commit('SET_REGIONLIST', data)
      }
    }
  },
  created() {
    this.getDynamicField()
  },
  computed: {
    ...mapState({
      regionList: state => state.user.regionList // 省市区列表
    })
  },
  watch: {
    'params.description'(newVal) {
      if (newVal && newVal.length > 100) {
        this.params.description = newVal.slice(0, 100)
      }
    }
  },
  onLoad: function ({ houseId, status }) {
    this.houseId = houseId
    this.status = status
    if (houseId) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const res = await this.$request.getRentalDetail({
        id: this.houseId
      })
      if (res.result === '1') {
        const detailInfo = res.data
        if (detailInfo) {
          this.params.organizationName = detailInfo?.organizationName
          this.params.organization = detailInfo?.organizationId
          this.params.name = detailInfo?.name
          this.params.phone = detailInfo?.phone
          this.params.houseName = detailInfo?.houseName
          this.params.roomTotalCount = detailInfo?.roomTotalCount
          this.params.accessTotalCount = detailInfo?.accessTotalCount
          this.params.floorTotalCount = detailInfo?.floorTotalCount
          this.params.roomPerFloorCount = detailInfo?.roomPerFloorCount
          this.params.description = detailInfo?.description
          if (detailInfo['address'] && detailInfo['address'].length) {
            const regionAddress = `${detailInfo['address'][0]}/${detailInfo['address'][2]}/${detailInfo['address'][4]}`
            this.params.region = regionAddress
            this.params.receiverProvince = detailInfo['address'][0]
            this.params.receiverCity = detailInfo['address'][2]
            this.params.receiverDistrict = detailInfo['address'][4]
            this.params.receiverAddress = detailInfo['address'][6]
            this.params.provinceCode = detailInfo['address'][1]
            this.params.cityCode = detailInfo['address'][3]
            this.params.districtCode = detailInfo['address'][5]
          }
          if (detailInfo.idPhoto && detailInfo.idPhoto.length) {
            this.params.IdPhoto1 = [
              {
                url: detailInfo.idPhoto[0],
                fileName: 'fileName'
              }
            ]
            this.params.IdPhoto2 = [
              {
                url: detailInfo.idPhoto[1],
                fileName: 'fileName'
              }
            ]
          }
          if (detailInfo.houseCertificate && detailInfo.houseCertificate.length) {
            this.params.houseCertificate = detailInfo.houseCertificate.map((v, i) => ({
              url: v,
              fileName: `fileName${i}`
            }))
          }
          if (detailInfo.sublessorCertificate && detailInfo.sublessorCertificate.length) {
            this.params.sublessorCertificate = detailInfo.sublessorCertificate.map((v, i) => ({
              url: v,
              fileName: `fileName${i}`
            }))
          }
        }
      }
    },
    // 获取动态字段
    async getDynamicField() {
      const { result, data } = await this.$request.getRentalField()
      if (result === '1') {
        this.hasDynamicField = true
        this.dynamicFieldList = data
        const newAddArr = [
          {
            field: 'IdPhoto1',
            fieldName: '身份证正面',
            oldField: 'IdPhoto'
          },
          {
            field: 'IdPhoto2',
            fieldName: '身份证反面',
            oldField: 'IdPhoto'
          },
          {
            field: 'region',
            fieldName: '城市地区',
            oldField: 'address'
          },
          {
            field: 'receiverAddress',
            fieldName: '详细地址',
            oldField: 'address'
          }
        ]
        newAddArr.forEach(item => {
          this.dynamicFieldList.push({
            field: item.field,
            fieldName: item.fieldName,
            visibility: this.dynamicFieldList.find(v => v.field === item.oldField).visibility,
            required: this.dynamicFieldList.find(v => v.field === item.oldField).required
          })
        })
        this.dynamicFieldList.forEach(element => {
          if (element.required === 1 && this.rules[element.field]) {
            this.rules[element.field][0].required = true
          }
          if (element.required === 1 && element[element.field] === 'address') {
            this.rules['region'][0].required = true
            this.rules['receiverAddress'][0].required = true
          }
        })
        await this.$nextTick()
        this.$refs.form.setRules(this.rules)
      } else {
        this.hasDynamicField = false
      }
    },
    /**
     * 设置字段是隐藏
     * @param {String} field 字段名称
     */
    setFieldShow(field) {
      return !!this.dynamicFieldList.find(item => item.field === field)?.visibility
    },
    /**
     * 设置字段是必选
     * @param {String} field 字段名称
     */
    setFieldRequied(field) {
      return !!this.dynamicFieldList.find(item => item.field === field)?.required
    },
    /**
     * 管理机构确定
     * @param {Object} obj 已选的管理机构
     */
    confirmOrganization(obj) {
      this.params = {
        ...this.params,
        organizationName: obj?.organizationName,
        organization: obj?.id
      }
    },
    // 弹出选择地区框
    regionClick() {
      this.pickerShow = true
      uni.hideKeyboard()
    },
    // 地区切换
    regionConfirm(data) {
      this.params.receiverProvince = data[0].label
      this.params.receiverCity = data[1].label
      this.params.receiverDistrict = data[2].label
      this.params.provinceCode = data[0].value
      this.params.cityCode = data[1].value
      this.params.districtCode = data[2].value
      this.params.region = `${this.params.receiverProvince}/${this.params.receiverCity}/${this.params.receiverDistrict}`
    },
    // 显示校验提示
    showValidToast(msg) {
      this.$refs.uToast.show({
        title: msg
      })
    },
    // 表单提交
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let {
            organizationName, // 管理机构名称
            organization, // 管理机构id
            name, // 姓名
            phone, // 手机号码
            IdPhoto1, // 证件照片正面
            IdPhoto2, // 证件照片反面
            houseName, // 出租屋名称
            region, // 省市区
            receiverProvince, // 省
            receiverCity, // 市
            receiverDistrict, // 区
            receiverAddress, // 详细地址
            provinceCode, // 省-编码
            cityCode, // 市-编码
            districtCode, // 区-编码
            roomTotalCount, // 房间总数
            accessTotalCount, // 出入口数
            floorTotalCount, // 楼层数
            roomPerFloorCount, // 每楼层房间数
            description, // 描述信息
            houseCertificate, // 产权证明
            sublessorCertificate // 二房东证明
          } = this.params
          // 校验
          let idPhoto, address
          if (this.setFieldShow('IdPhoto')) {
            const idPhotoRequied = this.setFieldRequied('IdPhoto')
            if (idPhotoRequied) {
              if (!IdPhoto1.length) {
                this.showValidToast('请上传身份证正面')
                return
              }
              if (!IdPhoto2.length) {
                this.showValidToast('请上传身份证反面')
                return
              }
            } else {
              if (!IdPhoto1.length && !!IdPhoto2.length) {
                this.showValidToast('请上传身份证正面')
                return
              }
              if (!IdPhoto2.length && !!IdPhoto1.length) {
                this.showValidToast('请上传身份证反面')
                return
              }
            }
            idPhoto =
              !!IdPhoto1?.[0]?.url && !!IdPhoto2?.[0]?.url
                ? [IdPhoto1?.[0]?.url ?? '', IdPhoto2?.[0]?.url ?? '']
                : [] // 证件照 [0]:正面 [1]:反面
          } else {
            idPhoto = undefined
          }
          if (this.setFieldShow('address')) {
            if (!this.setFieldRequied('address')) {
              if (!region && !!receiverAddress) {
                this.showValidToast('请选择城市地区')
                return
              }
              if (!receiverAddress && !!region) {
                this.showValidToast('请输入详细地址')
                return
              }
            }
            address =
              !!region && !!receiverAddress
                ? [
                    receiverProvince,
                    provinceCode,
                    receiverCity,
                    cityCode,
                    receiverDistrict,
                    districtCode,
                    receiverAddress
                  ]
                : [] // 地址 [省名称,省编码,市名称,市编码,区名称,区编码,详细地址]
          } else {
            address = undefined
          }
          if (this.setFieldShow('houseCertificate')) {
            const houseCertificateRequied = this.setFieldRequied('houseCertificate')
            if (houseCertificateRequied && !houseCertificate.length) {
              this.showValidToast('请上传产权证明照片')
              return
            }
            houseCertificate =
              houseCertificate && houseCertificate.length
                ? houseCertificate.map(item => item.url)
                : []
          } else {
            houseCertificate = undefined
          }
          if (this.setFieldShow('sublessorCertificate')) {
            const sublessorCertificateRequied = this.setFieldRequied('sublessorCertificate')
            if (sublessorCertificateRequied && !sublessorCertificate.length) {
              this.showValidToast('请上传委托二房东证明照片')
              return
            }
            sublessorCertificate =
              sublessorCertificate && sublessorCertificate.length
                ? sublessorCertificate.map(item => item.url)
                : []
          } else {
            sublessorCertificate = undefined
          }
          const ajaxData = {
            organizationName, // 管理机构名称
            organization, // 管理机构id
            name: this.setFieldShow('name') ? name : undefined, // 姓名
            phone: this.setFieldShow('phone') ? phone : undefined, // 手机号码
            houseName: this.setFieldShow('houseName') ? houseName : undefined, // 出租屋名称
            roomTotalCount: this.setFieldShow('roomTotalCount') ? roomTotalCount : undefined, // 房间总数
            accessTotalCount: this.setFieldShow('accessTotalCount') ? accessTotalCount : undefined, // 出入口数
            floorTotalCount: this.setFieldShow('floorTotalCount') ? floorTotalCount : undefined, // 楼层数
            roomPerFloorCount: this.setFieldShow('roomPerFloorCount')
              ? roomPerFloorCount
              : undefined, // 每楼层房间数
            description: this.setFieldShow('description') ? description : undefined, // 描述信息
            address, // 地址
            idPhoto, // 证件照 [0]:正面 [1]:反面
            houseCertificate, // 产权证明
            sublessorCertificate // 二房东证明
          }
          this.loading = true
          const api = {
            0: this.$request.submitRental,
            1: this.$request.updateRental
          }
          const { result, message } = await api[Number(!!this.houseId)]({
            apiLoading: true,
            apiReject: true,
            ...ajaxData,
            id: this.houseId
          }).finally(() => {
            this.loading = false
          })
          if (result !== '1') {
            uni.showModal({
              content: message,
              showCancel: false,
              confirmText: result === '10100' ? '我知道了' : '确定',
              confirmColor: this.$Data().primaryColor
            })
            return
          }
          uni.showToast({
            title: message,
            icon: 'none'
          })
          const routes = getCurrentPages()
          if (routes.length === 1) {
            uni.redirectTo({
              url: '/pages/my/house/index'
            })
          } else {
            setTimeout(() => {
              uni.navigateBack({
                delta: this.houseId ? 2 : 1,
                animationType: 'pop-out',
                animationDuration: 200
              })
            }, 500)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding-top: 16rpx;
  &-form {
    margin-bottom: 16rpx;
    padding: 0 32rpx;
    background: #ffffff;
    .natural-form {
      ::v-deep .u-form-item--left {
        min-width: 220rpx !important;
      }
    }
    ::v-deep .u-form-item--left__content {
      color: $u-content-color;
    }
    ::v-deep .u-input__input {
      color: $u-tips-color;
    }
    ::v-deep .u-cell {
      padding-left: 0 !important;
    }
    ::v-deep .u-form-item--left__content--required {
      left: 0;
    }
    ::v-deep .u-form-item--left__content__label {
      padding-left: 26rpx;
    }
    &__number-box {
      ::v-deep .u-numberbox {
        position: absolute;
        right: 0;
        top: -24rpx;
      }
    }

    &__title-child {
      margin: 30rpx 0 6rpx 0;
      font-size: 32rpx;
      color: $u-content-color;
      .star {
        color: #ff5959;
        margin-right: 16rpx;
      }
      .text {
        margin-left: 8rpx;
        font-size: 24rpx;
        color: $u-tips-color;
      }
      // 描述
      &.describe {
        margin-top: 0;
        padding-top: 30rpx;
        font-weight: bold;
        color: $u-main-color;
      }
      // 产权证明,委托二房东证明
      &.proof-photos {
        margin-top: 0;
        padding-top: 30rpx;
        color: $u-main-color;
      }
    }
    // 描述
    .describe-input {
      background: #fff;
      position: relative;
      ::v-deep .u-input__textarea {
        padding-top: 0 !important;
        padding-left: 0 !important;
        margin-left: 0 !important;
      }
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
  }

  &-button {
    @include leelen-bottom(68);
    padding-top: 32rpx;
    margin-top: 100rpx;
    background-color: #fff;
    ::v-deep .u-btn {
      margin: 0 32rpx;
    }
  }
}
// 证件照片
.certificate-upload {
  display: flex;
  &__positive,
  &__back {
    margin-right: 28rpx;
    text-align: center;
    .slot-text {
      font-size: 24rpx;
      color: $u-tips-color;
    }
  }
}
// 产权证明,委托二房东证明
.proof-upload {
  &__tips {
    font-size: 24rpx;
    color: $u-tips-color;
    padding-bottom: 30rpx;
  }
}
</style>
