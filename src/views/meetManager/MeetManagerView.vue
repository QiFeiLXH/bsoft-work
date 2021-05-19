<template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">
    <a-row>
      <a-col :span="10" style="padding: 10px 10px 0 0 ">
        <a-row style="padding-bottom: 10px">
          <a-month-picker placeholder="请选择年月" @change="onMonthChange" :value="moment(meetQueryParam.month)" :allowClear="false" style="width: 150px"/>
          <a-divider type="vertical" />
          <a-button type="primary" icon="search" @click="getMeetList"></a-button>
          <a-button type="primary"  @click="createMeet" style="float: right">新增会议</a-button>
        </a-row>
        <a-table :loading="meetLoading"
                 :columns="meetColumns"
                 :dataSource="meetData"
                 :pagination="false"
                 :customRow="meetRowClick"
                 :rowClassName="setRowClassName"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: meetHeight + 'px', margin: 0,}"
                 :bordered="false"
                 size="small">
          <template slot="name" slot-scope="text, record, index">
            <span>{{ "("+record.remark + ")" + record.name + "(" + record.personCount + ")"}}</span>
          </template>
          <template slot="flag" slot-scope="text, record, index">
            <a-switch checked-children="是" un-checked-children="否" :checked="record.flag===1" :disabled="true"/>
          </template>
          <template slot="action" slot-scope="text, record">
            <template>
              <a @click="updateMeet(record)">修改</a>
            </template>
          </template>
        </a-table>
        <div style="text-align:right;margin: 5px 0 5px 0">
          <a-pagination
            size="small"
            v-model="meetPage.pageNo"
            :pageSize.sync="meetPage.pageSize"
            :total="meetPage.totalCount"
            @change="handleMeetPageChange"
            :showTotal="total => `共 ${total} 条`"/>
        </div>
      </a-col>
      <a-col :span="14" style="padding: 10px 10px 0 0 ">
        <a-row style="padding-bottom: 10px">
          <a-input-search v-model="personQueryParam.input" @search="getPersonList" allowClear placeholder="姓名、手机号搜索" style="width: 200px"></a-input-search>
          <a-divider type="vertical" />
          <a-button type="primary"  @click="createPerson">新增</a-button>
          <a-divider type="vertical" />
          <a-upload :customRequest="doUploadData" :showUploadList="false" :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
