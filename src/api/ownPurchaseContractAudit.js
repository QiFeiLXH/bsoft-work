/**
 * 公司自用采购合同
 */
import { axios } from '@/utils/request'

const api = {
  purchaseContractQuery: '/ownpurchaseaudit/list',
  unreviewedCount: '/ownpurchaseaudit/unreviewed',
  contractAudit: '/ownpurchaseaudit/audit',
  contractDisagree: '/ownpurchaseaudit/disagree',
  contractAlterAudit: '/ownpurchaseaudit/alteraudit',
  contractAlterDisagree: '/ownpurchaseaudit/alterdisagree',
  contractModifyRecordQuery: '/ownpurchaseaudit/modifyrecord'
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
 * 公司自用采购合同未审核的数量
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getOwnUnreviewedCount (parameter) {
  return axios({
    url: api.unreviewedCount,
    method: 'get',
    params: parameter
  })
}

export function doAuditPurchaseContract (parameter) {
  return axios({
    url: api.contractAudit,
    method: 'get',
    params: parameter
  })
}

export function doDisagreePurchaseContract (parameter) {
  return axios({
    url: api.contractDisagree,
    method: 'get',
    params: parameter
  })
}

export function doAlterAuditPurchaseContract (parameter) {
  return axios({
    url: api.contractAlterAudit,
    method: 'post',
    data: parameter
  })
}

export function doAlterDisagreePurchaseContract (parameter) {
  return axios({
    url: api.contractAlterDisagree,
    method: 'post',
    data: parameter
  })
}

export function doLoadPurchaseContractModifyRecordList (parameter) {
  return axios({
    url: api.contractModifyRecordQuery,
    method: 'get',
    params: parameter
  })
}
