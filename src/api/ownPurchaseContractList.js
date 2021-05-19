/**
 * 公司自用采购合同
 */
import { axios } from '@/utils/request'
// const qs = require('qs')

const api = {
  purchaseContractQuery: '/ownpurchase/list',
  purchaseContractDelete: '/ownpurchase/contractdelete',
  purchaseContract: '/ownpurchaseprogress/getone',
  unfinishedCount: '/ownpurchase/unfinished',
  supplementCount: '/ownpurchase/supplement',
  customerList: '/ownpurchase/customers',
  contractList: '/ownpurchase/contracts',
  dicQuery: '/ownpurchase/dic',
  contractSave: '/ownpurchase/contractsave',
  paymentQuery: '/ownpurchase/paymentquery',
  costPaymentQuery: '/ownpurchase/costpayment',
  purchaseContractNo: '/ownpurchase/contractno',
  purchaseContractNoExist: '/ownpurchase/contractnoexist',
  purchaseContractExport: '/ownpurchase/contractdownload',
  contractAlter: '/ownpurchase/contractalter'
}

/**
 * 公司自用采购合同列表
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getOwnPurchaseContractlist (parameter) {
  return axios({
    url: api.purchaseContractQuery,
    method: 'post',
    data: parameter
  })
}

/**
 * 删除公司自用采购合同
 * @param parameter
 * @returns {AxiosPromise}
 */
export function deletePurchaseContract (parameter) {
  return axios({
    url: api.purchaseContractDelete,
    method: 'delete',
    params: parameter
  })
}

/**
 * 公司自用采购合同
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getPurchaseContract (parameter) {
  return axios({
    url: api.purchaseContract,
    method: 'get',
    params: parameter
  })
}

/**
 * 公司自用采购合同未完结数量
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getOwnUnfinishedCount (parameter) {
  return axios({
    url: api.unfinishedCount,
    method: 'get',
    params: parameter
  })
}

/**
 * 指定采购合同的补充协议数量
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getOwnSuplementCount (parameter) {
  return axios({
    url: api.supplementCount,
    method: 'get',
    params: parameter
  })
}

/**
 * 客户往来单位选择列表
 * @param parameter
 * @returns {AxiosPromise}
 */
export function loadCustomerSelectList (parameter) {
  return axios({
    url: api.customerList,
    method: 'get',
    params: parameter
  })
}

/**
 * 已审的采购合同列表
 * @param parameter
 * @returns {AxiosPromise}
 */
export function loadContractSelectList (parameter) {
  return axios({
    url: api.contractList,
    method: 'get',
    params: parameter
  })
}

export function doLoadDic (parameter) {
  return axios({
    url: api.dicQuery,
    method: 'get',
    params: parameter
  })
}

export function doSavePurchaseContract (parameter) {
  return axios({
    url: api.contractSave,
    method: 'post',
    data: parameter
  })
}

export function doLoadPaymentList (parameter) {
  return axios({
    url: api.paymentQuery,
    method: 'get',
    params: parameter
  })
}

export function doLoadCostPaymentList (parameter) {
  return axios({
    url: api.costPaymentQuery,
    method: 'get',
    params: parameter
  })
}

export function getPurchaseContractNo (parameter) {
  return axios({
    url: api.purchaseContractNo,
    method: 'get',
    params: parameter
  })
}

export function existPurchaseContractNo (parameter) {
  return axios({
    url: api.purchaseContractNoExist,
    method: 'get',
    params: parameter
  })
}

/* 导出excel  */
export function exportPurchaseContract (parameter) {
  return axios({
    url: api.purchaseContractExport,
    method: 'post',
    data: parameter,
    params: { menuId: parameter.menuId, personId: parameter.personId, system: parameter.system, context: parameter.context },
    responseType: 'arraybuffer'
  })
}

export function doAlterPurchaseContract (parameter) {
  return axios({
    url: api.contractAlter,
    method: 'post',
    data: parameter
  })
}

