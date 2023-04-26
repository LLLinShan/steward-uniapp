const homeApi = {
  getNeighListRecord: {
    title: '查询访问小区历史',
    url: '/wx/ca/visitor/getNeighListByUserId'
  },
  getRecordList: {
    title: '获取拜访历史',
    url: '/wx/ca/visitor/getVisitorSelfRegisterPage'
  },
  getResult: {
    title: '获取通行证',
    url: '/wx/ca/visitor/getSchemesResult'
  },
  getHouseTreeNodes: {
    title: '获取房屋节点树',
    url: '/wx/ca/miniAppsHousehold/getHouseTreeNodes'
  },
  addHousehold: {
    title: '住户登记',
    url: '/wx/ca/miniAppsHousehold/addHousehold'
  },
  modifyHousehold: {
    title: '住户编辑',
    url: '/wx/ca/miniAppsHousehold/modifyHousehold'
  },
  listHousehold: {
    title: '获取住户管理列表',
    url: '/wx/ca/miniAppsHousehold/listHousehold'
  },
  getHouseholdDetail: {
    title: '获取住户管理-获取住户详情',
    url: '/wx/ca/miniAppsHousehold/getHouseholdDetail'
  },
  removeHousehold: {
    title: '住户管理-删除住户',
    url: '/wx/ca/miniAppsHousehold/removeHousehold'
  },
  fuzzySearchHouse: {
    title: '住户管理-模糊查询房屋信息',
    url: '/wx/ca/miniAppsHousehold/fuzzySearchHouse'
  },
  getConfig: {
    title: '获取住户登记自定义显示字段',
    url: '/wx/ca/miniAppsHousehold/getMiniAppHouseHoldForm'
  },
  uploadFileImg: {
    title: '头像照片上传',
    url: '/wx/fs/resource/picUpload'
  },
  faceQualityCheck: {
    title: '照片质量校验',
    url: '/wx/ca/miniAppsHousehold/faceQualityCheck'
  },
  listEntranceLimit: {
    title: '获取门禁出入记录列表',
    url: '/wx/rc/record/listEntranceLimit'
  },
  entranceLimitDetail: {
    title: '获取门禁出入记录详情',
    url: '/wx/rc/record/entranceLimitDetail'
  },
  electromobileList: {
    title: '电动车识别告警列表',
    url: '/wx/se/electromobile/getList'
  },
  infoPage: {
    title: '信息列表',
    url: '/wx/cs/info/page'
  },
  infoAdd: {
    title: '新建信息',
    url: '/wx/cs/info/add'
  },
  infoUpdate: {
    title: '修改信息',
    url: '/wx/cs/info/update'
  },
  infoDetail: {
    title: '信息详情',
    url: '/wx/cs/info/detail'
  },
  listHouseholdAccount: {
    title: '住户账号管理列表',
    url: '/wx/ca/miniAppsHousehold/listHouseholdAccount'
  },
  getHouseholdAccountDetail: {
    title: '查看住户账号详情',
    url: '/wx/ca/miniAppsHousehold/getHouseholdAccountDetail'
  },
  unbindHome: {
    title: '解绑住家',
    url: '/wx/ca/miniAppsHousehold/unbindHome'
  },
  changeAccount: {
    title: '变更账号',
    url: '/wx/ca/miniAppsHousehold/changeAccount'
  },
  saveAccountPerm: {
    title: '保存住家账号功能信息',
    url: '/wx/ca/miniAppsHousehold/saveAccountPerm'
  },
  blockOrNotHouseholdProof: {
    title: '冻结或解冻凭证',
    url: '/wx/ca/miniAppsHousehold/blockOrNotHouseholdProof'
  },
  getHouseRentalInfo: {
    title: '获取房屋租户续租信息',
    url: '/wx/ca/miniAppsHousehold/getHouseRentalInfo'
  },
  batchRenewApply: {
    title: '房屋住户批量续租',
    url: '/wx/ca/miniAppsHousehold/batchRenewApply'
  },
  batchUnRentApply: {
    title: '房屋住户批量退租',
    url: '/wx/ca/miniAppsHousehold/batchUnRentApply'
  }
}

export default homeApi
