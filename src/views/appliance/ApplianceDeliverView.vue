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
          <span>领用日期：</span>
          <a-range-picker v-model="useDate" @change="onDateChange" style="width: 220px"/>
          <a-divider type="vertical" />
          <span>名称：</span>
          <a-input-search v-model="queryParam.inputContent" @search="getApplianceUseList" allowClear placeholder="物品名称或拼音码搜索" style="width: 220px"></a-input-search>
          <a-divider type="vertical" />
          <span>
            <a @click="toggleAdvanced">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>

        </a-row>
        <a-row v-if="advanced" style="padding-bottom: 10px">
          <span>领用部门：</span>
          <dept-select v-model="queryParam.useDept" @change="onDeptChange" ref="deptSelect" style="width: 220px"></dept-select>
          <a-divider type="vertical" />
          <span>领用人：</span>
          <person-select v-model="queryParam.userId" :allow-clear="true" @setPerson="setPerson" ref="personSelect"></person-select>
        </a-row>
        <a-table :loading="tableLoading"
                 :columns="tableColumns"
                 :dataSource="tableData"
                 :pagination="false"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: tableHeight + 'px'}"
                 :scroll="{x: false, y: tableScrollHeight }"
                 :bordered="false"
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</span>
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

  </a-card>
</template>

<script>
  import DeptSelect from "@/module/Dept/DeptSelect";
  import PersonSelect from "@/module/Person/PersonSelect/PersonSelect";
  import FooterToolBar from "@/components/FooterToolbar/FooterToolBar";
  import {getApplianceUseList} from "@/api/applianceUse";


  export default {
    name: "ApplianceDeliverView",
    components: {DeptSelect, PersonSelect, FooterToolBar},
    data() {
      return {
        cardHeight: window.innerHeight - 115,
        menuHeight: window.innerHeight - 179,
        tableHeight: window.innerHeight - 260,
        tableScrollHeight: window.innerHeight - 260,
        queryParam: {type: 0, userId: '', useDept: '', inputContent: '', startDateStr: null, endDateStr: null, pageNo: 1, pageSize: 25},
        page: {pageNo: 1, pageSize: 25, totalCount: 0},
        advanced: false,
        menuLoading: false,
        tableLoading: false,
        useDate: [],
        menuData: [
          {id: 0, name: '全部'},
          {id: 1, name: '办公用品'},
          {id: 2, name: '礼品'},
          {id: 3, name: '饮用水'},
        ],
        tableData: [],
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
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'rowIndex' },
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
            width: '5%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'standards' },
          },{
            key: 'quantity',
            dataIndex: 'quantity',
            title: '数量',
            width: '9%',
            align: 'right',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'quantity' },
          },{
            key: 'unitPrice',
            dataIndex: 'unitPrice',
            title: '单价  ',
            width: '9%',
            align: 'right',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'unitPrice' },
          },{
            key: 'money',
            dataIndex: 'money',
            title: '金额',
            width: '9%',
            align: 'right',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'money' },
          },{
            key: 'userName',
            dataIndex: 'userName',
            title: '领用人',
            width: '8%',
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
            width: '20%',
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
      this.getApplianceUseList()
    },
    methods: {
      getApplianceUseList() {
        getApplianceUseList(this.queryParam).then(res => {
          this.tableData = res.body.items
          this.page.totalCount=res.body.totalCount
        })
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
        this.getApplianceUseList()
      },
      onDeptChange(value) {
        this.queryParam.useDept = value
        this.page.pageNo = 1
        this.queryParam.pageNo = 1
        this.getApplianceUseList()
      },
      setPerson(record) {
        this.queryParam.userId = record.personId
        this.page.pageNo = 1
        this.queryParam.pageNo = 1
        this.getApplianceUseList()
      },
      onPageChange(pageNo, pageSize) {
        this.queryParam.pageNo = pageNo
        this.queryParam.pageSize = pageSize
        this.getApplianceUseList()
      },

      toggleAdvanced () {
        this.advanced = !this.advanced
        if (this.advanced) {
          this.tableScrollHeight = window.innerHeight - 302
        } else {
          this.tableScrollHeight = window.innerHeight - 260
        }
      },
      setRowClassName(record) {
        return this.queryParam.type === record.id ? 'selectRowStyle' : ''
      },
      menuRowClick(record) {
        return {
          on: {
            click: () => {
              this.queryParam.type = record.id
              this.useDate = []
              if(this.advanced) {
                this.$nextTick(()=>{
                  this.$refs.personSelect.handleClear()
                  this.$refs.deptSelect.getCurrent(null, null)
                })
              }
              this.queryParam.startDateStr = ''
              this.queryParam.endDateStr = ''
              this.queryParam.inputContent = ''
              this.queryParam.userId = ''
              this.queryParam.useDept = ''
              this.page.pageNo = 1
              this.queryParam.pageNo = 1
              this.getApplianceUseList()
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