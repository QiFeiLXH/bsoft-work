import { axios } from '@/utils/request'

const api = {
  getApplianceCountList: '/appliance/store/list',
  getApplianceUseDetails: '/appliance/store/usedetail',
}

/** 获取物品库存信息*/
export function getApplianceCountList (parameter) {
  return axios({
    url: api.getApplianceCountList,
    method: 'get',
    params: parameter,
  })
}

/** 获取单个物品的领用详情*/
export function getApplianceUseDetails(parameter) {
  return axios({
    url: api.getApplianceUseDetails,
    method: 'get',
    params: parameter
  })
}
