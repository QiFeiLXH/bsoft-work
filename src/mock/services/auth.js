import Mock from 'mockjs2'
import { builder, getBody } from '../util'

// 模拟登录
const username = ['admin', 'super']
const password = ['8914DE686AB28DC22F30D3D8E107FF6C'] // admin, ant.design

const login = (options) => {
  const body = getBody(options)
  if (!username.includes(body.username) || !password.includes(body.password)) {
    return builder({ isLogin: true }, {}, '账户或密码错误', 401)
  }

  return builder({}, {
    'id': Mock.mock('@guid'),
    'name': Mock.mock('@name'),
    'username': 'admin',
    'password': '',
    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    'status': 1,
    'telephone': '',
    'lastLoginIp': '27.154.74.117',
    'lastLoginTime': 1534837621348,
    'creatorId': 'admin',
    'createTime': 1497160610259,
    'deleted': 0,
    'roleId': 'admin',
    'lang': 'zh-CN',
    'sessionid': '4291d7da9005377ec9aec4a71ea837f'
  }, '', 200, { 'Custom-Header': Mock.mock('@guid') })
}

const logout = () => {
  return builder({}, '[测试接口] 注销成功')
}

Mock.mock(/\/auth\/login/, 'post', login)
Mock.mock(/\/auth\/logout/, 'post', logout)
