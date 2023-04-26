<template>
  <view class="page">
    <u-cell-group class="page-form">
      <u-cell-item
        title="房号"
        :value="detailInfo.houseCode || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="创建时间"
        :value="detailInfo.createTime || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="房屋楼层"
        :value="detailInfo.floor || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="住家地址"
        :value="detailInfo.houseAddress + detailInfo.houseName || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
      <u-cell-item
        title="呼叫号"
        :value="detailInfo.callNo || $Data().defaultStr"
        :arrow="false"
      ></u-cell-item>
    </u-cell-group>
    <u-form
      ref="form"
      class="page-form"
      :error-type="['toast']"
      label-width="220"
      :model="detailInfo"
    >
      <u-form-item label="房屋类别">
        <u-input
          placeholder="请选择房屋类别"
          type="select"
          :disabled="disabled"
          :value="detailInfo.houseTypeName"
          @click="houseTypePicker = true"
        />
        <common-select
          type="houseType"
          title="房屋类别"
          v-model="houseTypePicker"
          @confirm="confirmHouseType"
        />
      </u-form-item>
      <u-form-item label="房屋状态">
        <u-input
          placeholder="请选择房屋状态"
          type="select"
          :disabled="disabled"
          :value="detailInfo.houseStatusName"
          @click="houseStatusPicker = true"
        />
        <common-select
          type="miniAppsRentalHouseStatus"
          title="房屋状态"
          v-model="houseStatusPicker"
          @confirm="confirmHouseStatus"
        />
      </u-form-item>
      <u-form-item label="产权人">
        <u-input
          placeholder="请输入产权人"
          maxlength="10"
          trim
          :clearable="false"
          v-model="detailInfo.houseOwner"
        />
      </u-form-item>
      <u-form-item label="建筑面积" prop="houseArea" required>
        <u-input
          placeholder="请输入建筑面积"
          maxlength="5"
          type="number"
          trim
          :clearable="false"
          v-model="detailInfo.houseArea"
        />
        <view class="money-tip">m²</view>
      </u-form-item>
      <u-form-item label="使用面积" prop="usingArea">
        <u-input
          placeholder="请输入使用面积"
          type="number"
          trim
          :clearable="false"
          v-model="detailInfo.usingArea"
        />
        <view class="money-tip">m²</view>
      </u-form-item>
      <u-form-item label="公摊面积" prop="sharedArea">
        <u-input
          placeholder="请输入公摊面积"
          type="number"
          trim
          :clearable="false"
          v-model="detailInfo.sharedArea"
        />
        <view class="money-tip">m²</view>
      </u-form-item>
      <u-form-item label="房屋户型">
        <u-input
          placeholder="请选择房屋户型"
          type="select"
          :disabled="disabled"
          :value="detailInfo.houseShapeName"
          @click="houseShapePicker = true"
        />
        <u-select
          v-model="houseShapePicker"
          mode="mutil-column"
          :list="houseShapeOptions"
          @confirm="confirmHouseShape"
        ></u-select>
      </u-form-item>
      <u-form-item label="房屋朝向" prop="orientation">
        <u-input
          maxlength="6"
          placeholder="请输入房屋朝向"
          trim
          :clearable="false"
          v-model="detailInfo.orientation"
        />
      </u-form-item>
    </u-form>
    <div class="page-button">
      <u-button type="primary" :ripple="true" @click="onSubmit">保存</u-button>
    </div>
  </view>
</template>

