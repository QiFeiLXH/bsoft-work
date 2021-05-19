import { axios } from '@/utils/request'

const api = {
  businessCardQuery: '/businesscard/list',
  unpaidCount: '/businesscard/unpaidcount',
  unpaidAmount: '/businesscard/unpaidamount',
  totalAmount: '/businesscard/totalamount',
  businessCardIds: '/businesscard/businesscardids',
  applyPayBusinessCard: '/businesscard/applypaydownload',
  payBusinessCard: '/businesscard/pay',
  businessCardDownload: '/businesscard/imagedownload'
}

export function doLoadBusinessCardList (parameter) {
  return axios({
    url: api.businessCardQuery,
    method: 'get',
    params: parameter
  })
}

export function getUnpaidCount (parameter) {
  return axios({
    url: api.unpaidCount,
    method: 'get',
    params: parameter
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
    params: parameter
  })
}

export function getBusinessCardIds (parameter) {
  return axios({
    url: api.businessCardIds,
    method: 'get',
    params: parameter
  })
}

export function applyPayBusinessCard (parameter) {
  return axios({
    url: api.applyPayBusinessCard,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function payBusinessCard (parameter) {
  return axios({
    url: api.payBusinessCard,
    method: 'get',
    params: parameter
  })
}

export function downloadBusinessCardImage (parameter) {
  return axios({
    url: api.businessCardDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}
