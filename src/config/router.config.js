// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
/**
 * UserLayout 登录页面基础
 * BasicLayout 左边菜单、顶部菜单基础页面
 * RouteView 右下角详情基础页面
**/

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
      },
      {
        path: 'autoLogin',
        name: 'autoLogin',
        component: () => import('@/views/user/AutoLogin')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
