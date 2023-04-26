<template>
  <view class="house" v-if="list && list.length">
    <scroll-view class="house-view" scroll-x="true" :scroll-into-view="intoViewIndex">
      <view
        class="house-view__item"
        v-for="(item, index) in list"
        :key="index"
        :id="`house-label${index}`"
      >
        <text
          class="house-label"
          :class="[
            'house-label',
            Boolean(index === list.length - 1) ? 'house-label__last' : 'house-label__default'
          ]"
          @click="onHome(item, index)"
        >
          {{ item.label }}</text
        >
        <u-icon
          size="28rpx"
          color="#999999"
          name="arrow-right"
          v-if="index < list.length - 1"
        ></u-icon>
      </view>
    </scroll-view>

    <view class="house-list" :style="{ background: hasWhiteBg ? '#ffffff' : 'none' }">
      <list :data="curList" @next="onNext" @setWhite="onWhite" />
    </view>
  </view>
  <u-empty v-else />
</template>
<script>
import List from './List'
export default {
  props: {
    hasPerson: {
      // 是否到住家层级
      type: Boolean,
      default: false
    },
    empty: {
      // 空置树(换房使用)
      type: Boolean,
      default: false
    }
  },
  components: {
    List
  },
  data() {
    return {
      hasWhiteBg: false, // 是否有白色背景 pref: 为了优化视觉上滚动条闪动滑动
      intoViewIndex: undefined, // 设置移动到的描点标识
      list: [], // 房屋列表
      curList: [] // 当前房屋下所有子列表
    }
  },
  watch: {
    list: {
      handler(value) {
        if (value && value.length) {
          this.$nextTick(() => {
            this.intoViewIndex = 'house-label' + (value.length - 1)
          })
        }
      },
      immediate: true
    }
  },
  created() {
    this.getNeighData('1')
  },
  methods: {
    /**
     * 获取小区树数据
     * @param {String} id 房屋id
     */
    async getNeighData(id) {
      let api = this.empty
        ? this.$request.getNeighVacantStructTree
        : this.$request.getNeighStructTree
      const { result, data } = await api({
        apiLoading: true,
        structId: id
      })
      if (result !== '1') {
        this.curList = []
        return
      }
      if (data) {
        const { structId, label, children, type } = data
        // 如果包含了就不在加了
        let ids = this.list.map(item => item.structId)
        if (!ids.includes(id)) {
          this.list.push({
            label,
            structId,
            type
          })
        }

        this.curList = children.map(item => ({
          ...item,
          key: item.structId
        }))
      }
    },
    /**
     * 获取房屋下的人员的数据
     * @param {String} structId 房屋id
     */
    async getPersonData(houseStructId) {
      uni.setStorageSync('houseStructId', houseStructId)
      const { result, data } = await this.$request.listHouseholdAccount({
        page: {
          pageNum: 0,
          pageSize: 100
        },
        params: {
          houseStructId
        }
      })
      if (result === '1') {
        this.curList = data.list.map(item => ({
          ...item,
          key: item.memberId,
          label: item.realPhone,
          structId: item.houseId,
          realPhone: item.realPhone,
          type: 'person'
        }))
      }
    },
    /**
     * 获取下一级数据 （房屋或者人员）
     * @param {String} structId 房屋id
     * @param {String,Number} type 房屋类型或者人员标识
     * @param {String} label 房屋或者人员
     * @param {String} memberId 人员id
     */
    onNext({ structId, type, label, memberId, realPhone, houseId }) {
      // 如果人员类型为人员类型，直接触发父级事件getPerson
      if (type === 'person') {
        this.$emit('getPerson', {
          memberId,
          houseId: structId,
          realPhone
        })
        return
      }
      // 如果人员类型不为住家或者别墅，继续获取子级数据
      if (![9, 6].includes(type)) {
        this.getNeighData(structId)
        return
      }

      // 当前已经是别墅或住家层级

      // 如果是人员模式，就请求接口获取住家下的人员信息
      if (this.hasPerson) {
        this.list.push({
          label,
          structId,
          type: 'person'
        })
        this.getPersonData(structId)
      } else {
        // 如果是房屋模式，直接触发父级事件getHouse
        this.$emit('getHouse', { structId, houseId, label })
      }
    },
    /**
     * 获取当前数据
     * @param {String} structId 房屋id
     * @param {Number} curIndex 当前索引
     */
    onHome({ structId, type }, curIndex) {
      this.curList = []
      if (type === 'person') {
        this.getPersonData(structId)
      } else {
        this.getNeighData(structId)
      }

      this.list = this.list.filter((item, index) => index <= curIndex)
      console.log(this.list, 'this.list')
    },
    /**
     * 是否为白色列表
     * @param {Number} scrollTop 距离顶部的高度
     */
    onWhite(scrollTop) {
      this.hasWhiteBg = Boolean(scrollTop)
    }
  }
}
</script>
<style lang="scss" scoped>
.house {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  &-view {
    height: 105rpx;
    width: 690rpx;
    padding: 0rpx 30rpx;
    white-space: nowrap;
    position: relative;
    background: #ffffff;
    margin: 16rpx 0;
    &__item {
      position: relative;
      display: inline-block;
      height: 105rpx;
      line-height: 105rpx;
      font-size: 32rpx;
      transition-duration: 0.5s;
      flex: auto;
      width: auto;
    }
  }

  &-label {
    display: inline-block;

    &__last {
      color: $u-type-primary;
    }
    &__default {
      color: $u-tips-color;
    }
  }
  &-list {
    flex: 1;
    height: 0;
    // background: #ffffff;
  }
}
</style>
