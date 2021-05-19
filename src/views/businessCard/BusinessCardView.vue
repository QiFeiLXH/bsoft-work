<template>
  <div>
    <a-card
      :bordered="false"
      :bodyStyle="{
        height:cardHeight+'px',
        padding: '0px 10px',
      }">
      <a-row style="margin-bottom: 10px;margin-top:10px;">
        <a-col>
          <span>申请日期：</span>
          <a-range-picker v-model="dateRange" @change="onRangeChange" style="width: 250px" :allowClear="false"/>
          <a-divider type="vertical"/>
          <a-input-search
            placeholder="请输入姓名/拼音简码/工号/流水号查询"
            :allowClear="true"
            style="width: 300px;"
            v-model="queryParam.inputContent"
            @search="doQueryBusinessCard"
            @pressEnter="doQueryBusinessCard"/>
          <a-divider type="vertical"/>
<!--          <dept-select-->
<!--            v-model="queryParam.deptId"-->
<!--            placeholder="按部门选择"-->
<!--            @change="onDeptChange"-->
<!--            style="width: 190px;"></dept-select>-->
          <memory-dept-select style="width:190px;" :storageKey="'BusinessCardView_deptUseful_01'" ref="dept" :disabled="false" placeholder="按部门选择" v-model="queryParam.deptId"  @change="onDeptChange"></memory-dept-select>
          <a-divider type="vertical"/>
          <a-button type="primary" icon="search" @click="doQueryBusinessCard">查询</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-radio-group @change="onStatusChange" v-model="queryParam.status">
            <a-radio :value="0">
              <template>
                <a-badge :count="unpaidCount">
                  <div class="head-example">未支付</div>
                </a-badge>
              </template>
            </a-radio>
            <a-radio :value="1">
              <a-badge count="0">
                <div class="head-example">已申请</div>
              </a-badge>
            </a-radio>
            <a-radio :value="-1">
              <a-badge count="0">
                <div class="head-example" style="width: 25px">全部</div>
              </a-badge>
            </a-radio>
          </a-radio-group>
          <div style="display: inline;position: fixed">
            <a-divider v-action:1 type="vertical"/>
            <a-button v-action:1 type="primary" @click="doBatchApplyPay" :loading="isApplying" :disabled="queryParam.status !== 0">申请支付</a-button>
            <a-divider v-action:1 type="vertical"/>
            <a-button v-action:1 type="primary" @click="doBatchPay" :loading="isPaying" :disabled="queryParam.status !== 1">批量支付</a-button>
          </div>

          <span
            style="float: right;margin-right: 20px;margin-top: 5px">未支付金额： <a>￥{{ unpaidAmount | AmountFormat }}</a><span v-if="content">{{ content }} <a>￥{{ totalAmount | AmountFormat }}</a></span></span>
        </a-col>
      </a-row>
      <s-table
        v-watermark
        :row-selection="{ columnTitle: '选择', selectedRowKeys: selectedRowKeys, onChange: onSelectChange,
                          getCheckboxProps: record => ({
                            props: {
                              disabled: queryParam.status === -1
                            }
                          })}"
        ref="table"
        size="small"
        :rowKey="(record) => record.id"
        :columns="businessCardColumns"
        :height="tableHeight"
        :data="loadBusinessCardList"
        :customRow="onClickRow"
        :rowClassName="setCurrentRow"
        :showSizeChanger="false"
        :pageSize="pagination.pageSize"
        :pageNum="pagination.pageNumber"
        :showPagination="true"
        :bodyStyle="{ height:listScrollHeight+'px' }"
        :scroll="{ x: false, y: listScrollHeight }"
      >
        <template slot="rowIndex" slot-scope="text, record, index">
          <span>
            {{ (pagination.pageNumber - 1) * pagination.pageSize + index + 1 }}
          </span>
        </template>
        <template slot="status" slot-scope="text">
          <a-badge :color="text | statusFilter" :text="text | statusTextFilter"/>
        </template>
        <template slot="amount" slot-scope="text">
          {{ text | AmountFormat }}
        </template>
        <template slot="postName" slot-scope="text">
          <a-tooltip>
            <template slot="title">
              {{ text }}
            </template>
            {{ text }}
          </a-tooltip>
        </template>
        <template slot="deptName" slot-scope="text">
          <a-tooltip>
            <template slot="title">
              {{ text }}
            </template>
            {{ text }}
          </a-tooltip>
        </template>
        <template slot="lshid" slot-scope="text">
          <a-tooltip>
            <template slot="title">
              {{ text }}
            </template>
            {{ text }}
          </a-tooltip>
        </template>
      </s-table>
    </a-card>
    <a-drawer
      :title="drawerTitle"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="900"
      @close="onDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <business-card-info-module
        :businessCardInfo="businessCardInfo"
        v-if="drawerVisible"></business-card-info-module>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '9px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button key="back" @click="onDrawerClose">关闭</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { STable } from '@/components'
