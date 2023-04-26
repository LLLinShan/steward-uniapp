<template>
  <page-loading v-if="pageLoading" />
  <view v-else class="page">
    <u-cell-group>
      <u-cell-item title="入住房屋" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
      <u-cell-item :title="address || $Data().defaultStr" :arrow="false"></u-cell-item>
    </u-cell-group>
    <u-cell-group class="page-title">
      <u-cell-item title="住户信息" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
    </u-cell-group>
    <view class="page-form">
      <u-form ref="form" :error-type="['toast']" label-width="220" :model="params">
        <u-form-item
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
          prop="identityTypeName"
          label="人员类型"
          :required="setFieldRequied('identityType')"
          v-if="setFieldShow('identityType')"
        >
          <u-input
            placeholder="请选择人员类型"
            type="select"
            :disabled="disabled"
            :value="params.identityTypeName"
            @click="identityTypePicker = true"
          />
          <common-select
            type="personType"
            title="人员类型"
            v-model="identityTypePicker"
            @confirm="confirmIdentityType"
          />
        </u-form-item>
        <!-- 租客才有租凭开始时间与租凭结束时间 -->
        <u-form-item
          prop="szValidBegin"
          label="租赁开始时间"
          :required="setFieldRequied('szValid')"
          v-if="params.identityType === '2' && setFieldShow('szValid')"
        >
          <u-input
            placeholder="请选择开始租赁时间"
            type="select"
            disabled
            :value="params.szValidBegin"
            @click="rentTimeStartPicker = !disabled"
          />
          <u-picker
            v-model="rentTimeStartPicker"
            mode="time"
            safe-area-inset-bottom
            title="请选择租赁开始时间"
            :params="{
              year: true,
              month: true,
              day: true
            }"
            @confirm="confirmStartRentTime"
          />
        </u-form-item>
        <u-form-item
          prop="szValidEnd"
          label="租赁结束时间"
          :required="setFieldRequied('szValid')"
          v-if="params.identityType === '2' && setFieldShow('szValid')"
        >
          <u-input
            placeholder="请选择结束租赁时间"
            type="select"
            disabled
            :value="params.szValidEnd"
            @click="rentTimeEndPicker = !disabled"
          />
          <u-picker
            v-model="rentTimeEndPicker"
            mode="time"
            safe-area-inset-bottom
            title="请选择结束租赁时间"
            :params="{
              year: true,
              month: true,
              day: true
            }"
            @confirm="confirmEndRentTime"
          />
        </u-form-item>
        <u-form-item
          prop="genderName"
          label="性别"
          :required="setFieldRequied('gender')"
          v-if="setFieldShow('gender')"
        >
          <u-input
            placeholder="请选择性别"
            type="select"
            :disabled="disabled"
            :value="params.genderName"
            @click="genderPicker = true"
          />
          <common-select
            type="gender"
            title="性别"
            v-model="genderPicker"
            @confirm="confirmGenderPicker"
          />
        </u-form-item>
        <u-form-item
          prop="birthDate"
          label="出生日期"
          :required="setFieldRequied('birthDate')"
          v-if="setFieldShow('birthDate')"
        >
          <u-input
            placeholder="请选择出生日期"
            type="select"
            disabled
            :value="params.birthDate"
            @click="birthDatePicker = !disabled"
          />
          <u-picker
            v-model="birthDatePicker"
            mode="time"
            start-year="1900"
            :end-year="new Date().getFullYear()"
            safe-area-inset-bottom
            title="请选择出生日期"
            :params="{
              year: true,
              month: true,
              day: true
            }"
            @confirm="confirmBirthDatePicer"
          />
        </u-form-item>
        <u-form-item
          prop="nationName"
          label="民族"
          :required="setFieldRequied('nation')"
          v-if="setFieldShow('nation')"
        >
          <u-input
            placeholder="请选择民族"
            type="select"
            :disabled="disabled"
            :value="params.nationName"
            @click="nationPicker = true"
          />
          <common-select
            type="nation"
            title="民族"
            v-model="nationPicker"
            @confirm="confirmNationPicer"
          />
        </u-form-item>
        <u-form-item
          prop="permanentTypeName"
          label="户籍类型"
          :required="setFieldRequied('permanentType')"
          v-if="setFieldShow('permanentType')"
        >
          <u-input
            placeholder="请选择户籍类型"
            type="select"
            :disabled="disabled"
            :value="params.permanentTypeName"
            @click="permanentTypePicker = true"
          />
          <common-select
            type="householdRegistType"
            title="户籍类型"
            v-model="permanentTypePicker"
            @confirm="confirmPermanentTypePicker"
          />
        </u-form-item>
        <u-form-item
          prop="permanentAddress"
          label="户籍地址"
          :required="setFieldRequied('permanentAddress')"
          v-if="setFieldShow('permanentAddress')"
        >
          <u-input
            placeholder="请选择户籍地址"
            type="select"
            :disabled="disabled"
            :value="params.permanentAddress"
            @click="permanentAddressPicker = true"
          />
          <u-select
            v-model="permanentAddressPicker"
            mode="mutil-column-auto"
            :list="poistionList"
            @confirm="confirmPermanentAddress"
          ></u-select>
        </u-form-item>
        <u-form-item
          prop="szAddress"
          label="详细地址"
          class="szAddress-input"
          :required="setFieldRequied('szAddress')"
          v-if="setFieldShow('szAddress')"
        >
          <u-input
            placeholder="请输入详细地址"
            maxlength="60"
            type="textarea"
            height="200"
            trim
            :clearable="false"
            v-model="params.szAddress"
          />
          <view class="input-tip">
            <text class="input-tip__length">{{ params.szAddress.length }}</text
            >/60
          </view>
        </u-form-item>
        <u-form-item
          prop="politicalName"
          label="政治面貌"
          :required="setFieldRequied('politicalStatus')"
          v-if="setFieldShow('politicalStatus')"
        >
          <u-input
            placeholder="请选择政治面貌"
            type="select"
            :disabled="disabled"
            :value="params.politicalName"
            @click="politicalPicker = true"
          />
          <common-select
            type="politicalStatus"
            title="政治面貌"
            v-model="politicalPicker"
            @confirm="confirmPoliticalPicker"
          />
        </u-form-item>
        <u-form-item
          prop="careerTypeName"
          label="职业类别"
          :required="setFieldRequied('careerType')"
          v-if="setFieldShow('careerType')"
        >
          <u-input
            placeholder="请选择职业类别"
            type="select"
            :disabled="disabled"
            :value="params.careerTypeName"
            @click="careerTypePicker = true"
          />
          <common-select
            type="professionCategory"
            title="政治面貌"
            v-model="careerTypePicker"
            @confirm="confirmCareerTypePicker"
          />
        </u-form-item>
        <u-form-item
          prop="phone"
          label="联系方式"
          :required="setFieldRequied('phone')"
          v-if="setFieldShow('phone')"
        >
          <u-input
            placeholder="请输入联系方式"
            maxlength="11"
            type="number"
            trim
            :clearable="false"
            v-model="params.phone"
          />
        </u-form-item>
        <template v-if="setFieldShow('szPhotoPath')">
          <!-- 冻结凭证就不让头像照片修改-->
          <u-form-item label="头像照片" v-if="isFreeze" class="page-form__photo">
            <u-image
              width="180rpx"
              height="200rpx"
              border-radius="12rpx"
              :src="
                params.szPhotoPath && params.szPhotoPath.length
                  ? params.szPhotoPath[0].url
                  : require('img/toPhotoCropper.png')
              "
              :error-icon="require('img/toPhotoCropper.png')"
            />
            <view class="page-form__tip"
              >凭证冻结中，暂{{
                params.szPhotoPath && params.szPhotoPath.length ? '不可修改' : '不可上传'
              }}</view
            >
          </u-form-item>
          <u-form-item
            class="page-form__photo"
            label="头像照片"
            prop="szPhotoPath"
            :required="setFieldRequied('szPhotoPath')"
            v-else
          >
            <common-upload
              name="头像照片"
              :maxSize="5 * 1024 * 1024"
              :limitType="['jpg']"
              :formData="{ bizType: 7, neighNo: params.neighNo }"
              :disabled="params.blockStatus === '1'"
              v-model="params.szPhotoPath"
              needCut
            />
            <view class="page-form__tip">支持jpg格式，单张不超过5M</view>
          </u-form-item>
        </template>

        <u-form-item
          prop="certTypeName"
          label="证件类型"
          :required="setFieldRequied('certType')"
          v-if="setFieldShow('certType')"
        >
          <u-input
            placeholder="请选择证件类型"
            type="select"
            :disabled="disabled"
            :value="params.certTypeName"
            @click="certTypePicker = true"
          />
          <common-select
            type="certificateType"
            title="证件类型"
            v-model="certTypePicker"
            @confirm="confirmCertTypePicker"
          />
        </u-form-item>
        <u-form-item
          prop="certNum"
          label="证件号码"
          :required="setFieldRequied('certNum')"
          v-if="setFieldShow('certNum') && params.certTypeName"
        >
          <u-input
            placeholder="请输入证件号码"
            maxlength="18"
            trim
            :clearable="false"
            v-model="params.certNum"
          />
        </u-form-item>
        <u-form-item
          class="page-form__photo"
          label="证件照片"
          :required="setFieldRequied('idCardPhotoPath') || setFieldRequied('idCardBackPhotoPath')"
          v-if="setFieldShow('idCardPhotoPath') || setFieldShow('idCardBackPhotoPath')"
        >
          <div class="page-form__card">
            <common-upload
              name="证件正面"
              :maxSize="5 * 1024 * 1024"
              v-model="params.idCardPhotoPath"
              v-if="setFieldShow('idCardPhotoPath')"
            />
            <common-upload
              v-if="setFieldShow('idCardBackPhotoPath')"
              class="card-left"
              name="证件反面"
              :maxSize="5 * 1024 * 1024"
              v-model="params.idCardBackPhotoPath"
            />
          </div>
          <span class="page-form__tip">支持jpg格式，单张不超过5M</span>
        </u-form-item>

        <u-form-item
          class="page-form__photo"
          label="住房证明"
          :required="setFieldRequied('housingCert')"
          v-if="setFieldShow('housingCert')"
        >
          <common-upload :maxCount="3" v-model="params.housingCert" />
          <div class="page-form__tip">提示：</div>
          <div class="page-form__tip">1、业主请提供产权证件照片（合同、产权证等）</div>
          <div class="page-form__tip">2、租客提供租客证明照片（合同等）</div>
          <div class="page-form__tip">3、亲戚/朋友请提供关系证明照片等</div>
        </u-form-item>

        <u-form-item prop="accessEffectTime" label="门禁生效时间" :required="true">
          <u-input
            :disabled="disabled"
            type="select"
            :value="params.accessEffectTime"
            placeholder="请选择"
            @click="accessBeginPicker = !disabled"
          />
          <u-picker
            v-model="accessBeginPicker"
            mode="time"
            :start-year="new Date().getFullYear()"
            safe-area-inset-bottom
            title="选择门禁生效时间"
            :params="{
              year: true,
              month: true,
              day: true,
              hour: true,
              minute: true,
              second: true
            }"
            @confirm="confirmAccessTimeBegin"
          />
        </u-form-item>
        <u-form-item prop="accessExpireTime" label="门禁失效时间" :required="true">
          <u-input
            :disabled="disabled"
            type="select"
            :value="params.accessExpireTime"
            placeholder="请选择"
            @click="accessEndPicker = !disabled"
          />
          <u-picker
            v-model="accessEndPicker"
            mode="time"
            :start-year="new Date().getFullYear()"
            safe-area-inset-bottom
            title="选择门禁失效时间"
            :params="{
              year: true,
              month: true,
              day: true
            }"
            @confirm="confirmAccessTimeEnd"
          />
        </u-form-item>
        <u-form-item
          prop="appOpenName"
          label="开通App/小程序功能权限"
          label-width="400"
          :required="setFieldRequied('appOpenStatus')"
          v-if="setFieldShow('appOpenStatus')"
        >
          <u-input
            placeholder="请选择"
            type="select"
            :disabled="disabled"
            :value="params.appOpenName"
            @click="appOpenPicker = true"
          />
          <common-select
            type="appOpenStatus"
            title="开通App/小程序功能权限"
            v-model="appOpenPicker"
            @confirm="confirmAppOpenPicker"
          />
        </u-form-item>
        <u-form-item
          prop="realPhone"
          label="开通权限手机号"
          label-width="240"
          :required="setFieldRequied('realPhone')"
          v-if="params.appOpenStatus === '1' && setFieldShow('realPhone')"
        >
          <u-input
            placeholder="请输入手机号"
            maxlength="11"
            type="number"
            trim
            :clearable="false"
            v-model="params.realPhone"
          />
        </u-form-item>
      </u-form>
      <u-toast ref="uToast" />
    </view>
    <view class="tips"> 提示：同一户内不能使用相同的手机号码开通 </view>

    <view class="page-button">
      <u-button type="primary" :ripple="true" :loading="loading" @click="onSubmit">提交</u-button>
    </view>
  </view>
