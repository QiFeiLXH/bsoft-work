<template>
  <a-card
    :bodyStyle="{
      height:cardHeight+'px',
      padding: '0px 10px'
    }"
    :bordered="false">
    <a-row style="margin-bottom: 10px;margin-top:10px;">
      <!--<span style="margin-right:15px">签订年份：</span>
      <a-input-number v-model="queryParam.signYear" :min="1"></a-input-number>-->
      <span style="margin-right:15px">截止确认月份：</span>
      <a-month-picker placeholder="调整月份" @change="onMonthChange" :value="moment(queryParam.endDate)" :allowClear="false" style="width: 150px"/>
      <a-divider type="vertical" />
      <a-input-search
        placeholder="采购合同号/合同名称"
        v-model="queryParam.inputContent"
        style="width: 270px"
        allow-clear
        :pressEnter="doQuery"
        @search="doQuery"/>
      <a-divider type="vertical" />
      <a-radio-group :value="queryParam.progressFlag" @change="onProgressChange">
        <a-radio :value="0">进度小于100%</a-radio>
        <a-radio :value="1">100%</a-radio>
      </a-radio-group>
      <a-divider type="vertical" />
      <a-button type="primary" icon="search" @click="doQuery">查询</a-button>
      <a-divider type="vertical" />
      <a-button type="primary" icon="plus-circle" @click="addContractProgress">新增进度合同</a-button>
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
      :scroll="{ x: false, y: listScrollHeight }">
      <template slot="rowIndex" slot-scope="text, record, index">
        <span>
          {{ (page.pageNo - 1) * page.pageSize + index + 1 }}
        </span>
      </template>
      <template slot="contractName" slot-scope="text">
        <a-tooltip>
          <template slot="title">
            {{ text }}
          </template>
          {{ text }}
        </a-tooltip>
      </template>
      <template slot="totalAmount" slot-scope="text">
        <template v-if="text > 0">{{ text | AmountFormat }}</template>
      </template>
      <template slot="suppliersText" slot-scope="text">
        <a-tooltip>
          <template slot="title">
            {{ text }}
          </template>
          {{ text }}
        </a-tooltip>
      </template>
      <template slot="progress" slot-scope="text">
        <a-progress
          :stroke-color="{ from: '#108ee9', to: '#87d068',}"
          :percent="parseInt(text * 100)"
          :status="text === 1 ? 'success' : 'active'" />
      </template>
      <template slot="confirmDate" slot-scope="text">
        <span v-if="text">{{moment(text).format('YYYY-MM')}}</span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="doOperateContract('read',record)" v-if="record.progress === 1">查看</a>
        <a @click="doOperateContract('modify',record)" v-else>维护</a>
      </template>
    </a-table>
    <a-drawer
      title="合同执行进度信息"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="1000"
      @close="onProgressDrawerClose"
      :visible="progressDrawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <own-progress-info
        ref="progressInfo"
        :baseInfo="baseInfo"
        v-if="progressDrawerVisible"
        :purchaseContractId="purchaseContractId"
        :operation="operation"
        @refresh="doQuery"
        @changeBtnStatus="changeBtnStatus"></own-progress-info>
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
        <a-button
          v-if="displayed && operation !== 'add'"
          type="primary"
          @click="addProgressToContract"
          style="margin-left: 20px;">新增
        </a-button>
        <a-button
          v-if="displayed"
          type="primary"
          @click="handleSaveProgress"
          :disabled="disabled"
          style="margin-left: 20px;">保存
        </a-button>
        <a-button key="back" style="margin-left: 20px" @click="onProgressDrawerClose">关闭</a-button>
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
import { getOwnPurchaseContractlist, exportPurchaseContract } from '@/api/ownPurchaseContractProgress'
import { OwnProgressInfo } from '@/module'
import { downFile } from '@/utils/util'
import store from '@/store'

export default {
  name: 'OwnPurchaseContractProgressView',
  components: {
    FooterToolBar,
    OwnProgressInfo
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
      queryParam: { pageNo: 1, pageSize: 25, progressFlag: 0, inputContent: '', signYear: undefined, endDate: undefined },
      columns: [
        {
          key: 'rowIndex',
          dataIndex: 'rowIndex',
          align: 'center',
          title: '序号',
          width: '7%',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          key: 'purchaseContractNo',
          dataIndex: 'purchaseContractNo',
          align: 'left',
          title: '采购合同号',
          width: '14%'
        },
        {
          key: 'contractName',
          dataIndex: 'contractName',
          align: 'left',
          title: '合同名称',
          width: '16%',
          scopedSlots: { customRender: 'contractName' },
          ellipsis: true
        },
        {
          key: 'suppliersText',
          dataIndex: 'suppliersText',
          align: 'left',
          title: '对方单位',
          width: '20%',
          ellipsis: true,
          scopedSlots: { customRender: 'suppliersText' }
        },
        {
          key: 'totalAmount',
          dataIndex: 'totalAmount',
          align: 'right',
          title: '合同金额',
          width: '9%',
          scopedSlots: { customRender: 'totalAmount' }
        },
        {
          key: 'progress',
          dataIndex: 'progress',
          align: 'center',
          title: '进度',
          scopedSlots: { customRender: 'progress' },
          width: '16%'
        },
        {
          key: 'confirmDate',
          dataIndex: 'confirmDate',
          align: 'center',
          title: '确认月份',
          scopedSlots: { customRender: 'confirmDate' },
          width: '10%'
        },
        {
          key: 'operation',
          dataIndex: 'operation',
          align: 'center',
          title: '操作',
          width: '8%',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      progressDrawerVisible: false,
      baseInfo: {},
      operation: '',
      displayed: false,
      disabled: false,
      purchaseContractId: 0,
      contractCurrentPage: 1,
      isDownloading: false
    }
  },
  methods: {
    moment,
    onMonthChange (moment) {
      this.queryParam.endDate = moment.endOf('month').format('YYYY-MM-DD').toString()
      this.doQuery()
    },
    doOperateContract (op, record) {
      this.progressDrawerVisible = true
      this.operation = op
      this.selectedRow = record.purchaseContractId
      this.selectedRowInfo = record
      this.purchaseContractId = record.purchaseContractId
      this.baseInfo = { ...record }
      if (op === 'read') {
        this.displayed = false
      } else {
        this.displayed = true
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
    doQuery () {
      this.queryParam.pageNo = 1
      this.getList()
    },
    addContractProgress () {
      this.progressDrawerVisible = true
      this.operation = 'add'
      this.disabled = false
      this.displayed = true
      this.baseInfo = {}
    },
    addProgressToContract () {
      this.$refs.progressInfo.newContractProgress()
    },
    handleSaveProgress () {
      this.$refs.progressInfo.doSaveContractProgress()
    },
    onProgressChange (val) {
      this.queryParam.progressFlag = val.target.value
      this.doQuery()
    },
    onProgressDrawerClose () {
      this.progressDrawerVisible = false
      this.displayed = true
      this.disabled = false
    },
    changeBtnStatus (bool, btn) {
      if (bool) {
        this.disabled = true
        if (btn === 'all') {
          this.displayed = false
        } else {
          this.displayed = true
        }
      } else {
        this.disabled = false
      }
    },
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
          }
        }
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
      console.log(this.queryParam)
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
    // this.queryParam.signYear = moment().year()
    this.queryParam.endDate = moment().endOf('month').format('YYYY-MM-DD').toString()
    this.getList()
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