import { DeptSelect } from '@/module'
import { doLoadBusinessCardList, getUnpaidCount, getUnpaidAmount, getTotalAmount, getBusinessCardIds, applyPayBusinessCard, payBusinessCard } from '@/api/businessCard'
import moment from 'moment'
import { downFile } from '@/utils/util'
import store from '@/store'
import BusinessCardInfoModule from './component/BusinessCardInfoModule'
import MemoryDeptSelect from "../../components/MemorySelect/MemoryDeptSelect";

const statusMap = {
  0: {
    color: 'grey',
    text: '未支付'
  },
  1: {
    color: 'blue',
    text: '已申请'
  },
  2: {
    color: 'green',
    text: '已支付'
  }
}
export default {
  name: 'BusinessCardView',
  components: {
    DeptSelect,
    STable,
    BusinessCardInfoModule,
    MemoryDeptSelect
  },
  data () {
    return {
      moment,
      rowSelected: null,
      tableHeight: 0,
      queryParam: {
        pageSize: 25,
        inputContent: null,
        status: 0,
        deptId: null,
        startDate: null,
        endDate: null
      },
      pagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      loadBusinessCardList: parameter => {
        return doLoadBusinessCardList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.expressDetailList = res.body.items
            this.pagination.pageNumber = res.body.pageNumber + 1
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      businessCardColumns: [
        {
          dataIndex: 'lshid',
          width: '18%',
          title: '流水号',
          scopedSlots: { customRender: 'lshid' },
          ellipsis: true
        },
        {
          dataIndex: 'userName',
          width: '10%',
          title: '申请人'
        },
        {
          dataIndex: 'applyDate',
          width: '12%',
          title: '申请日期'
        },
        {
          dataIndex: 'deptName',
          width: '20%',
          title: '部门',
          scopedSlots: { customRender: 'deptName' },
          ellipsis: true
        },
        {
          dataIndex: 'postName',
          width: '12%',
          title: '岗位名称',
          scopedSlots: { customRender: 'postName' },
          ellipsis: true
        },
        {
          dataIndex: 'amount',
          width: '14%',
          title: '金额',
          scopedSlots: { customRender: 'amount' },
          align: 'right'
        },
        {
          dataIndex: 'status',
          width: '12%',
          title: '状态',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        }
      ],
      unpaidCount: 0,
      unpaidAmount: 0,
      drawerVisible: false,
      businessCardInfo: {},
      drawerTitle: '',
      dateRange: [],
      isApplying: false,
      isPaying: false,
      selectedRowKeys: [],
      content: '，本次申请支付金额：',
      totalAmount: 0,
      expressDetailList: []
    }
  },
  computed: {
    cardHeight: function () {
      return window.innerHeight - 85
    },
    listScrollHeight: function () {
      return window.innerHeight - 300
    }
  },
  filters: {
    statusTextFilter (type) {
      return statusMap[type].text
    },
    statusFilter (type) {
      return statusMap[type].color
    }
  },
  methods: {
    doQueryBusinessCard (flag) {
      this.refreshTable(flag)
      this.getUnpaidCount()
      this.getUnpaidAmount()
      if (this.queryParam.status !== -1) {
        this.getAllBusinessCardIds()
      } else {
        this.selectedRowKeys = []
      }
    },
    onRangeChange (dates, dateStrings) {
      this.queryParam.startDate = dateStrings[0]
      this.queryParam.endDate = dateStrings[1]
      this.doQueryBusinessCard()
    },
    onStatusChange (val) {
      var status = val.target.value
      if (status === 0) {
        this.content = '，本次申请支付金额：'
      }
      if (status === 1) {
        this.content = '，本次支付金额：'
      }
      if (status === -1) {
        this.content = ''
      }
      this.queryParam.status = val.target.value
      this.doQueryBusinessCard()
    },
    onDeptChange (val) {
      this.queryParam.deptId = val
      this.doQueryBusinessCard()
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.getTotalAmount()
    },
    onDrawerClose () {
      this.drawerVisible = false
      this.drawerTitle = ''
    },
    refreshTable (flag) {
      this.rowSelected = null
      setTimeout(() => {
        this.$refs.table.refresh(flag !== 1) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    resetDataSource (data) {
      setTimeout(() => {
        this.$refs.table.resetLocalDataSource(data) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    doBatchApplyPay () {
      if (this.isApplying) {
        return
      }
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择需要申请支付的名片数据！')
        return
      }
      const me = this
      this.$confirm({
        title: '是否批量申请支付选中的名片？',
        // 确认 与 关闭位置对调
        cancelText: '确定',
        okText: '取消',
        okButtonProps: {
          props: {
            type: 'default'
          }
        },
        cancelButtonProps: {
          props: {
            type: 'primary'
          }
        },
        onOk () {
        },
        onCancel () {
          const params = {}
          params.menuId = me.$route.meta.id // 菜单id
          params.context = me.$route.meta.title // 菜单名称
          params.personId = store.getters.userInfo.personId // 用户id
          params.system = 16 // 系统
          params.businessCardIds = me.selectedRowKeys
          me.isApplying = true
          applyPayBusinessCard(params).then(res => {
            me.$message.success('申请支付成功')
            me.doQueryBusinessCard()
            const headers = res.headers
            const contentType = headers['content-type']
            if (res.data) {
              const blob = new Blob([res.data], { type: contentType })
              const contentDisposition = res.headers['content-disposition']
              let fileName = 'unknown'
              if (contentDisposition) {
                fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1])
              }
              downFile(blob, fileName)
            }
            me.isApplying = false
          })
        }
      })
    },
    doBatchPay () {
      if (this.isPaying) {
        return
      }
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择需要批量支付的名片数据！')
        return
      }
      const me = this
      this.$confirm({
        title: '是否批量支付选中的名片？',
        // 确认 与 关闭位置对调
        cancelText: '确定',
        okText: '取消',
        okButtonProps: {
          props: {
            type: 'default'
          }
        },
        cancelButtonProps: {
          props: {
            type: 'primary'
          }
        },
        onOk () {
        },
        onCancel () {
          me.isPaying = true
          payBusinessCard({ businessCardIds: me.selectedRowKeys }).then(res => {
            if (res.code === 200) {
              me.$message.success('批量支付成功')
              me.doQueryBusinessCard()
              me.isPaying = false
            }
            me.isPaying = false
          })
        }
      })
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowSelected = record.id
          },
          dblclick: () => {
            this.businessCardInfo = { ...record }
            this.drawerVisible = true
            this.drawerTitle = '名片详细信息（工号：' + record.userId + '）'
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.rowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    getUnpaidCount () {
      getUnpaidCount(this.queryParam).then(res => {
        if (res.code === 200) {
          this.unpaidCount = res.body
        }
      })
    },
    getUnpaidAmount () {
      getUnpaidAmount().then(res => {
        if (res.code === 200) {
          this.unpaidAmount = res.body
        }
      })
    },
    getTotalAmount () {
      if (this.selectedRowKeys.length === 0) {
        this.totalAmount = 0
        return
      }
      getTotalAmount({ businessCardIds: this.selectedRowKeys }).then(res => {
        if (res.code === 200) {
          this.totalAmount = res.body
        }
      })
    },
    getAllBusinessCardIds () {
      getBusinessCardIds(this.queryParam).then(res => {
        if (res.code === 200) {
          this.selectedRowKeys = res.body
        }
      }).then(res => {
        this.getTotalAmount()
      })
    },
    initPage () {
      var startDate = moment().startOf('month')
      var endDate = moment().endOf('month')
      this.dateRange = []
      this.dateRange.push(startDate)
      this.dateRange.push(endDate)
      this.queryParam.startDate = startDate.format('YYYY-MM-DD')
      this.queryParam.endDate = endDate.format('YYYY-MM-DD')
      this.getUnpaidCount()
      this.getUnpaidAmount()
      this.getAllBusinessCardIds()
    }
  },
  created () {
    this.initPage()
  }
}
</script>

<style scoped>
  /deep/ .ant-table-placeholder {
    display: none;
  }

  .head-example {
    width: 60px;
    height: 40px;
    border-radius: 4px;
    background: white;
    padding: 10px 10px 10px 0px;
  }

  /deep/ .ant-badge-count, .ant-badge-dot, .ant-badge .ant-scroll-number-custom-component {
    position: absolute;
    top: 4px;
    right: 6px;
    -webkit-transform: translate(50%, -50%);
    transform: translate(50%, -50%);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
  }

  /deep/ .ant-badge-count {
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    color: #fff;
    font-weight: 400;
    font-size: 10px;
    line-height: 20px;
    white-space: nowrap;
    text-align: center;
    background: #f5222d;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #fff;
  }
</style>
