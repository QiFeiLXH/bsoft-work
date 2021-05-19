/**
 * 公司自用采购合同
 */
import { axios } from '@/utils/request'

const api = {
  purchaseContractQuery: '/ownpurchaseprogress/list',
  purchaseContract: '/ownpurchaseprogress/getone',
  purchaseContractExport: '/ownpurchaseprogress/contractdownload',
  contractSelect: '/ownpurchaseprogress/contractselect',
  progressQuery: '/ownpurchaseprogress/progress',
  progressSave: '/ownpurchaseprogress/progresssave'
}

/**
 * 公司自用采购合同列表
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getOwnPurchaseContractlist (parameter) {
  return axios({
    url: api.purchaseContractQuery,
    method: 'get',
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
 * 公司自用采购合同查找选择
 * @param parameter
 * @returns {AxiosPromise}
 */
export function doFindPurchaseContractList (parameter) {
  return axios({
    url: api.contractSelect,
    method: 'get',
    params: parameter
  })
}

/**
 * 公司自用采购合同进度列表
 * @param parameter
 * @returns {AxiosPromise}
 */
export function doLoadProgressList (parameter) {
  return axios({
    url: api.progressQuery,
    method: 'get',
    params: parameter
  })
}

/**
 * 保存公司采购合同进度
 * @param parameter
 * @returns {AxiosPromise}
 */
export function doSavePurchaseContractProgress (parameter) {
  return axios({
    url: api.progressSave,
    method: 'post',
    data: parameter
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
