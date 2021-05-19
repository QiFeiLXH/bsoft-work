<template>
  <div>
    <div :style="{ height: cardHeight + 'px',paddingBottom: '50px', overflowY: 'auto' }">
      <a-card
        :bordered="false"
        :bodyStyle="{
          height:topCardHeight+'px',
          padding: '0px 10px'
        }"
      >
        <a-table
          size="small"
          :loading="isLoading"
          :rowKey="(record) => record.id"
          :bordered="false"
          :dataSource="table"
          :columns="columns"
          :customRow="onClickRow"
          :rowClassName="setCurrentRow"
          :pagination="false"
          :scroll="{y: listScrollHeight }">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>
              {{ (page.pageNo - 1) * page.pageSize + index + 1 }}
            </span>
          </template>
          <template slot="applyAmount" slot-scope="text">
            {{ text | AmountFormat }}
          </template>
          <template slot="taxFlag" slot-scope="text">
            <a-switch size="small" :checked="text === 1"/>
          </template>
        </a-table>
        <div style="text-align:right;margin: 5px 0 5px 0">
          <a-row>
            <a-pagination
              size="small"
              v-model="page.pageNo"
              :pageSize.sync="page.pageSize"
              :total="page.totalCount"
              @change="onPageChange"
              :showTotal="total => `已申请总金额:￥${PriceFormat(applyTotalAmount)}元。      共 ${total} 条`"/>
          </a-row>
        </div>
      </a-card>
      <div :style="{ height: formHeight + 'px',overflowY: 'auto' }">
        <a-form-model ref="payInfoForm" style="margin-top: 10px" :model="payInfoForm">
          <a-card :body-style="{ padding: '10px 0 10px 10px' }">
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="申请人"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="applerName"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.applerName"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="申请日期"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="applyDate"
                  style="margin-bottom: 10px;">
                  <a-date-picker
                    v-model="payInfoForm.applyDate"
                    :disabled="true"
                    style="width: 220px"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="归属人"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="belongerName"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.belongerName"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="项目名称"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="projectName"
                  style="margin-bottom: 10px;">
                  <a-tooltip v-if="payInfoForm.projectName">
                    <template slot="title">
                      {{ payInfoForm.projectName }}
                    </template>
                    <a-input
                      v-model="payInfoForm.projectName"
                      style="width: 220px;color: #000000"
                      :readOnly="true"/>
                  </a-tooltip>
                  <a-input
                    v-else
                    v-model="payInfoForm.projectName"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="核算部门"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="checkDeptName"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.checkDeptName"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="核算口径"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="accountCaliberText"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.accountCaliberText"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="对方单位"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="suppliersText"
                  style="margin-bottom: 10px;">
                  <a-tooltip v-if="payInfoForm.suppliersText">
                    <template slot="title">
                      {{ payInfoForm.suppliersText }}
                    </template>
                    <a-input
                      v-model="payInfoForm.suppliersText"
                      style="width: 220px;color: #000000"
                      :readOnly="true"/>
                  </a-tooltip>
                  <a-input
                    v-else
                    v-model="payInfoForm.suppliersText"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="采购合同号"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="purchaseContractNo"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.purchaseContractNo"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="本次申请金额"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="applyAmount"
                  style="margin-bottom: 10px;">
                  <a-input-number
                    :disabled="true"
                    :step="0.01"
                    v-model="payInfoForm.applyAmount"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                    style="width: 220px;color: #000000"></a-input-number>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="款项"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="paymentAccountText"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.paymentAccountText"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col>
                <a-form-model-item
                  label="备注"
                  :label-col="{ span: 3 }"
                  :wrapper-col="{ span: 21 }"
                  prop="remark"
                  style="margin-bottom: 10px;">
                  <a-textarea
                    v-model="payInfoForm.remark"
                    style="width: 710px;color: #000000"
                    :auto-size="{ minRows: 2, maxRows: 2 }"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card :body-style="{ padding: '10px 0 10px 10px' }">
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="税票标志"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="taxFlag"
                  style="margin-bottom: 10px;">
                  <a-switch :checked="payInfoForm.taxFlag === 1"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="税票金额"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="taxAmount"
                  style="margin-bottom: 10px;">
                  <a-input-number
                    :disabled="true"
                    :step="0.01"
                    v-model="payInfoForm.taxAmount"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                    style="width: 220px;color: #000000"></a-input-number>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="发票代码"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="invoiceCode"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.invoiceCode"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="发票号"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="invoiceNum"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.invoiceNum"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="税票类别"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="invoiceTypeText"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.invoiceTypeText"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="税率"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="taxRate"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.taxRate"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item
                  label="凭证单号"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="voucher"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.voucher"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="登记人"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }"
                  prop="registerPersonName"
                  style="margin-bottom: 10px;">
                  <a-input
                    v-model="payInfoForm.registerPersonName"
                    style="width: 220px;color: #000000"
                    :readOnly="true"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-card>
        </a-form-model>
      </div>

    </div>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '1000px',
        borderTop: '0px solid #e9e9e9',
        padding: '9px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button key="back" @click="onDrawerClose" style="margin-left: 20px">关闭</a-button>
    </div>
  </div>
</template>

<script>
import { doLoadCostPaymentList } from '@/api/ownPurchaseContractList'
import { PriceFormat } from '@/utils/util'
import moment from 'moment'

