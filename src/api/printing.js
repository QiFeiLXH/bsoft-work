import { axios } from '@/utils/request'

const api = {
  printingQuery: '/printing/list',
  unpaidCount: '/printing/unpaidcount',
  unpaidAmount: '/printing/unpaidamount',
  totalAmount: '/printing/totalamount',
  printingIds: '/printing/printingids',
  printingImport: '/printing/import',
  applyPayPrinting: '/printing/applypaydownload',
  payPrinting: '/printing/pay',
  errorDataDownload: '/printing/errordatadownload',
  templateDownload: '/printing/templatedownload',
  printingSave: '/printing/save',
  printingDetailQuery: '/printing/detaillist'
}

export function doLoadPrintingList (parameter) {
  return axios({
    url: api.printingQuery,
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

export function getPrintingIds (parameter) {
  return axios({
    url: api.printingIds,
    method: 'get',
    params: parameter
  })
}

export function importPrinting (parameter) {
  return axios({
    url: api.printingImport,
    method: 'post',
    data: parameter
  })
}

export function applyPayPrinting (parameter) {
  return axios({
    url: api.applyPayPrinting,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function payPrinting (parameter) {
  return axios({
    url: api.payPrinting,
    method: 'get',
    params: parameter
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

export function savePrinting (parameter) {
  return axios({
    url: api.printingSave,
    method: 'post',
    data: parameter
  })
}

export function doLoadPrintingDetailList (parameter) {
  return axios({
    url: api.printingDetailQuery,
    method: 'get',
    params: parameter
  })
}
