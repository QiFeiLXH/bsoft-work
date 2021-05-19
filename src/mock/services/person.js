import Mock from 'mockjs2'
import {builder, getBody } from '../util'

const personList = [
  {
    key: '1',
    title: 'title',
    // description: 'description',
    personId: '1',
    personName: '徐成龙1',
    deptId: '2222',
    deptName: '1',
    isValid: 1
  },
  {
    key: '2',
    title: 'title',
    // description: 'description',
    personId: '2',
    personName: '徐成龙2',
    deptId: '2222',
    deptName: '2',
    isValid: 1
  },
  {
    key: '3',
    title: 'title',
    // description: 'description',
    personId: '3',
    personName: '徐成龙3',
    deptId: '2222',
    deptName: '3',
    isValid: 1
  },
  {
    key: '4',
    title: 'title',
    // description: 'description',
    personId: '4',
    personName: '徐成龙4',
    deptId: '2222',
    deptName: '4',
    isValid: 1
  },
  {
    key: '5',
    title: 'title',
    // description: 'description',
    personId: '5',
    personName: '徐成龙5',
    deptId: '2222',
    deptName: '5',
    isValid: 1
  },
  {
    key: '6',
    title: 'title',
    // description: 'description',
    personId: '6',
    personName: '徐成龙6',
    deptId: '2222',
    deptName: '6',
    isValid: 1
  },
  {
    key: '7',
    title: 'title',
    // description: 'description',
    personId: '7',
    personName: '徐成龙7',
    deptId: '2222',
    deptName: '7',
    isValid: 1
  },
  {
    key: '8',
    title: 'title',
    // description: 'description',
    personId: '8',
    personName: '徐成龙8',
    deptId: '2222',
    deptName: '8',
    isValid: 1
  },
  {
    key: '9',
    title: 'title',
    // description: 'description',
    personId: '9',
    personName: '徐成龙9',
    deptId: '2222',
    deptName: '9',
    isValid: 1
  },
  {
    key: '10',
    title: 'title',
    // description: 'description',
    personId: '10',
    personName: '徐成龙10',
    deptId: '2222',
    deptName: '10',
    isValid: 0
  },
  {
    key: '11',
    title: 'title',
    // description: 'description',
    personId: '11',
    personName: '徐成龙11',
    deptId: '2222',
    deptName: '11',
    isValid: 0
  },
  {
    key: '12',
    title: 'title',
    // description: 'description',
    personId: '12',
    personName: '徐成龙12',
    deptId: '2222',
    deptName: '12',
    isValid: 0
  }
]

const personListAuth = ['2','4','6','8']

const personListAll = () => {
  return builder(personList)
}

const personListRole = (options) => {
  const body = getBody(options)
  const roleId = body.roleId
  return builder(personListAuth)
}

const newpersonListRole = (options) => {
  const body = getBody(options)
  console.log(body)
  return builder(personListAuth)
}

Mock.mock(/\/person\/list/, 'get', personListAll)
Mock.mock(/\/person\/roleList/, 'post', personListRole)
Mock.mock(/\/person\/save/, 'post', newpersonListRole)

