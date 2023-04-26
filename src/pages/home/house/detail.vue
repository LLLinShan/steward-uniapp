<template>
  <view class="page">
    <u-tabs-swiper
      ref="uTabs"
      :list="list"
      :current="current"
      @change="tabsChange"
      :is-scroll="false"
      :active-color="$Data().primaryColor"
      inactive-color="#666666"
    ></u-tabs-swiper>
    <swiper
      class="page-swiper"
      :current="swiperCurrent"
      @transition="transition"
      @animationfinish="animationfinish"
    >
      <swiper-item v-for="(item, index) in list" :key="index">
        <person-detail
          :structId="structId"
          :houseId="houseId"
          :houseName="houseName"
          :list="personList"
          :btnStatus="btnStatus"
          v-if="index === 0"
        />
        <house-detail :detailInfo="detailInfo" :structId="structId" v-else />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import houseDetail from './houseDetail'
import personDetail from './personDetail'
export default {
  components: {
    houseDetail,
    personDetail
  },
  data() {
    return {
      list: [{ name: '住户管理' }, { name: '房屋详情' }],
      current: 0,
      swiperCurrent: 0,
      structId: undefined,
      houseId: undefined,
      houseName: undefined,
      personList: [],
      detailInfo: {},
      btnStatus: false
    }
  },
  onLoad: function ({ structId, houseId, houseName }) {
    this.structId = structId
    this.houseId = houseId
    this.houseName = houseName
    uni.setNavigationBarTitle({
      title: houseName
    })
  },
  onShow() {
    this.getList()
  },
  methods: {
    // tabs通知swiper切换
    tabsChange(index) {
      this.swiperCurrent = index
      if (index) {
        this.getDetail()
      } else {
        this.getList()
      }
    },
    // swiper-item左右移动，通知tabs的滑块跟随移动
    transition(e) {
      let dx = e.detail.dx
      this.$refs.uTabs.setDx(dx)
    },
    // swiper滑动结束，分别设置tabs和swiper的状态
    animationfinish(e) {
      let current = e.detail.current
      this.$refs.uTabs.setFinishCurrent(current)
      this.swiperCurrent = current
      this.current = current
    },
    // 获取房屋详情
    async getDetail() {
      const { result, data } = await this.$request.getNeighHouseDetail({
        apiLoading: true,
        structId: this.structId
      })
      if (result !== '1') return
      this.detailInfo = data
      if (data.houseShape !== null) {
        let temp = data.houseShape.split(',')
        this.detailInfo.houseShape = temp[0] + '室' + temp[1] + '厅' + temp[2] + '卫'
      }
      if (data.houseArea !== null && data.houseArea !== '') {
        this.detailInfo.houseArea = data.houseArea + 'm²'
      }
      if (data.usingArea !== null && data.usingArea !== '') {
        this.detailInfo.usingArea = data.usingArea + 'm²'
      }
      if (data.sharedArea !== null && data.sharedArea !== '') {
        this.detailInfo.sharedArea = data.sharedArea + 'm²'
      }
    },
    // 获取住户管理列表
    async getList() {
      const { result, data } = await this.$request.listNeighHousePerson({
        structId: this.structId
      })
      if (result === '1') {
        //判断是不是有存在租客信息,没有租客信息时不显示退/续租操作
        let curIndex = data.findIndex(item => item.personType === 2)
        if (curIndex !== -1) this.btnStatus = true
        this.personList = data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  &-swiper {
    flex: 1;
  }
}
</style>
