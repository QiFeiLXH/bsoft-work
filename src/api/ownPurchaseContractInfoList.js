/**
 * 公司自用采购合同
 */
import { axios } from '@/utils/request'

const api = {
  purchaseContractQuery: '/ownpurchaseinfo/list',
  purchaseContractExport: '/ownpurchaseinfo/contractdownload'
}

/**
 * 公司自用采购合同列表
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getOwnPurchaseContractInfolist (parameter) {
  return axios({
    url: api.purchaseContractQuery,
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
