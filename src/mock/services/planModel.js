import Mock from 'mockjs2'
import { builder } from '../util'
// eslint-disable-next-line no-unused-vars
const planModel = () => {
  return builder({
    'data': [{
      id: 100,
      milepostLevel: 1,
      parentid: 0,
      milepostid: 1,
      planid: 1,
      editFlag: false,
      milepostname: '确定计划',
      logoff: 0,
      children: [
        {
          id: 101,
          milepostLevel: 2,
          parentid: 100,
          milepostid: null,
          planid: 1,
          editFlag: true,
          milepostname: '确定项目计划',
          logoff: 0,
          children: [
            {
              id: 1010,
              milepostLevel: 3,
              parentid: 101,
              milepostid: null,
              planid: 1,
              editFlag: true,
              milepostname: '项目计划填写',
              logoff: 1,
              children: [{
                id: 10101,
                milepostLevel: 4,
                parentid: 1010,
                milepostid: null,
                planid: 1,
                editFlag: true,
                milepostname: '明细计划填写',
                logoff: 0,
                children: []
              }]
            }
          ]
        },
        {
          id: 102,
          milepostLevel: 2,
          parentid: 100,
          milepostid: null,
          planid: 1,
          editFlag: true,
          milepostname: '确定进度计划',
          logoff: 0,
          children: []
        }
      ]
    },
    {
      id: 200,
      milepostLevel: 1,
      parentid: 0,
      milepostid: 2,
      planid: 1,
      editFlag: false,
      milepostname: '系统调研',
      logoff: 0,
      children: []
    },
    {
      id: 300,
      milepostLevel: 1,
      parentid: 0,
      milepostid: 3,
      planid: 1,
      editFlag: false,
      milepostname: '部署上线',
      logoff: 0,
      children: []
    },
    {
      id: 400,
      milepostLevel: 1,
      parentid: 0,
      milepostid: 4,
      planid: 1,
      editFlag: false,
      milepostname: '系统培训',
      logoff: 0,
      children: []
    },
    {
      id: 500,
      milepostLevel: 1,
      parentid: 0,
      milepostid: 5,
      planid: 1,
      editFlag: false,
      milepostname: '系统应用',
      logoff: 0,
      children: []
    },
    {
      id: 600,
      milepostLevel: 1,
      parentid: 0,
      milepostid: 6,
      planid: 1,
      editFlag: false,
      milepostname: '项目终验',
      logoff: 0,
      children: []
    }
    ]
  })
}

Mock.mock(/\/getPlanModel/, 'get', planModel)
