<template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">

    <a-row>
      <a-col :span="3" style="padding: 10px 10px 0 0 ">
        <a-table :loading="menuLoading"
                 :columns="menuColumns"
                 :dataSource="menuData"
                 :pagination="false"
                 :customRow="menuRowClick"
                 :rowClassName="setRowClassName"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: menuHeight + 'px', margin: 0,}"
                 :bordered="false"
                 size="small">
        </a-table>
      </a-col>

      <a-col :span="21">

        <a-row style="padding-top: 10px">
          <span>入库日期：</span>
          <a-range-picker v-model="inDateRange" @change="onDateChange" style="width: 220px"/>
          <a-divider type="vertical" />
          <span>名称/单位：</span>
          <a-input-search v-model="queryParam.inputContent" @search="getApplianceList" allowClear placeholder="物品名称、采购单位搜索" style="width: 200px"></a-input-search>
        </a-row>
        <a-row style="padding: 10px 0">
          <a-button type="primary" @click="entry" v-action:1>新增</a-button>
          <a-divider type="vertical" v-action:1/>
          <a-checkbox-group  v-model="queryParam.statusList" :options="options" @change="onStatusChange"/>
          <div style="margin-top: 6px; float: right">
            <span style="margin-left: 15px">未支付金额：<span style="color: #1890ff;">￥{{unPayMoney | NumberFormat}}</span></span>
            <span style="margin-left: 15px">申请支付金额：<span style="color: #1890ff;">￥{{applyPayMoney | NumberFormat}}</span></span>
          </div>
          <a-divider type="vertical" v-action:1/>
          <a-radio-group v-model="queryParam.submitFlag" @change="onSubmitFlagChange">
            <a-radio :value="0">未提交</a-radio>
            <a-radio :value="1">已提交</a-radio>
          </a-radio-group>
        </a-row>

        <a-table :loading="tableLoading"
                 :columns="tableColumns"
                 :dataSource="tableData"
                 :pagination="false"
                 :customRow="tableRowClick"
                 :row-selection="{selectedRows: selectedRows, selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps }"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 :scroll="{x: false, y: tableScrollHeight }"
                 :bordered="false"
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</span>
          </template>
          <template slot="nameName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="quantity" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="unitPrice" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">￥{{ record.unitPrice.toFixed(2) | NumberFormat }}</template>
              {{ record.unitPrice.toFixed(2) | NumberFormat }}
            </a-tooltip>
          </template>
          <template slot="money" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">￥{{ record.money.toFixed(2) | NumberFormat }}</template>
              {{ record.money.toFixed(2) | NumberFormat }}
            </a-tooltip>
          </template>
          <template slot="supplierName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="inDate" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="status" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">{{ text | statusTextFilter }}</template>
              <a-badge :status="text | statusFilter" :text="text | statusTextFilter"/>
            </a-tooltip>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <footer-tool-bar>
      <a-pagination :disabled="tableLoading"
                    :total="page.totalCount"
                    :pageSize.sync="page.pageSize"
                    v-model="page.pageNo"
                    @change="onPageChange"
                    style="margin-top: 10px"/>
    </footer-tool-bar>

    <a-drawer ref="modalDrawer"
              placement="right"
              title="入库信息"
              :closable="false"
              :width="600"
              :bodyStyle="{ padding: '0'}"
              @close="onEntryClose"
              :visible="showEntryFrom">
      <ApplianceEntryForm ref="applianceForm" @onEntrySaveSuccess="onEntrySaveSuccess"></ApplianceEntryForm>
      <div :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
        <a-button type="primary" style="margin-right: 20px" v-if="this.currentRecord.submitFlag != 1" :loading="submitLoading" @click="onEntrySubmit" v-action:1>提交</a-button>
        <a-button type="primary" style="margin-right: 20px" v-if="this.currentRecord.submitFlag != 1" :loading="saveLoading" @click="onEntrySave" v-action:1>保存</a-button>
        <a-button type="default"  @click="onEntryClose">取消</a-button>
      </div>
    </a-drawer>


  </a-card>
</template>

