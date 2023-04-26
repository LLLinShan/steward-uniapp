const auditApi = {
  getAuditList: {
    title: '获取审核列表',
    url: '/wx/ca/miniAppsHousehold/listHouseholdAudit'
  },
  getAuditDetail: {
    title: '获取审核详情',
    url: '/wx/ca/miniAppsHousehold/getAuditDetail'
  },
  audit: {
    title: '住户审核',
    url: '/wx/ca/miniAppsHousehold/audit'
  },
  listRenewAudit: {
    title: '续租审核分页列表',
    url: '/wx/ca/miniAppsHousehold/listRenewAudit'
  },
  renewApplyDetail: {
    title: '续租申请详情',
    url: '/wx/ca/miniAppsHousehold/renewApplyDetail'
  },
  renewAudit: {
    title: '续租审核',
    url: '/wx/ca/miniAppsHousehold/renewAudit'
  }
}

export default auditApi
