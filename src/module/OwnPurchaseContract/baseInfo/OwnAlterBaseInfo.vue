<template>
  <a-spin :spinning="isSpinning">
    <div :style="{ height: formHeight + 'px',paddingBottom: '50px', overflowY: 'auto' }">
      <a-form-model
        :model="purchaseContractForm"
        ref="purchaseContractForm"
        :rules="purchaseContractFormRules"
        :hideRequiredMark="readOnly">
        <a-card :body-style="{ padding: '10px 0 10px 10px' }">
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="采购合同号"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="purchaseContractNo"
                style="margin-bottom: 10px;"
              >
                <a-input
                  v-model="purchaseContractForm.purchaseContractNo"
                  style="width: 250px;color: #000000"
                  :readOnly="true"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="是否补充协议"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="supplementFlag"
                style="margin-bottom: 10px;"
              >
                <a-switch
                  checked-children="是"
                  un-checked-children="否"
                  :checked="supplementFlag"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="合同分类"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="classification"
                style="margin-bottom: 10px;"
              >
                <a-select
                  :value="purchaseContractForm.classification"
                  :disabled="true"
                  show-search
                  option-filter-prop="children"
                  style="width: 250px;color: #000000"
                  :filter-option="filterOption"
                  @change="handleClassificationChange">
                  <a-select-option v-for="item in classificationsDic" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="合同类型"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="hasContract"
                style="margin-bottom: 10px;"
              >
                <a-select
                  :value="purchaseContractForm.hasContract"
                  :disabled="true"
                  show-search
                  option-filter-prop="children"
                  style="width: 220px;color: #000000"
                  :filter-option="filterOption"
                  @change="handleHasContractChange">
                  <a-select-option :value="0">
                    无合同
                  </a-select-option>
                  <a-select-option :value="1">
                    有合同
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="合同金额"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="alterAmount"
                style="margin-bottom: 10px;"
              >
                <a-input-number
                  :disabled="operation === 'audit2'"
                  :step="0.01"
                  v-model="purchaseContractForm.alterAmount"
                  @blur="handleAlterAmountBlur"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  :style="amountAlterFlag ? 'width: 250px;color: #1890FF' : 'width: 250px;color: #000000'"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="合同决算金额"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="finalCostAmount"
                style="margin-bottom: 10px;"
              >
                <a-input-number
                  :disabled="true"
                  :min="0"
                  :step="0.01"
                  v-model="purchaseContractForm.finalCostAmount"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  :style="operation === 'audit1' ? 'width: 220px;font-size: 20px;font-weight: bold;color: red' : 'width: 220px;color: #000000'"></a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="签定日期"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="signDate"
                style="margin-bottom: 10px;"
              >
                <a-date-picker
                  v-model="purchaseContractForm.signDate"
                  :disabled="true"
                  style="width: 250px"
                  @change="handleSignDateChange"
                  :allowClear="false"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="采购大类"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="flag"
                style="margin-bottom: 10px;"
              >
                <a-select v-model="purchaseContractForm.flag" style="width: 220px;color: #000000" :disabled="true">
                  <a-select-option :value="3">
                    募投基建
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-model-item
                label="对方单位"
                :labelCol="{lg: {span: 3}, sm: {span: 2},style: { marginLeft: '-12px'}}"
                :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                prop="suppliersText"
                style="margin-bottom: 10px;"
              >
                <a-input
                  v-model="purchaseContractForm.suppliersText"
                  style="width: 776px;color: #000000"
                  :readOnly="true"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="合同名称"
                :labelCol="{lg: {span: 3}, sm: {span: 2},style: { marginLeft: '-12px'}}"
                :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                prop="contractName"
                style="margin-bottom: 10px;"
              >
                <a-input
                  v-model="purchaseContractForm.contractName"
                  style="width: 776px;color: #000000"
                  :readOnly="true"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="采购内容"
                :labelCol="{lg: {span: 3}, sm: {span: 2},style: { marginLeft: '-12px'}}"
                :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                prop="productName"
                style="margin-bottom: 10px;"
              >
                <a-textarea
                  v-model="purchaseContractForm.productName"
                  placeholder="文字输入 （200字内容）"
                  style="width: 776px;color: #000000"
                  :maxLength="200"
                  :auto-size="{ minRows: 2, maxRows: 2 }"
                  :readOnly="true"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card :body-style="{ padding: '10px 0 10px 10px' }">
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="付款条件"
                :labelCol="{lg: {span: 5}, sm: {span: 2},style: { marginLeft: '-100px'}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="paymentCondition"
                style="margin-bottom: 10px;"
              >
                <a-table
                  ref="paymentTable"
                  size="small"
                  :bordered="false"
                  :loading="isPaymentLoading"
                  :columns="paymentColumns"
                  :dataSource="paymentList"
                  :rowKey="(record) => record.id"
                  :pagination="false"
                  class="paymentClass"
                  :customRow="onPaymentClickRow"
                  :rowClassName="setPaymentCurrentRow"
                  :scroll="{ x: false, y: listPaymentScrollHeight }"
                  :style="{background: 'white', margin: '0 0'}">
                  <template slot="rowIndex" slot-scope="text, record, index">
                    <span>
                      {{ index + 1 }}
                    </span>
                  </template>
                  <template slot="paymentAccount" slot-scope="text, record">
                    <template v-if="readOnly || !record.isNew">
                      {{ record.paymentAccountText }}
                    </template>
                    <template v-else>
                      <a-select
                        :class="record.isError && !text? 'has-error': ''"
                        :value="{ key: text }"
                        show-search
                        label-in-value
                        option-filter-prop="children"
                        style="width: 100px"
                        :filter-option="filterOption"
                        @focus="handleItemFocus(record)"
                        @change="handleItemChange">
                        <a-select-option v-for="item in paymentItemsDic" :key="item.id" :value="item.id">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </template>
                  </template>
                  <template slot="alterPayment" slot-scope="text, record">
                    <template v-if="readOnly || !record.isNew">
                      <span v-if="text > 0">￥{{ text | NumberFormat }}</span>
                    </template>
                    <template v-else>
                      <a-input-number
                        :class="record.isError && !text? 'errorClass': ''"
                        v-model="record.alterPayment"
                        @blur="handleAlterPaymentBlur"
                        style="width: 100%"
                        :min="0"
                        :step="0.01"
                        :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="value => value.replace(/\￥\s?|(,*)/g, '')"></a-input-number>
                    </template>
                  </template>
                  <template slot="rate" slot-scope="text">
                    <template>
                      <span v-if="text > 0">{{ text | PercentFormat(2) }}</span>
                    </template>
                  </template>
                  <template slot="remarks" slot-scope="text, record">
                    <template v-if="record.isNew && !readOnly">
                      <a-textarea
                        placeholder="文字输入 （200字内容）"
                        :class="record.isError && !text? 'errorClass': ''"
                        :auto-size="{ minRows: 2, maxRows: 2 }"
                        v-model="record.remarks"
                        :maxLength="200"/>
                    </template>
                    <template v-else>
                      {{ text }}
                    </template>
                  </template>
                  <template slot="operate" slot-scope="text, record">
                    <template v-if="record.id === paymentSelectedRow && operation !== 'audit2'">
                      <a-icon type="edit" theme="twoTone" @click="doEditPayment(record)"/>
                      <a-divider type="vertical" v-if="record.id < 0"/>
                      <a-icon type="delete" theme="twoTone" @click="doRemovePayment(record)" v-if="record.id < 0"/>
                    </template>
                  </template>
                  <template slot="footer">
                    <a-row>
                      <a-col :span="9">
                        <div style="text-align: right;margin-right: 10px">合计：<span :style="error?{color: 'red'}:{}">￥{{ totalPaymentAmount | AmountFormat }}</span>
                        </div>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col>
                        <div style="text-align: center">
                          <a-button @click="doAddPaymentCondition" v-if="operation !== 'audit2'">新增付款条件
                          </a-button>
                          <a-button v-else disabled>新增付款条件</a-button>
                        </div>
                      </a-col>
                    </a-row>
                  </template>
                </a-table>
                <div
                  class="ant-form-explain"
                  v-if="showError"
                  style="margin-top:2px;color: #f5222d;transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);">
                  {{ callbackMsg }}
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="合同附件"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="contractEnclosure"
                style="margin-bottom: 10px;"
              >
                <span
                  v-if="topThreeFiles.length > 0"
                  v-for="file in topThreeFiles"
                  :key="file.id"
                  @click="downloadSpecifiedFile(file)"
                  style="cursor:pointer"><img
                    :src=" require(`@/assets/fileicon/fileicon-m-${file.fileName.substring(file.fileName.lastIndexOf('.') + 1)}.png`) "
                    style="width: 30px;"/></span>
                <a @click="doHandleFileUpload" v-if="this.currentPurchaseContractId">点击设置</a>
                <span v-else style="color: lightgrey">点击设置</span>
                <a-modal
                  style="top: 30px;"
                  v-model="docModalVisible"
                  :width="700"
                  :maskClosable="false"
                  :bodyStyle="{ height: docModalHeight }"
                  :closable="false"
                  :destroyOnClose="true">
                  <a-row style="margin: 10px 0px">
                    <a-col>
                      <a-button @click="downloadFile" type="primary" :loading="downloading" icon="download">查看</a-button>
                    </a-col>
                  </a-row>
                  <a-table
                    size="small"
                    :scroll="{ x: false, y: 200 }"
                    :rowKey="(record) => record.id"
                    :loading="isFileLoading"
                    :columns="fileColumns"
                    :dataSource="documentList"
                    :customRow="onDocClickRow"
                    :rowClassName="setDocCurrentRow"
                    :pagination="docPagination"
                    @change="docPageChange"
                  >
                    <template slot="rowIndex" slot-scope="text, record, index">
                      <span>
                        {{ (docCurrentPage - 1) * docPagination.pageSize + index + 1 }}
                      </span>
                    </template>
                    <span slot="renderFileSize" slot-scope="text">
                      {{ text }}Mb
                    </span>
                  </a-table>
                  <template slot="footer">
                    <a-button key="back" @click="onDocModalCancel">关闭</a-button>
                  </template>
                </a-modal>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="采购合同原件"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="originalStatus"
                style="margin-bottom: 10px;"
              >
                <a-radio-group
                  v-model="purchaseContractForm.originalStatus"
                  button-style="solid"
                  :disabled="true">
                  <a-radio-button :value="1">已回</a-radio-button>
                  <a-radio-button :value="2">未回</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card :body-style="{ padding: '10px 0 10px 10px' }">
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="签定人"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="signer"
                style="margin-bottom: 10px;"
              >
                <person-select
                  ref="person"
                  v-model="purchaseContractForm.signer"
                  style="color: #000000;width:220px"
                  :disabled="true"></person-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="签定部门"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="signDept"
                style="margin-bottom: 10px;"
              >
                <dept-select
                  ref="dept"
                  v-model="purchaseContractForm.signDept"
                  style="width:220px"
                  :disabled="true"></dept-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form-model>
    </div>
    <a-drawer
      :title="drawerTitle"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="800"
      @close="onRecordDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }"
    >
      <a-card :bordered="false" :body-style="{ height:drawerCardHeight + 'px',padding:'10px 0px 0px 10px'}">
        <div :style="{ height: drawerFormHeight + 'px',paddingBottom: '50px', overflowY: 'hidden' }">
          <s-table
            ref="recordTable"
            class="custom"
            size="small"
            :rowKey="(record) => record.id"
            :columns="recordColumn"
            :height="tableHeight"
            :data="loadRecordList"
            :customRow="onRecordClickRow"
            :rowClassName="setRecordCurrentRow"
            :showSizeChanger="false"
            :pageSize="recordPagination.pageSize"
            :pageNum="recordPagination.pageNumber"
            :showPagination="true"
            :bodyStyle="{ minHeight: recordListScrollHeight+'px' }"
            :scroll="{ x: false, y: recordListScrollHeight }"
          >
            <template slot="rowIndex" slot-scope="text, record, index">
              <span>
                {{ (recordPagination.pageNumber - 1) * recordPagination.pageSize + index + 1 }}
              </span>
            </template>
            <template slot="modifyContent" slot-scope="text">
              <a-tooltip>
                <template slot="title">
                  {{ text }}
                </template>
                {{ text }}
              </a-tooltip>
            </template>
          </s-table>
        </div>
      </a-card>
    </a-drawer>
  </a-spin>