<!--            <a-button type="primary" icon="upload" :loading="uploading" v-action:1>导入</a-button>-->
            <a-button type="primary" icon="upload" :loading="uploading">导入名单</a-button>
          </a-upload>

        </a-row>
        <a-row style="padding-bottom: 10px; height: 42px" v-if="showImportResult">
          <span>导入结果：{{importResultMsg}}</span>
          <a-button type="danger" icon="file-excel" @click="doDownloadErrorData" :loading="errorDownloading" v-if="haveError" >导出</a-button>
          <a-icon type="close-circle" @click="onImportResultClose"  style="margin-left:20px"></a-icon>
        </a-row>
        <a-table class="person"
                 ref="personTable"
                 :loading="personLoading"
                 :columns="personColumns"
                 :dataSource="personData"
                 :pagination="false"
                 :customRow="personRowClick"
                 :rowKey="(record) => record.id"
                 :bodyStyle="{ height: personHeight + 'px' }"
                 :scroll="{x: false, y: personScrollHeight }"
                 :bordered="false"
                 size="small">
          <template slot="rowIndex" slot-scope="text, record, index">
            <span>{{ (personPage.pageNo - 1) * personPage.pageSize + index + 1 }}</span>
          </template>
          <template slot="action" slot-scope="text, record">
            <template>
              <a @click="updatePerson(record)">修改</a>
            </template>
            <a-divider type="vertical" />
            <template>
              <a @click="deletePerson(record)">删除</a>
            </template>
          </template>
        </a-table>
        <div style="text-align:right;margin: 5px 0 5px 0">
          <a-pagination
            size="small"
            :pageSize.sync="personPage.pageSize"
            v-model="personPage.pageNo"
            :total="personPage.totalCount"
            @change="handlePersonPageChange"
            :showTotal="total => `共 ${total} 条`"/>
        </div>
      </a-col>
    </a-row>
    <a-drawer ref="meetDrawer"
              placement="right"
              title="会议信息"
              :closable="false"
              :width="600"
              :bodyStyle="{ padding: '0'}"
              @close="onMeetClose"
              :visible="showMeetForm">
      <MeetInfoForm ref="meetForm" @onMeetSaveSuccess="onMeetSaveSuccess"></MeetInfoForm>
      <div :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
        <a-button type="default" style="margin-right: 20px" @click="onMeetClose">取消</a-button>
        <a-button type="primary" :loading="meetSaveLoading" @click="onMeetSave">保存</a-button>
      </div>
    </a-drawer>
    <a-drawer ref="personDrawer"
              placement="right"
              title="会议人员信息"
              :closable="false"
              :width="600"
              :bodyStyle="{ padding: '0'}"
              @close="onPersonClose"
              :visible="showPersonForm">
      <MeetPersonForm ref="personForm" @onMeetPersonSaveSuccess="onMeetPersonSaveSuccess"></MeetPersonForm>
      <div :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
        <a-button type="default" style="margin-right: 20px" @click="onPersonClose">取消</a-button>
        <a-button type="primary" :loading="personSaveLoading" @click="onPersonSave">保存</a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import {downFile} from "@/utils/util";
  import store from "@/store";
  import FooterToolBar from "@/components/FooterToolbar/FooterToolBar";
  import MeetInfoForm from "@/module/MeetManager/MeetInfoForm";
  import MeetPersonForm from "@/module/MeetManager/MeetPersonForm";
  import {
    getMeetList,
    getMeetPersonList,
    importData,
    exportErrorData,
    deletePerson
  } from "@/api/meetmanager";
  const statusMap = {
    0: {status: 'default', text: '未发放'},
    1: {status: 'success', text: '已发放'}
  }
    export default {
      name: "MeetManagerView",
      components: {MeetInfoForm,FooterToolBar,MeetPersonForm},
      data(){
          return{
            fileList:[],uploadTypes: ['xls', 'xlsx'],errorDownloading:false,
            showImportResult: false, importResultMsg: '', haveError: true,
            uploading:false,
            meetSaveLoading:false,personSaveLoading:false,
            showMeetForm:false,showPersonForm:false,
            meetPage: {
              pageSize: 25,
              pageNo: 1,
              totalCount: 0
            },
            personPage: {
              pageSize: 25,
              pageNo: 1,
              totalCount: 0
            },
            personQueryParam:{pageNo:1,pageSize:25,input:''},
            meetQueryParam:{pageNo:1,pageSize:25,month:''},
            cardHeight: window.innerHeight - 115,
            meetHeight: window.innerHeight - 210,
            personHeight: window.innerHeight - 248,
            personScrollHeight: window.innerHeight - 248,
            meetLoading: false,personLoading:false,
            meetData:[],
            meetColumns:[
              {
                key: 'name',
                width: '60%',
                dataIndex: 'name',
                title: '会议名称',
                ellipsis: true,
                scopedSlots: { customRender: 'name' },
              },{
                key: 'flag',
                dataIndex: 'flag',
                title: '状态',
                width: '20%',
                align: 'center',
                className: "center-th-header",
                scopedSlots: { customRender: 'flag' },
              },{
                key: 'action',
                dataIndex: 'action',
                title: '操作',
                width: '10%',
                align: 'center',
                className: "center-th-header",
                scopedSlots: { customRender: 'action' },
              }
            ],
            personData:[],
            personColumns:[ {
              key: 'rowIndex',
              dataIndex: 'rowIndex',
              title: '序号',
              width: '5%',
              align: 'center',
              className: "center-th-header",
              ellipsis: true,
              scopedSlots: { customRender: 'rowIndex' },
            },{
              key: 'personName',
              dataIndex: 'personName',
              title: '姓名',
              width: '20%',
              align: 'center',
              className: "center-th-header",
            },{
              key: 'mobileNo',
              dataIndex: 'mobileNo',
              title: '手机号',
              width: '20%',
              align: 'center',
              className: "center-th-header",
            },{
              key: 'action',
              dataIndex: 'action',
              title: '操作',
              width: '20%',
              align: 'center',
              className: "center-th-header",
              scopedSlots: { customRender: 'action' },
            }]
          }
      },
      mounted() {
        this.getMeetList();
        this.meetQueryParam.month = moment().format('YYYY-MM').toString()
      },
      filters: {
        statusFilter (val) {
          return statusMap[val].status
        },
        statusTextFilter (val) {
          return statusMap[val].text
        },
      },
      methods:{
        onMonthChange (moment) {
          this.meetQueryParam.month = moment.format('YYYY-MM').toString()
          this.getMeetList();
          this.personQueryParam.meetId = 0
          this.getPersonList();
        },
        moment,
        createMeet(){
          this.showMeetForm = true
          this.$nextTick(() => {
            this.$refs.meetForm.resetForm()
          })
        },
        createPerson(){
          if(this.personQueryParam.meetId == null){
            this.$message.error('请选择参会会议')
            return
          }
          this.showPersonForm = true
          this.$nextTick(() => {
            this.$refs.personForm.resetForm(this.personQueryParam.meetId)
          })
        },
        updatePerson(record){
          this.showPersonForm = true
          this.$nextTick(() => {
            this.$refs.personForm.setForm(record)
          })
        },
        deletePerson(record){
          const me = this
          this.$confirm({
            title: '是否确认删除该参会人员?',
            // 确认 与 关闭位置对调
            cancelText: '确定',
            okText: '关闭',
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
              const param = { id: record.id }
              deletePerson(param)
                .then(res => {
                  if (res.code === 200) {
                    me.$message.success('删除成功！')
                    me.rowSelected = ''
                    me.rowSelectedInfo = {}
                    setTimeout(() => {
                      me.getPersonList();
                      me.getMeetList();
                    }, 100)
                  }
                })
            }
          })
        },
        doDownloadErrorData(){
          const params = {}
          //Object.assign(params, this.queryParam)
          params.menuId = this.$route.meta.id // 菜单id
          params.context = this.$route.meta.title // 菜单名称
          params.personId = store.getters.userInfo.personId // 用户id
          params.system = 20 // 系统
          this.errorDownloading = true
          exportErrorData(params).then(res => {
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
            this.errorDownloading = false
          }).catch(error => {
            console.log(error)
            this.errorDownloading = false
          })
        },
        doUploadData(){
          if(this.personQueryParam.meetId == null){
            this.$message.error('请选择参会会议')
            return
          }
          this.uploading = true
          const { fileList } = this
          const formData = new FormData()
          fileList.forEach(file => {
            formData.append('file', file)
            formData.append('meetId', this.personQueryParam.meetId)
          })
          importData(formData).then(res => {
            if (res.code === 200) {
              if (res.body.failCount > 0) {
                this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败' + res.body.failCount + '条数据，可下载导入失败数据！'
                this.haveError = true
              } else {
                this.importResultMsg = '成功导入数据' + res.body.successCount + '条数据，导入失败0条数据！'
                this.haveError = false
              }
              this.showImportResult = true
              this.personHeight = window.innerHeight - 288
              this.personScrollHeight = window.innerHeight - 288
              this.getPersonList()
            }
            this.uploading = false
          })
        },
        onImportResultClose() {
          this.showImportResult = false
          this.haveError = false
          this.importResultMsg = ''
          this.personHeight = window.innerHeight - 248
          this.personScrollHeight = window.innerHeight - 248
        },
        handleRemove (file) {
          const index = this.fileList.indexOf(file)
          const newFileList = this.fileList.slice()
          newFileList.splice(index, 1)
          this.fileList = newFileList
        },
        beforeUpload (file) {
          const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)
          const index = this.uploadTypes.findIndex(item => item === suffix)
          if (index === -1) {
            this.$message.error('文件格式不对!')
            return false
          } else {
            this.fileList = [file]
            return true
          }
        },
        getMeetList(){
          this.meetLoading = true;
          getMeetList(this.meetQueryParam).then(res => {
            if(res.code === 200){
              this.meetLoading = false
              this.meetData = res.body.items
              this.meetPage.totalCount=res.body.totalCount
            }
          })
        },
        refresh(){
          this.queryParam.pageNo = 1
          this.getPersonList()
        },
        getPersonList(){
          this.personLoading = true
          getMeetPersonList(this.personQueryParam).then(res => {
            if(res.code === 200){
              this.personLoading = false
              this.personData = res.body.items
              this.personPage.totalCount=res.body.totalCount
            }
          })
        },
        setRowClassName(record) {
          return this.personQueryParam.meetId === record.id ? 'selectRowStyle' : ''
        },
        meetRowClick(record) {
          return {
            on: {
              click: () => {
                this.personQueryParam.meetId = record.id
                this.personQueryParam.input = ''
                this.personPage.pageNo = 1
                this.personQueryParam.pageNo = 1;
                this.getPersonList();
              },
              dblclick: () => {
                // this.personQueryParam.meetId = record.id
                // this.showMeetForm = true
                // this.$nextTick(() => {
                //   this.$refs.meetForm.setForm(record)
                // })
              }
            }
          }
        },
        updateMeet(record){
          this.personQueryParam.meetId = record.id
          this.showMeetForm = true
          this.$nextTick(() => {
            this.$refs.meetForm.setForm(record)
          })
        },
        handleMeetPageChange(pageNo, pageSize) {
          this.meetQueryParam.pageNo = pageNo
          this.meetQueryParam.pageSize = pageSize
          this.getMeetList()
        },
        handlePersonPageChange(pageNo, pageSize) {
          this.personQueryParam.pageNo = pageNo
          this.personQueryParam.pageSize = pageSize
          this.getPersonList()
        },
        personRowClick(record) {
          return {
            on: {
              // dblclick: () => {
              //   this.showEntryFrom = true
              //   this.currentRecord = JSON.parse(JSON.stringify(record));
              //   this.$nextTick(()=>{
              //     this.$refs.applianceForm.setForm(this.currentRecord)
              //   })
              // }
            }
          }
        },
        onMeetClose(){
          this.showMeetForm = false
        },
        onPersonClose(){
          this.showPersonForm = false
        },
        onMeetSave(){
          this.$refs.meetForm.save()
        },
        onPersonSave(){
          this.$refs.personForm.save()
        },
        onMeetSaveSuccess(){
          this.showMeetForm = false
          this.meetPage.pageNo = 1
          this.meetQueryParam.pageNo = 1
          this.$refs.meetForm.resetForm()
          this.getMeetList()
        },
        onMeetPersonSaveSuccess(){
          this.showPersonForm = false
          this.personPage.pageNo = 1
          this.personQueryParam.pageNo = 1
          this.$refs.personForm.resetForm()
          this.getPersonList()
          this.getMeetList()
        }
      }
    }
</script>

<style scoped>
  /deep/ .ant-table-placeholder {
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
  /deep/ .selectRowStyle {
    background-color: #d5fffe;
  }
  /deep/ .ant-switch-loading, .ant-switch-disabled {
    cursor: not-allowed;
     opacity: 1;
  }
</style>