<script>
  import FooterToolBar from "@/components/FooterToolbar/FooterToolBar";
  import ApplianceEntryForm from "@/views/appliance/components/ApplianceEntryForm";
  import {
    getApplianceList,
    getApplianceUnPayMoney
  } from "@/api/applianceEntry";
  import { Decimal } from 'decimal.js'

  const statusMap = {
    1: {status: 'default', text: '未支付'},
    2: {status: 'processing', text: '已申请'},
    3: {status: 'success', text: '已支付'}
  }
  const options = [
    { label: '未支付', value: 1 },
    { label: '已申请', value: 2 },
    { label: '已支付', value: 3 },
  ]

  export default {
    name: "ApplianceEntryView",
    components: {ApplianceEntryForm, FooterToolBar },
    data() {
      return {
        queryParam: {type: 0, statusList: [1,2,3], startDateStr: null, endDateStr: null, submitFlag: 1, pageNo: 1, pageSize: 25},
        page: {pageNo: 1, pageSize: 25, totalCount: 0},
        selectedRows: [], selectedRowKeys: [],
        options,
        currentRecord: {},
        inDateRange: [],
        lshId: '',
        fileList: [], uploadTypes: ['xls', 'xlsx'],

        cardHeight: window.innerHeight - 115,
        menuHeight: window.innerHeight - 179,
        tableHeight: window.innerHeight - 300,
        tableScrollHeight: window.innerHeight - 300,

        payType: 1,
        showBatchPaySaveBtn: true,
        unPayMoney: 0, unPayList: [],
        applyPayMoney: 0, applyPayList: [],

        showEntryFrom: false, showPayList: false, showUseList: false,
        uploading: false, downloading: false,
        menuLoading: false, tableLoading: false,
        submitLoading: false, saveLoading: false,

        menuData: [
          {id: 0, name: '全部'},
          {id: 1, name: '办公用品'},
          {id: 2, name: '礼品'},
          {id: 3, name: '饮用水'},
        ],
        tableData: [],
        payData: [],
        menuColumns: [
          {
            key: 'name',
            width: '70%',
            dataIndex: 'name',
            title: '分类',
            ellipsis: true,
          }
        ],
        tableColumns: [
          {
            key: 'rowIndex',
            dataIndex: 'rowIndex',
            title: '序号',
            width: '5%',
            align: 'right',
            ellipsis: true,
            scopedSlots: { customRender: 'rowIndex' },
          },{
            key: 'nameName',
            dataIndex: 'nameName',
            title: '物品名称',
            width: '15%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'nameName' },
          },{
            key: 'quantity',
            dataIndex: 'quantity',
            title: '数量',
            width: '10%',
            align: 'right',
            ellipsis: true,
            scopedSlots: { customRender: 'quantity' },
          },{
            key: 'unitPrice',
            dataIndex: 'unitPrice',
            title: '单价  ',
            width: '10%',
            align: 'right',
            ellipsis: true,
            scopedSlots: { customRender: 'unitPrice' },
          },{
            key: 'money',
            dataIndex: 'money',
            title: '金额',
            width: '10%',
            align: 'right',
            ellipsis: true,
            scopedSlots: { customRender: 'money' },
          },{
            key: 'supplierName',
            dataIndex: 'supplierName',
            title: '供应商',
            width: '30%',
            align: 'left',
            ellipsis: true,
            scopedSlots: { customRender: 'supplierName' },
          },{
            key: 'inDate',
            dataIndex: 'inDate',
            title: '入库日期',
            width: '10%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'inDate' },
          },{
            key: 'status',
            dataIndex: 'status',
            title: '支付状态',
            width: '10%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'status' },
          }
        ],
        payColumns: [
          {
            key: 'rowIndex',
            dataIndex: 'rowIndex',
            title: '序号',
            width: '5%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'rowIndex' },
          },{
            key: 'typeName',
            dataIndex: 'typeName',
            title: '物品类别',
            width: '10%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'typeName' },
          },{
            key: 'nameName',
            dataIndex: 'nameName',
            title: '物品名称',
            width: '10%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'nameName' },
          },{
            key: 'standards',
            dataIndex: 'standards',
            title: '规格',
            width: '10%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'standards' },
          }, {
            key: 'quantity',
            dataIndex: 'quantity',
            title: '数量',
            width: '10%',
            align: 'right',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'quantity' },
          },{
            key: 'unitPrice',
            dataIndex: 'unitPrice',
            title: '单价  ',
            width: '10%',
            align: 'right',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'unitPrice' },
          },{
            key: 'money',
            dataIndex: 'money',
            title: '金额',
            width: '10%',
            align: 'right',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'money' },
          },{
            key: 'supplierName',
            dataIndex: 'supplierName',
            title: '供应商',
            width: '25%',
            align: 'left',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'supplierName' },
          },{
            key: 'inDate',
            dataIndex: 'inDate',
            title: '入库日期',
            width: '10%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'inDate' },
          }
        ],
      }
    },
    created() {
      this.getApplianceList()
      this.getApplianceUnPayMoney()
    },
    filters: {
      statusFilter (val) {
        return statusMap[val].status
      },
      statusTextFilter (val) {
        return statusMap[val].text
      },
    },
    methods: {
      getApplianceList() {
        if(this.queryParam.statusList == null || this.queryParam.statusList == [] || this.queryParam.statusList.length < 1) {
          this.tableData = []
          return
        }
        this.selectedRows = []
        this.selectedRowKeys = []
        this.unPayList = []
        this.applyPayList = []
        this.applyPayMoney = 0
        this.tableLoading = true
        getApplianceList(this.queryParam).then(res => {
          this.tableLoading = false
          this.tableData = res.body.items
          this.page.totalCount=res.body.totalCount
        })
      },

      getApplianceUnPayMoney() {
        const params = {
          'type': this.queryParam.type
        }
        getApplianceUnPayMoney(params).then(res => {
          this.unPayMoney = res.body
        })
      },

      entry() {
        this.showEntryFrom = true
        const record = {
          type: this.queryParam.type == 0 ? 1 : this.queryParam.type,
          name: null,
          standards: '',
          quantity: null,
          unitPrice: null,
          money: 0,
          supplier: null,
          supplierName: '',
          remark: '',
          register: '',
          registerName: '',
          inDate: null,
          status: null,
          lshId: null,
          submitFlag: 0,
        }
        this.currentRecord = {...record}
        this.$nextTick(() => {
          this.$refs.applianceForm.setForm({...record})
        })
      },
      onEntryClose() {
        this.showEntryFrom = false
        this.$refs.applianceForm.resetForm()
      },
      onEntrySave() {
        this.$refs.applianceForm.save()
      },
      onEntrySubmit() {
        this.$refs.applianceForm.submit()
      },
      onEntrySaveSuccess() {
        this.showEntryFrom = false
        this.page.pageNo = 1
        this.queryParam.pageNo = 1
        this.$refs.applianceForm.resetForm()
        this.getApplianceList()
        this.getApplianceUnPayMoney()
      },

      onStatusChange(statusList) {
        this.queryParam.statusList = statusList
        this.page.pageNo = 1
        this.queryParam.pageNo = 1;
        this.getApplianceList()
      },
      onSubmitFlagChange(event){
        console.log(event.target.value)
        this.queryParam.submitFlag = event.target.value
        this.getApplianceList()
      },
      onDateChange(date, dateString) {
        if(dateString[0] === '') {
          this.queryParam.startDateStr = null
          this.queryParam.endDateStr = null
        } else {
          this.queryParam.startDateStr = dateString[0] + ' 00:00:00'
          this.queryParam.endDateStr = dateString[1] + ' 23:59:59'
        }
        this.page.pageNo = 1
        this.queryParam.pageNo = 1;
        this.getApplianceList()
      },
      onPageChange(pageNo, pageSize) {
        this.queryParam.pageNo = pageNo
        this.queryParam.pageSize = pageSize
        this.getApplianceList()
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        let unPayList = []
        let applyPayMoney = 0
        let applyPayList = []
        selectedRows.forEach(item => {
          if (item.status === 1) {
            unPayList.push(item)
            applyPayMoney += item.money
          } else if (item.status === 2) {
            applyPayList.push(item)
          }
        })
        applyPayMoney = new Decimal(applyPayMoney).toFixed(2)
        this.unPayList = unPayList
        this.applyPayMoney = applyPayMoney
        this.applyPayList = applyPayList
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      getCheckboxProps(record) {
        return ({
          props: {
            disabled: record.status === 3
          }
        })
      },
      setRowClassName(record) {
        return this.queryParam.type === record.id ? 'selectRowStyle' : ''
      },
      menuRowClick(record) {
        return {
          on: {
            click: () => {
              this.inDateRange = []
              this.queryParam.type = record.id
              this.queryParam.statusList = [1,2,3]
              this.queryParam.startDateStr = null
              this.queryParam.endDateStr = null
              this.queryParam.inputContent = ''
              this.page.pageNo = 1
              this.queryParam.pageNo = 1;
              this.getApplianceList()
              this.getApplianceUnPayMoney()
            }
          }
        }
      },
      tableRowClick(record) {
        return {
          on: {
            dblclick: () => {
              this.showEntryFrom = true
              this.currentRecord = JSON.parse(JSON.stringify(record));
              this.$nextTick(()=>{
                this.$refs.applianceForm.setForm(this.currentRecord)
              })
            }
          }
        }
      },
    }
  }
</script>

<style scoped>
  /deep/ .ant-table-placeholder{
    display:none;
  }
  /deep/ .selectRowStyle {
    background-color: #d5fffe;
  }
</style>