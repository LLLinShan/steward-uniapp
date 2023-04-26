<template>
  <view class="page">
    <view class="page-form">
      <u-cell-group class="page-title">
        <u-cell-item title="装修情况" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
      </u-cell-group>
      <view class="page-choose">
        <ul>
          <li
            v-for="(item, index) in decorateDic"
            :key="index"
            @click="changeRadioLi(item)"
            :class="[item.select ? 'select' : '']"
          >
            {{ item.label }}
          </li>
        </ul>
      </view>
      <u-cell-group class="page-title">
        <u-cell-item title="房屋亮点" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
      </u-cell-group>
      <view class="page-choose">
        <ul>
          <li
            v-for="(item, index) in housePointDic"
            :key="index"
            @click="changeLi(item)"
            :class="[item.select ? 'select' : '']"
          >
            {{ item.label }}
          </li>
        </ul>
      </view>
      <u-cell-group class="page-title">
        <u-cell-item title="装修配置" :arrow="false" :title-style="cellItemStyle"></u-cell-item>
      </u-cell-group>
      <div class="page-choose">
        <ul>
          <li
            v-for="(item, index) in configDic"
            :key="index"
            @click="changeLi(item)"
            :class="[item.select ? 'select' : '']"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </view>
    <div class="page-button">
      <u-button type="primary" :ripple="true" @click="confirmBtn">确定</u-button>
    </div>
  </view>
</template>

<script>
import Utils from '_u'
export default {
  data() {
    return {
      decorateDic: [], //装修情况字典列表
      housePointDic: [], //房屋亮点字典列表
      configDic: [], //装修配置字典列表
      decorationTagList: [], //装修情况标签列表
      housePointList: [], //房屋亮点标签列表
      houseConfigList: [] //房屋配置标签列表
    }
  },
  onLoad: function ({ decorationTagList, housePointList, houseConfigList }) {
    this.decorationTagList = decorationTagList.split(',')
    this.housePointList = housePointList.split(',')
    this.houseConfigList = houseConfigList.split(',')
  },
  onShow() {
    this.getDic()
  },
  methods: {
    getDic() {
      // houseResourceTag 房源标签
      // decorationTag 装修情况
      // housePointTag 房屋亮点
      // houseConfigTag 房屋配置
      let decoration = Utils.getDicList('decorationTag')
      this.decorateDic = decoration.map(item => {
        if (this.decorationTagList.indexOf(item.value) !== -1) {
          return {
            ...item,
            select: true
          }
        }
        return {
          ...item,
          select: false
        }
      })
      let pointTag = Utils.getDicList('housePointTag')
      this.housePointDic = pointTag.map(item => {
        if (this.housePointList.indexOf(item.value) !== -1) {
          return {
            ...item,
            select: true
          }
        }
        return {
          ...item,
          select: false
        }
      })
      let configTag = Utils.getDicList('houseConfigTag')
      this.configDic = configTag.map(item => {
        if (this.houseConfigList.indexOf(item.value) !== -1) {
          return {
            ...item,
            select: true
          }
        }
        return {
          ...item,
          select: false
        }
      })
    },
    changeRadioLi(choose) {
      this.decorateDic = this.decorateDic.map(item => {
        if (item.value === choose.value) {
          return {
            ...item,
            select: !choose.select
          }
        }
        return {
          ...item,
          select: false
        }
      })
    },
    changeLi(item) {
      if (item.select) {
        item.select = false
      } else {
        item.select = true
      }
    },
    confirmBtn() {
      this.decorationTagList = this.decorateDic
        .filter(item => item.select)
        .map(item => {
          return item.value
        })
      this.housePointList = this.housePointDic
        .filter(item => item.select)
        .map(item => {
          return item.value
        })
      this.houseConfigList = this.configDic
        .filter(item => item.select)
        .map(item => {
          return item.value
        })
      let decorationTagValue = this.decorateDic
        .filter(item => item.select)
        .map(item => {
          return item.label
        })
      let housePointValue = this.housePointDic
        .filter(item => item.select)
        .map(item => {
          return item.label
        })
      let houseConfigName = this.configDic
        .filter(item => item.select)
        .map(item => {
          return item.label
        })
      let resultName = decorationTagValue.concat(housePointValue, houseConfigName)
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        isChange: 1,
        decorationTagList: this.decorationTagList,
        housePointList: this.housePointList,
        houseConfigList: this.houseConfigList,
        resultName
      })
      uni.navigateBack()
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  &-title {
    display: block;
    margin-top: 16rpx;
  }
  &-form {
    flex: 1;
    height: 0;
  }
  &-choose {
    display: block;
    height: auto;
    padding: 20rpx;
    background: #fff;
    li {
      background: #efefef;
      color: #333333;
      padding: 8rpx 30rpx;
      margin-right: 10rpx;
      margin-bottom: 10rpx;
      border-radius: 10rpx;
      display: inline-block;
      width: 30%;
      text-align: center;
    }
    li.select {
      background-color: #00c8cf;
      color: #fff;
    }
  }
  &-button {
    @include leelen-bottom(32);
    width: 100%;
    padding-top: 32rpx;
    background: #ffffff;
    ::v-deep .u-btn {
      margin: 0 30rpx;
    }
  }
}
</style>
