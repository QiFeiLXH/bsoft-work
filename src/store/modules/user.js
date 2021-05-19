import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    name: '',
    avatar: '',
    roles: [],
    info: {},
    currentRoute:{}
  },

  mutations: {
    SET_CURRENTROUTE: (state, routeinfo) => {
      state.currentRoute = routeinfo
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name }) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    setCurrentRoute({commit},routeinfo){
      commit('SET_CURRENTROUTE', routeinfo)
    },
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // 请求登录URL
        login(userInfo).then(response => {
          if (response.code === 200){
            Vue.ls.set(ACCESS_TOKEN, response.properties.sessionid, 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', response.properties.sessionid)
            resolve(response)
          }else{
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const params = { 'system': 20 }
        getInfo(params).then(response => {
          const result = response.properties
          const userInfo = result.userInfo
          commit('SET_INFO', result.userInfo)
          commit('SET_NAME', { name: result.userInfo.personName })
          commit('SET_AVATAR', "/avatar2.jpg")
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
