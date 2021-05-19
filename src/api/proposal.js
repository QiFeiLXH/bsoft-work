/**
 * 提案模块
 */
import {axios} from '@/utils/request'

const api = {
  getMenu: '/proposal/getManagerGroup',
  getPolicyList: '/proposal/getPolicyList',
}

export function getManagerGroup(parameter) {
  return axios({
    url: api.getMenu,
    method: 'get',
    params: parameter
  })
}

export function getPolicyList(parameter) {
    return axios({
      url: api.getPolicyList,
      method: 'get',
      params: parameter
    })

}