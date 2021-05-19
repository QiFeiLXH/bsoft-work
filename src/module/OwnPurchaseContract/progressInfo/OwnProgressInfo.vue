<template>
  <div :style="{ height: panelHeight + 'px',paddingBottom: '50px', overflowY: 'auto' }">
    <a-row>
      <a-col :span="12">
          <a-card
            :bordered="false"
            :bodyStyle="{
              height:formHeight -20 +'px',
              padding: '20px 0px 0px 20px'
            }">
            <a-form-model
              :model="progressForm"
              ref="progressForm"
              :rules="progressFormRules"
              :hideRequiredMark="readOnly">
              <a-row>
                <a-col>
                  <a-form-model-item
                    label="采购合同号"
                    :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                    prop="purchaseContractNo"
                    style="margin-bottom: 10px;"
                  >
                    <a-input
                      v-model="progressForm.purchaseContractNo"
                      style="width: 250px;color: #000000"
                      :readOnly="true"/>
                    <a-icon
                      v-show="operation === 'add'"
                      type="search"
                      @click="doContractSearch"
                      style="margin-left: 10px;font-size: 15px"/>
                    <a-modal
                      title="公司采购合同选择"
                      style="top: 30px;"
                      v-model="contractModalVisible"
                      :width="700"
                      :maskClosable="false"
                      :bodyStyle="{ height: contractModalHeight }"
                      :closable="false"
                      :destroyOnClose="true">
                      <a-row style="margin-bottom: 10px;margin-top:10px;">
                        <a-input-search
                          placeholder="采购合同号/合同名称"
                          v-model="contractModalQueryParam.inputContent"
                          style="width: 270px"
                          allow-clear
                          :pressEnter="doQueryContract"
                          @search="doQueryContract"/>
                      </a-row>
                      <a-table
                        size="small"
                        :bordered="false"
                        :loading="isContractLoading"
                        :columns="contractColumns"
                        :dataSource="contractList"
                        :rowKey="(record) => record.purchaseContractId"
                        :pagination="false"
                        :customRow="onContractClickRow"
                        :rowClassName="setContractCurrentRow"
                        :scroll="{ x: false, y: listContractScrollHeight }">
                        <template slot="rowIndex" slot-scope="text, record, index">
                      <span>
                        {{ (contractCurrentPage - 1) * contractModalPage.pageSize + index + 1 }}
                      </span>
                        </template>
                      </a-table>
                      <template slot="footer">
                        <a-pagination
                          size="small"
                          :total="contractModalPage.totalCount"
                          :pageSize.sync="contractModalPage.pageSize"
                          v-model="contractModalPage.pageNumber"
                          @change="onContractModalCurrentChange"
                          style="margin-bottom: 10px"/>
                        <a-button key="submit" type="primary" @click="onContractModalConfirm">确定</a-button>
                        <a-button key="back" @click="onContractModalCancel">取消</a-button>
                      </template>
                    </a-modal>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  <a-form-model-item
                    label="采购合同名称"
                    :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                    prop="contractName"
                    style="margin-bottom: 10px;"
                  >
                    <a-input
                      v-model="progressForm.contractName"
                      style="width: 250px;color: #000000"
                      :readOnly="true"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  <a-form-model-item
                    label="上期进度"
                    :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                    prop="lastProgress"
                    style="margin-bottom: 10px;"
                  >
                    <a-input-number
                      v-model="progressForm.lastProgress"
                      :disabled="true"
                      style="width: 250px;color: #000000"
                    /> %
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  <a-form-model-item
                    label="进度确认日期"
                    :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                    prop="confirmDate"
                    style="margin-bottom: 10px;"
                  >
                    <a-date-picker
                      v-model="progressForm.confirmDate"
                      :disabled="readOnly || dataDisabled"
                      style="width: 250px"
                      :allowClear="false"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  <a-form-model-item
                    label="确认进度"
                    :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                    prop="progress"
                    style="margin-bottom: 10px;"
                  >
                    <a-input-number
                      v-model="progressForm.progress"
                      :min="0"
                      :max="100"
                      :disabled="readOnly || dataDisabled"
                      style="width: 250px;color: #000000"
                    /> %
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  <a-form-model-item
                    label="登记人"
                    :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                    prop="registerPersonName"
                    style="margin-bottom: 10px;"
                  >
                    <a-input
                      ref="person"
                      v-model="progressForm.registerPersonName"
                      style="color: #000000;width:250px"
                      :readOnly="true"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  <a-form-model-item
                    label="登记日期"
                    :labelCol="{lg: {span: 6}, sm: {span: 2}}"
                    :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
                    prop="registerDate"
                    style="margin-bottom: 10px;"
                  >
                    <a-date-picker
                      v-model="progressForm.registerDate"
                      :disabled="true "
                      style="width: 250px"
                      :allowClear="false"/>
                  </a-form-model-item>
                </a-col>
              </a-row>

            </a-form-model>
          </a-card>
        </a-col>
      <a-col :span="12">
        <a-card
          :bordered="false"
          :bodyStyle="{
            height:formHeight -20 +'px',
            padding: '25px 20px 0px 20px'
          }">
          <a-table
            size="small"
            :bordered="false"
            :loading="isProgressLoading"
            :columns="progressColumns"
            :dataSource="progressList"
            :rowKey="(record) => record.id"
            :pagination="false"
            :customRow="onProgressClickRow"
            :rowClassName="setProgressCurrentRow"
            :scroll="{ x: false, y: listProgressScrollHeight }">
            <template slot="progress" slot-scope="text">
              <a-progress
                :class="text < 1 ? 'progressClass' : ''"
                :stroke-color="{ from: '#108ee9', to: '#87d068'}"
                size="small"
                :percent="parseInt(text * 100)"
                :status="text  === 1 ? 'success' : 'active'" />
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PersonSelect } from '@/module'
import store from '@/store'
import moment from 'moment'
import { doLoadProgressList, doSavePurchaseContractProgress, getPurchaseContract, doFindPurchaseContractList } from '@/api/ownPurchaseContractProgress'
import { Decimal } from 'decimal.js'

