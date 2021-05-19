import { axios } from '@/utils/request'

const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  UserInfo: '/user/admin/info',
  check: '/auth/checkLogon',
  enable: '/auth/checkEnable',
  menuInfo: '/user/admin/nav',
  codeRefresh: '/code/refresh'
}
/**
 * 登录相关
 * @param parameter
 * @returns {AxiosPromise}
 */

/**
 * 使用工号密码登录
 * @param parameter
 * @returns {AxiosPromise}
 */
export function login (parameter) {
  return axios({
    url: api.Login,
    method: 'post',
    data: parameter
  })
}

/**
 * 单点登录之后，验证是否登录成功
 * @returns {AxiosPromise}
 */
export function checklogin () {
  return axios({
    url: api.check,
    method: 'post'
  })
}

/**
 * 验证是否可以登录，查询账号密码错误次数
 * @returns {AxiosPromise}
 */
export function checkEnable () {
  return axios({
    url: api.enable,
    method: 'post'
  })
}

/**
 * 获取员工信息及操作权限信息
 * @returns {AxiosPromise}
 * const params = { 'system': 3 }
 */
export function getInfo (parameter) {
  return axios({
    url: api.UserInfo,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取当前用户的菜单导航
 * @returns {AxiosPromise}
 */
export function getCurrentUserNav (parameter) {
  return axios({
    url: api.menuInfo,
    method: 'get',
    params: parameter
  })
}

/**
 * 退出登录
 * @returns {AxiosPromise}
 */
export function logout () {
  return axios({
    url: api.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 刷新验证码
 * @returns {AxiosPromise}
 */
export function codeRefresh () {
  return axios({
    url: api.codeRefresh,
    method: 'get'
  })
}

