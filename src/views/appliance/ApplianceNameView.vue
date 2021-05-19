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
          <a-input-search v-model="queryParam.inputContent" @search="onSearch" allowClear placeholder="物品名称或拼音码搜索" style="width: 200px"></a-input-search>
          <a-divider type="vertical"/>
          <a-checkbox-group  v-model="queryParam.logoutList" :options="options" @change="onLogoutChange"/>
          <a-divider type="vertical"/>
          <a-button type="primary" @click="add">新增</a-button>
        </a-row>
        <a-table :loading="tableLoading"
                 :columns="tableColumns"
                 :dataSource="tableData"
                 :pagination="false"
                 :customRow="tableRowClick"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: tableHeight + 'px' }"
                 :scroll="{x: false, y: tableScrollHeight }"
                 :bordered="false"
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>{{ (page.pageNo - 1) * page.pageSize + index + 1 }}</span>
          </template>
          <template slot="logout" slot-scope="text, record">
            <a-badge :status="text | logoutFilter" :text="text | logoutTextFilter"/>
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
              title="新增名称"
              :closable="false"
              :width="600"
              :bodyStyle="{ padding: '0'}"
              @close="onClose"
              :visible="visible">

    <appliance-name-form ref="applianceNameForm" :visible="visible" :readOnly="readOnly" @onSaveSuccess="onSaveSuccess" @onClose="onClose"></appliance-name-form>

    </a-drawer>
  </a-card>
</template>

<script>
  import FooterToolBar from "@/components/FooterToolbar/FooterToolBar";
  import {getApplianceNameList, saveApplianceName} from "@/api/applianceName";
  import ApplianceNameForm from "@/views/appliance/components/ApplianceNameForm";

  const logoutMap = {
    0: {status: 'success', text: '未注销'},
    1: {status: 'default', text: '已注销'},
  }
  const options = [
    { label: '未注销', value: 0 },
      { label: '已注销', value: 1 },
  ]
  export default {
    name: "ApplianceNameView",
    components: {ApplianceNameForm, FooterToolBar},
    data() {
      return {
        cardHeight: window.innerHeight - 115,
        menuHeight: window.innerHeight - 179,
        tableHeight: window.innerHeight - 260,
        tableScrollHeight: window.innerHeight - 260,
        queryParam: {applianceType: 0, inputContent: '', logoutList: [0,1], pageNo: 1, pageSize: 25},
        page: {pageNo: 1, pageSize: 25, totalCount: 0},
        options,
        menuLoading: false,
        tableLoading: false,
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
            key: 'name',
            dataIndex: 'name',
            title: '物品名称',
            width: '30%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'name' },
          },{
            key: 'pinyin',
            dataIndex: 'pinyin',
            title: '拼音码',
            width: '30%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'pinyin' },
          },{
            key: 'logout',
            dataIndex: 'logout',
            title: '注销标志',
            width: '35%',
            align: 'center',
            className: "center-th-header",
            ellipsis: true,
            scopedSlots: { customRender: 'logout' },
          }
        ],
        visible: false,
        readOnly: false,
      }
    },
    filters: {
      logoutFilter (val) {
        return logoutMap[val].status
      },
      logoutTextFilter (val) {
        return logoutMap[val].text
      },
    },
    created() {
      this.getApplianceNameList()
    },
    methods: {
      getApplianceNameList() {
        if(this.queryParam.logoutList == null || this.queryParam.logoutList == []) {
          this.tableData = []
          return
        }
        getApplianceNameList(this.queryParam).then(res => {
         if(res.code == 200) {
           this.tableData = res.body.items
           this.page.totalCount = res.body.totalCount
         }
        })
      },

      onSearch() {
        this.page.pageNo = 1
        this.queryParam.pageNo = 1;
        this.getApplianceNameList()
      },
      onLogoutChange(statusList) {
        this.queryParam.statusList = statusList
        this.page.pageNo = 1
        this.queryParam.pageNo = 1;
        this.getApplianceNameList()
      },
      onPageChange(pageNo, pageSize) {
        this.queryParam.pageNo = pageNo
        this.queryParam.pageSize = pageSize
        this.getApplianceNameList()
      },

      add() {
        this.visible = true
        this.readOnly = false
        const record = {
          id: null,
          applianceType: this.queryParam.applianceType == 0 ? 1 : this.queryParam.applianceType,
          name: null,
          standards: null,
          pinyin: null,
          logout: 0,
        }
        this.$nextTick(() => {
          this.$refs.applianceNameForm.setForm(record)
        })
      },
      onClose() {
        this.visible = false
        this.$refs.applianceNameForm.resetForm()
      },
      onSaveSuccess() {
        this.$message.success("保存成功！")
        this.queryParam.inputContent = ''
        this.queryParam.logoutList = [0,1]
        this.page.pageNo = 1
        this.queryParam.pageNo = 1
        this.getApplianceNameList()
      },

      setRowClassName(record) {
        return this.queryParam.applianceType === record.id ? 'selectRowStyle' : ''
      },
      menuRowClick(record) {
        return {
          on: {
            click: () => {
              this.queryParam.applianceType = record.id
              this.queryParam.inputContent = ''
              this.queryParam.logoutList = [0,1]
              this.page.pageNo = 1
              this.queryParam.pageNo = 1
              this.getApplianceNameList()
            }
          }
        }
      },
      tableRowClick(record) {
        return {
          on: {
            click: () => {
              this.visible = true
              this.readOnly = true
              this.$nextTick(() => {
                this.$refs.applianceNameForm.setForm({...record})
              })
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