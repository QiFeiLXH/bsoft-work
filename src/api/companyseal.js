import { axios } from '@/utils/request'

const api = {
  getcompanyseals: '/companyseal/getcompanyseals',
  savecompanyseal: '/companyseal/savecompanyseal',
  getseal: '/companyseal/getseal',
  getcompany:'/companyseal/getcompany',


}

/** 获取公司印章信息列表*/
export function getCompanySeals (parameter) {
  return axios({
    url: api.getcompanyseals,
    method: 'get',
    params: parameter,
  })
}

/** 获取公司信息*/
export function getcompany (parameter) {
  return axios({
    url: api.getcompany,
    method: 'get',
    params: parameter,
  })
}

/** 获取所有未注销的公司列表*/
export function getSeal (parameter) {
  return axios({
    url: api.getseal,
    method: 'get',
    params: parameter,
  })
}

/** 保存公司印章信息*/
export function saveCompanySeal (parameter) {
  return axios({
    url: api.savecompanyseal,
    method: 'post',
    data: parameter
  })
}

