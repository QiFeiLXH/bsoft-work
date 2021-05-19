import { axios } from '@/utils/request'

const api = {
  getApplianceNameList: '/appliance/name/list',
  saveApplianceName: '/appliance/name/save',
}

const qs = require('qs')

/** 获取物品名称列表*/
export function getApplianceNameList (parameter) {
  return axios({
    url: api.getApplianceNameList,
    method: 'get',
    params: parameter,
  })
}

/** 保存物品名称信息*/
export function saveApplianceName (parameter) {
  return axios({
    url: api.saveApplianceName,
    method: 'post',
    data: parameter
  })
}


