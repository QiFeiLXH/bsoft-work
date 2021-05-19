import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'
const tree = [{
  'key': 'key-01',
  'title': '启动阶段',
  'icon': 'check-square',
  'children': [{
    'key': 'key-01-01',
    'title': '项目启动会'
  }]
}, {
  'key': 'key-02',
  'title': '准备阶段',
  'icon': 'edit',
  'children': [{
    'key': 'key-02-01',
    'title': '确定项目计划',
    'icon': null
  }, {
    'key': 'key-02-02',
    'title': '环境准备',
    'icon': null,
    'children': [{
      'key': 'key-02-02-01',
      'title': '网络环境准备',
      'icon': null
    }, {
      'key': 'key-02-02-02',
      'title': '中心端硬件环境准备',
      'icon': null
    }, {
      'key': 'key-02-02-03',
      'title': '应用端硬件环境准备',
      'icon': null
    }, {
      'key': 'key-02-02-04',
      'title': '软件环境准备',
      'icon': null
    }
    ]
  }, {
    'key': 'key-02-03',
    'title': '产品准备',
    'icon': null,
    'children': [{
      'key': 'key-02-03-01',
      'title': 'HIS产品准备',
      'icon': null
    },
    {
      'key': 'key-02-03-02',
      'title': '公卫产品准备',
      'icon': null
    }, {
      'key': 'key-02-03-03',
      'title': '区域平台产品准备',
      'icon': null
    }, {
      'key': 'key-02-03-04',
      'title': '软件接口准备',
      'icon': null
    }, {
      'key': 'key-02-03-05',
      'title': '互联互通联调',
      'icon': null
    }
    ]
  }]
}, {
  'key': 'key-03',
  'title': '实施阶段',
  'icon': 'tool',
  'children': [{
    'key': 'key-03-01',
    'title': '系统部署',
    'icon': null
  }, {
    'key': 'key-03-02',
    'title': '数据准备',
    'icon': null
  }, {
    'key': 'key-03-03',
    'title': '产品培训',
    'icon': null
  }, {
    'key': 'key-03-04',
    'title': '系统联调',
    'icon': null
  }, {
    'key': 'key-03-05',
    'title': '试点上线',
    'icon': null
  }, {
    'key': 'key-03-06',
    'title': '正式上线',
    'icon': null
  }]
}, {
  'key': 'key-04',
  'title': '验收阶段',
  'icon': 'message'
}, {
  'key': 'key-05',
  'title': '维护阶段',
  'icon': 'setting'
}]

const planTree = () => {
  return builder(tree)
}

const customerProject = {
  projectId: 1,
  projectName: '珠海市卫生健康网（区域平台）',
  contractNo: '2018-0611',
  manager: '0001',
  projectManagerText: '李杰',
  area: '123',
  areaText: '粤中区',
  amount: 1000,
  signDate: '2018-1-15',
  customerName: '珠海市卫生局',
  customerClass: '卫生局',
  customerState: '无',
  respectiveRegion: '广东省珠海市'
}

const ownLastProject = () => {
  return builder(customerProject)
}

const time = [
  {
    key: 0,
    time: '2019-1-16',
    flag: 1
  },
  {
    key: 1,
    time: '2019-1-15',
    flag: 1
  },
  {
    key: 2,
    time: '2019-1-14',
    flag: 1
  },
  {
    key: 3,
    time: '2019-1-13',
    flag: 0
  },
  {
    key: 4,
    time: '2019-1-12',
    flag: 0
  }
]

const initPage = () => {
  return builder({ 'time': time, 'customerProject"': customerProject, 'planTree': tree })
}

const totalCount = 100
const allProjects = (options) => {
  const parameters = getQueryParameters(options)
  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = pageSize

  for (let i = 0; i < next; i++) {
    const tmpKey = key + i
    result.push({
      projectId: tmpKey,
      projectName: '珠海市卫生健康网（区域平台）' + tmpKey,
      contractNo: '2018-0611',
      manager: '0001',
      projectManagerText: '李杰',
      area: '123',
      areaText: '粤中区',
      amount: 1000 * i,
      signDate: '2018-1-15',
      customerName: '珠海市卫生局',
      customerClass: '卫生局',
      customerState: '无',
      respectiveRegion: '广东省珠海市'
    })
  }

  return builder({
    pageSize: pageSize,
    pageNumber: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    items: result
  })
}

const ownWorkLogs = (options) => {
  console.log(options)
  return builder([{
    id: 1,
    attendanceId: 1001,
    milepostId: 2,
    range: 1,
    plan: 1,
    role: 7,
    mode: 1,
    type: 1,
    workLog: '在家办公1',
    workload: 4,
    projectScale: 0.8,
    workLogId: 102,
    auditter: '5262',
    auditDate: '2020-2-6',
    auditFlag: 0,
    remark: ''
  },
  {
    id: 2,
    attendanceId: 1001,
    milepostId: 2,
    range: 2,
    plan: 2,
    role: 7,
    mode: 2,
    type: 2,
    workLog: '在家办公2',
    workload: 4,
    projectScale: 0.8,
    workLogId: 102,
    auditter: '5262',
    auditDate: '2020-2-6',
    auditFlag: 0,
    remark: ''
  }
  ])
}

Mock.mock(/\/projectLog\/planTree/, 'get', planTree)
Mock.mock(/\/projectLog\/ownLastProject/, 'get', ownLastProject)
Mock.mock(/\/projectLog\/searchProjects/, 'get', allProjects)
Mock.mock(/\/projectLog\/ownWorkLogs/, 'get', ownWorkLogs)
Mock.mock(/\/projectLog\/initPage/, 'get', initPage)