</template>

<script>
import {
  doLoadDic,
  doLoadPaymentList,
  getPurchaseContract,
  doAlterPurchaseContract
} from '@/api/ownPurchaseContractList'
import { doLoadPurchaseContractModifyRecordList, doAlterAuditPurchaseContract, doAlterDisagreePurchaseContract } from '@/api/ownPurchaseContractAudit'
import { fileDownload, doLoadFilesUploadedList } from '@/api/publicWords'
import moment from 'moment/moment'
import { downFile } from '@/utils/util'
import { PersonSelect, DeptSelect } from '@/module'
import { Decimal } from 'decimal.js'
import { STable } from '@/components'

const fileColumns = [
  {
    title: '序号',
    dataIndex: 'rowIndex',
    scopedSlots: { customRender: 'rowIndex' },
    width: '8%'
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
    width: '45%'
  },
  {
    title: '大小',
    dataIndex: 'fileSize',
    width: '12%',
    scopedSlots: { customRender: 'renderFileSize' }
  },
  {
    title: '上传人',
    dataIndex: 'uploaderName',
    width: '15%'
  },
  {
    title: '上传日期',
    dataIndex: 'uploadDate',
    width: '20%'
  }
]
const recordColumn = [
  {
    dataIndex: 'rowIndex',
    title: '序号',
    width: '10%',
    scopedSlots: { customRender: 'rowIndex' }
  }, {
    dataIndex: 'modifyDate',
    title: '变更时间',
    width: '20%'
  }, {
    dataIndex: 'modifyPersonName',
    title: '变更人',
    width: '15%'
  }, {
    dataIndex: 'modifyContent',
    title: '变更内容',
    width: '55%',
    align: 'left',
    ellipsis: true,
    scopedSlots: { customRender: 'modifyContent' }
  }]
