import { axios } from '@/utils/request'

const api = {
  getDeptTree: '/publicapi/depttree',
  getDeptSelectTree: '/publicapi/deptselecttree',
  findPersonSelectList: '/publicapi/personselectlist',
  getPersonSelectList: '/publicapi/personselect',
  getCurrentPerson: '/publicapi/getcurrentperson',
  area: '/publicapi/getarea',
  getPubDicList: '/publicapi/pubdiclist',
  getSysDicList: '/publicapi/sysdiclist',
  getHrDicList: '/publicapi/hrdiclist',
  getCustomerContractList: '/publicapi/customercontact',
}

export function getDeptTree (parameter) {
  return axios({
    url: api.getDeptTree,
    method: 'get',
    params: parameter
  })
}

export function getDeptSelectTree (parameter) {
  return axios({
    url: api.getDeptSelectTree,
    method: 'get',
    params: parameter
  })
}

export function findPersonSelectList (parameter) {
  return axios({
    url: api.findPersonSelectList,
    method: 'get',
    params: parameter
  })
}

export function getPersonSelectList (parameter) {
  return axios({
    url: api.getPersonSelectList,
    method: 'get',
    params: parameter
  })
}

export function getCurrentPerson (parameter) {
  return axios({
    url: api.getCurrentPerson,
    method: 'get',
    params: parameter
  })
}

export function getArea (parameter) {
  return axios({
    url: api.area,
    method: 'get',
    params: parameter
  })
}

/** 公用代码字典列表*/
export function getPubDicList (parameter) {
  return axios({
    url: api.getPubDicList,
    method: 'get',
    params: parameter
  })
}

/** 系统代码字典列表*/
export function getSysDicList (parameter) {
  return axios({
    url: api.getSysDicList,
    method: 'get',
    params: parameter
  })
}

/** 人事代码字典列表*/
export function getHrDicList (parameter) {
  return axios({
    url: api.getHrDicList,
    method: 'get',
    params: parameter
  })
}
/** 客户往来单位选择列表*/
export function getCustomerContractList (parameter) {
  return axios({
    url: api.getCustomerContractList,
    method: 'get',
    params: parameter
  })
}


