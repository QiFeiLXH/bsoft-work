<template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">
    <a-row>
      <!--导航栏-->
      <a-col :span="4">
        <a-table
          size="small"
          :columns="columns"
          :data-source="resMenuData"
          :pagination="false"
          :bordered="false"
          :rowKey="(record) => record.key + record.councilName"
          :customRow="menuHandleCheck"
          :rowClassName="setRowClassName"
        >
          <template slot="councilName" slot-scope="text, record, index">
            <span>{{ record.councilName +'(' + (record.total?record.total:0) +")"}} </span>
          </template>
        </a-table>
      </a-col>
      <!--主表-->
      <a-col :span="20">
        <a-row style="padding: 10px">
          <a-input-search v-model="queryCnd.inputContent" @search="onSearch" style="width: 180px"></a-input-search>
          <a-divider type="vertical"/>
          <a-button type="primary" @click="onSearch">查询</a-button>
        </a-row>
        <a-row style="padding: 10px">
          <a-range-picker v-model="searchDate" @change="onDateChange"></a-range-picker>
          <a-divider type="vertical"/>
          <a-radio-group v-model="queryCnd.readStatus" @change="onChange">
            <a-radio :value="0">
              未阅读
            </a-radio>
            <a-radio :value="1">
              已阅
            </a-radio>
          </a-radio-group>
        </a-row>
        <!-- 表单 -->
        <a-row>
          <a-table :loading="tableLoading"
                   :columns="tableColumns"
                   :dataSource="resData"
                   :pagination="false"
                   :rowKey="(record) => record.id"
                   :bodyStyle="{ height: tableHeight + 'px'}"
                   :scroll="{x: false, y: tableScrollHeight }"
                   :bordered="false"
                   size="small">
            <template slot="rowIndex" slot-scope="text, record, index">
              <span>{{ (personPage.current - 1) * personPage.pageSize + index + 1 }}</span>
            </template>
            <template slot="coverId" slot-scope="text, record, index">
              <a v-if="record.coverId">封皮</a>
            </template>
            <template slot="deadlineDate" slot-scope="text, record, index">
              <a v-if="record.deadLineDateType===1" style="color: black">{{text}}}</a>
              <a v-if="record.deadLineDateType===2" style="color: gold">剩余7天</a>
              <a v-if="record.deadLineDateType===3" style="color: red">剩余4天</a>
            </template>
          </a-table>


        </a-row>
      </a-col>
    </a-row>

    <footer-tool-bar>
      <a-pagination :disabled="tableLoading"
                    :total="personPage.totalCount"
                    :pageSize.sync="personPage.pageSize"
                    v-model="personPage.current"
                    @change="handlePersonPageChange"
                    style="margin-top: 10px"/>
    </footer-tool-bar>
  </a-card>
</template>

<script>
import {getManagerGroup, getPolicyList} from "@/api/proposal";
import FooterToolBar from "@/components/FooterToolbar/FooterToolBar";
import PersonSelect from "@/module/Person/PersonSelect/PersonSelect";
import MemoryDeptSelect from "@/components/MemorySelect/MemoryDeptSelect";

const columns = [
  {
    title: '委员会',
    key: 'key',
    dataIndex: 'councilName',
    width: '100%',
    scopedSlots: {customRender: 'councilName'},
  },
];
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

export default {
  name: "ProposalReadListView",
  components: {MemoryDeptSelect, PersonSelect, FooterToolBar},
  data() {
    return {

      columns,
      rowSelection,
      expandedRowKeys: [],
      cardHeight: window.innerHeight - 115,
      menuHeight: window.innerHeight - 179,
      tableHeight: window.innerHeight - 260,
      tableScrollHeight: window.innerHeight - 260,
      tableLoading: false,
      Date: [],
      selectId: '',
      resData: [],
      resMenuData:[],
      queryCnd: {
        inputContent: '',
        status: null,
        current: 1,
        pageSize: 5,
        startTime: '',
        endTime: '',
        readStatus: 1,
        personId:'',
        councilId:'',
      },
      searchDate: [],
      personPage: {
        pageSize: 5,
        current: 1,
        totalCount: 0
      },
      tableColumns: [
        {
          key: 'rowIndex',
          dataIndex: 'rowIndex',
          title: '序号',
          width: '5%',
          align: 'center',
          className: "center-th-header",
          ellipsis: true,
          scopedSlots: {customRender: 'rowIndex'},
        }, {
          key: 'title',
          dataIndex: 'title',
          title: '标题',
          width: '10%',
        }, {
          key: 'councilName',
          dataIndex: 'councilName',
          title: '所属委员会',
          width: '5%',
        }, {
          key: 'deadlineDate',
          dataIndex: 'deadlineDate',
          title: '阅读截止时间',
          width: '9%',
          scopedSlots: {customRender: 'deadlineDate'},
        }, {
          key: 'coverId',
          dataIndex: 'coverId',
          title: '  ',
          width: '9%',
          scopedSlots: {customRender: 'coverId'},
        }]
    };
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val);
    },
  },

  methods: {
    setRowClassName(record){
      return record.councilId==this.selectId ? 'clickRowStyle' :''
    },
    menuHandleCheck(record,index){
      return{
        on:{
          click:(event)=>{
            if (record.key===1 || record.key===2){
              return
            }
            this.selectId = record.councilId
            console.log(record.councilId)
            console.log(this.selectId)
            this.queryCnd.councilId=record.councilId
            this.queryCnd.current=1
            this.initTableData()
          }
        }
      }
    },
    personChange(personId, personData) {
      console.log(personId)
      console.log(personData)
    },
    onSearch() {
      this.initTableData()
    },
    onDateChange(date, dateStr) {
      this.queryCnd.startTime = dateStr[0]
      this.queryCnd.endTime = dateStr[1]
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    onChange(e) {
      console.log('value', e);
    },
    initTableData() {

      getPolicyList(this.queryCnd).then(res => {
        if (res.code === 200) {
          this.resData = res.body.items
          this.personPage.totalCount = res.body.totalCount
          this.resData.forEach(item => {
              item['deadLineDateType'] = this.diffTime(item.deadlineDate)

            }
          )
          console.log(this.resData)

        }
      })
      getManagerGroup(this.queryCnd).then(res=>{
        if (res.code === 200) {
         this.resMenuData=res.body
          console.log(this.resMenuData)
        }
      })
    },
    handlePersonPageChange(current, pageSize) {
      console.log('current', current);
      console.log('pageSize', pageSize);
      this.queryCnd.current = current
      this.queryCnd.pageSize = pageSize
      this.initTableData()
    },
    diffTime(deadDate) {
      const deadTime = new Date(deadDate).getTime();
      const now = new Date().getTime();
      const diffTime = deadTime - now;
      const minute = 1000 * 60;
      const hour = minute * 60;
      const day = hour * 24;
      const dayC = diffTime / day;
      if (dayC > 10) {
        return 1
      } else if (dayC > 5 && dayC < 10) {
        return 2
      } else if (dayC < 5) {
        return 3
      }

    },

  },
  mounted() {
    this.initTableData()
  },
}
</script>

<style scoped>
/deep/ .clickRowStyle {
  background-color: #e8f7ff;
  color: #1890FF
}
</style>