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
      <a-radio-group :value="queryParam.endMark" @change="onEndMarkChange">
        <a-radio :value="0">未完结<span v-if="unfinishedCount > 0">({{ unfinishedCount }}个)</span></a-radio>
        <a-radio :value="1">已完结</a-radio>
      </a-radio-group>
      <a-divider type="vertical" />
      <a-button type="primary" icon="search" @click="refreshTable">查询</a-button>
      <a-divider type="vertical" />
      <a-button type="primary" icon="plus-circle" @click="doOperateContract('add')">新增</a-button>
      <a-divider type="vertical" v-action:1/>
      <a-button
        v-action:1
        type="primary"
        icon="download"
        @click="doExport"
        :loading="isDownloading">导出</a-button>

    </a-row>
    <a-table
      size="small"
      class="custom"
      :loading="isLoading"
      :rowKey="(record) => record.purchaseContractId"
      :bordered="false"
      :dataSource="table"
      :columns="dynamicColumns"
      :customRow="onClickRow"
      :rowClassName="setCurrentRow"
      :pagination="false"
      :bodyStyle="{ height: listScrollHeight + 'px'}"
      :scroll="{ x: 1400, y: listScrollHeight }">
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
      <template slot="status" slot-scope="text, record">
        <template v-if="text === -1">
          <a-badge color="black" text="未提交"/>
        </template>
        <template v-else>
          <template>
            <a-badge :color="text | statusTypeFilter" :text="text | statusFilter"/>
          </template>
          <template v-if="record.alterFlag === 1">
            <a-badge status="processing" text="变更中"/>
          </template>
        </template>
      </template>
      <template slot="operation" slot-scope="text, record">
        <template v-if="record.status === -1">
          <a @click="doOperateContract('modify',record)">修改</a>
          <a-divider type="vertical"/>
          <a @click="doOperateContract('remove',record)">删除</a>
        </template>
        <template v-else-if="record.status == 0">
        </template>
        <template v-else-if="record.status == 1 || record.status == 2">
          <a @click="doOperateContract('alter',record)" v-if="record.alterFlag !== 1">变更</a>
          <a-divider type="vertical" v-if="record.alterFlag !== 1"/>
          <a @click="doOperateContract('finalcost',record)">决算信息</a>
        </template>
      </template>
    </a-table>
    <a-drawer
      title="合同信息"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="1000"
      @close="onAddContractDrawerClose"
      :visible="newContractDrawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <own-base-info
        ref="baseInfo"
        :purchaseContractId="purchaseContractId"
        :operation="operation"
        v-if="newContractDrawerVisible && operation !== 'alter'"
        @refresh="refreshTable"
        @closeDrawer="onAddContractDrawerClose">
      </own-base-info>
      <own-alter-base-info
        ref="alterBaseInfo"
        :purchaseContractId="purchaseContractId"
        :operation="operation"
        v-if="newContractDrawerVisible && operation === 'alter'"
        @refresh="refreshTable"
        @closeDrawer="onAddContractDrawerClose">
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
        <template v-if="operation === 'alter'"><a-button type="primary" icon="carry-out" style="margin-left: 20px" @click="doAlterContract">变更</a-button></template>
        <template v-else>
        <a-button type="primary" icon="file-done" style="margin-left: 20px" @click="handleCommitContract">提交</a-button>
        <a-button
          v-if="hasCommitted"
          type="primary"
          icon="check"
          style="margin-left: 20px"
          @click="handleSaveContract"
          :disabled="true">保存</a-button>
        <a-button v-else type="primary" icon="check" style="margin-left: 20px" @click="handleSaveContract">保存</a-button></template>
        <a-button key="back" icon="close" style="margin-left: 20px" @click="onAddContractDrawerClose">关闭</a-button>
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
              :usageFlag="1"
              @closeDrawer="onLookDrawerClose"></own-base-info>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="支付信息">
            <own-pay-info ref="lookPayInfo" v-if="lookDrawerVisible && activeKey === 2" :purchaseContractNo="purchaseContractNo" @closeDrawer="onLookDrawerClose"></own-pay-info>
          </a-tab-pane>
          <a-tab-pane :key="3" tab="进度信息">
            <own-progress-info
              ref="progressInfo"
              :baseInfo="baseInfo"
              v-if="lookDrawerVisible && activeKey === 3"
              :purchaseContractId="purchaseContractId"
              :operation="operation"
              @closeDrawer="onLookDrawerClose"></own-progress-info>
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
          <a-button key="back" icon="close" style="margin-left: 20px" @click="onLookDrawerClose">关闭</a-button>
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
import { getOwnPurchaseContractlist, getOwnUnfinishedCount, deletePurchaseContract, exportPurchaseContract } from '@/api/ownPurchaseContractList'
import { OwnBaseInfo, OwnPayInfo, OwnProgressInfo, OwnAlterBaseInfo } from '@/module'
import { downFile } from '@/utils/util'
import store from '@/store'

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
export default {
  name: 'OwnPurchaseContractListView',
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
      page: { pageNo: 1, pageSize: 25, totalCount: 0 },
      queryParam: { pageNo: 1, pageSize: 25, endMark: 0, inputContent: '', signYear: undefined },
      dynamicColumns: [],
      columns1: [
        {
          key: 'rowIndex',
          dataIndex: 'rowIndex',
          align: 'center',
          title: '序号',
          width: 50,
          scopedSlots: { customRender: 'rowIndex' }
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
          width: 95
        },
        {
          key: 'operation',
          dataIndex: 'operation',
          align: 'right',
          title: '操作',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      columns2: [
        {
          key: 'rowIndex',
          dataIndex: 'rowIndex',
          align: 'center',
          title: '序号',
          width: 50,
          scopedSlots: { customRender: 'rowIndex' }
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
        }
      ],
      selectedInfo: {},
      newContractDrawerVisible: false,
      lookDrawerVisible: false,
      baseInfoDrawerTitle: '',
      baseInfo: {},
      activeKey: 1,
      operation: '',
      unfinishedCount: 0,
      purchaseContractNo: '',
      isDownloading: false,
      hasCommitted: false,
      purchaseContractId: 0
    }
  },
  filters: {
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
            this.purchaseContractNo = record.purchaseContractNo
            this.purchaseContractId = record.purchaseContractId
            if (record.status !== -1) {
              this.hasCommitted = true
            } else {
              this.hasCommitted = false
            }
          },
          dblclick: () => {
            this.selectedRow = record.purchaseContractId
            this.purchaseContractId = record.purchaseContractId
            this.purchaseContractNo = record.purchaseContractNo
            this.doOperateContract('read', record)
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
    getUnfinishedCount () {
      var param = { signYear: this.queryParam.signYear, inputContent: this.queryParam.inputContent }
      getOwnUnfinishedCount(param).then(res => {
        if (res.code === 200) {
          this.unfinishedCount = res.body
        }
      })
    },
    handleCommitContract () {
      this.$refs.baseInfo.doInfoCommit()
    },
    doAlterContract () {
      this.$refs.alterBaseInfo.doInfoAlter()
    },
    handleSaveContract () {
      this.$refs.baseInfo.doInfoSave()
    },
    handleAddContract () {
      this.purchaseContractId = 0
      this.hasCommitted = false
      this.newContractDrawerVisible = true
    },
    handleRemoveContract (id) {
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
          deletePurchaseContract({ purchaseContractId: id }).then(res => {
            if (res.code === 200) {
              me.doQuery()
              me.getUnfinishedCount()
              me.page.pageNo = 1
            }
          })
        }
      })
    },
    handleModifyContract (record) {
      this.purchaseContractId = record.purchaseContractId
      this.newContractDrawerVisible = true
      if (record.status !== -1) {
        this.hasCommitted = true
      } else {
        this.hasCommitted = false
      }
    },
    handleFinalCostContract (record) {
      this.purchaseContractId = record.purchaseContractId
      this.newContractDrawerVisible = true
      this.hasCommitted = true
    },
    handleReadContract (record) {
      this.baseInfo = { ...record }
      this.lookDrawerVisible = true
    },
    handleAlterContract (record) {
      this.purchaseContractId = record.purchaseContractId
      this.newContractDrawerVisible = true
    },
    doQuery () {
      this.queryParam.pageNo = 1
      this.getList()
      this.getUnfinishedCount()
    },
    onEndMarkChange (val) {
      this.queryParam.endMark = val.target.value
      if (this.queryParam.endMark === 0) {
        this.dynamicColumns = this.columns1
      } else {
        this.dynamicColumns = this.columns2
      }
      this.doQuery()
    },
    doOperateContract (operation, record) {
      this.operation = operation
      if (operation === 'add') {
        this.handleAddContract()
      }
      if (operation === 'remove') {
        this.handleRemoveContract(record.purchaseContractId)
      }
      if (operation === 'modify') {
        this.handleModifyContract(record)
      }
      if (operation === 'finalcost') {
        this.handleFinalCostContract(record)
      }
      if (operation === 'read') {
        this.handleReadContract(record)
      }
      if (operation === 'alter') {
        this.handleAlterContract(record)
      }
    },
    refreshTable () {
      this.doQuery()
    },
    onAddContractDrawerClose (bool) {
      this.newContractDrawerVisible = false
    },
    onLookDrawerClose () {
      this.lookDrawerVisible = false
      this.activeKey = 1
    },
    handleTabChange (key) {
      this.activeKey = key
      if (key === 1) {
        this.$refs.lookBaseInfo.initPage()
      }
    },
    doExport () {
      const params = {}
      Object.assign(params, this.queryParam)
      params.menuId = this.$route.meta.id // 菜单id
      params.context = this.$route.meta.title // 菜单名称
      params.personId = store.getters.userInfo.personId // 用户id
      params.system = 16 // 系统
      this.isDownloading = true
      exportPurchaseContract(params).then(res => {
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
    }
  },
  mounted () {
    this.dynamicColumns = this.columns1
    this.listScrollHeight = window.innerHeight - 265
    this.cardHeight = window.innerHeight - 125
    this.queryParam.signYear = moment().year()
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
