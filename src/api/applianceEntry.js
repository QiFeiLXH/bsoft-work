import { axios } from '@/utils/request'

const api = {
  getApplianceList: '/appliance/entry/list',
  saveAppliance: '/appliance/entry/save',
  submitAppliance: '/appliance/entry/submit',
  getApplianceNameSelectList: '/appliance/entry/nameselect',
  getCustomerList: '/appliance/entry/customers',
  getApplianceUnPayMoney: '/appliance/entry/unpay',

}
const qs = require('qs')

/** 获取入库物品信息*/
export function getApplianceList (parameter) {
  return axios({
    url: api.getApplianceList,
    method: 'get',
    params: parameter,
  })
}

/** 保存物品信息*/
export function saveAppliance (parameter) {
  return axios({
    url: api.saveAppliance,
    method: 'post',
    data: parameter
  })
}

/** 提交物品信息*/
export function submitAppliance (parameter) {
  return axios({
    url: api.submitAppliance,
    method: 'post',
    data: parameter
  })
}

/** 客户往来单位选择列表*/
export function getCustomerList (parameter) {
  return axios({
    url: api.getCustomerList,
    method: 'get',
    params: parameter
  })
}

/** 获取物品名称列表*/
export function getApplianceNameSelectList (parameter) {
  return axios({
    url: api.getApplianceNameSelectList,
    method: 'get',
    params: parameter,
  })
}

/** 统计未支付金额*/
export function getApplianceUnPayMoney(parameter) {
  return axios({
    url: api.getApplianceUnPayMoney,
    method: 'get',
    params: parameter,
  })
}


