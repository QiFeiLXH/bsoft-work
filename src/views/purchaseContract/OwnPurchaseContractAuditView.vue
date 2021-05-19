<template>
  <a-card
    :bodyStyle="{
      height:cardHeight+'px',
      padding: '0px 10px'
    }"
    :bordered="false">
    <a-row style="margin-bottom: 10px;margin-top:10px;">
      <span style="margin-right:15px">签订年份：</span>
      <a-input-number v-model="queryParam.signYear" :min="1"></a-input-number>
      <a-divider type="vertical" />
      <a-input-search
        placeholder="采购合同号/合同名称/采购内容"
        v-model="queryParam.inputContent"
        style="width: 270px"
        allow-clear
        :pressEnter="doQuery"
        @search="doQuery"/>
      <a-divider type="vertical" />
      <a-radio-group :value="queryParam.auditStatus" @change="onStatusChange">
        <a-radio :value="0">未审核<span v-if="unreviewedCount > 0">({{ unreviewedCount }}个)</span></a-radio>
        <a-radio :value="1">已审核</a-radio>
      </a-radio-group>
      <a-divider type="vertical" />
      <a-button type="primary" icon="search" style="margin-left:15px" @click="refreshTable">查询</a-button>
    </a-row>
    <a-table
      size="small"
      class="custom"
      :loading="isLoading"
      :rowKey="(record) => record.purchaseContractId"
      :bordered="false"
      :dataSource="table"
      :columns="columns"
      :customRow="onClickRow"
      :rowClassName="setCurrentRow"
      :pagination="false"
      :bodyStyle="{ height: listScrollHeight + 'px'}"
      :scroll="{ x: 1300,y: listScrollHeight }">
      <template slot="rowIndex" slot-scope="text, record, index">
        <span>
          {{ (page.pageNo - 1) * page.pageSize + index + 1 }}
        </span>
      </template>
      <template slot="totalAmount" slot-scope="text">
        <template v-if="text > 0">{{ text | AmountFormat }}</template>
      </template>
      <template slot="finalCostAmount" slot-scope="text">
        <template v-if="text > 0">{{ text | AmountFormat }}</template>
      </template>
      <template slot="payAmount" slot-scope="text">
        <template v-if="text > 0">{{ text | AmountFormat }}</template>
      </template>
      <template slot="contractName" slot-scope="text">
        <a-tooltip>
          <template slot="title">
            {{ text }}
          </template>
          {{ text }}
        </a-tooltip>
      </template>
      <template slot="suppliersText" slot-scope="text">
        <a-tooltip>
          <template slot="title">
            {{ text }}
          </template>
          {{ text }}
        </a-tooltip>
      </template>
      <template slot="hasContract" slot-scope="text">
        <a-checkbox size="small" :checked="text === 1" />
      </template>
      <template slot="flag" slot-scope="text">
        <span>{{ text | flagFilter }}</span>
      </template>
      <template slot="status" slot-scope="text, record">
        <template v-if="queryParam.auditStatus === 0 && (record.alterFlag === 0) || (record.alterFlag === 1 && (text === 0 || text === 2))">
          <a-badge :color="text | statusTypeFilter" :text="text | statusFilter"/>
        </template>
        <template v-if="queryParam.auditStatus === 1">
          <a-badge :color="text | statusTypeFilter" :text="text | statusFilter"/>
        </template>
        <template v-if="record.alterFlag === 1 && queryParam.auditStatus === 0">
          <a-badge status="processing" text="变更未审"/>
        </template>
      </template>
      <template slot="operation" slot-scope="text, record">
        <template v-if="record.status === 0">
          <a @click="doOperateContract('audit0',record)">审核</a>
        </template>
        <template v-else-if="record.status === 2">
          <a @click="doOperateContract('audit1',record)">决算审核</a>
          <a @click="doOperateContract('audit2',record)" v-if="record.alterFlag === 1">变更审核</a>
        </template>
        <template v-else>
          <a @click="doOperateContract('read',record)" v-if="queryParam.auditStatus === 1">查看</a>
          <a @click="doOperateContract('audit2',record)" v-else>变更审核</a>
        </template>
      </template>
    </a-table><a-drawer
      title="合同信息"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="1000"
      @close="onAuditContractDrawerClose"
      :visible="auditDrawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <own-base-info
        ref="baseInfo"
        :purchaseContractId="purchaseContractId"
        v-if="auditDrawerVisible && operation !== 'audit2'"
        :operation="operation"
        @refresh="refreshTable"
        @closeDrawer="onAuditContractDrawerClose">
      </own-base-info>
      <own-alter-base-info
        ref="alterBaseInfo"
        :purchaseContractId="purchaseContractId"
        :operation="operation"
        v-if="auditDrawerVisible && operation === 'audit2'"
        @refresh="refreshTable"
        @closeDrawer="onAuditContractDrawerClose">
      </own-alter-base-info>
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
          zIndex: 1000
        }"
      >
        <a-button type="primary" @click="doDisplayModifyRecord" v-if="operation === 'audit2'">变更记录</a-button>
        <a-button type="primary" style="margin-left: 620px" @click="doAudit">同意</a-button>
        <a-button type="danger" style="margin-left: 20px" @click="doDisagree">退回</a-button>
        <a-button key="back" style="margin-left: 20px" @click="onAuditContractDrawerClose">关闭</a-button>
      </div>
    </a-drawer>
    <a-drawer
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="1000"
      @close="onLookDrawerClose"
      :visible="lookDrawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <div class="card-container">
        <a-tabs
          hideAdd
          size="small"
          type="card"
          v-model="activeKey"
          @change="handleTabChange"
        >
          <a-tab-pane :key="1" tab="合同信息">
            <own-base-info
              ref="lookBaseInfo"
              :purchaseContractId="purchaseContractId"
              v-if="lookDrawerVisible"
              :operation="operation"
              :usageFlag="2"
              @closeDrawer="onLookDrawerClose"
              @refresh="refreshTable"></own-base-info>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="支付信息">
            <own-pay-info ref="lookPayInfo" v-if="lookDrawerVisible && activeKey === 2" :purchaseContractNo="purchaseContractNo" @closeDrawer="onLookDrawerClose"></own-pay-info>
          </a-tab-pane>
          <a-tab-pane :key="3" tab="进度信息">
            <own-progress-info ref="progressInfo" :purchaseContractId="purchaseContractId" v-if="lookDrawerVisible && activeKey === 3" :baseInfo="baseInfo" :operation="operation" @closeDrawer="onLookDrawerClose"></own-progress-info>
          </a-tab-pane>
        </a-tabs>
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
            zIndex: 1000
          }"
        >
          <a-button key="back" style="margin-left: 20px" @click="onLookDrawerClose">关闭</a-button>
        </div>
      </div>
    </a-drawer>
    <footer-tool-bar>
      <a-pagination
        :disabled="isLoading"
        :total="page.totalCount"
        :pageSize.sync="page.pageSize"
        v-model="page.pageNo"
        @change="onPageChange"
        style="margin-top: 10px"/>
    </footer-tool-bar>
  </a-card>
