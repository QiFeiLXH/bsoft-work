import { axios } from '@/utils/request'

const api = {
  managerGroupList: '/managergroup/list',
  cancelManagerGroup: '/managergroup/cancel',
  saveManagerGroup: '/managergroup/save',
  managerList: "/manager/list",
  deleteManager: "/manager/delete",
  saveManager: "/manager/save"
}

export function doLoadManagerGroupList (parameter) {
  return axios({
    url: api.managerGroupList,
    method: 'get',
    params: parameter
  })
}
export function doCancelManagerGroup (parameter) {
  return axios({
    url: api.cancelManagerGroup,
    method: 'put',
    params: parameter
  })
}
export function doSaveManagerGroup (parameter) {
  return axios({
    url: api.saveManagerGroup,
    method: 'post',
    data: parameter
  })
}
export function doLoadManagerList (parameter) {
  return axios({
    url: api.managerList,
    method: 'get',
    params: parameter
  })
}
export function doDeleteManager (parameter) {
  return axios({
    url: api.deleteManager,
    method: 'delete',
    params: parameter
  })
}
export function doSaveManager (parameter) {
  return axios({
    url: api.saveManager,
    method: 'post',
    data: parameter
  })
}