<template>
  <view class="page">
    <u-cell-group>
      <u-cell-item
        title="更新时间"
        :arrow="false"
        :title-style="cellItemStyle"
        :value="detailInfo.updateDetailTime"
      ></u-cell-item>
    </u-cell-group>
    <u-cell-group>
      <u-cell-item
        title="房源信息"
        :arrow="false"
        :title-style="cellItemStyle"
        required
      ></u-cell-item>
    </u-cell-group>
    <u-cell-group class="page-title">
      <u-cell-item
        title="出租屋名称"
        :value="detailInfo.neighName || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="房屋楼层"
        :value="detailInfo.floor || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="房号"
        :value="detailInfo.houseCode || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="建筑面积"
        :value="detailInfo.houseArea || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="房屋户型"
        :value="detailInfo.houseShape || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="房屋朝向"
        :value="detailInfo.orientation || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
    </u-cell-group>
    <u-form ref="form" class="page-form" :error-type="['toast']" label-width="220" :model="params">
      <u-form-item label="月租金"></u-form-item>
      <u-form-item prop="monthRentTypeName" label="发布类型" required>
        <u-input
          placeholder="请选择发布类型"
          type="select"
          :disabled="disabled"
          :value="params.monthRentTypeName"
          @click="publishTypePicker = true"
        />
        <common-select
          :options="monthRentTypeOptions"
          title="发布类型"
          v-model="publishTypePicker"
          @confirm="confirmPublishType"
        />
      </u-form-item>
      <u-form-item prop="monthRent" label="租金" required v-if="params.monthRentType === 1">
        <u-input
          placeholder="请输入金额"
          maxlength="7"
          type="number"
          trim
          :clearable="false"
          v-model="params.monthRent"
        />
        <view class="money-tip">元/月</view>
      </u-form-item>
      <u-form-item class="page-form__photo" label="房源图片" required>
        <div class="page-form__card">
          <common-upload
            :maxCount="8"
            :maxSize="5 * 1024 * 1024"
            v-model="params.houseResourcesPic"
          />
        </div>
      </u-form-item>
      <u-form-item label="房源标签"></u-form-item>
      <u-form-item class="content-input">
        <text v-for="(aaa, index) in resultName" :key="index">{{ aaa }}</text>
        <div>
          <u-button type="primary" :ripple="true" size="mini" @click="chooseTag(params)">
            + 添加标签</u-button
          >
        </div>
      </u-form-item>
      <u-form-item label="房源描述">
        <view class="input-tip">
          <text class="input-tip__length">{{ params.houseDescribe.length || 0 }}</text
          >/300
        </view>
      </u-form-item>
      <u-form-item class="content-input">
        <u-input
          placeholder="请输入房源描述"
          maxlength="300"
          type="textarea"
          height="400"
          trim
          :clearable="false"
          v-model="params.houseDescribe"
        />
      </u-form-item>
      <u-form-item prop="phone" label="联系方式" required>
        <u-input
          placeholder="请输入联系方式"
          maxlength="12"
          type="number"
          trim
          :clearable="false"
          v-model="params.phone"
        />
      </u-form-item>
    </u-form>
    <div class="page-two" v-if="params.houseResourceStatus === 1">
      <u-button type="error" :ripple="true" @click="onSubmit(1)">房源下架</u-button>
      <u-button type="primary" :ripple="true" @click="onSubmit(2)">更新发布</u-button>
    </div>
    <div class="page-one" v-else>
      <u-button type="primary" :ripple="true" @click="onSubmit(2)">重新发布</u-button>
    </div>
  </view>