export default {
  name: 'OwnPayInfo',
  data () {
    return {
      selectedRow: '',
      selectedRowInfo: {},
      isLoading: false,
      listScrollHeight: 0,
      cardHeight: 0,
      topCardHeight: 0,
      formHeight: 0,
      table: [],
      page: { pageNo: 1, pageSize: 5, totalCount: 0 },
      queryParam: { pageNo: 1, pageSize: 5 },
      columns: [
        {
          key: 'rowIndex',
          dataIndex: 'rowIndex',
          align: 'center',
          title: '序号',
          width: '5%',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          key: 'paymentAccountText',
          dataIndex: 'paymentAccountText',
          align: 'center',
          title: '款项',
          width: '12%'
        },
        {
          key: 'applyDate',
          dataIndex: 'applyDate',
          align: 'center',
          title: '申请日期',
          width: '13%'
        },
        {
          key: 'applyAmount',
          dataIndex: 'applyAmount',
          align: 'right',
          title: '申请金额(元)',
          scopedSlots: { customRender: 'applyAmount' },
          width: '15%'
        },
        {
          key: 'checkDeptName',
          dataIndex: 'checkDeptName',
          align: 'center',
          title: '核算部门',
          width: '16%'
        },
        {
          key: 'applerName',
          dataIndex: 'applerName',
          align: 'center',
          title: '申请人',
          width: '13%'
        },
        {
          key: 'issueDate',
          dataIndex: 'issueDate',
          align: 'center',
          title: '发放日期',
          width: '14%'
        },
        {
          key: 'taxFlag',
          dataIndex: 'taxFlag',
          align: 'center',
          title: '税票标志',
          scopedSlots: { customRender: 'taxFlag' },
          width: '12%'
        }
      ],
      payInfoForm: {}
    }
  },
  props: {
    purchaseContractNo: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    moment,
    PriceFormat,
    initFormFields () {
      this.payInfoForm = {
        id: null,
        paymentAccountText: null,
        applyDate: null,
        applyAmount: null,
        checkDeptName: null,
        applerName: null,
        belongerName: null,
        issueDate: null,
        taxFlag: null,
        purchaseContractNo: null,
        projectId: null,
        projectName: null,
        accountCaliberText: null,
        suppliersText: null,
        remark: null,
        taxAmount: null,
        invoiceCode: null,
        invoiceNum: null,
        invoiceTypeText: null,
        registerPersonName: null
      }
    },
    getList () {
      this.isLoading = true
      doLoadCostPaymentList(Object.assign(this.queryParam)).then(res => {
        if (res.code === 200) {
          this.table = res.body.items
          this.page.totalCount = res.body.totalCount
          this.total = res.body.totalCount
          if (this.table.length > 0) {
            this.selectedRow = this.table[0].id
            this.selectedRowInfo = this.table[0]
            this.setFormValue(this.selectedRowInfo)
          }
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    setFormValue (record) {
      this.payInfoForm = { ...record }
      if (this.payInfoForm.applyDate) {
        this.payInfoForm.applyDate = moment(record.applyDate)
      }
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.selectedRow = record.id
            this.selectedRowInfo = record
            this.setFormValue(record)
          }
        }
      }
    },
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.selectedRow) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onPageChange (current) {
      this.queryParam.pageNo = current
      this.page.pageNo = current
      this.getList()
    },
    loadPage () {
      this.resetForm()
      this.queryParam.purchaseContractNo = this.purchaseContractNo
      this.getList()
    },
    onDrawerClose () {
      this.$emit('closeDrawer', true)
    },
    resetForm () {
      this.initFormFields()
      this.selectedRow = ''
      this.selectedRowInfo = {}
      this.isLoading = false
      this.table = []
      this.page = { pageNo: 1, pageSize: 5, totalCount: 0 }
      this.queryParam = { pageNo: 1, pageSize: 5 }
    }
  },
  computed: {
    applyTotalAmount: function () {
      if (this.table.length === 0) {
        return 0
      } else {
        // eslint-disable-next-line no-eval
        return eval(this.table.filter(item => item.applyAmount > 0).map(item => item.applyAmount).join('+'))
      }
    }
  },
  mounted () {
    this.listScrollHeight = window.innerHeight - 300
    this.cardHeight = window.innerHeight - 60
    this.topCardHeight = 280
    this.formHeight = window.innerHeight - 400
  },
  created () {
    this.loadPage()
  }
}
</script>

<style scoped>
  /deep/ .ant-radio-button-wrapper-disabled.ant-radio-button-wrapper-checked {
    color: #fff;
    background-color: #40a9ff;
    border-color: #d9d9d9;
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  /deep/ .ant-radio-button-wrapper-disabled {
    color: black;
    background-color: white;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }

  /deep/ .ant-input-disabled {
    color: black;
    background-color: white;
    cursor: not-allowed;
    opacity: 1;
  }

  /deep/ .ant-select-disabled .ant-select-selection {
    background: white;
    cursor: not-allowed;
  }

  /deep/ .ant-input-number-disabled .ant-input-number-input {
    cursor: not-allowed;
    background-color: white;
    color: black;
  }

  /deep/ .ant-select-selection--single .ant-select-selection__rendered {
    margin-right: 24px;
    color: black;
  }

  /deep/ .ant-card-extra {
    float: left;
    margin-left: 0;
    padding: 16px 0;
    color: rgba(0, 0, 0, 0.65);
    font-weight: normal;
    font-size: 14px;
  }
</style>
