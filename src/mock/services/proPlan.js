import Mock from 'mockjs2'
import { builder } from '../util'
// eslint-disable-next-line no-unused-vars
const totalCount = 5701

const proPlans = () => {
  return builder({
    'data': [{
      contractno: '2008-0379',
      contractName: '昆山市卫生局(社区)',
      largeAreaText: '苏皖大区_',
      areaText: '苏州区',
      projectName: '昆山市卫生局(社区)2008-0379',
      flagText: '工程',
      projectTypeText: '社区',
      projectManager: '林德渊',
      planFlag: '0',
      modifyDate: '',
      memberNum: 2
    },
    {
      contractno: '2008-0529',
      contractName: '上海市社会保障和市民服务信息中心HRP',
      largeAreaText: '上海大区_',
      areaText: '沪中区',
      projectName: '上海市社会保障和市民服务信息中心(社会保障卡服务中心)(HRP)2008-0529',
      flagText: '工程',
      projectTypeText: 'HRP',
      projectManager: '林德渊',
      planFlag: '1',
      modifyDate: '',
      memberNum: 2
    },
    {
      contractno: '2008-0457',
      contractName: '苏州市第五人民医院(HIS售后)',
      largeAreaText: '苏皖大区_',
      areaText: '苏州区',
      projectName: '苏州市第五人民医院(HRP)2008-0457',
      flagText: '工程',
      projectTypeText: 'HRP',
      projectManager: '林德渊',
      planFlag: '0',
      modifyDate: '',
      memberNum: 2
    }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 3,
    'totalCount': 57
  })
}

Mock.mock(/\/getPlans/, 'get', proPlans)