</template>

<script>
import commonSelect from '_c/commonSelect'
import commonUpload from '_c/upload'
import PageLoading from '_c/pageLoading'
import { matchMobile, isChnID, matchHKB, isPassWord, matchRate } from '_u/regExp'
import { mapState } from 'vuex'
export default {
  components: {
    commonSelect,
    commonUpload,
    PageLoading
  },
  computed: {
    ...mapState({
      dic: state => state.user.dic
    }),
    hasPicker() {
      return (
        this.permanentAddressPicker ||
        this.permanentTypePicker ||
        this.certTypePicker ||
        this.birthDatePicker ||
        this.politicalPicker ||
        this.nationPicker ||
        this.genderPicker ||
        this.appOpenPicker ||
        this.accessBeginPicker ||
        this.accessEndPicker ||
        this.identityTypePicker ||
        this.rentTimePicker
      )
    }
  },
  watch: {
    hasPicker(val) {
      if (val) {
        this.disabled = true
        uni.hideKeyboard()
      } else this.disabled = false
    },
    'params.szAddress'(newVal) {
      if (newVal && newVal.length) {
        this.params.szAddress = newVal.slice(0, 60)
      }
    }
  },
  data() {
    return {
      pageLoading: true,
      poistionList: [], // 位置列表
      cellItemStyle: {
        fontWeight: 'bold'
      },
      isFreeze: false, // 是否为冻结状态
      accessBeginPicker: false, //显示门禁生效时间弹窗
      accessEndPicker: false, //显示门禁失效时间弹窗
      permanentAddressPicker: false, // 显示户籍地址的弹框
      permanentTypePicker: false, // 显示户籍类型的弹框
      certTypePicker: false, // 显示证件类型的弹框
      birthDatePicker: false, // 显示出生日期的弹框
      politicalPicker: false, // 显示政治面貌的弹框
      nationPicker: false, // 显示名族的弹框
      genderPicker: false, // 显示性别的弹框
      appOpenPicker: false, // 显示开通app账号开关的弹窗
      loading: false, //表单的加载
      structId: undefined, // 节点id
      address: undefined, // 房屋地址
      params: {
        housingCert: [], // 住房证明
        szPhotoPath: '', // 头像图片
        idCardPhotoPath: [], // 证件正面照片
        idCardBackPhotoPath: [], // 证件反面照片
        szAddress: '', // 详细地址
        permanentType: undefined, // 户籍类型
        permanentTypeName: undefined, // 户籍类型名称
        permanentAddress: undefined, // 户籍地址
        areaCode: undefined, // 户籍地址code
        certNum: undefined, //证件号码
        certType: undefined, // 证件类型
        certTypeName: undefined, // 证件类型名称
        birthDate: undefined, // 出生日期
        nation: undefined, // 名族
        nationName: undefined, // 民族名称
        genderName: undefined, // 性别名称
        gender: undefined, // 性别
        name: undefined, // 姓名
        phone: undefined, // 联系方式
        identityTypeName: undefined, // 人员类型名称
        identityType: undefined, // 人员类型
        szValidBegin: '', // 租凭开始时间
        szValidEnd: '', // 租凭结束时间
        accessEffectTime: undefined, //门禁生效时间
        accessExpireTime: undefined, //门禁失效时间
        appOpenStatus: undefined, // 自动开通app账号开关
        appOpenName: undefined, // 开通app账号开关
        realPhone: undefined // 开通权限手机号
      },
      identityTypePicker: false, // 显示人员类型的弹框
      rentTimeStartPicker: false, // 显示租凭开始时间的弹框
      rentTimeEndPicker: false, // 显示租凭结束时间的弹框
      configList: [], // 配置列表
      memberId: undefined, // 住户成员
      disabled: false
    }
  },
  onLoad: function ({ address, structId, memberId }) {
    this.address = address
    this.structId = structId
    this.memberId = memberId
    this.params.neighNo = this.$store.state.user.neighNo
    if (this.memberId) {
      uni.setNavigationBarTitle({
        title: '住户编辑'
      })
    } else {
      uni.setNavigationBarTitle({
        title: '住户登记'
      })
    }
  },
  async onReady() {
    await this.getAddress()
    await this.getConfig()
    await this.getDetail()
  },
  onShow() {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1] // 当前页面
    let cropperUrl = currPage.cropperUrl
    if (cropperUrl !== undefined) {
      this.params.szPhotoPath = cropperUrl
    }
  },
  methods: {
    // 获取地址
    async getAddress() {
      const { result, data } = await this.$request.getPosition({})
      if (result !== '1') return
      this.poistionList = data
    },
    // 获取表单字段显示隐藏配置
    async getConfig() {
      const { result, data } = await this.$request.getConfig()
      if (result !== '1') return
      this.configList = data
      // await this.$nextTick()
      this.setRules()
    },
    // 设置表单规则
    async setRules() {
      const that = this
      this.rules = {
        szPhotoPath: [
          {
            async asyncValidator(rule, value, callback) {
              if (value.length) {
                const res = await that.$request.faceQualityCheck({
                  facePhotoUrl: value[0].url,
                  neighNo: that.$store.state.user.neighNo
                })
                if (res.result === '1' && res.data.code === 1) return callback()
                else return callback(new Error('头像验证不通过'))
              } else return callback()
            },
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入姓名',
            max: 20,
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          {
            required: this.setFieldRequied('phone'),
            message: '请输入联系方式',
            trigger: ['blur', 'change']
          },
          { pattern: matchMobile, message: '请输入正确的联系方式', trigger: 'blur' }
        ],
        certTypeName: [
          {
            required: this.setFieldRequied('certType'),
            message: '请选择证件类型',
            trigger: 'change'
          }
        ],
        accessEffectTime: [{ required: true, message: '请选择门禁生效时间' }],
        accessExpireTime: [{ required: true, message: '请选择门禁失效时间' }],
        certNum: [
          {
            required: this.setFieldRequied('certNum'),
            message: '请输入证件号码',
            trigger: ['blur', 'change']
          },
          {
            validator: (rule, value) => {
              const { certType } = this.params
              if (value) {
                if (['1', '2'].includes(certType)) {
                  return isChnID(value) // 身份证
                } else if (certType === '3') {
                  return matchHKB.test(value) // 户口薄
                } else if (certType === '7') {
                  return isPassWord(value) // 护照
                }
                return matchRate.test(value)
              } else {
                return false
              }
            },
            message: '证件号码不正确',
            trigger: 'change'
          }
        ],
        identityTypeName: [
          {
            required: this.setFieldRequied('identityType'),
            message: '请选择人员类型',
            trigger: 'change'
          }
        ],
        szValidBegin: [
          {
            required: this.setFieldRequied('szValid'),
            message: '请选择租凭开始时间',
            trigger: 'change'
          }
        ],
        szValidEnd: [
          {
            required: this.setFieldRequied('szValid'),
            message: '请选择租凭结束时间',
            trigger: 'change'
          },
          {
            validator(rule, value) {
              if (!that.params.szValidBegin) return true
              return (
                Number(that.$moment(value, 'x')) >
                Number(that.$moment(that.params.szValidBegin, 'x'))
              )
            },
            message: '租凭结束时间不能早于租凭开始时间',
            trigger: 'change'
          }
        ],

        genderName: [
          {
            required: this.setFieldRequied('gender'),
            message: '请选择性别',
            trigger: 'change'
          }
        ],
        nationName: [
          {
            required: this.setFieldRequied('nation'),
            message: '请选择民族',
            trigger: 'change'
          }
        ],
        birthDate: [
          {
            required: this.setFieldRequied('birthDate'),
            message: '请选择出生日期',
            trigger: 'change'
          }
        ],

        permanentTypeName: [
          {
            required: this.setFieldRequied('permanentType'),
            message: '请选择户籍类型',
            trigger: 'change'
          }
        ],
        politicalName: [
          {
            required: this.setFieldRequied('politicalStatus'),
            message: '请选择政治面貌',
            trigger: 'change'
          }
        ],
        careerTypeName: [
          {
            required: this.setFieldRequied('careerType'),
            message: '请选择职业类别',
            trigger: 'change'
          }
        ],
        szAddress: [
          {
            required: this.setFieldRequied('szAddress'),
            message: '请输入详细地址',
            trigger: ['blur', 'change']
          }
        ],

        permanentAddress: [
          {
            required: this.setFieldRequied('permanentAddress'),
            message: '请输入户籍地址',
            trigger: ['blur', 'change']
          }
        ],
        appOpenName: [
          {
            required: this.setFieldRequied('appOpenStatus'),
            message: '请选择开通app账号开关',
            trigger: ['blur', 'change']
          }
        ],
        realPhone: [
          {
            required: this.setFieldRequied('realPhone'),
            message: '请输入正确的开通权限手机号',
            trigger: ['blur', 'change']
          },
          { pattern: matchMobile, message: '请输入正确的开通权限手机号', trigger: 'blur' }
        ]
      }
      this.$nextTick(() => {
        this.$refs.form.setRules(this.rules)
      })
      this.pageLoading = false
    },
    /**
     * 设置字段是隐藏
     * @param {String} field 字段名称
     */
    setFieldShow(field) {
      let curData = this.configList.find(item => item.field === field)
      return curData?.visibility
    },
    /**
     * 设置字段是必选
     * @param {String} field 字段名称
     */
    setFieldRequied(field) {
      let curData = this.configList.find(item => item.field === field)
      return curData?.required
    },
    /**
     * 户籍地址确定
     * @param {Arrray} arr 已选的户籍类型
     */
    confirmPermanentAddress(data) {
      this.params.permanentAddress = data.map(item => item.label).join('')
      this.params.areaCode = data.map(item => item.value).join(',')
    },
    /**
     * 户籍类型确定
     * @param {Arrray} arr 已选的户籍类型
     */
    confirmPermanentTypePicker(arr) {
      this.params = {
        ...this.params,
        permanentTypeName: arr[0]?.label,
        permanentType: arr[0]?.value
      }
    },
    /**
     * 证件类型确定
     * @param {Arrray} arr 已选的证件类型
     */
    confirmCertTypePicker(arr) {
      this.params = {
        ...this.params,
        certTypeName: arr[0]?.label,
        certType: arr[0]?.value
      }
    },
    /**
     * 政治面貌确定
     * @param {Arrray} arr 已选的政治面貌
     */
    confirmPoliticalPicker(arr) {
      this.params = {
        ...this.params,
        politicalName: arr[0]?.label,
        politicalStatus: arr[0]?.value
      }
    },
    /**
     * 职业类别确定
     * @param {Arrray} arr 已选的职业类别
     */
    confirmCareerTypePicker(arr) {
      this.params = {
        ...this.params,
        careerTypeName: arr[0]?.label,
        careerType: arr[0]?.value
      }
    },
    /**
     * 民族确定
     * @param {Arrray} arr 已选的民族
     */
    confirmNationPicer(arr) {
      this.params = {
        ...this.params,
        nationName: arr[0]?.label,
        nation: arr[0]?.value
      }
    },
    /**
     * 人员类型确定
     * @param {Arrray} arr 已选的人员类型
     */
    confirmIdentityType(arr) {
      this.params = {
        ...this.params,
        identityTypeName: arr[0]?.label,
        identityType: arr[0]?.value
      }
      if (arr[0]?.value === '1') {
        let date = new Date()
        let year = date.getFullYear()
        let year70 = date.getFullYear() + 70
        let month = date.getMonth() + 1
        let finalMonth = month < 10 ? '0' + month : month
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        this.params.accessEffectTime = year + '-' + finalMonth + '-' + day + ' 00:00:00'
        this.params.accessExpireTime = year70 + '-' + finalMonth + '-' + day + ' 23:59:59'
      }
    },
    /**
     * 性别确定
     * @param {Arrray} arr 已选的性别
     */
    confirmGenderPicker(arr) {
      this.params = {
        ...this.params,
        genderName: arr[0]?.label,
        gender: arr[0]?.value
      }
    },
    /**
     * 入住确定
     * @param {String} endDate 结束时间
     * @param {String} startDate 开始时间
     */
    confirmStartRentTime({ year, month, day }) {
      this.params.szValidBegin = `${year}-${month}-${day}`
      this.params.accessEffectTime = this.params.szValidBegin + ' 00:00:00'
    },
    confirmEndRentTime({ year, month, day }) {
      this.params.szValidEnd = `${year}-${month}-${day}`
      this.params.accessExpireTime = this.params.szValidEnd + ' 23:59:59'
    },
    /**
     * 出生日期确定
     * @param {Object} e 原生对象
     */
    confirmBirthDatePicer({ year, month, day }) {
      this.params.birthDate = `${year}-${month}-${day}`
    },
    /**
     * 自动开通app账号开关
     * @param {Arrray} arr 已选的app账号开关
     */
    confirmAppOpenPicker(arr) {
      this.params = {
        ...this.params,
        appOpenName: arr[0]?.label,
        appOpenStatus: arr[0]?.value
      }
    },
    confirmAccessTimeBegin(options) {
      this.params.accessEffectTime = `${options.year}-${options.month}-${options.day} ${options.hour}:${options.minute}:${options.second}`
    },
    confirmAccessTimeEnd(options) {
      this.params.accessExpireTime = `${options.year}-${options.month}-${options.day} 23:59:59`
    },
    // 表单提交
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const {
            szValidBegin,
            szValidEnd,
            identityType,
            name,
            phone,
            gender,
            nation,
            birthDate,
            certType,
            certNum,
            permanentType,
            szAddress,
            idCardBackPhotoPath,
            idCardPhotoPath,
            szPhotoPath,
            housingCert,
            politicalStatus,
            careerType,
            permanentAddress,
            areaCode,
            appOpenStatus,
            accessEffectTime,
            accessExpireTime,
            realPhone
          } = this.params
          let photoList = [
            {
              name: 'idCardPhotoPath',
              title: '证件正面'
            },
            {
              name: 'idCardBackPhotoPath',
              title: '证件反面'
            },
            {
              name: 'housingCert',
              title: '住房证明'
            }
          ]
          if (accessEffectTime > accessExpireTime) {
            uni.showToast({
              icon: 'none',
              title: '门禁生效时间不能大于门禁失效时间'
            })
            this.loading = false
            return
          }
          let photoData = photoList.find(
            item => this.setFieldRequied(item.name) && !this.params[item.name].length
          )
          if (photoData) {
            this.$refs.uToast.show({
              title: `请上传${photoData.title}`
            })
            this.loading = false
            return
          }
          const ajax = this.memberId ? this.$request.modifyHousehold : this.$request.addHousehold
          const { result, message } = await ajax({
            apiLoading: true,
            apiReject: true,
            houseId: this.structId,
            memberId: this.memberId,
            name,
            identityType,
            phone,
            certNum,
            certType,
            szValidBegin,
            szValidEnd,
            gender,
            nation,
            politicalStatus,
            careerType,
            birthDate,
            housingCert:
              housingCert && housingCert.length
                ? housingCert.map(item => item.url).join(',')
                : undefined,
            szPhotoPath: szPhotoPath?.[0]?.url ?? '',
            idCardPhotoPath: idCardPhotoPath?.[0]?.url ?? undefined,
            idCardBackPhotoPath: idCardBackPhotoPath?.[0]?.url ?? undefined,
            szAddress,
            permanentAddress,
            areaCode,
            permanentType,
            appOpenStatus,
            accessEffectTime,
            accessExpireTime,
            realPhone
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
            duration: 2000
          })
          const pages = getCurrentPages()
          let curIndex = pages.findIndex(item => item.route === 'pages/home/register/house')
          console.log(pages)
          if (
            pages &&
            pages[curIndex - 1] &&
            pages[curIndex - 1].route === 'pages/home/house/detail'
          ) {
            // 回退到2步住户管理
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 300)
          } else {
            // 替换到住户管理
            uni.redirectTo({
              url: '/pages/home/manage/index'
            })
          }
        } else {
          console.log(valid)
        }
      })
    },
    // 获取人员详情
    async getDetail() {
      if (this.memberId) {
        const { result, data } = await this.$request.getHouseholdDetail({
          apiLoading: true,
          memberId: this.memberId,
          houseId: this.structId
        })
        if (result !== '1') return
        this.isFreeze = data.blockStatus === '1' // 冻结状态
        let personTypeOptions = []
        let genderOptions = []
        let nationOptions = []
        let politicalStatusOptions = []
        let professionCategoryOptions = []
        let certificateTypeOptions = []
        let householdRegistTypeOptions = []
        let appOpenStatusOptions = []

        // 获取数据字典
        this.dic.map(el => {
          if (el.dataType === 'personType') {
            personTypeOptions = el.labels
          } else if (el.dataType === 'gender') {
            // 性别
            genderOptions = el.labels
          } else if (el.dataType === 'nation') {
            // 民族
            nationOptions = el.labels
          } else if (el.dataType === 'politicalStatus') {
            // 政治面貌
            politicalStatusOptions = el.labels
          } else if (el.dataType === 'professionCategory') {
            // 职业类别
            professionCategoryOptions = el.labels
          } else if (el.dataType === 'certificateType') {
            // 证件类型
            certificateTypeOptions = el.labels
          } else if (el.dataType === 'householdRegistType') {
            // 户籍类型
            householdRegistTypeOptions = el.labels
          } else if (el.dataType === 'appOpenStatus') {
            // 自动开通app账号开关
            appOpenStatusOptions = el.labels
          }
        })
        let arr = []
        if (data.housingCert && data.housingCert !== '') {
          let housingCertList = data.housingCert ? data.housingCert.split(',') : []
          housingCertList.map(el => {
            let obj = { url: el, fileName: el }
            arr.push(obj)
          })
        } else {
          arr = []
        }
        this.params = {
          ...data,
          identityTypeName: personTypeOptions.find(item => item.value === data.identityType)?.label,
          genderName: genderOptions.find(item => item.value === data.gender)?.label,
          nationName: nationOptions.find(item => item.value === data.nation)?.label,
          politicalName: politicalStatusOptions.find(item => item.value === data.politicalStatus)
            ?.label,
          careerTypeName: professionCategoryOptions.find(item => item.value === data.careerType)
            ?.label,
          certTypeName: certificateTypeOptions.find(item => item.value === data.certType)?.label,
          permanentTypeName: householdRegistTypeOptions.find(
            item => item.value === data.permanentType
          )?.label,
          appOpenName: appOpenStatusOptions.find(item => item.value === data.appOpenStatus)?.label,
          housingCert: arr,
          identityType: data.identityType ? data.identityType : undefined,
          szValidBegin: data.szValidBegin,
          szValidEnd: data.szValidEnd,
          appOpenStatus: data.appOpenStatus ? data.appOpenStatus : undefined,
          szPhotoPath:
            data.szPhotoPath && data.szPhotoPath
              ? [{ url: data.szPhotoPath, fileName: data.szPhotoPath }]
              : []
        }
        if (data.idCardPhotoPath && data.idCardPhotoPath !== '') {
          this.params.idCardPhotoPath = [
            { url: data.idCardPhotoPath, fileName: data.idCardPhotoPath }
          ]
        } else this.params.idCardPhotoPath = ''
        if (data.idCardBackPhotoPath && data.idCardBackPhotoPath !== '') {
          this.params.idCardBackPhotoPath = [
            { url: data.idCardBackPhotoPath, fileName: data.idCardBackPhotoPath }
          ]
        } else this.params.idCardBackPhotoPath = ''
        this.pageLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding-top: 16rpx;
  &-form {
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
  &-title {
    display: block;
    margin-top: 16rpx;
  }
  &-button {
    @include leelen-bottom(84);
    margin-top: 100rpx;
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
.title {
  color: $u-main-color;
  text-align: center;
  padding: 20rpx 0 0 0;
  font-weight: bold;
}

.szAddress-input {
  background: #fff;
  position: relative;
  ::v-deep .u-input__textarea {
    margin: 16rpx 0 64rpx 0 !important;
    padding: 0 !important;
    line-height: 35rpx;
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
.card-left {
  margin-left: 28rpx;
}
</style>