</template>
<script>
import commonUpload from '_c/upload'
import commonSelect from '_c/commonSelect'
import { matchMobile, matchPhone } from '_u/regExp'
import { mapState } from 'vuex'
export default {
  components: {
    commonUpload,
    commonSelect
  },
  data() {
    return {
      publishTypePicker: false, //显示发布类型弹窗
      monthRentTypeOptions: [
        {
          value: 1,
          label: '公开'
        },
        {
          value: 2,
          label: '面议'
        }
      ],
      params: {
        id: undefined,
        monthRent: undefined, //月租金金额
        houseDescribe: undefined, //房源描述
        houseResourcesPic: [], //房源图片，多张图片图片地址用逗号隔开
        monthRentTypeName: undefined,
        monthRentType: undefined, //月租金类型 1公开 2面议
        phone: undefined, //联系方式
        decorationTagList: [], //装修情况标签列表
        housePointList: [], //房屋亮点标签列表
        houseConfigList: [] //房屋配置标签列表
      },
      resultName: [],
      rules: {
        monthRentTypeName: [
          {
            required: true,
            message: '请选择管理机构',
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: ['blur', 'change'] },
          {
            validator: (rule, value) => {
              if (value) {
                return matchMobile.test(value) || matchPhone.test(value)
              } else {
                return false
              }
            },
            message: '联系方式不正确',
            trigger: ['blur', 'change']
          }
        ]
      },
      detailInfo: {} //房屋详情
    }
  },
  computed: {
    ...mapState({
      dic: state => state.user.dic
    }),
    hasPicker() {
      return this.publishTypePicker
    }
  },
  onLoad: function ({ id }) {
    this.params.id = id
    this.getDetail()
  },
  onShow() {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    if (currPage.data.isChange === 1) {
      this.params.decorationTagList = currPage.data.decorationTagList
      this.params.housePointList = currPage.data.housePointList
      this.params.houseConfigList = currPage.data.houseConfigList
      this.resultName = currPage.data.resultName
    }
  },
  watch: {
    hasPicker(val) {
      if (val) {
        this.disabled = true
        uni.hideKeyboard()
      } else this.disabled = false
    },
    'params.houseDescribe'(newVal) {
      if (newVal && newVal.length) {
        this.params.houseDescribe = newVal.slice(0, 300)
      }
    }
  },
  methods: {
    //发布类型确定
    confirmPublishType(arr) {
      this.params = {
        ...this.params,
        monthRentTypeName: arr[0]?.label,
        monthRentType: arr[0]?.value
      }
    },
    // 获取房屋详情
    async getDetail() {
      const { result, data } = await this.$request.houseResourceDetail({
        apiLoading: true,
        houseResourceId: this.params.id
      })
      if (result !== '1') return
      let houseShapeTemp = ''
      if (data.houseShape !== null) {
        let temp = data.houseShape.split(',')
        houseShapeTemp = temp[0] + '室' + temp[1] + '厅' + temp[2] + '卫'
      }
      this.detailInfo = {
        houseResourceId: data.houseResourceId,
        neighName: data.neighName,
        floor: data.floor,
        houseCode: data.houseCode,
        houseArea: data.houseArea,
        houseShape: houseShapeTemp,
        orientation: data.orientation,
        updateTime: data.updateTime,
        updateDetailTime: data.updateDetailTime
      }
      //房源图片
      let arr = []
      if (data.houseResourcesPic && data.houseResourcesPic !== '') {
        let houseResourcesPicList = data.houseResourcesPic ? data.houseResourcesPic.split(',') : []
        houseResourcesPicList.map(el => {
          let obj = { url: el, fileName: el }
          arr.push(obj)
        })
      } else {
        arr = []
      }
      this.params = {
        ...this.params,
        monthRentTypeName: this.monthRentTypeOptions.find(item => item.value === data.monthRentType)
          ?.label,
        monthRentType: data.monthRentType,
        monthRent: data.monthRent,
        houseResourcesPic: arr,
        decorationTagList: data.decorationTagList,
        housePointList: data.housePointList,
        houseConfigList: data.houseConfigList,
        houseDescribe: data.houseDescribe,
        phone: data.phone,
        houseResourceStatus: data.houseResourceStatus
      }
      let decorationTagDic = []
      let housePointDic = []
      let houseConfigDic = []
      // 获取数据字典
      this.dic.map(el => {
        if (el.dataType === 'decorationTag') {
          //装修情况
          decorationTagDic = el.labels
        } else if (el.dataType === 'housePointTag') {
          // 房屋亮点
          housePointDic = el.labels
        } else if (el.dataType === 'houseConfigTag') {
          // 房屋配置
          houseConfigDic = el.labels
        }
      })
      let decorationTagName = []
      decorationTagDic.map(item => {
        if (data.decorationTagList.indexOf(item.value) !== -1) {
          decorationTagName.push(item.label)
        }
      })
      let housePointName = []
      housePointDic.map(item => {
        if (data.housePointList.indexOf(item.value) !== -1) {
          housePointName.push(item.label)
        }
      })
      let houseConfigName = []
      houseConfigDic.map(item => {
        if (data.houseConfigList.indexOf(item.value) !== -1) {
          houseConfigName.push(item.label)
        }
      })
      this.resultName = decorationTagName.concat(housePointName, houseConfigName)
      this.$refs.form.setRules(this.rules)
    },
    chooseHouse() {
      uni.navigateTo({
        url: '/pages/home/rent/chooseHouse'
      })
    },
    chooseTag() {
      uni.navigateTo({
        url: `/pages/home/rent/houseTag?decorationTagList=${this.params.decorationTagList}&housePointList=${this.params.housePointList}&houseConfigList=${this.params.houseConfigList}`
      })
    },
    onSubmit(status) {
      if (!this.params.houseResourcesPic.length) {
        uni.showToast({
          title: '请上传房源图片',
          icon: 'none'
        })
        return
      }
      if (this.params.monthRentType === 1 && !this.params.monthRent) {
        uni.showToast({
          title: '请输入金额',
          icon: 'none'
        })
        return
      }
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.release(status)
        }
      })
    },
    // 1：下架 2:重新发布
    async release(status) {
      console.log(status)
      const houseResourcesPic = this.params.houseResourcesPic
      const api =
        status === 1 ? this.$request.houseResourcePutoff : this.$request.houseResourcePuton
      const { result, message } = await api({
        apiLoading: true,
        ...this.params,
        houseResourceId: this.params.id,
        houseResourcesPic:
          houseResourcesPic && houseResourcesPic.length
            ? houseResourcesPic.map(item => item.url).join(',')
            : undefined
      })
      if (result !== '1') return
      uni.showToast({
        title: message,
        mask: true,
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            const pages = getCurrentPages()
            const num = pages.length
            //当前页面栈总数
            let backnum
            //需要返回的页数
            for (let i = 0; i < num; i++) {
              //循环找到指定页面路由所在的页数
              if (pages[i].route === 'pages/home/rent/index') {
                backnum = num - i - 1
              }
            }
            uni.navigateBack({
              delta: backnum
            })
          }, 1000)
        }
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
  // &-list {
  //   height: 0;
  //   flex: 1;
  // }
  &-form {
    padding: 0 32rpx;
    background: #ffffff;
    &__photo {
      ::v-deep .u-form-item__body {
        flex-direction: column !important;
      }
      ::v-deep .u-form-item--left {
        flex: 1 !important;
        width: 220rpx;
      }
    }
    .money-tip {
      position: absolute;
      right: 0;
      top: 0;
    }
    .input-tip {
      text-align: right;
      font-size: 28rpx;
      color: $u-tips-color;
      .input-tip__length {
        color: #00c8cf;
      }
    }
    .textright {
      text-align: right;
      color: #00c8cf !important;
    }
  }
  &-title {
    display: block;
    margin-bottom: 16rpx;
  }
  &-two {
    @include leelen-bottom(32);
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 16rpx;
    padding-top: 32rpx;
    background: #fff;
    u-button {
      width: 250rpx;
      margin-right: 20rpx;
    }
  }
  &-one {
    @include leelen-bottom(32);
    width: 100%;
    margin-top: 16rpx;
    padding-top: 32rpx;
    background: #ffffff;
    ::v-deep .u-btn {
      margin: 0 30rpx;
    }
  }
}
.content-input {
  background: #fff;
  position: relative;
  text {
    margin-right: 12rpx;
    height: 36rpx;
    padding: 0 10rpx;
    font-size: 24rpx;
    border-radius: 8rpx;
    text-align: center;
    background-color: #e5fafa;
    color: #00c8cf;
  }
  ::v-deep .u-input__textarea {
    margin: 16rpx 0 16rpx 0 !important;
    padding: 0 !important;
    line-height: 35rpx;
    max-height: 450rpx;
    height: auto !important;
    overflow-y: scroll;
  }
  ::v-deep .u-form-item--left {
    align-items: flex-start !important;
  }
}
</style>
