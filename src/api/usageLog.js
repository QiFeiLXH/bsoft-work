import { axios } from '@/utils/request'

const api = {
  count: '/log/usagelog',
  report: '/log/usagelogreport'
}

export function saveUsageLog (parameter) {
  return axios({
    url: api.count,
    method: 'get',
    params: parameter
  })
}

export function usageLogReport (parameter) {
  return axios({
    url: api.report,
    method: 'get',
    params: parameter
  })
}