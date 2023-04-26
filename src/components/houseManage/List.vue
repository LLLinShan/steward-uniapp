<template>
  <scroll-view class="house-data" scroll-y :scroll-top="scrollTop" @scroll="onScroll">
    <view
      :style="{
        height: getVirtualHeight
      }"
    ></view>
    <u-cell-group class="house-data__virtual" :style="{ top: getTop }" v-if="data && data.length">
      <u-cell-item
        class="house-data__item"
        :style="{
          height: cellHeight + 'px'
        }"
        :title-style="{
          overflow: 'hidden',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis'
        }"
        v-for="item in visibleData"
        :key="item.key"
        :title="item.label"
        @click="$emit('next', item)"
      ></u-cell-item>
    </u-cell-group>
    <u-empty mode="data" v-else />
  </scroll-view>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      viewScrollTop: 0,
      scrollTop: 0, // 滚动条距离
      cellHeight: 52, // 块高度
      end: 0, // 结束的索引
      start: 0, // 开始的索引
      count: 30, // 一页几个数据
      remain: 8 // 预留的数据
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val && val.length) {
          this.scrollTop = this.viewScrollTop
          this.$nextTick(() => {
            this.scrollTop = 0
          })
          this.updateVisibleData()
        }
      },
      immediate: true
    },
    viewScrollTop: {
      handler(val) {
        this.$emit('setWhite', val)
      },
      immediate: true
    }
  },

  computed: {
    // 前面预留几个
    prevCount() {
      return Math.min(this.start, this.remain)
    },
    // 后面预留几个
    nextCount() {
      return Math.min(this.remain, this.end)
    },
    // 虚拟高度
    getVirtualHeight() {
      return `${this.data.length * this.cellHeight}px`
    },
    // 定位top
    getTop() {
      return `${this.start * this.cellHeight}px`
    },
    // 可显示的
    visibleData() {
      return this.data.slice(this.start, Math.min(this.end, this.data.length))
    }
  },
  methods: {
    // 更新可视数据
    updateVisibleData() {
      this.start =
        Math.floor(this.viewScrollTop / this.cellHeight) - this.prevCount >= 0
          ? Math.floor(this.viewScrollTop / this.cellHeight) - this.prevCount
          : 0
      this.end = this.start + this.count + this.nextCount
    },
    /**
     * 滚动条事件
     * @param {Object} e 原生事件
     */
    onScroll(e) {
      this.viewScrollTop = e.detail.scrollTop
      this.updateVisibleData()
    }
  }
}
</script>
<style lang="scss" scoped>
.house-data {
  position: relative;
  width: 100%;

  &__virtual {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  &__item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #666;
    box-sizing: border-box;
  }
}
</style>
