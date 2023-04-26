/** * @description: 功能描述 * @author: 开发人员 * @creatTime: 创建时间 * @updated: 时间+更新说明 */
<template>
  <view class="page">
    <!-- <u-navbar
      title="远程开门"
      title-color="#333333"
      back-icon-color="#333333"
      :background="{ backgroundColor: '#ffffff' }"
      :customBack="toHome"
    /> -->
    <view class="page-list">
      <view class="page-form">
        <view class="item-wrap" v-for="(item, index) in list" :key="index">
          <view class="opt-open" @click="openDoor(item)">
            <u-image
              v-if="item.inOutType === 1"
              width="36rpx"
              height="36rpx"
              :src="require('img/home/openDoorIn.png')"
              alt=""
            />
            <u-image
              v-else-if="item.inOutType === 2"
              width="36rpx"
              height="36rpx"
              :src="require('img/home/openDoorOut.png')"
              alt=""
            />
            <u-image
              v-else
              width="36rpx"
              height="36rpx"
              :src="require('img/home/openDoorNone.png')"
              alt=""
            />
            <view class="text">{{ item.address + item.name }}</view>
          </view>
          <view
            class="more-icon"
            v-if="item.address.length + item.name.length > 10"
            @click="getItemInfo(item.address + item.name)"
            ><u-image width="36rpx" height="36rpx" :src="require('img/home/more.png')" alt=""
          /></view>
        </view>
      </view>
      <view v-if="list && list.length">
        <u-loadmore :status="loadStatus" />
      </view>
      <u-empty mode="data" v-else></u-empty>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {},
  props: [],
  computed: {
    ...mapState({
      neighName: state => state.user.neighName,
      neighNo: state => state.user.neighNo
    })
  },
  data() {
    return {
      list: [], // 列表
      loadStatus: 'nomore' // loadmore / loading / nomore
    }
  },
  onShow() {
    this.getList()
  },
  methods: {
    // 获取远程开门列表
    async getList() {
      this.loadStatus = 'loading'
      const { result, data } = await this.$request.listEntranceDevice()
      this.loadStatus = 'loadmore'
      if (result === '1') {
        this.list = data
        this.loadStatus = 'nomore'
      }
    },
    // 开门
    async openDoor(item) {
      uni.showLoading({ title: '开门中,请稍后...' })
      const params = {
        deviceId: item.id,
        did: item.did,
        directDid: item.directDid
      }
      const { result } = await this.$request.remoteOpenDoor(params)
      if (result === '1') {
        uni.hideLoading()
        uni.showModal({
          content: '开门成功',
          showCancel: false,
          confirmText: '确定',
          confirmColor: this.$Data().primaryColor
        })
        return
      }
    },
    // 显示更多信息
    getItemInfo(value) {
      uni.showModal({
        content: value,
        showCancel: false,
        confirmText: '确定',
        confirmColor: this.$Data().primaryColor
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-list {
  ::v-deep .u-icon {
    margin-top: 400rpx;
  }

  .page-form {
    width: 750rpx;
    padding: 0 32rpx;
    background: #fff;
    .item-wrap {
      border-bottom: 1px solid #eeeeee;
      height: 104rpx;
      line-height: 104rpx;
      display: flex;
      .opt-open {
        flex: 1;
        u-image {
          display: inline-block;
          margin-right: 20rpx;
        }
        .text {
          width: 580rpx;
          height: 36rpx;
          line-height: 36rpx;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .more-icon {
        width: 40rpx;
        margin-top: 24rpx;
      }
    }
  }
}
</style>
