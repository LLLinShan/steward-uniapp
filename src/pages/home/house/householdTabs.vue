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
        <household-detail
          :memberId="memberId"
          :houseId="houseId"
          :detailInfo="householdInfo"
          v-if="index === 0"
        />
        <house-detail
          :memberId="memberId"
          :houseId="houseId"
          :realPhone="realPhone"
          :detailInfo="detailInfo"
          :accountPermissionDTOList="accountPermissionDTOList"
          v-else
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import houseDetail from '../houseHold/detail'
import householdDetail from './householdDetail'
export default {
  components: {
    houseDetail,
    householdDetail
  },
  data() {
    return {
      list: [{ name: '住户详情' }, { name: '账号管理' }],
      current: 0,
      swiperCurrent: 0,
      memberId: undefined,
      structId: undefined,
      houseId: undefined,
      realPhone: undefined,
      detailInfo: {}, //房屋详情
      householdInfo: {}, //住户详情
      accountPermissionDTOList: [],
      btnStatus: false
    }
  },
  onLoad: function ({ memberId, structId, houseId, realPhone }) {
    this.memberId = memberId
    this.structId = structId
    this.houseId = houseId
    this.realPhone = realPhone
    uni.setNavigationBarTitle({
      title: '住户管理'
    })
  },
  onShow() {
    // this.getDetail()
    this.getHouseHoldDetail()
  },
  methods: {
    // tabs通知swiper切换
    tabsChange(index) {
      this.swiperCurrent = index
      if (index) {
        this.getDetail()
      } else {
        this.getHouseHoldDetail()
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
    // 获取账号管理详情
    async getDetail() {
      const { result, data } = await this.$request.getHouseholdAccountDetail({
        apiLoading: true,
        memberId: this.memberId,
        houseId: this.houseId,
        realPhone: this.realPhone
      })
      if (result !== '1') return
      this.accountPermissionDTOList = data.accountPermissionDTOList.map(value => {
        return {
          name: this.$utils.getDicLabel('neighPermSign', value.permissionSign),
          permissionSign: value.permissionSign,
          permissionState: value.permissionState === 1 ? true : false
        }
      })
      this.detailInfo = data
      if (data.floor && data.floor !== 0) {
        this.detailInfo.floor = '第' + data.floor + '层'
      } else if (data.floor === 0) {
        this.detailInfo.floor = '第0层'
      } else {
        this.detailInfo.floor = '--'
      }
    },
    // 获取住户详情
    async getHouseHoldDetail() {
      const { result, data } = await this.$request.getHouseholdDetail({
        apiLoading: true,
        memberId: this.memberId,
        houseId: this.houseId
      })
      if (result !== '1') return
      let housingCertList
      if (data.housingCert && data.housingCert !== '') {
        housingCertList = data.housingCert.split(',')
      } else {
        housingCertList = null
      }
      this.householdInfo = {
        ...data,
        housingCert: housingCertList
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
