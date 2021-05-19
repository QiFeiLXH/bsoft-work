import { axios } from '@/utils/request'

const api = {
  getMeetList: '/meet/meetlist',
  saveMeet: '/meet/savemeet',
  getMeetPersonList: '/meet/meetpersonlist',
  saveMeetPerson: '/meet/savemeetperson',
  importData: '/meet/import',
  deletePerson:'/meet/deleteperson',
  exportErrorData:'/meet/errordownload',
  personExitsMeet:'/meet/personexitmeet',
  havePersonExits:'/meet/haveperson',

}
const qs = require('qs')

/** 获取会议信息*/
export function getMeetList (parameter) {
  return axios({
    url: api.getMeetList,
    method: 'get',
    params: parameter,
  })
}

/** 保存会议信息*/
export function saveMeet (parameter) {
  return axios({
    url: api.saveMeet,
    method: 'post',
    data: parameter
  })
}

/** 获取会议人员列表*/
export function getMeetPersonList (parameter) {
  return axios({
    url: api.getMeetPersonList,
    method: 'get',
    params: parameter,
  })
}

/** 保存会议人员*/
export function saveMeetPerson (parameter) {
  return axios({
    url: api.saveMeetPerson,
    method: 'post',
    data: parameter,
  })
}
/** 判断人员是否存在会议*/
export function personExitsMeet (parameter) {
  return axios({
    url: api.personExitsMeet,
    method: 'post',
    data: parameter,
  })
}
/** 判断人员手机号是否重复*/
export function havePersonExits (parameter) {
  return axios({
    url: api.havePersonExits,
    method: 'post',
    data: parameter,
  })
}

/** 删除会议人员*/
export function deletePerson (parameter) {
  return axios({
    url: api.deletePerson,
    method: 'get',
    params: parameter,
  })
}

/** 导入数据 */
export function importData (parameter) {
  return axios({
    url: api.importData,
    method: 'post',
    data: parameter
  })
}


/** 导出错误数据*/
export function exportErrorData (parameter) {
  return axios({
    url: api.exportErrorData,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer',
  })
}



