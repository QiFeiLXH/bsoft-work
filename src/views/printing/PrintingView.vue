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
          <span>文印日期：</span>
          <a-month-picker v-model="month" @change="onMonthChange" style="width: 120px" :allowClear="false"/>
          <a-divider type="vertical"/>
          <a-input-search
            placeholder="请输入姓名/简拼/工号/订单编号/流水号查询"
            :allowClear="true"
            style="width: 370px;"
            v-model="queryParam.inputContent"
            @search="doQueryPrinting"
            @pressEnter="doQueryPrinting"/>
          <a-divider type="vertical"/>
<!--          <dept-select-->
<!--            v-model="queryParam.deptId"-->
<!--            placeholder="按部门选择"-->
<!--            @change="onDeptChange"-->
<!--            style="width: 160px;"></dept-select>-->
          <memory-dept-select style="width:160px;" :storageKey="'PrintingView_deptUseful_01'" ref="dept" :disabled="false" placeholder="按部门选择" v-model="queryParam.deptId"  @change="onDeptChange"></memory-dept-select>
          <a-divider type="vertical"/>
          <a-button type="primary" icon="search" @click="doQueryPrinting">查询</a-button>
          <a-divider type="vertical"/>
          <a-button type="primary" icon="download" @click="doDownloadTemplate" :loading="isDownloading" >下载模板</a-button>
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
            <a-divider type="vertical"/>
            <a-upload
              :customRequest="doUploadData"
              :showUploadList="false"
              :fileList="fileList"
              :remove="handleRemove"
              :beforeUpload="beforeUpload">
              <a-button type="primary" icon="upload" :loading="isUploading">核准金额导入</a-button>
            </a-upload>
          </div>

          <span
            style="float: right;margin-right: 20px;margin-top: 5px">未支付金额： <a>￥{{ unpaidAmount | AmountFormat }}</a><span v-if="content">{{ content }} <a>￥{{ totalAmount | AmountFormat }}</a></span></span>
        </a-col>
      </a-row>
      <a-row style="margin-bottom:5px;" v-if="isDisplaying">
        <a-col>
          <template>
            <span>导出结果：{{ importResultMsg }}</span>
            <a-button
              type="primary"
              icon="file-excel"
              @click="doDownloadErrorRecords"
              :loading="isErrorDownloading"
              v-if="haveErrors"
              style="margin-left:20px">查看</a-button>
            <a-icon type="close-circle" @click="handleClose" style="margin-left:20px"></a-icon>
          </template>
        </a-col>
      </a-row>
      <s-table
        :row-selection="{ columnTitle: '选择', selectedRowKeys: selectedRowKeys, onChange: onSelectChange,
                          getCheckboxProps: record => ({
                            props: {
                              disabled: record.approval === 0 || !record.approval || queryParam.status === -1
                            }
                          })}"
        ref="table"
        size="small"
        :rowKey="(record) => record.id"
        :columns="printingColumns"
        :height="tableHeight"
        :data="loadPrintingList"
        :customRow="onClickRow"
        :rowClassName="setCurrentRow"
        :showSizeChanger="false"
        :pageSize="pagination.pageSize"
        :pageNum="pagination.pageNumber"
        :showPagination="true"
        :bodyStyle="{ height:listScrollHeight+'px' }"
        :scroll="{ x: 890, y: listScrollHeight }"
      >
        <template slot="rowIndex" slot-scope="text, record, index">
          <span>
            {{ (pagination.pageNumber - 1) * pagination.pageSize + index + 1 }}
          </span>
        </template>
        <template slot="status" slot-scope="text">
          <a-badge :color="text | statusFilter" :text="text | statusTextFilter"/>
        </template>
        <template slot="sumAmount" slot-scope="text">
          {{ text | AmountFormat }}
        </template>
        <template slot="approval" slot-scope="text, record">
          <template v-if="record.isModified">
            <a-input-number
              :min="0"
              :value="text"
              @change="val => handleApprovalChange(val, record.id)"></a-input-number>
          </template>
          <template v-else>
            {{ text | AmountFormat }}
          </template>
        </template>
        <template slot="orderNum" slot-scope="text">
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
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.status === 0">
            <template v-if="record.isModified">
              <a @click="handleSavePrinting(record)"><a-icon type="check"/></a>
              <a-divider type="vertical"/>
              <a @click="handleCancelPrintingDetail(record)"><a-icon type="close"/></a>
            </template>
            <template v-else>
              <a @click="doOperate(record, 'modify')">修改</a>
            </template>
          </template>

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
      <printing-info-module
        :printingInfo="printingInfo"
        v-if="drawerVisible"></printing-info-module>
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
import { doLoadPrintingList, getUnpaidCount, getUnpaidAmount, getTotalAmount, getPrintingIds, importPrinting, applyPayPrinting, payPrinting, exportErrorRecords, exportTemplate, savePrinting } from '@/api/printing'
import moment from 'moment'
import { downFile } from '@/utils/util'
import store from '@/store'
import PrintingInfoModule from './component/PrintingInfoModule'
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
  name: 'PrintingView',
  components: {
    DeptSelect,
    STable,
    PrintingInfoModule,
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
      loadPrintingList: parameter => {
        return doLoadPrintingList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 200) {
            this.printingList = res.body.items
            this.pagination.pageNumber = res.body.pageNumber + 1
            this.pagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      printingColumns: [
        {
          dataIndex: 'orderNum',
          width: 150,
          title: '订单编号',
          scopedSlots: { customRender: 'orderNum' },
          ellipsis: true
        },
        {
          dataIndex: 'applicantName',
          width: 80,
          title: '申请人'
        },
        {
          dataIndex: 'printDate',
          width: 120,
          title: '文印日期'
        },
        {
          dataIndex: 'deptName',
          width: 150,
          title: '部门',
          scopedSlots: { customRender: 'deptName' },
          ellipsis: true
        },
        {
          dataIndex: 'sumAmount',
          width: 90,
          title: '金额',
          scopedSlots: { customRender: 'sumAmount' },
          align: 'right'
        },
        {
          dataIndex: 'approval',
          width: 90,
          title: '核准金额',
          scopedSlots: { customRender: 'approval' },
          align: 'right'
        },
        {
          dataIndex: 'lshid',
          width: 160,
          title: '流水号',
          align: 'left',
          scopedSlots: { customRender: 'lshid' },
          ellipsis: true
        },
        {
          dataIndex: 'status',
          width: 80,
          title: '状态',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          dataIndex: 'operation',
          width: 100,
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          fixed: 'right'
        }
      ],
      unpaidCount: 0,
      unpaidAmount: 0,
      drawerVisible: false,
      printingInfo: {},
      drawerTitle: '',
      month: null,
      isApplying: false,
      isPaying: false,
      isUploading: false,
      isErrorDownloading: false,
      isDownloading: false,
      fileList: [],
      importResultMsg: '',
      uploadTypes: ['xls', 'xlsx'],
      selectedRowKeys: [],
      content: '，本次申请支付金额：',
      totalAmount: 0,
      isDisplaying: false,
      haveErrors: false,
      printingList: []
    }
  },
  computed: {
    cardHeight: function () {
      return window.innerHeight - 85
    },
    listScrollHeight: function () {
      return this.isDisplaying ? window.innerHeight - 325 : window.innerHeight - 300
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
    doOperate (record, op) {
      this.rowSelected = record.id
      if (op === 'modify') {
        this.doModify(record)
      }
    },
    doModify (record) {
      const data = [ ...this.printingList ]
      var target = data.find(item => item.id === record.id)
      if (target) {
        target.isModified = true
        target._originalData = {}
        Object.assign(target._originalData, target)
      }
      this.printingList = data
      this.resetDataSource(data)
    },
    handleSavePrinting (record) {
      this.rowSelected = record.id
      var printing = {}
      Object.assign(printing, record)
      delete printing._originalData
      savePrinting(printing).then(res => {
        if (res.code === 200) {
          this.$message.success('修改核准金额成功！')
          this.doQueryPrinting(1)
        }
      })
    },
    handleCancelPrintingDetail (record) {
      this.rowSelected = record.id
      const data = [ ...this.printingList ]
      var target = data.find(item => item.id === record.id)
      if (target) {
        Object.assign(target, target._originalData)
        target._originalData = {}
        target.isModified = false
      }
      this.printingList = data
      this.resetDataSource(data)
    },
    handleApprovalChange (val, id) {
      const data = [ ...this.printingList ]
      var target = data.find(item => item.id === id)
      if (target) {
        target.approval = val
      }
      this.printingList = data
      this.resetDataSource(data)
    },
    doQueryPrinting (flag) {
      this.refreshTable(flag)
      this.getUnpaidCount()
      this.getUnpaidAmount()
      if (this.queryParam.status !== -1) {
        this.getAllPrintingIds()
      } else {
        this.selectedRowKeys = []
      }
    },
    onMonthChange (moment) {
      this.month = moment
      this.queryParam.startDate = moment.startOf('month').format('YYYY-MM-DD').toString()
      this.queryParam.endDate = moment.endOf('month').format('YYYY-MM-DD').toString()
      this.doQueryPrinting()
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
      this.doQueryPrinting()
    },
    onDeptChange (val) {
      this.queryParam.deptId = val
      this.doQueryPrinting()
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.getTotalAmount()
    },
    onDrawerClose () {
      this.drawerVisible = false
      this.drawerTitle = ''
    },
    handleClose () {
      this.haveErrors = false
      this.isDisplaying = false
      this.importResultMsg = ''
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
        this.$message.warning('请选择需要申请支付的文印数据！')
        return
      }
      const me = this
      this.$confirm({
        title: '是否批量申请支付选中的文印？',
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
          params.ids = me.selectedRowKeys
          me.isApplying = true
          applyPayPrinting(params).then(res => {
            me.$message.success('申请支付成功')
            me.doQueryPrinting()
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
        this.$message.warning('请选择需要批量支付的文印数据！')
        return
      }
      const me = this
      this.$confirm({
        title: '是否批量支付选中的文印？',
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
          payPrinting({ ids: me.selectedRowKeys }).then(res => {
            if (res.code === 200) {
              me.$message.success('批量支付成功')
              me.doQueryPrinting()
              me.isPaying = false
            }
            me.isPaying = false
          })
        }
      })
    },
    doUploadData () {
      if (this.isUploading) {
        return
      }
      this.isUploading = true
      this.loading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      const me = this
      importPrinting(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('导入结束')
          if (res.body.failCount > 0) {
            this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败' + res.body.failCount + '条数据，请点击右边下载查看导入失败数据！'
            this.haveErrors = true
          } else {
            this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败0条数据！'
          }
          this.isDisplaying = true
          me.doQueryPrinting()
        }
        me.isUploading = false
      })
    },
    doDownloadTemplate () {
      if (this.isDownloading) {
        return
      }
      const params = {}
      params.menuId = this.$route.meta.id // 菜单id
      params.context = this.$route.meta.title // 菜单名称
      params.personId = store.getters.userInfo.personId // 用户id
      params.system = 16 // 系统
      this.isDownloading = true
      exportTemplate(params).then(res => {
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
        this.isDownloading = false
      }).catch(error => {
        console.log(error)
        this.isDownloading = false
      })
    },
    doDownloadErrorRecords () {
      if (this.isErrorDownloading) {
        return
      }
      const params = {}
      params.menuId = this.$route.meta.id // 菜单id
      params.context = this.$route.meta.title // 菜单名称
      params.personId = store.getters.userInfo.personId // 用户id
      params.system = 16 // 系统
      this.isErrorDownloading = true
      exportErrorRecords(params).then(res => {
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
        this.isErrorDownloading = false
      }).catch(error => {
        console.log(error)
        this.isErrorDownloading = false
      })
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)
      const index = this.uploadTypes.findIndex(item => item === suffix)
      if (index === -1) {
        this.$message.error('文件格式不对!')
        return false
      } else {
        this.fileList = [file]
        return true
      }
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowSelected = record.id
          },
          dblclick: () => {
            this.printingInfo = { ...record }
            this.drawerVisible = true
            this.drawerTitle = '文印详细信息（订单编号：' + record.orderNum + ')'
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
      getTotalAmount({ printingIds: this.selectedRowKeys }).then(res => {
        if (res.code === 200) {
          this.totalAmount = res.body
        }
      })
    },
    getAllPrintingIds () {
      getPrintingIds(this.queryParam).then(res => {
        if (res.code === 200) {
          this.selectedRowKeys = res.body
        }
      }).then(res => {
        this.getTotalAmount()
      })
    },
    initPage () {
      this.month = moment()
      this.queryParam.startDate = this.month.startOf('month').format('YYYY-MM-DD').toString()
      this.queryParam.endDate = this.month.endOf('month').format('YYYY-MM-DD').toString()
      this.getUnpaidCount()
      this.getUnpaidAmount()
      this.getAllPrintingIds()
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
