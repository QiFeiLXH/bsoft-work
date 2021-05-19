import Mock from 'mockjs2'
import { builder, getBody } from '../util'

const list = [{
  'name': 'project',
  'parentId': 0,
  'id': 10,
  'routetitle': '项目日志',
  'icon': 'warning',
  // 'redirect': '',
  'component': 'RouteView',
  'sort': 1,
  'active': 1,
  'children': [],
  'pubFlag': 0
},
{
  'name': 'account',
  'parentId': 0,
  'id': 30,
  'routetitle': '个人页',
  'icon': 'user',
  // 'redirect': '/account/center',
  'component': 'RouteView',
  'sort': 6,
  'active': 1,
  'pubFlag': 1,
  'children': [{
    'name': 'center',
    'parentId': 30,
    'id': 3010,
    'routetitle': '222222222',
    'path': '/account/center',
    'component': 'AccountCenter',
    'sort': 7,
    'active': 1,
    'pubFlag': 1
  },
  // 特殊三级菜单
  {
    'name': 'settings',
    'parentId': 30,
    'id': 3020,
    'routetitle': '个人设置',
    // 'redirect': '/account/settings/base',
    'component': 'RouteView',
    'sort': 8,
    'active': 1,
    'pubFlag': 1,
    'children': [{
      'name': 'BaseSettings',
      'path': '/account/settings/base',
      'parentId': 3020,
      'id': 302010,
      'routetitle': '基本设置',
      'component': 'BaseSettings',
      'sort': 9,
      'active': 1,
      'pubFlag': 1
    },
    {
      'name': 'SecuritySettings',
      'path': '/account/settings/security',
      'parentId': 3020,
      'id': 302020,
      'routetitle': '安全设置',
      'component': 'SecuritySettings',
      'sort': 10,
      'active': 1,
      'pubFlag': 1
    },
    {
      'name': 'CustomSettings',
      'path': '/account/settings/custom',
      'parentId': 3020,
      'id': 302030,
      'routetitle': '个性化设置',
      'component': 'CustomSettings',
      'sort': 11,
      'active': 1,
      'pubFlag': 1
    },
    {
      'name': 'BindingSettings',
      'path': '/account/settings/binding',
      'parentId': 3020,
      'id': 302040,
      'routetitle': '账户绑定',
      'component': 'BindingSettings',
      'sort': 12,
      'active': 1,
      'pubFlag': 1
    },
    {
      'name': 'NotificationSettings',
      'path': '/account/settings/notification',
      'parentId': 3020,
      'id': 302050,
      'routetitle': '新消息通知',
      'component': 'NotificationSettings',
      'sort': 13,
      'active': 1,
      'pubFlag': 1
    }]
  }]
},
{
  'name': 'System',
  'parentId': 0,
  'id': 40,
  'routetitle': '系统配置',
  'icon': 'warning',
  // 'redirect': '',
  'component': 'RouteView',
  'sort': 14,
  'active': 1,
  'pubFlag': 0,
  'children': [{
    'name': 'menu',
    'path': '/system/menu',
    'parentId': 40,
    'id': 4010,
    'routetitle': '菜单设置',
    // 'icon': 'warning',
    // 'redirect': '',
    'component': 'Menu',
    'sort': 15,
    'active': 1,
    'pubFlag': 0
  },
  {
    'name': 'rolemanager',
    'path': '/system/role',
    'parentId': 40,
    'id': 4020,
    'routetitle': '角色配置',
    // 'icon': 'warning',
    // 'redirect': '',
    'component': 'RoleManager',
    'sort': 17,
    'active': 1,
    'pubFlag': 0
  }]
}]
const menuList = () => {
  return builder(list)
}

const deleteTree = (list, id) => {
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list.splice(i, 1)
    } else {
      if (list[i].children !== undefined && list[i].children.length > 0) {
        deleteTree(list[i].children, id)
      }
    }
  }
}

const deleteMenuList = (options) => {
  const body = getBody(options)
  const newlist = list
  for (var i = 0; i < newlist.length; i++) {
    if (newlist[i].id === body.id) {
      newlist.splice(i, 1)
    } else {
      if (newlist[i].children !== undefined && newlist[i].children.length > 0) {
        deleteTree(newlist[i].children, body.id)
      }
    }
  }
  const lastlist = newlist
  return builder({
    'data': lastlist
  })
}

const updateTree = (list, body) => {
  const id = body.id
  const parentid = body.parentId
  if (id !== undefined || id !== null) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i] = body
      } else {
        if (list[i].children !== undefined && list[i].children.length > 0) {
          updateTree(list[i].children, body)
        }
      }
    }
  } else {
    for (var j = 0; j < list.length; j++) {
      if (list[j].id === parentid) {
        list[j].children.push(body)
      } else {
        if (list[j].children !== undefined && list[j].children.length > 0) {
          updateTree(list[j].children, body)
        }
      }
    }
  }
}

const updateMenuList = (options) => {
  const body = getBody(options)
  const id = body.id
  const parentid = body.parentId
  if (id !== undefined || id !== null) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i] = body
      } else {
        if (list[i].children !== undefined && list[i].children.length > 0) {
          updateTree(list[i].children, body)
        }
      }
    }
  } else {
    for (var j = 0; j < list.length; j++) {
      if (list[j].id === parentid) {
        list[j].children.push(body)
      } else {
        if (list[j].children !== undefined && list[j].children.length > 0) {
          updateTree(list[j].children, body)
        }
      }
    }
  }
  return builder({
    'data': list
  })
}

Mock.mock(/\/api\/menu\/list/, 'get', menuList)
Mock.mock(/\/api\/menu\/delete/, 'delete', deleteMenuList)
Mock.mock(/\/api\/menu\/update/, 'post', updateMenuList)
