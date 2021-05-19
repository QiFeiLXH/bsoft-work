import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getRandom, rsaEncryptByPublicKey, rsaDecryptByPublicKey, tripleDESEncrypt, tripleDESDecrypt, cryptFlag } from './encrypt'

const qs = require('qs')

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 600000 // 请求超时时间
})

service.defaults.headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
}

const err = (error) => {
  notification.error({
    message: '请求异常，请联系信息中心'
  })
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  const menuId = store.getters.routeinfo.meta.id
  if (token) {
    config.headers['Access-Token'] = token
    config.headers['menuId'] = menuId
  }
  if (config.data instanceof FormData) {
    return config
  }
  if (config.headers['Content-Type'] === ('application/json;charset=UTF-8') && cryptFlag === 1) {
    const random = getRandom(12)
    const encryptedRandom = rsaEncryptByPublicKey(random)
    config.headers['DES-Password'] = encryptedRandom
    if (config.data) {
      config.data = tripleDESEncrypt(random, JSON.stringify(config.data))
    }
    if (config.params) {
      config.params = tripleDESEncrypt(random, qs.stringify(config.params, { arrayFormat: 'repeat' }))
    }
  } else {
    if (config.params) {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  var data = null
  if (response.config.url.endsWith('Download') || response.config.url.endsWith('download')) {
    data = response.data
  } else {
    if (cryptFlag == 1) {
      const decryptPassword = rsaDecryptByPublicKey(response.headers['des-password'])
      const dataStr = tripleDESDecrypt(decryptPassword, response.data)
      data = JSON.parse(dataStr)
    } else {
      data = response.data
    }
  }
  if (response.config.url.endsWith('Download') || response.config.url.endsWith('download')) {
    if (response.status === 200) {
      return response
    } else {
      notification.error({
        message: '下载失败'
      })
    }
  }
  if (data.code !== 200 && data.code !== 999 && data.code !== 10001 && data.code !== 10004) {
    notification.error({
      message: data.msg
    })
  }
  if (data.code === 999) {
    store.dispatch('Logout').then(() => {
      window.location.reload()
    })
  }
  return data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
