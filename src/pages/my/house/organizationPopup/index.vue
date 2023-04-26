<template>
  <u-popup v-model="visible" mode="bottom" border-radius="32" height="800">
    <view class="organization">
      <view class="organization-title">选择管理机构</view>
      <view class="organization-search">
        <u-search
          placeholder="请输入管理机构搜索"
          search-icon-color="#999999"
          :action-style="{ color: '#00C8CF' }"
          v-model="name"
          @custom="onSearch"
        ></u-search>
      </view>
      <scroll-view scroll-y="true" style="height: 500rpx">
        <view class="organization-list" v-if="!!organizationList.length">
          <view
            @click="getName(item)"
            v-for="item in organizationList"
            :key="item.id"
            class="organization-list__item"
          >
            {{ item.organizationName }}
          </view>
        </view>
        <view v-else class="organization-list organization-none">暂无数据</view>
      </scroll-view>
    </view>
  </u-popup>
</template>
<script>
import Utils from '_u'
export default {
  props: {
    // 是否显示弹框
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      organizationList: []
    }
  },

  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log('111', val)
        this.name = ''
        this.getList()
      }
    }
  },

  methods: {
    getName(item) {
      this.$emit('confirm', item)
      this.visible = false
    },
    async getList(organizationName = undefined) {
      const { result, data } = await this.$request.getOrganizationList({ organizationName })
      if (result === '1') this.organizationList = data ?? []
    },
    // 搜索防抖
    onSearch: Utils.debounce(function () {
      this.getList(this.name)
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
.organization {
  font-size: 32rpx;
  color: $u-main-color;
  &-title {
    text-align: center;
    line-height: 108rpx;
    font-weight: bold;
    border-bottom: 1rpx solid #eee;
  }
  &-search {
    height: 120rpx;
    line-height: 120rpx;
    border-bottom: 1rpx solid #eee;
    padding: 0 32rpx;
  }
  &-list {
    padding: 0 10rpx 40rpx 32rpx;
    &__item {
      border-bottom: 1rpx solid #eee;
      padding: 20rpx 20rpx 20rpx 0;
    }
  }
  &-none {
    text-align: center;
    padding-top: 100rpx;
  }
}
</style>
