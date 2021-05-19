import Mock from 'mockjs2'
import { builder } from '../util'

const info = (options) => {
  const userInfo = {
    'id': '4291d7da9005377ec9aec4a71ea837f',
    'personName': '天野远子',
    'username': 'admin',
    'password': '',
    'avatar': '/avatar2.jpg',
    'status': 1,
    'telephone': '',
    'lastLoginIp': '27.154.74.117',
    'lastLoginTime': 1534837621348,
    'creatorId': 'admin',
    'createTime': 1497160610259,
    'merchantCode': 'TLif2btpzg079h15bk',
    'deleted': 0,
    'roleId': 'admin',
    'role': {}
  }
  // role
  const roleObj = {
    'id': 'admin',
    'name': '管理员',
    'describe': '拥有所有权限',
    'status': 1,
    'creatorId': 'system',
    'createTime': 1497160610259,
    'deleted': 0,
    'permissions': [{
      'roleId': 'admin',
      'permissionId': 'user',
      'permissionName': '用户管理',
      'actionEntitySet': [{
        'action': 'add',
        'describe': '新增',
        'defaultCheck': false
      }, {
        'action': 'import',
        'describe': '导入',
        'defaultCheck': false
      }, {
        'action': 'get',
        'describe': '详情',
        'defaultCheck': false
      }, {
        'action': 'update',
        'describe': '修改',
        'defaultCheck': false
      }, {
        'action': 'delete',
        'describe': '删除',
        'defaultCheck': false
      }, {
        'action': 'export',
        'describe': '导出',
        'defaultCheck': false
      }]
    }, {
      'roleId': 'admin',
      'permissionId': 'project',
      'permissionName': '项目日志',
      'actionEntitySet': [{
        'action': 'add',
        'describe': '新增',
        'defaultCheck': false
      }, {
        'action': 'import',
        'describe': '导入',
        'defaultCheck': false
      }, {
        'action': 'get',
        'describe': '详情',
        'defaultCheck': false
      }, {
        'action': 'update',
        'describe': '修改',
        'defaultCheck': false
      }]
    }, {
      'roleId': 'admin',
      'permissionId': 'menu',
      'permissionName': '菜单设置',
      'actionEntitySet': [{
        'action': 'add',
        'describe': '新增',
        'defaultCheck': false
      }]
    }
    ]
  }
  roleObj.permissions.push()
  userInfo.role = roleObj
  const role = {
    'permissions': roleObj
  }
  const map = {
    'userInfo': userInfo,
    'role': role
  }
  return builder({}, map)
}

const userNav = (options) => {
  const nav = [
    {
      'id': 38,
      'title': '项目管理',
      'parentId': 0,
      'sort': null,
      'icon': 'projectManager.png',
      'path': null,
      'component': 'RouteView',
      'name': 'Project'
    }, {
      'id': 39,
      'title': '项目日志',
      'parentId': 38,
      'sort': null,
      'icon': null,
      'path': null,
      'component': 'ProjectLog',
      'name': 'ProjectLog'
    }, {
      'id': 41,
      'title': '项目组组员维护',
      'parentId': 38,
      'sort': null,
      'icon': null,
      'path': '/group/GroupMembersMaintain',
      'component': 'GroupMembersMaintain',
      'name': 'GroupMembersMaintain'
    }, {
      'id': 33,
      'title': '角色配置',
      'parentId': 16,
      'sort': null,
      'icon': null,
      'path': '/system/role',
      'component': 'RoleManager',
      'name': 'rolemanager'
    }, {
      'id': 16,
      'title': '系统配置',
      'parentId': 0,
      'sort': null,
      'icon': 'set.png',
      'path': null,
      'component': 'RouteView',
      'name': 'System'
    }, {
      'id': 17,
      'title': '菜单设置',
      'parentId': 16,
      'sort': null,
      'icon': null,
      'path': '/system/menu',
      'component': 'Menu',
      'name': 'menu'
    }, {
      'id': 36,
      'title': '项目计划',
      'parentId': 38,
      'sort': null,
      'icon': null,
      'path': '/project/plan/ProjectPlanList',
      'component': 'ProjectPlanList',
      'name': 'ProjectPlanList'
    }, {
      'id': 37,
      'title': '项目审核',
      'parentId': 38,
      'sort': null,
      'icon': null,
      'path': '/project/worklog/WorklogList',
      'component': 'WorklogList',
      'name': 'WorklogList'
    }, {
      'id': 39,
      'title': '项目计划查询',
      'parentId': 38,
      'sort': null,
      'icon': null,
      'path': '/project/plan/ProjectPlanQueryList',
      'component': 'ProjectPlanQueryList',
      'name': 'ProjectPlanQueryList'
    }
  ]
  const json = builder(nav)
  return json
}

Mock.mock(/\/api\/user\/info/, 'get', info)
Mock.mock(/\/api\/user\/nav/, 'get', userNav)
