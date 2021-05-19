<template>
  <a-card
    :bodyStyle="{
      height:cardHeight+'px',
      padding: '0px 10px'
    }"
    :bordered="false">
    <a-row style="margin-bottom: 10px;margin-top:10px;">
      <a-radio-group :value="queryParam.dateRangeFlag" @change="onDateRangeFlagChange">
        <a-radio :value="1">发放日期</a-radio>
        <a-radio :value="2">核算日期</a-radio>
      </a-radio-group>
      <a-divider type="vertical" />
      <a-range-picker
        :allowClear="false"
        :style="{'margin-left':'10px','width': '230px'}"
        :format="dateFormat"
        v-model="dateRange"
        @change="onRefresh"/>
      <a-divider type="vertical" />
      <a-input-search
        placeholder="采购合同号/合同名称/采购内容"
        v-model="queryParam.inputContent"
        style="width: 270px"
        allow-clear
        :pressEnter="doQuery"
        @search="doQuery"/>
      <a-divider type="vertical" />
      <a-button type="primary" icon="search" @click="doQuery">查询</a-button>
      <a-divider type="vertical" v-action:1/>
      <a-button v-action:1 type="primary" icon="download" @click="doExport" :loading="isDownloading">导出</a-button>

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
      :scroll="{ x: 1300, y: listScrollHeight }">
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
      <template slot="issueAmount" slot-scope="text">
        <template>{{ text | AmountFormat }}</template>
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
        <a-switch size="small" :checked="text === 1" />
      </template>
      <template slot="progress" slot-scope="text">
        <a-progress
          :stroke-color="{ from: '#108ee9', to: '#87d068',}"
          :percent="parseInt(text * 100)"
          :status="text === 1 ? 'success' : 'active'" />
      </template>
    </a-table>
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
              v-if="lookDrawerVisible"
              :purchaseContractId="purchaseContractId"
              :operation="operation"
              :usageFlag="3"
              @closeDrawer="onLookDrawerClose"></own-base-info>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="支付信息">
            <own-pay-info ref="lookPayInfo" v-if="lookDrawerVisible && activeKey === 2" :purchaseContractNo="purchaseContractNo" @closeDrawer="onLookDrawerClose"></own-pay-info>
          </a-tab-pane>
          <a-tab-pane :key="3" tab="进度信息">
            <own-progress-info
              ref="progressInfo"
              :purchaseContractId="purchaseContractId"
              v-if="lookDrawerVisible && activeKey === 3"
              :baseInfo="baseInfo"
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
import { getOwnPurchaseContractInfolist, exportPurchaseContract } from '@/api/ownPurchaseContractInfoList'
import { OwnBaseInfo, OwnPayInfo, OwnProgressInfo } from '@/module'
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
    color: 'blue',
    text: '决算未审'
  },
  3: {
    color: 'green',
    text: '决算已审'
  }
}
export default {
  name: 'OwnPurchaseContractInfoListView',
  components: {
    FooterToolBar,
    OwnBaseInfo,
    OwnPayInfo,
    OwnProgressInfo
  },
  data () {
    return {
      listScrollHeight: 0,
      cardHeight: 0,
      table: [],
      isLoading: false,
      selectedRow: null,
      page: { pageNo: 1, pageSize: 25, totalCount: 0 },
      queryParam: { pageNo: 1, pageSize: 25, dateRangeFlag: 1, inputContent: '', startDate: undefined, endDate: undefined },
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
          width: 120,
          scopedSlots: { customRender: 'totalAmount' }
        },
        {
          key: 'finalCostAmount',
          dataIndex: 'finalCostAmount',
          align: 'right',
          title: '决算金额',
          width: 120,
          scopedSlots: { customRender: 'finalCostAmount' }
        },
        {
          key: 'payAmount',
          dataIndex: 'payAmount',
          align: 'right',
          title: '累计已支付金额',
          width: 120,
          scopedSlots: { customRender: 'payAmount' }
        },
        {
          key: 'issueAmount',
          dataIndex: 'issueAmount',
          align: 'right',
          title: '本期支付金额',
          width: 120,
          scopedSlots: { customRender: 'issueAmount' }
        },
        {
          key: 'progress',
          dataIndex: 'progress',
          align: 'center',
          title: '进度',
          scopedSlots: { customRender: 'progress' },
          width: 120
        },
        {
          key: 'confirmDate',
          dataIndex: 'confirmDate',
          align: 'center',
          title: '进度确认日期',
          width: 120
        }
      ],
      selectedInfo: {},
      lookDrawerVisible: false,
      baseInfoDrawerTitle: '',
      baseInfo: {},
      activeKey: 1,
      operation: '',
      purchaseContractNo: '',
      purchaseContractId: 0,
      isDownloading: false,
      dateFormat: 'YYYY-MM-DD',
      dateRange: []
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
            this.purchaseContractId = record.purchaseContractId
            this.purchaseContractNo = record.purchaseContractNo
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
    onRefresh () {
      this.queryParam.pageNo = 1
      this.queryParam.startDate = this.dateRange[0].format('YYYY-MM-DD').toString()
      this.queryParam.endDate = this.dateRange[1].format('YYYY-MM-DD').toString()
      this.selectedRow = ''
      this.doQuery()
    },
    getList () {
      this.isLoading = true
      getOwnPurchaseContractInfolist(Object.assign(this.queryParam)).then(res => {
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
    handleReadContract (record) {
      this.lookDrawerVisible = true
      this.baseInfo = { ...record }
    },
    doQuery () {
      this.queryParam.pageNo = 1
      this.getList()
    },
    onDateRangeFlagChange (val) {
      this.queryParam.dateRangeFlag = val.target.value
      this.doQuery()
    },
    doOperateContract (operation, record) {
      this.operation = operation
      if (operation === 'read') {
        this.handleReadContract(record)
      }
    },
    onLookDrawerClose () {
      this.lookDrawerVisible = false
      this.activeKey = 1
    },
    handleTabChange (key) {
      this.activeKey = key
      if (key === 1) {
        this.$nextTick(() => {
          this.$refs.lookBaseInfo.initPage()
        })
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
    this.listScrollHeight = window.innerHeight - 265
    this.cardHeight = window.innerHeight - 125
    var startDate = moment().startOf('year')
    var today = moment() // 今天
    this.dateRange.push(startDate, today)
    this.queryParam.startDate = startDate.format('YYYY-MM-DD').toString()
    this.queryParam.endDate = today.format('YYYY-MM-DD').toString()
    this.doQuery()
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