export default {
  name: 'OwnProgressInfo',
  components: {
    PersonSelect
  },
  data () {
    return {
      moment,
      formHeight: window.innerHeight - 150,
      panelHeight: window.innerHeight - 100,
      listProgressScrollHeight: window.innerHeight - 250,
      listContractScrollHeight: 280,
      progressForm: {},
      progressFormRules: {
        confirmDate: [{ required: true, message: '请选择进度确认日期!', trigger: 'change' }],
        purchaseContractId: [{ required: true, message: '请选择采购合同号!', trigger: 'blur' }],
        progress: [{ required: true, message: '请填写进度!', trigger: 'blur' }]
      },
      readOnly: false,
      dataDisabled: false,
      isModified: false,
      isProgressLoading: false,
      progressColumns: [
        {
          title: '确认日期',
          dataIndex: 'confirmDate',
          scopedSlots: { customRender: 'confirmDate' },
          width: '30%'
        },
        {
          title: '进度',
          dataIndex: 'progress',
          scopedSlots: { customRender: 'progress' },
          width: '70%'
        }
      ],
      progressList: [],
      progressSelectedRow: '',
      progressSelectedRowInfo: {},
      currentPurchaseContractId: null,
      firstProgressId: null,
      contractModalVisible: false,
      contractModalHeight: 400 + 'px',
      isContractLoading: false,
      contractColumns: [
        {
          dataIndex: 'rowIndex',
          title: '',
          width: '10%',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'purchaseContractNo',
          title: '采购合同号',
          width: '30%'
        },
        {
          dataIndex: 'contractName',
          title: '合同名称',
          width: '60%'
        }
      ],
      contractSelectedRow: '',
      contractSelectedRowInfo: {},
      contractList: [],
      contractModalPage: { pageNumber: 0, pageSize: 0, totalCount: 0 },
      contractModalQueryParam: { pageNo: 1, pageSize: 25, inputContent: null }
    }
  },
  props: {
    baseInfo: {
      type: Object,
      default: null
    },
    operation: {
      type: String,
      default: ''
    },
    purchaseContractId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    initFormFields () {
      this.progressForm = {
        id: null,
        purchaseContractNo: null,
        contractName: null,
        purchaseContractId: null,
        progress: null,
        confirmDate: moment(),
        lastProgress: null,
        registerPersonId: null,
        registerPersonName: null,
        registerDate: null
      }
    },
    doQueryContract () {
      this.contractModalQueryParam.pageNo = 1
      this.doContractSearch()
    },
    doContractSearch () {
      this.contractSelectedRow = ''
      this.contractSelectedRowInfo = {}
      this.contractModalVisible = true
      this.loadContractList()
    },
    onContractModalCurrentChange (pageNo) {
      this.contractModalQueryParam.pageNo = pageNo
      this.loadContractList()
    },
    loadContractList () {
      this.isContractLoading = true
      doFindPurchaseContractList(this.contractModalQueryParam)
        .then(res => {
          if (res.code === 200) {
            this.contractModalPage.pageNumber = res.body.pageNumber + 1
            this.contractModalPage.pageSize = res.body.pageSize
            this.contractModalPage.totalCount = res.body.totalCount
            this.contractList = res.body.items
            this.contractCurrentPage = res.body.pageNumber + 1
          }
          this.isContractLoading = false
        })
    },
    setFormFields () {
      var record = this.progressSelectedRowInfo
      this.progressForm = { ...record }
      this.progressForm.lastProgress = parseInt(record.lastProgress * 100)
      this.progressForm.progress = parseInt(record.progress * 100)
      this.progressForm.contractName = record.contractName
      if (record.registerDate) {
        this.progressForm.registerDate = moment(record.registerDate)
      }
      if (record.confirmDate) {
        this.progressForm.confirmDate = moment(record.confirmDate)
      }
    },
    resetForm () {
      this.$refs.progressForm.resetFields()
      this.initFormFields()
      this.readOnly = false
      this.isModified = false
      this.progressList = []
      this.progressSelectedRow = ''
      this.progressSelectedRowInfo = {}
      this.isProgressLoading = false
      this.progressForm = {}
      this.firstProgressId = null
    },
    newContractProgress () {
      this.reloadPurchaseContract()
      this.progressForm.confirmDate = moment()
      this.progressForm.registerDate = moment()
      this.progressForm.progress = null
      this.progressForm.id = null
      this.readOnly = false
      this.dataDisabled = false
    },
    reloadPurchaseContract () {
      var param = { purchaseContractId: this.currentPurchaseContractId }
      getPurchaseContract(param).then((res) => {
        if (res.code === 200) {
          this.baseInfo.progress = res.body.progress
          this.progressForm.lastProgress = parseInt(this.baseInfo.progress * 100)
        }
      })
    },
    loadProgressList (bool, op) {
      this.isProgressLoading = true
      var param = { purchaseContractId: this.currentPurchaseContractId }
      doLoadProgressList(param).then((res) => {
        if (res.code === 200) {
          this.progressList = res.body
          this.isProgressLoading = false
          if (res.body.length > 0) {
            this.firstProgressId = res.body[0].id
          }
          if (bool && res.body.length > 0) {
            this.progressSelectedRow = res.body[0].id
            this.progressSelectedRowInfo = res.body[0]
            if (op === 'read') {
              this.setFormFields()
            }
          }
        }
        this.isProgressLoading = false
      })
    },
    doSaveContractProgress () {
      var validateResult = true
      this.$refs.progressForm.validate(valid => { // 校验
        if (valid) {
        } else {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      var progress = {}
      Object.assign(progress, this.progressForm)
      if (progress.progress < progress.lastProgress) {
        this.$message.warning('当期进度须大于等于上期进度！')
        return
      }
      if (progress.confirmDate) {
        progress.confirmDate = progress.confirmDate.format('YYYY-MM-DD')
      }
      progress.registerDate = null
      progress.progress = Number(new Decimal(progress.progress).dividedBy(100).toFixed(2))
      doSavePurchaseContractProgress(progress)
        .then(res => {
          if (res.code === 200) {
            this.resetModifyForm()
            this.$message.success('保存成功！')
            this.loadProgressList(true)
            setTimeout(() => {
              this.$emit('refresh', true)
            }, 100)
          }
        })
    },
    resetModifyForm () {
      var form = { ...this.progressForm }
      this.progressForm.lastProgress = form.progress
      this.progressForm.confirmDate = moment()
      this.progressForm.progress = null
      this.progressForm.id = null
      if (form.progress === 100) {
        this.changeBtnStatus(true, 'save')
      }
    },
    onContractModalConfirm () {
      if (!this.contractSelectedRow) {
        this.$message.warning('请先选择公司采购合同！')
        return
      }
      this.currentPurchaseContractId = this.contractSelectedRowInfo.purchaseContractId
      this.progressForm.purchaseContractNo = this.contractSelectedRowInfo.purchaseContractNo
      this.progressForm.purchaseContractId = this.contractSelectedRowInfo.purchaseContractId
      this.progressForm.contractName = this.contractSelectedRowInfo.contractName
      this.progressForm.lastProgress = parseInt(this.contractSelectedRowInfo.progress * 100)
      this.progressForm.progress = null
      this.progressForm.confirmDate = moment()
      this.changeBtnStatus(false)
      this.loadProgressList()
      this.contractModalVisible = false
      this.contractModalQueryParam.inputContent = ''
      this.contractList = []
      this.dataDisabled = false
      this.progressSelectedRow = ''
      this.progressSelectedRowInfo = {}
      this.firstProgressId = ''
    },
    onContractModalCancel () {
      this.contractSelectedRow = ''
      this.contractSelectedRowInfo = {}
      this.contractModalVisible = false
      this.contractModalQueryParam.inputContent = ''
      this.contractList = []
    },
    setPurchaseContract (data) {
      this.purchaseContractId = data.purchaseContractId
      this.progressForm.purchaseContractNo = data.purchaseContractNo
      this.progressForm.contractName = data.contractName
      this.progressForm.lastProgress = parseInt(data.progress * 100)
      this.progressForm.progress = null
      this.progressForm.confirmDate = moment()
      this.loadProgressList()
    },
    onProgressClickRow (record, index) {
      return {
        on: {
          click: () => {
            if (record.progress === 1 || record.id !== this.firstProgressId) {
              if (!this.dataDisabled) {
                this.dataDisabled = true
              }
            } else {
              this.dataDisabled = false
            }
            this.progressSelectedRow = record.id
            this.progressSelectedRowInfo = record
            this.progressForm = { ...record }
            this.progressForm.lastProgress = parseInt(record.lastProgress * 100)
            this.progressForm.progress = parseInt(record.progress * 100)
            this.progressForm.contractName = record.contractName
            if (record.registerDate) {
              this.progressForm.registerDate = moment(record.registerDate)
            }
            if (record.confirmDate) {
              this.progressForm.confirmDate = moment(record.confirmDate)
            }
            this.$refs.progressForm.clearValidate()
          }
        }
      }
    },
    setProgressCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.progressSelectedRow) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onContractClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.contractSelectedRow = record.purchaseContractId
            this.contractSelectedRowInfo = record
          },
          dblclick: () => {
            this.currentPurchaseContractId = record.purchaseContractId
            this.progressForm.purchaseContractNo = record.purchaseContractNo
            this.progressForm.purchaseContractId = record.purchaseContractId
            this.progressForm.contractName = record.contractName
            this.progressForm.lastProgress = parseInt(record.progress * 100)
            this.progressForm.progress = null
            this.progressForm.confirmDate = moment()
            this.changeBtnStatus(false)
            this.loadProgressList()
            this.contractModalVisible = false
            this.dataDisabled = false
            this.progressSelectedRow = ''
            this.progressSelectedRowInfo = {}
            this.firstProgressId = ''
          }
        }
      }
    },
    setContractCurrentRow (record, index) {
      var styleClassName = ''
      if (record.purchaseContractId === this.contractSelectedRow) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    changeBtnStatus (bool, btn) {
      this.$emit('changeBtnStatus', bool, btn)
    },
    resetFields () {
      this.$refs.progressForm.resetFields()
    },
    initPage () {
      this.initFormFields()
      if (this.operation === 'add') {
        this.progressForm.registerPersonName = store.getters.userInfo.personName
        this.progressForm.registerDate = moment()
      }
      if (this.operation === 'modify') {
        this.isModified = true
        this.currentPurchaseContractId = this.purchaseContractId
        this.progressForm = { ...this.baseInfo }
        this.progressForm.registerPersonName = store.getters.userInfo.personName
        this.progressForm.confirmDate = moment()
        this.progressForm.registerDate = moment()
        this.progressForm.contractName = this.baseInfo.contractName
        this.progressForm.purchaseContractNo = this.baseInfo.purchaseContractNo
        this.progressForm.lastProgress = parseInt(this.baseInfo.progress * 100)
        this.progressForm.progress = null
        this.progressForm.purchaseContractId = this.baseInfo.purchaseContractId
        this.loadProgressList()
      }
      if (this.operation === 'read') {
        this.currentPurchaseContractId = this.purchaseContractId
        this.progressForm = { ...this.baseInfo }
        this.progressForm.confirmDate = this.progressForm.confirmDate ? moment(this.progressForm.confirmDate) : null
        this.progressForm.registerDate = this.progressForm.registerDate ? moment(this.progressForm.registerDate) : null
        this.readOnly = true
        this.loadProgressList(true, 'read')
      } else {
        this.readOnly = false
      }
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style scoped>
  /deep/ .ant-input-number-disabled .ant-input-number-input {
    cursor: not-allowed;
    background: white;
  }

  /deep/ .ant-select-auto-complete.ant-select .ant-input {
    color: black;
    background-color: #f5f5f5;
    opacity: 1;
    background-color: transparent;
  }

  /deep/ .ant-calendar-picker-input.ant-input {
    line-height: 1.5;
    color: #000000;
    background: #ffffff;
  }

  /deep/ .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
  }

  .progressClass /deep/ .ant-progress-text {
    display: inline-block;
    width: 2em;
    margin-left: 8px;
    color: rgb(0, 0, 0);
    font-size: 1em;
    line-height: 1;
    white-space: nowrap;
    text-align: left;
    vertical-align: middle;
    word-break: normal;
  }
</style>
