import Mock from 'mockjs2'
import { builder, getBody } from '../util'

const list = [
  {
    id: 1,
    name: '系统管理员',
    roleName: 'admin',
    system: 2
  },
  {
    id: 2,
    name: '普通用户',
    roleName: 'user',
    system: 2
  },
  {
    id: 3,
    name: '信息中心',
    roleName: 'centeruser',
    system: 2
  }
]

const roleList = () => {
  return builder(list)
}

const newRoleList = (params) => {
  const body = getBody(params)
  const newMap = {
    'id': 7,
    'system': body.system,
    'name': body.name,
    'roleName': body.roleName
  }
  list.push(newMap)
  return builder(list)
}

Mock.mock(/\/api\/role\/list/, 'get', roleList)
Mock.mock(/\/api\/role\/add/, 'post', newRoleList)
