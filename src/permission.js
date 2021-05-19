import Vue from 'vue'
import router from './router'
import store from './store'
import { checklogin } from '@/api/login'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'autoLogin'] // no redirect whitelist
const defaultRoutePath = '/indexview'

router.beforeEach((to, from, next) => {
  // if (to.path != '/user/login' && to.path != '/user/autoLogin'){
  //   if (to.meta.id != undefined){
  //     const params = { 'menuId': to.meta.id}
  //     saveUsageLog(params).then((res)=>{
  //     }).catch((err)=>{
  //     })
  //   }
  // }
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login' || to.path === '/user/autoLogin') {
      if (to.path === '/user/autoLogin') {
        checklogin().then((res) => {
          if (res.code === 200){
            next({ path: res.properties.toPath })
          }
        }).catch((err) => {

        })
      } else {
        next({ path: defaultRoutePath })
      }
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0 || store.getters.roles === undefined) {
        store.dispatch('GetInfo')
          .then(res => {
            // const roles = res.properties && res.properties.role
            store.dispatch('GenerateRoutes').then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login' })
              // next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login' })
      // next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
