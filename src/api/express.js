import { axios } from '@/utils/request'

const api = {
  expressQuery: '/express/list',
  unpaidCount: '/express/unpaidcount',
  unpaidAmount: '/express/unpaidamount',
  totalAmount: '/express/totalamount',
  expressIds: '/express/expressids',
  expressDetailImport: '/express/import',
  applyPayExpressDetail: '/express/applypaydownload',
  payExpressDetail: '/express/pay',
  errorDataDownload: '/express/errordatadownload',
  templateDownload: '/express/templatedownload',
  expressSave: '/express/save'
}

const qs = require('qs')

export function doLoadExpressList (parameter) {
  return axios({
    url: api.expressQuery,
    method: 'get',
    params: parameter,
  })
}

export function getUnpaidCount (parameter) {
  return axios({
    url: api.unpaidCount,
    method: 'get',
    params: parameter,
  })
}

export function getUnpaidAmount (parameter) {
  return axios({
    url: api.unpaidAmount,
    method: 'get',
    params: parameter
  })
}

export function getTotalAmount (parameter) {
  return axios({
    url: api.totalAmount,
    method: 'get',
    params: parameter,
  })
}

export function getExpressIds (parameter) {
  return axios({
    url: api.expressIds,
    method: 'get',
    params: parameter
  })
}

export function importExpressDetails (parameter) {
  return axios({
    url: api.expressDetailImport,
    method: 'post',
    data: parameter
  })
}

export function applyPayExpressDetail (parameter) {
  return axios({
    url: api.applyPayExpressDetail,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function payExpressDetail (parameter) {
  return axios({
    url: api.payExpressDetail,
    method: 'get',
    params: parameter,
  })
}

export function exportErrorRecords (parameter) {
  return axios({
    url: api.errorDataDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function exportTemplate (parameter) {
  return axios({
    url: api.templateDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function saveExpressDetail (parameter) {
  return axios({
    url: api.expressSave,
    method: 'post',
    data: parameter
  })
}
