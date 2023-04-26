<template>
  <view class="page">
    <view class="page-search">
      <u-search
        placeholder="请输入"
        search-icon-color="#999999"
        action-text="取消"
        :focus="true"
        :clearabled="false"
        @change="onChange"
        @custom="onCancel"
      ></u-search>
    </view>
    <scroll-view class="page-list" scroll-y v-if="searchList && searchList.length">
      <!-- 列表数据 -->
      <u-cell-group class="page-title" v-for="(item, index) in searchList" :key="index">
        <u-cell-item :title="item.name" :arrow="false" @click="selectNeigh(item)">
          <view class="page-icon" v-if="item.checkSign">
            <u-image width="32" height="32" :src="require('img/home/neighSelect.png')" />
          </view>
        </u-cell-item>
      </u-cell-group>
      <view v-if="searchList.length">
        <u-loadmore :status="loadStatus" />
      </view>
    </scroll-view>
    <u-empty class="page-list" mode="data" v-else></u-empty>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      timer: null,
      searchList: [],
      loading: false,
      loadStatus: 'nomore' // loadmore / loading / nomore
    }
  },
  computed: {
    ...mapState({
      neighList: state => state.user.neighList
    })
  },
  mounted() {
    this.searchList = this.neighList.slice(0, 100)
  },
  methods: {
    // 搜索防抖
    onChange(value) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.searchList = this.neighList
          .filter(item => item.name.indexOf(value) !== -1)
          .slice(0, 100)
      }, 250)
    },
    // 取消
    onCancel() {
      uni.navigateBack()
    },
    // 选择小区
    async selectNeigh(selectedNeigh) {
      await this.$request.setSelectNeigh({ neighNo: selectedNeigh.neighNo })
      this.$store.commit('SET_NEIGH', selectedNeigh)
      this.$store.dispatch('GetUserInfo')
      this.$store.dispatch('GetNeighList')
      uni.navigateBack()
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
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
    color: #999999;
    font-size: 28rpx;
  }
  &-icon {
    float: right;
  }
  &-list {
    @include leelen-bottom(10);
    height: 0;
    flex: 1;
  }
  &-search {
    padding: 32rpx 25rpx;
    align-items: center;
    background: #ffffff;
    margin-bottom: 16rpx;
    ::v-deep .u-content {
      width: 598rpx;
      padding: 0 32rpx;
      border-radius: 12rpx !important;
      .u-input {
        margin: 0 10rpx 0 20rpx;
      }
    }
    ::v-deep .u-action {
      color: $u-type-primary;
    }
  }
}
::v-deep .u-cell_title {
  width: 500rpx !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
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
