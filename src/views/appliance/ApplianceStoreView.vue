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
                 :rowKey="(record) => record.type"
                 :bodyStyle="{ height: menuHeight + 'px', margin: 0,}"
                 :bordered="false"
                 size="small">
        </a-table>
      </a-col>

      <a-col :span="21">
        <a-row style="padding: 10px 0">
          <span>名称：</span>
          <a-input-search v-model="queryParam.inputContent" @search="getApplianceCountList" allowClear placeholder="物品名称或拼音码搜索" style="width: 200px"></a-input-search>
        </a-row>
        <a-table :loading="tableLoading"
                 :columns="tableColumns"
                 :dataSource="tableData"
                 :pagination="false"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 :scroll="{x: false, y: tableScrollHeight }"
                 :bordered="false"
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</span>
          </template>
          <template slot="unitPrice" slot-scope="text, record, index">
            {{ record.unitPrice.toFixed(2) | NumberFormat }}
          </template>
          <template slot="surplusQuantity" slot-scope="text, record, index">
            <div @click="useDetail(record)" style="text-align: center;cursor:pointer;">
              <span v-if="record.surplusQuantity >= 20" style="font-weight: bold">{{ text }}</span>
              <span v-if="record.surplusQuantity < 20" style="font-weight: bold; color: #F5222D">{{ text }}</span>
            </div>
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
              title="领用情况"
              :closable="false"
              :width="1000"
              :bodyStyle="{ padding: '0'}"
              @close="onUseDetailClose"
              :visible="showUseList">
      <a-card :bodyStyle="{ height: tableHeight + 200 +  'px' }">
        <a-table :columns="useColumns"
                 :dataSource="useData"
                 :pagination="false"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: tableHeight + 150 + 'px' }"
                 :bordered="false"
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="typeName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="nameName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="standards" slot-scope="text, record, index">
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
          <template slot="userName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="useDeptName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="projectName" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="useDate" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </a-table>
      </a-card>
      <div :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
        <a-button type="default" style="" @click="onUseDetailClose">取消</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import FooterToolBar from "@/components/FooterToolbar/FooterToolBar";
  import {getApplianceCountList, getApplianceUseDetails} from "@/api/applianceStore";

  export default {
    name: "ApplianceDeliverView",
    components: {FooterToolBar},
    data() {
      return {
        cardHeight: window.innerHeight - 115,
        menuHeight: window.innerHeight - 179,
        tableHeight: window.innerHeight - 260,
        tableScrollHeight: window.innerHeight - 260,
        queryParam: {type:0, inputContent: '', pageNo: 1, pageSize: 25},
        page: {pageNo: 1, pageSize: 25, totalCount: 0},
        menuLoading: false,
        tableLoading: false,
        showUseList: false,
        menuData: [
          {id: 0, name: '全部'},
          {id: 1, name: '办公用品'},
          {id: 2, name: '礼品'},
          {id: 3, name: '饮用水'},
        ],
        tableData: [],
        useData: [],
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
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'rowIndex' },
          },{
            key: 'typeName',
            dataIndex: 'typeName',
            title: '物品类别',
            width: '20%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'typeName' },
          },{
            key: 'nameName',
            dataIndex: 'nameName',
            title: '物品名称',
            width: '25%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'nameName' },
          },{
            key: 'standards',
            dataIndex: 'standards',
            title: '规格',
            width: '20%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'standards' },
          },{
            key: 'unitPrice',
            dataIndex: 'unitPrice',
            title: '单价',
            width: '15%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'unitPrice' },
          },{
            key: 'surplusQuantity',
            dataIndex: 'surplusQuantity',
            title: '数量',
            width: '15%',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'surplusQuantity' },
          }
        ],
        useColumns: [
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
          },{
            key: 'quantity',
            dataIndex: 'quantity',
            title: '数量',
            width: '5%',
            align: 'right',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'quantity' },
          },{
            key: 'userName',
            dataIndex: 'userName',
            title: '领用人',
            width: '10%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'userName' },
          },{
            key: 'useDeptName',
            dataIndex: 'useDeptName',
            title: '部门',
            width: '15%',
            align: 'left',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'useDeptName' },
          },{
            key: 'projectName',
            width: '15%',
            dataIndex: 'projectName',
            title: '归属项目',
            align: 'left',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'projectName' },
          },{
            key: 'useDate',
            width: '10%',
            dataIndex: 'useDate',
            title: '领用日期',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'useDate' },
          }
        ],
      }
    },
    created() {
      this.getApplianceCountList()
    },
    methods: {
      getApplianceCountList() {
        getApplianceCountList(this.queryParam).then(res => {
          this.tableData = res.body.items
          this.page.totalCount=res.body.totalCount
        })
      },
      getApplianceUseDetails(stockId) {
        this.useData = []
        const params = {
          'stockId': stockId
        }
        getApplianceUseDetails(params).then(res => {
          this.useData = res.body
        })
      },

      onPageChange(pageNo, pageSize) {
        this.queryParam.pageNo = pageNo
        this.queryParam.pageSize = pageSize
        this.getApplianceCountList()
      },
      useDetail(record) {
        this.showUseList = true
        this.getApplianceUseDetails(record.id)
      },
      onUseDetailClose() {
        this.showUseList = false
      },
      setRowClassName(record) {
        return this.queryParam.type === record.id ? 'selectRowStyle' : ''
      },
      menuRowClick(record) {
        return {
          on: {
            click: () => {
              this.queryParam.type = record.id
              this.queryParam.inputContent = ''
              this.page.pageNo = 1
              this.queryParam.pageNo = 1
              this.getApplianceCountList()
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