</template>

<script>
import moment from 'moment'
import FooterToolBar from '@/components/FooterToolbar'
import { getOwnPurchaseContractlist, getOwnUnreviewedCount } from '@/api/ownPurchaseContractAudit'
import { OwnBaseInfo, OwnPayInfo, OwnProgressInfo, OwnAlterBaseInfo } from '@/module'

const statusMap = {
  0: {
    color: 'grey',
    text: '未审核'
  },
  1: {
    color: 'cyan',
    text: '已审核'
  },
  2: {
    color: 'purple',
    text: '决算未审'
  },
  3: {
    color: 'green',
    text: '决算已审'
  }
}

const flagMap = {
  1: {
    text: '硬件'
  },
  2: {
    text: '软件'
  },
  3: {
    text: '募投基建'
  }
}
export default {
  name: 'OwnPurchaseContractAuditView',
  components: {
    FooterToolBar,
    OwnBaseInfo,
    OwnPayInfo,
    OwnProgressInfo,
    OwnAlterBaseInfo
  },
  data () {
    return {
      listScrollHeight: 0,
      cardHeight: 0,
      table: [],
      isLoading: false,
      selectedRow: null,
      selectedRowInfo: {},
      page: { pageNo: 1, pageSize: 25, totalCount: 0 },
      queryParam: { pageNo: 1, pageSize: 25, auditStatus: 0, inputContent: '', signYear: undefined },
      columns: [
        {
          key: 'rowIndex',
          dataIndex: 'rowIndex',
          align: 'center',
          title: '序号',
          width: 50,
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          key: 'signDate',
          dataIndex: 'signDate',
          align: 'center',
          title: '签定日期',
          width: 120
        },
        {
          key: 'hasContract',
          dataIndex: 'hasContract',
          align: 'center',
          title: '合同',
          width: 80,
          scopedSlots: { customRender: 'hasContract' }
        },
        {
          key: 'purchaseContractNo',
          dataIndex: 'purchaseContractNo',
          align: 'left',
          title: '采购合同号',
          width: 200
        },
        {
          key: 'contractName',
          dataIndex: 'contractName',
          align: 'left',
          title: '合同名称',
          width: 250,
          scopedSlots: { customRender: 'contractName' },
          ellipsis: true
        },
        {
          key: 'flag',
          dataIndex: 'flag',
          align: 'center',
          title: '采购类别',
          width: 100,
          scopedSlots: { customRender: 'flag' }
        },
        {
          key: 'suppliersText',
          dataIndex: 'suppliersText',
          align: 'left',
          title: '对方单位',
          width: 250,
          ellipsis: true,
          scopedSlots: { customRender: 'suppliersText' }
        },
        {
          key: 'totalAmount',
          dataIndex: 'totalAmount',
          align: 'right',
          title: '合同金额',
          width: 100,
          scopedSlots: { customRender: 'totalAmount' }
        },
        {
          key: 'finalCostAmount',
          dataIndex: 'finalCostAmount',
          align: 'right',
          title: '决算金额',
          width: 100,
          scopedSlots: { customRender: 'finalCostAmount' }
        },
        {
          key: 'payAmount',
          dataIndex: 'payAmount',
          align: 'right',
          title: '已支付金额',
          width: 100,
          scopedSlots: { customRender: 'payAmount' }
        },
        {
          key: 'status',
          dataIndex: 'status',
          align: 'center',
          title: '状态',
          scopedSlots: { customRender: 'status' },
          width: 100
        },
        {
          key: 'operation',
          dataIndex: 'operation',
          align: 'center',
          title: '操作',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      selectedInfo: {},
      auditDrawerVisible: false,
      lookDrawerVisible: false,
      baseInfoDrawerTitle: '',
      baseInfo: {},
      activeKey: 1,
      operation: '',
      unreviewedCount: 0,
      purchaseContractNo: '',
      purchaseContractId: 0
    }
  },
  filters: {
    flagFilter (type) {
      return flagMap[type].text
    },
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].color
    }
  },
  methods: {
    moment,
    setCurrentRow (record, index) {
      var styleClassName = ''
      if (record.purchaseContractId === this.selectedRow) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.selectedRow = record.purchaseContractId
            this.selectedRowInfo = record
            this.purchaseContractNo = record.purchaseContractNo
            this.purchaseContractId = record.purchaseContractId
          }
        }
      }
    },
    onPageChange (current) {
      this.queryParam.pageNo = current
      this.getList()
    },
    getList () {
      this.isLoading = true
      getOwnPurchaseContractlist(Object.assign(this.queryParam)).then(res => {
        if (res.code === 200) {
          this.table = res.body.items
          this.page.totalCount = res.body.totalCount
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    handleTabChange (key) {
      this.activeKey = key
      if (key === 1) {
        this.$refs.lookBaseInfo.initPage()
      }
    },
    getUnreviewedCount () {
      var param = { signYear: this.queryParam.signYear, inputContent: this.queryParam.inputContent }
      getOwnUnreviewedCount(param).then(res => {
        if (res.code === 200) {
          this.unreviewedCount = res.body
        }
      })
    },
    handleAuditContract (record) {
      this.auditDrawerVisible = true
    },
    handleReadContract (record) {
      this.lookDrawerVisible = true
      this.baseInfo = { ...record }
    },
    doQuery () {
      this.queryParam.pageNo = 1
      this.getList()
      this.getUnreviewedCount()
    },
    doDisagree () {
      if (this.operation === 'audit2') {
        this.$refs.alterBaseInfo.doAlterDisagree()
      } else {
        this.$refs.baseInfo.doDisagree()
      }
    },
    doAudit () {
      if (this.operation === 'audit2') {
        this.$refs.alterBaseInfo.doAlterAudit()
      } else {
        this.$refs.baseInfo.doAudit()
      }
    },
    doDisplayModifyRecord () {
      this.$refs.alterBaseInfo.doDisplayModifyRecord()
    },
    onStatusChange (val) {
      this.queryParam.auditStatus = val.target.value
      if (this.queryParam.auditStatus === 0) {
        this.queryParam.signYear = this.queryParam.signYear ? this.queryParam.signYear : null
      } else {
        this.queryParam.signYear = this.queryParam.signYear ? this.queryParam.signYear : moment().year()
      }
      this.doQuery()
    },
    doOperateContract (operation, record) {
      this.selectedRow = record.purchaseContractId
      this.selectedRowInfo = record
      this.purchaseContractId = record.purchaseContractId
      this.operation = operation
      if (operation === 'audit0' || operation === 'audit1' || operation === 'audit2') {
        this.handleAuditContract(record)
      }
      if (operation === 'read') {
        this.handleReadContract(record)
      }
    },
    refreshTable () {
      this.doQuery()
    },
    onAuditContractDrawerClose (bool) {
      this.auditDrawerVisible = false
    },
    onLookDrawerClose () {
      this.lookDrawerVisible = false
    }
  },
  mounted () {
    this.listScrollHeight = window.innerHeight - 265
    this.cardHeight = window.innerHeight - 125
    this.refreshTable()
  }
}
</script>

<style scoped>
  .card-container {
    background: #ffffff;
    overflow: hidden;
  }

  .custom /deep/ .ant-table-placeholder {
    position: absolute;
    z-index: 1;
    padding: 16px 16px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    margin-top: 1px;
    top: 36px;
    width: 100%
  }
</style>
