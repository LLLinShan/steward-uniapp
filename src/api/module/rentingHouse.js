// 出租屋报备
const houseApi = {
  getRentalList: {
    title: '出租房报备申请列表',
    url: '/wx/cs/rental/page'
  },
  getRentalDetail: {
    title: '查看出租房报备申请',
    url: '/wx/cs/rental/detail'
  },
  getRentalField: {
    title: '出租房报备申请字段',
    url: '/wx/cs/rental/field/detail'
  },
  submitRental: {
    title: '提交出租房报备申请',
    url: '/wx/cs/rental/submit'
  },
  updateRental: {
    title: '修改出租房报备申请',
    url: '/wx/cs/rental/update'
  },
  getOrganizationList: {
    title: '机构列表',
    url: '/wx/cs/rental/organization/list'
  }
}

export default houseApi