export default {
  name: 'OwnAlterBaseInfo',
  components: {
    PersonSelect,
    DeptSelect,
    STable
  },
  data () {
    var validatePayments = (rule, value, callback) => {
      if (this.paymentList.length === 0) {
        callback()
        this.callbackMsg = '请填写付款条件！'
        this.showError = true
      } else if (this.isError) {
        callback()
        this.callbackMsg = '数据内容不能为空，内容请填写完整！'
        this.showError = true
      } else {
        this.showError = false
        callback()
      }
    }
    return {
      moment,
      customerModalVisible: false,
      contractModalVisible: false,
      docModalVisible: false,
      formHeight: window.innerHeight - 60,
      drawerCardHeight: window.innerHeight - 60,
      drawerFormHeight: window.innerHeight - 90,
      recordListScrollHeight: window.innerHeight - 170,
      tableHeight: 0,
      purchaseContractData: {},
      readOnly: false,
      firstStepAudited: false,
      isSpinning: false,
      purchaseContractForm: {},
      docModalHeight: 400 + 'px',
      isFileLoading: false,
      isPaymentLoading: false,
      downloading: false,
      uploading: false,
      paymentColumns: [
        {
          dataIndex: 'rowIndex',
          title: '',
          width: '5%',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'paymentAccount',
          title: '付款科目',
          width: '16%',
          scopedSlots: { customRender: 'paymentAccount' }
        },
        {
          dataIndex: 'alterPayment',
          title: '付款金额',
          width: '17%',
          scopedSlots: { customRender: 'alterPayment' }
        },
        {
          dataIndex: 'rate',
          title: '比例',
          width: '9%',
          scopedSlots: { customRender: 'rate' }
        },
        {
          dataIndex: 'remarks',
          title: '付款条件',
          width: '43%',
          scopedSlots: { customRender: 'remarks' }
        },
        {
          dataIndex: 'operate',
          title: '',
          width: '10%',
          scopedSlots: { customRender: 'operate' },
          align: 'right'
        }

      ],
      fileColumns,
      recordColumn,
      recordRowSelected: '',
      paymentSelectedRow: '',
      rowDocSelected: '',
      rowDocSelectedInfo: {},
      documentList: [],
      paymentList: [],
      fileList: [],
      fileTypesDic: [],
      paymentItemsDic: [],
      classificationsDic: [],
      listPaymentScrollHeight: 250,
      docPagination: {
        total: 0,
        size: 'small',
        current: 0,
        pageSize: 0
      },
      recordPagination: { pageNumber: 1, pageSize: 25, totalCount: 1 },
      recordQueryParam: { pageNo: 1, pageSize: 25, mainId: null, modifyDetail: 14 },
      docQueryParam: { pageNo: 1, pageSize: 25, mainId: null, menuId: null, type: 1 },
      docCurrentPage: 1,
      currentPurchaseContractId: null,
      countNumber: 0,
      paymentDeletes: [],
      unpaidAmount: 0,
      purchaseContractFormRules: {
        alterAmount: [{ required: true, message: '请填写变更金额!', trigger: 'blur' }],
        paymentCondition: [{ required: true, validator: validatePayments }]
      },
      isError: false,
      showError: false,
      callbackMsg: '',
      topThreeFiles: [],
      supplementFlag: false,
      generateFlag: false,
      supplementPurchaseContract: {},
      originalPurchaseContract: {},
      error: false,
      signDateStr: '',
      drawerTitle: '',
      drawerVisible: false,
      loadRecordList: parameter => {
        return doLoadPurchaseContractModifyRecordList(Object.assign(parameter, this.recordQueryParam)).then(res => {
          if (res.code === 200) {
            this.recordPagination.pageNumber = res.body.pageNumber + 1
            this.recordPagination.totalCount = res.body.totalCount
            return res.body
          }
        })
      },
      amountAlterFlag: false
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
    usageFlag: {
      type: Number,
      default: 0
    },
    purchaseContractId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClassificationChange (val) {
      if (this.currentPurchaseContractId > 0 && this.purchaseContractForm.purchaseContractNo) {
        const me = this
        this.$confirm({
          title: '修改后可能会重新生成新的合同号，是否继续？',
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
            me.purchaseContractForm.classification = val
          }
        })
      } else {
        this.purchaseContractForm.classification = val
      }
    },
    handleHasContractChange (val) {
      if (this.currentPurchaseContractId > 0 && this.purchaseContractForm.purchaseContractNo) {
        const me = this
        this.$confirm({
          title: '修改后可能会重新生成新的合同号，是否继续？',
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
            me.purchaseContractForm.hasContract = val
          }
        })
      } else {
        this.purchaseContractForm.hasContract = val
      }
    },
    handleSignDateChange (val) {
      if (this.currentPurchaseContractId > 0 && this.purchaseContractForm.purchaseContractNo) {
        const me = this
        this.$confirm({
          title: '修改后可能会重新生成新的合同号，是否继续？',
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
            me.purchaseContractForm.signDate = val
            me.signDateStr = val.format('YYYYMMDD')
          }
        })
      } else {
        this.purchaseContractForm.signDate = val
        this.signDateStr = val.format('YYYYMMDD')
      }
    },
    handleAlterAmountBlur () {
      if (this.purchaseContractForm.alterAmount && this.purchaseContractForm.alterAmount > 0 && this.paymentList.length > 0) {
        const data = [...this.paymentList]
        data.forEach(item => {
          if (item.alterPayment > 0) {
            item.rate = new Decimal(item.alterPayment).dividedBy(new Decimal(this.purchaseContractForm.alterAmount)).toFixed(4)
          }
        })
        this.paymentList = data
      }
    },
    doHandleFileUpload () {
      this.docModalVisible = true
      this.loadUploadedDocList()
    },
    doEditPayment (record) {
      this.paymentSelectedRow = record.id
      var newData = [...this.paymentList]
      var target = newData.find(item => item.id === this.paymentSelectedRow)
      target._origionalData = { ...target }
      if (target) {
        target.isNew = true
      }
      this.paymentList = newData
    },
    doRemovePayment (record) {
      this.paymentSelectedRow = record.id
      const me = this
      this.$confirm({
        title: '是否删除该行记录？',
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
          if (me.paymentSelectedRow > 0) {
            me.paymentDeletes.push(me.paymentSelectedRow)
          }
          me.paymentList = me.paymentList.filter(item => item.id !== me.paymentSelectedRow)
          me.paymentSelectedRow = ''
        }
      })
    },
    doAddPaymentCondition () {
      this.countNumber = this.countNumber - 1
      this.paymentList.push({
        id: this.countNumber,
        contractId: this.currentPurchaseContractId,
        paymentAccount: '',
        paymentAccountText: '',
        payment: null,
        alterPayment: null,
        rate: null,
        remarks: '',
        isNew: true
      })
      this.scrollToBottom()
    },
    doInfoAlter () {
      if (this.isSpinning) {
        return
      }
      var validateResult = true
      this.$refs.purchaseContractForm.validate(valid => { // 校验
        if (valid) {
        } else {
          validateResult = false
        }
      })
      var newData = [...this.paymentList]
      var totalPaymentAmount = 0
      if (newData.length > 0) {
        newData.forEach(item => {
          if (item.id < 0) {
            item.payment = item.alterPayment
          }
          if (!item.paymentAccount || !item.alterPayment || !item.remarks) {
            item.isNew = true
            item.isError = true
            validateResult = false
          } else {
            item.isError = false
          }
          if (item.alterPayment) {
            totalPaymentAmount = new Decimal(totalPaymentAmount).add(new Decimal(item.alterPayment)).toNumber()
          }
        })
      } else {
        validateResult = false
      }
      if (totalPaymentAmount > this.purchaseContractForm.alterAmount) {
        this.$message.error('付款总和不能超过合同金额！')
        this.error = true
        validateResult = false
      } else {
        this.error = false
      }
      this.paymentList = newData
      if (this.paymentList.filter(item => item.isError).length > 0) {
        this.isError = true
      } else {
        this.isError = false
      }
      var validateField = ['paymentCondition']
      this.$refs.purchaseContractForm.validateField(validateField, errorMessage => {
        if (errorMessage) {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      // 判断数据是否有变更
      var alterAmountFlag = this.purchaseContractForm.totalAmount !== this.purchaseContractForm.alterAmount
      var paymentFlag = false
      this.paymentList.forEach(payment => {
        if (payment.id < 0) {
          payment.alterType = 1 // 新增
          paymentFlag = true
        } else if (payment.id > 0 && payment._origionalData) {
          if (payment._origionalData.paymentAccount !== payment.paymentAccount || payment._origionalData.alterPayment !== payment.alterPayment || payment._origionalData.remarks !== payment.remarks) {
            payment.alterType = 2 // 修改
            paymentFlag = true
          }
        }
      })
      if (!(paymentFlag || alterAmountFlag)) {
        this.$message.warning('无数据修改')
        return
      }
      var payment = this.paymentList.filter(item => item.alterType)
      var purchaseContract = {}
      purchaseContract.purchaseContractId = this.purchaseContractForm.purchaseContractId
      purchaseContract.totalAmount = this.purchaseContractForm.totalAmount
      purchaseContract.alterAmount = this.purchaseContractForm.alterAmount
      this.isSpinning = true
      doAlterPurchaseContract({
        purchaseContract: purchaseContract,
        saves: payment
      })
        .then(res => {
          if (res.code === 200) {
            this.isSpinning = false
            this.$message.success('变更成功！')
            this.onDrawerClose()
            this.$emit('refresh', true)
          }
          this.isSpinning = false
        })
    },
    doDisplayModifyRecord () {
      this.drawerTitle = '调整记录 (' + this.purchaseContractForm.purchaseContractNo + ')'
      this.drawerVisible = true
      this.recordQueryParam.mainId = this.currentPurchaseContractId
      setTimeout(() => {
        this.$refs.recordTable.refresh(true) // refresh() 不传参默认值 false 不刷新到分页第一页
      }, 100)
    },
    doAlterAudit () {
      var purchaseContract = {}
      purchaseContract.purchaseContractId = this.purchaseContractForm.purchaseContractId
      purchaseContract.totalAmount = this.purchaseContractForm.totalAmount
      purchaseContract.alterAmount = this.purchaseContractForm.alterAmount
      doAlterAuditPurchaseContract({
        purchaseContract: purchaseContract,
        saves: this.paymentList }).then(res => {
        if (res.code === 200) {
          this.$message.success('变更审核成功！')
          this.$emit('refresh', true)
          this.onDrawerClose()
        }
      })
    },
    doAlterDisagree () {
      const me = this
      this.$confirm({
        title: '是否退回该采购合同变更？',
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
          var purchaseContract = {}
          purchaseContract.purchaseContractId = me.purchaseContractForm.purchaseContractId
          purchaseContract.totalAmount = me.purchaseContractForm.totalAmount
          purchaseContract.alterAmount = me.purchaseContractForm.alterAmount
          purchaseContract.modifyId = me.purchaseContractForm.modifyId

          doAlterDisagreePurchaseContract({
            purchaseContract: purchaseContract,
            saves: me.paymentList }).then(res => {
            if (res.code === 200) {
              me.$message.success('驳回变更成功！')
              me.$emit('refresh', true)
              me.onDrawerClose()
            }
          })
        }
      })
    },
    handleAlterPaymentBlur () {
      if (this.purchaseContractForm.alterAmount && this.purchaseContractForm.alterAmount > 0) {
        const data = [...this.paymentList]
        var target = data.find(item => this.paymentSelectedRow === item.id)
        if (target.alterPayment) {
          target.rate = new Decimal(target.alterPayment).dividedBy(new Decimal(this.purchaseContractForm.alterAmount)).toFixed(4)
        }
        this.paymentList = data
      }
    },
    initFormFields () {
      this.purchaseContractForm = {
        purchaseContractId: null,
        purchaseContractNo: null,
        signDept: undefined,
        signDeptName: null,
        suppliers: null,
        suppliersText: null,
        totalAmount: null,
        hasContract: 1,
        signer: null,
        signerText: null,
        signDate: moment(),
        payAmount: null,
        flag: 3,
        originalStatus: null,
        endMark: null,
        productName: null,
        finalCostAmount: null,
        status: null,
        contractName: null,
        classification: undefined,
        progress: null,
        confirmDate: null,
        paymentCondition: null,
        supplementFlag: 0,
        originalContractId: null,
        committed: 0
      }
      this.signDateStr = this.purchaseContractForm.signDate.format('YYYYMMDD')
    },
    onDocClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowDocSelected = record.id
            this.rowDocSelectedInfo = record
          }
        }
      }
    },
    setDocCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.rowDocSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onPaymentClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.paymentSelectedRow = record.id
          }
        }
      }
    },
    setPaymentCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.paymentSelectedRow) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      if (record.alterType === 1 || record.alterType === 2) {
        styleClassName = 'specialRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onRecordClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.recordRowSelected = record.id
          }
        }
      }
    },
    setRecordCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.recordRowSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    handleItemFocus (record) {
      this.paymentSelectedRow = record.id
    },
    handleItemChange (data) {
      const newData = [...this.paymentList]
      const target = newData.find(item => this.paymentSelectedRow === item.id)
      if (target) {
        target['paymentAccount'] = data.key
        target['paymentAccountText'] = data.label
        this.paymentList = newData
      }
    },
    onDocModalCancel () {
      this.rowDocSelected = ''
      this.rowDocSelectedInfo = {}
      this.docModalVisible = false
    },
    onDrawerClose () {
      this.$emit('closeDrawer', true)
    },
    onRecordDrawerClose () {
      this.drawerVisible = false
      this.drawerTitle = ''
      this.recordQueryParam.mainId = null
    },
    downloadFile () {
      if (!this.rowDocSelected) {
        this.$message.error('未选择文档')
        return
      }
      this.downloading = true
      const param = { fileId: this.rowDocSelectedInfo.fileId, wordId: this.rowDocSelected }
      fileDownload(param).then(res => {
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
          this.downloading = false
        }
        this.downloading = false
      })
    },
    downloadSpecifiedFile (file) {
      this.$confirm({
        title: '是否下载查看该文档?',
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
          const param = { fileId: file.fileId, wordId: file.id }
          fileDownload(param).then(res => {
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
          })
        }
      })
    },
    loadUploadedDocList () {
      this.isFileLoading = true
      doLoadFilesUploadedList(this.docQueryParam)
        .then(res => {
          if (res.code === 200) {
            this.docPagination.current = res.body.pageNumber + 1
            this.docCurrentPage = res.body.pageNumber + 1
            this.docPagination.pageSize = res.body.pageSize
            this.docPagination.total = res.body.totalCount
            this.documentList = res.body.items
            this.isFileLoading = false
          }
          this.isFileLoading = false
        })
    },
    getTopThreeFiles () {
      if (this.currentPurchaseContractId === 0) {
        return
      }
      this.docQueryParam.menuId = this.usageFlag === 1 ? Number(this.$route.meta.id) : null
      this.docQueryParam.mainId = this.currentPurchaseContractId
      this.topThreeFiles = []
      doLoadFilesUploadedList(this.docQueryParam)
        .then(res => {
          if (res.code === 200) {
            if (res.body.items.length > 0) {
              this.topThreeFiles = res.body.items.slice(0, 3)
            }
          }
        })
    },
    loadPaymentList () {
      this.isPaymentLoading = true
      const params = { contractId: this.currentPurchaseContractId }
      params.alterFlag = this.operation === 'audit2' ? 1 : 0
      doLoadPaymentList(params)
        .then(res => {
          if (res.code === 200) {
            this.paymentList = res.body
            if (this.purchaseContractForm.totalAmount && this.purchaseContractForm.totalAmount > 0 && res.body.length > 0) {
              const data = [...this.paymentList]
              this.paymentList.forEach(item => {
                if (this.operation === 'audit2') {
                  if (item.alterType) {
                    if (item.alterPayment && item.alterPayment > 0) {
                      item.rate = new Decimal(item.alterPayment).dividedBy(new Decimal(this.purchaseContractForm.totalAmount)).toFixed(4)
                    }
                  } else {
                    item.alterPayment = item.payment
                    item.rate = new Decimal(item.alterPayment).dividedBy(new Decimal(this.purchaseContractForm.totalAmount)).toFixed(4)
                  }
                } else {
                  if (item.payment && item.payment > 0) {
                    item.alterPayment = item.payment
                    item.rate = new Decimal(item.alterPayment).dividedBy(new Decimal(this.purchaseContractForm.totalAmount)).toFixed(4)
                  }
                }
              })
              this.paymentList = data
            }
            this.isPaymentLoading = false
          }
          this.isPaymentLoading = false
        })
    },
    docPageChange (pagination) {
      this.docQueryParam.pageNo = pagination.current
      this.loadUploadedDocList()
    },
    getDicData () {
      doLoadDic()
        .then(res => {
          if (res.code === 200) {
            this.fileTypesDic = res.body.fileTypes
            this.paymentItemsDic = res.body.paymentItems
            this.classificationsDic = res.body.contractClassifications
          }
        })
    },
    scrollToBottom () {
      const table = this.$refs.paymentTable.$el
      // 获取到具有 'scroll' 属性的这一层dom元素
      const tableBody = table.querySelector('.ant-table-body')
      if (tableBody) {
        this.$nextTick(() => {
          tableBody.scrollTop = tableBody.scrollHeight
        })
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    initPageData (purchaseContract) {
      this.purchaseContractForm = { ...purchaseContract }
      if (this.purchaseContractForm.signDate) {
        this.purchaseContractForm.signDate = moment(this.purchaseContractForm.signDate)
      } else {
        this.purchaseContractForm.signDate = moment()
      }
      this.signDateStr = this.purchaseContractForm.signDate.format('YYYYMMDD')
      if (this.purchaseContractForm.confirmDate) {
        this.purchaseContractForm.confirmDate = moment(this.purchaseContractForm.confirmDate)
      } else {
        this.purchaseContractForm.confirmDate = null
      }
      this.supplementFlag = this.purchaseContractForm.supplementFlag === 1
      if (this.operation !== 'audit2') {
        this.purchaseContractForm.alterAmount = this.purchaseContractForm.totalAmount
      } else {
        if (this.purchaseContractForm.alterAmount > 0) {
          this.amountAlterFlag = true
        } else {
          this.purchaseContractForm.alterAmount = this.purchaseContractForm.totalAmount
        }
      }

      this.$nextTick(() => {
        this.$refs.person.getCurrent(this.purchaseContractForm.signer, this.purchaseContractForm.signerText)
        this.$refs.dept.getCurrent(this.purchaseContractForm.signDept, this.purchaseContractForm.signDeptName)
      })
      this.loadPaymentList()
    },
    resetFields () {
      this.$refs.purchaseContractForm.resetFields()
    },
    resetForm () {
      this.initFormFields()
      this.fileList = []
      this.documentList = []
      this.paymentList = []
      this.fileTypesDic = []
      this.paymentItemsDic = []
      this.topThreeFiles = []
      this.docPagination = {
        total: 0,
        size: 'small',
        current: 0,
        pageSize: 0
      }
      this.docQueryParam = { pageNo: 1, pageSize: 25, mainId: null, menuId: null, type: 1 }
      this.docCurrentPage = 1
      this.purchaseContractId = null
      this.isError = false
      this.showError = false
      this.supplementFlag = false
      this.supplementPurchaseContract = {}
      this.originalPurchaseContract = {}
      this.error = false
      this.paymentSelectedRow = ''
      this.rowDocSelected = ''
      this.rowDocSelectedInfo = {}
    },
    loadPurchaseContract () {
      this.isSpinning = true
      var param = { purchaseContractId: this.currentPurchaseContractId }
      getPurchaseContract(param).then((res) => {
        if (res.code === 200) {
          var purchaseContract = res.body
          this.initPageData(purchaseContract)
          this.isSpinning = false
        }
        this.isSpinning = false
      })
    },
    initPage () {
      this.getDicData()
      this.initFormFields()
      this.currentPurchaseContractId = this.purchaseContractId
      this.loadPurchaseContract()
      this.getTopThreeFiles()
      if (this.operation === 'audit2') {
        this.purchaseContractFormRules = {}
      }
    },
    calculateTotalAmount () {
      var totalPaymentAmount = 0
      if (this.paymentList.length > 0) {
        this.paymentList.forEach(item => {
          if (item.alterPayment) {
            totalPaymentAmount = new Decimal(totalPaymentAmount).add(new Decimal(item.alterPayment)).toNumber()
          }
        })
      }
      return totalPaymentAmount
    }
  },
  computed: {
    totalPaymentAmount: function () {
      return this.calculateTotalAmount()
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style scoped>
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

  /deep/ .ant-radio-disabled + span {
    color: rgb(0, 0, 0);
    cursor: not-allowed;
  }

  /deep/ .ant-table-footer {
    position: relative;
    padding: 5px;
    color: rgba(0, 0, 0, 0.85);
    background: #fafafa;
    border-top: 1px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
  }

  .paymentClass /deep/ .ant-table-placeholder {
    display: none;
  }

  /deep/ .ant-radio-button-wrapper-disabled.ant-radio-button-wrapper-checked {
    color: #fff;
    background-color: #1890ff;
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

  /deep/ .ant-input-number-disabled .ant-input-number-input {
    cursor: not-allowed;
    background: white;
  }

  .errorClass {
    border-color: #f5222d;
  }

</style>
