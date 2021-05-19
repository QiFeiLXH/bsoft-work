
import { axios } from '@/utils/request'

const api = {
  getApplianceUseList: '/appliance/deliver/list',
}


/** 获取物品领用信息*/
export function getApplianceUseList (parameter) {
  return axios({
    url: api.getApplianceUseList,
    method: 'get',
    params: parameter,
  })
}
