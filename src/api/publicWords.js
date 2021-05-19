import { axios } from '@/utils/request'

const api = {
  fileUpload: '/publicwords/fileupload',
  fileDownload: '/publicwords/filedownload',
  fileDelete: '/publicwords/filedelete',
  fileUploadedQuery: '/publicwords/files',
  fileTypeDic: '/publicwords/filetypedic'
}

export function fileUpload (parameter) {
  return axios({
    url: api.fileUpload,
    method: 'post',
    data: parameter
  })
}

export function fileDownload (parameter) {
  return axios({
    url: api.fileDownload,
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  })
}

export function fileDelete (parameter) {
  return axios({
    url: api.fileDelete,
    method: 'delete',
    params: parameter
  })
}

export function doLoadFilesUploadedList (parameter) {
  return axios({
    url: api.fileUploadedQuery,
    method: 'get',
    params: parameter
  })
}

export function doLoadFileTypeDic (parameter) {
  return axios({
    url: api.fileTypeDic,
    method: 'get',
    params: parameter
  })
}