<script>
import commonSelect from '_c/commonSelect'
import { mapState } from 'vuex'
export default {
  components: {
    commonSelect
  },
  data() {
    return {
      houseStatusPicker: false, // 显示房屋状态的弹框
      houseTypePicker: false, // 显示房屋类别的弹框
      houseShapePicker: false, // 显示房屋户型的弹框
      disabled: false,
      detailInfo: {},
      rules: {
        houseArea: [
          { required: true, message: '请输入建筑面积', trigger: ['blur', 'change'] },
          {
            pattern: /^[1-9][0-9]*$/,
            message: '建筑面积请输入正整数'
          },
          {
            validator: (rule, value, callback) => {
              if (value > 99999) {
                callback(new Error('建筑面积不能大于99999㎡'))
              } else {
                callback()
              }
            },
            trigger: ['change', 'blur']
          }
        ],
        usingArea: {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^([0-9]*\.?[0-9]?[0-9]?|[0-9]+)$/g.test(value)) {
                callback(new Error('使用面积请输入数字,并最多保留两位小数'))
              } else {
                if (value < 0.01) {
                  callback(new Error('使用面积不能小于0.01㎡'))
                } else if (value > 10000) {
                  callback(new Error('使用面积不能大于10000㎡'))
                } else {
                  callback()
                }
              }
            } else {
              callback()
            }
          },
          trigger: ['change', 'blur']
        },
        sharedArea: {
          validator: (rule, value, callback) => {
            if (value) {
              if (!/^([0-9]*\.?[0-9]?[0-9]?|[0-9]+)$/g.test(value)) {
                callback(new Error('公摊面积请输入数字,并最多保留两位小数'))
              } else {
                if (value < 0.01) {
                  callback(new Error('公摊面积不能小于0.01㎡'))
                } else if (value > 10000) {
                  callback(new Error('公摊面积不能大于10000㎡'))
                } else {
                  callback()
                }
              }
            } else {
              callback()
            }
          },
          trigger: ['change', 'blur']
        },
        orientation: {
          validator: (rule, value, callback) => {
            let reg = /[^\u4e00-\u9fa5]/g
            if (value && reg.test(value)) {
              callback(new Error('房屋朝向请输入汉字'))
            } else {
              callback()
            }
          },
          trigger: ['change', 'blur']
        }
      },
      structId: undefined
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  watch: {
    hasPicker(val) {
      if (val) {
        this.disabled = true
        uni.hideKeyboard()
      } else this.disabled = false
    }
  },
  computed: {
    ...mapState({
      dic: state => state.user.dic
    }),
    hasPicker() {
      return this.houseTypePicker || this.houseStatusPicker || this.houseShapePicker
    },
    houseShapeOptions() {
      const allList = []
      const envList1 = []
      const envList2 = []
      const envList3 = []
      for (let i = 0; i <= 99; i++) {
        envList1.push({
          value: i,
          label: i + '室'
        })
      }
      for (let i = 0; i <= 9; i++) {
        envList2.push({
          value: i,
          label: i + '厅'
        })
        envList3.push({
          value: i,
          label: i + '卫'
        })
      }
      allList[0] = envList1
      allList[1] = envList2
      allList[2] = envList3
      return allList
    }
  },
  onLoad: function ({ structId }) {
    this.structId = structId
  },
  onShow() {
    this.getDetail()
  },
  methods: {
    // 房屋户型确定
    confirmHouseShape(arr) {
      const chooseList = []
      for (const key in arr) {
        chooseList.push(arr[key].value)
      }
      this.detailInfo.houseShape = chooseList.toString()
      this.detailInfo.houseShapeName = arr[0].label + arr[1].label + arr[2].label
    },
    // 房屋状态确定
    confirmHouseStatus(arr) {
      this.detailInfo = {
        ...this.detailInfo,
        houseStatusName: arr[0]?.label,
        houseState: arr[0]?.value
      }
    },
    // 房屋类别确定
    confirmHouseType(arr) {
      this.detailInfo = {
        ...this.detailInfo,
        houseTypeName: arr[0]?.label,
        houseType: arr[0]?.value
      }
    },
    // 获取房屋详情
    async getDetail() {
      const { result, data } = await this.$request.getNeighHouseDetail({
        apiLoading: true,
        structId: this.structId
      })
      if (result !== '1') return

      let houseTypeOptions = []
      let houseStatusOptions = []
      // 获取数据字典
      this.dic.map(el => {
        if (el.dataType === 'houseType') {
          // 房屋类别
          houseTypeOptions = el.labels
        } else if (el.dataType === 'miniAppsRentalHouseStatus') {
          // 房屋状态
          houseStatusOptions = el.labels
        }
      })
      let houseShapeName
      if (data.houseShape !== null) {
        let temp = data.houseShape.split(',')
        houseShapeName = temp[0] + '室' + temp[1] + '厅' + temp[2] + '卫'
      }
      console.log(data.houseType, 'houseTypehouseTypehouseType')
      console.log(data.houseState, 'data.houseStatusdata.houseStatus')
      this.detailInfo = {
        ...data,
        houseId: data.id,
        houseShapeName: houseShapeName,
        houseTypeName: houseTypeOptions.find(item => item.value === String(data.houseType))?.label,
        houseStatusName: houseStatusOptions.find(item => item.value === String(data.houseState))
          ?.label
      }
    },
    onSubmit() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.onSave()
        }
      })
    },
    async onSave() {
      const params = {
        houseShape: this.detailInfo.houseShape,
        houseArea: this.detailInfo.houseArea,
        houseOwner: this.detailInfo.houseOwner,
        houseState: this.detailInfo.houseState,
        houseType: this.detailInfo.houseType,
        orientation: this.detailInfo.orientation,
        sharedArea: this.detailInfo.sharedArea,
        usingArea: this.detailInfo.usingArea,
        houseId: this.detailInfo.houseId
      }
      const { result, message } = await this.$request.modifyHouseInfo({
        apiLoading: true,
        ...params
      })
      if (result !== '1') return
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
        if (pages[i].route === 'pages/home/house/detail') {
          backnum = num - i - 1
        }
      }
      uni.navigateBack({
        delta: backnum
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
  height: 100vh;
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
  }
  &-button {
    @include leelen-bottom(20);
    width: 100%;
    margin-top: 16rpx;
    padding-top: 32rpx;
    background: #ffffff;
    ::v-deep .u-btn {
      margin: 0 30rpx;
    }
  }
}
</style>
