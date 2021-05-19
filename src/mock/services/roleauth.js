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
  'actionEntitySet': [],
  'children': [],
  'pubFlag': 1
},
// Exception
{
  'name': 'exception',
  'parentId': 0,
  'id': 20,
  'routetitle': '异常页',
  'icon': 'warning',
  // 'redirect': '/exception/403',
  'component': 'RouteView',
  'sort': 2,
  'active': 1,
  'pubFlag': 1,
  'actionEntitySet': [],
  'children': [{
    'name': '403',
    'parentId': 20,
    'id': 2010,
    'routetitle': '403',
    'path': '/exception/403',
    'component': 'Exception403',
    'sort': 3,
    'active': 1,
    'actionEntitySet': [],
    'pubFlag': 1
  },
  {
    'name': '404',
    'parentId': 20,
    'id': 2020,
    'routetitle': '404',
    'path': '/exception/404',
    'component': 'Exception404',
    'sort': 4,
    'actionEntitySet': [],
    'active': 1,
    'pubFlag': 1
  },
  {
    'name': '500',
    'parentId': 20,
    'id': 2030,
    'routetitle': '500',
    'path': '/exception/500',
    'component': 'Exception500',
    'sort': 5,
    'actionEntitySet': [],
    'active': 1
  }]
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
  'actionEntitySet': [],
  'actionData': [],
  'children': [{
    'name': 'center',
    'parentId': 30,
    'id': 3010,
    'routetitle': '个人中心',
    'path': '/account/center',
    'component': 'AccountCenter',
    'sort': 7,
    'actionEntitySet': [],
    'actionData': [],
    'active': 1
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
    'actionEntitySet': [],
    'actionData': [],
    'children': [{
      'name': 'BaseSettings',
      'path': '/account/settings/base',
      'parentId': 3020,
      'id': 302010,
      'routetitle': '基本设置',
      'component': 'BaseSettings',
      'sort': 9,
      'actionEntitySet': [],
      'actionData': [],
      'active': 1
    },
    {
      'name': 'SecuritySettings',
      'path': '/account/settings/security',
      'parentId': 3020,
      'id': 302020,
      'routetitle': '安全设置',
      'component': 'SecuritySettings',
      'sort': 10,
      'actionEntitySet': [],
      'actionData': [],
      'active': 1
    },
    {
      'name': 'CustomSettings',
      'path': '/account/settings/custom',
      'parentId': 3020,
      'id': 302030,
      'routetitle': '个性化设置',
      'component': 'CustomSettings',
      'sort': 11,
      'actionEntitySet': [],
      'actionData': [],
      'active': 1
    },
    {
      'name': 'BindingSettings',
      'path': '/account/settings/binding',
      'parentId': 3020,
      'id': 302040,
      'routetitle': '账户绑定',
      'component': 'BindingSettings',
      'sort': 12,
      'actionEntitySet': [],
      'actionData': [],
      'active': 1
    },
    {
      'name': 'NotificationSettings',
      'path': '/account/settings/notification',
      'parentId': 3020,
      'id': 302050,
      'routetitle': '新消息通知',
      'component': 'NotificationSettings',
      'sort': 13,
      'actionEntitySet': [
        {
          'value': 5,
          'label': '新增'
        },
        {
          'value': 6,
          'label': '删除'
        },
        {
          'value': 7,
          'label': '更改'
        }
      ],
      'actionData': [5, 6],
      'active': 1
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
    'actionEntitySet': [
      {
        'value': 3,
        'label': '新增'
      },
      {
        'value': 4,
        'label': '删除'
      }
    ],
    'actionData': [],
    'active': 1
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
    'actionEntitySet': [
      {
        'value': 1,
        'label': '新增'
      },
      {
        'value': 2,
        'label': '删除'
      }
    ],
    'active': 1
  }]
}]

const actionList = [
  {
    'menuId': 302050,
    'actionList': [5, 6]
  }
]
const menuIdList = [10, 20, 302010, 3020]

const map = {
  'actionList': actionList,
  'menuIdList': menuIdList
}
const roleAuthList = (params) => {
  const body = getBody(params)
  const roleId = body.roleId
  if (roleId === 1) {
    return builder(list, map)
  } else {
    const newList = []
    const map = {}
    return builder(newList, map)
  }
}
const newroleAuthList = (params) => {
  const body = getBody(params)
  const roleId = body.roleId
  // const menuIds = body.menuIds
  // const authInfo = body.authInfo
  if (roleId === 1) {
    return builder(list, map)
  } else {
    const newList = []
    const map = {}
    return builder(newList, map)
  }
}

Mock.mock(/\/api\/roleAuth\/list/, 'post', roleAuthList)
Mock.mock(/\/api\/roleAuth\/save/, 'post', newroleAuthList)
