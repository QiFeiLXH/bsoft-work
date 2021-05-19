 <template>
  <a-card :bordered="false" :bodyStyle="{ height: cardHeight + 'px', padding: '0px 10px'}">
    <a-row>
      <a-col :span="12">
        <span>阅读人员分组</span>
        <a-row style="padding: 10px 0;">

          <a-input-search style="width: 180px" v-model="queryManagerGroupListParam.councilName" @search="onSearch" placeholder="组名称">
          </a-input-search>
          <a-divider type="vertical"/>
          <a-radio-group @change="onIsCancelChange" v-model="queryManagerGroupListParam.isCancel">
            <a-radio :value="0" >未注销</a-radio>
            <a-radio :value="1" >已注销</a-radio>
          </a-radio-group>
        </a-row>
        <a-table :columns="councilGroupColumns"
                 :data-source="councilGroupData"
                 :scroll="{x: false, y: tableScrollHeight }"
                 :body-style="{height: tableHeight + 'px'}"
                 :rowKey="(record) => record.councilId"
                 :pagination="false"
                 :customRow="onClickCouncilGroupTableRow"
                 :rowClassName="setRowClassName"
                 ref="councilGroupTable"
                 size="small"
                 v-watermark
        >
          <template slot="councilGroupRowIndex" slot-scope="text, record, index">
                    <span>
                      {{ index + 1 }}
                    </span>
          </template>
          <template slot="councilName" slot-scope="text, record">
            <template v-if="(record.isNew && !readOnly)">
              <a-input placeholder="新增组名称" style="width: 100px"  @blur="councilRowChange(record)" v-model="record.councilName"></a-input>
            </template>
            <template v-else-if="(record.isEdit && !readOnly)">
              <a-input placeholder="修改组名称" style="width: 100px" @blur="councilRowChange(record)" v-model="record.councilName"></a-input>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="type" slot-scope="text, record">
            <template v-if="(record.isNew && !readOnly)">
              <a-select  style="width: 90px" @change="councilRowChange(record)" v-model="record.type">
                <a-select-option :value="1">
                  决策类
                </a-select-option>
                <a-select-option :value="2">
                  提案类
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="(record.isEdit && !readOnly)">
              <a-select style="width: 90px" @change="councilRowChange(record)" v-model="record.type">
                <a-select-option :value="1">
                  决策类
                </a-select-option>
                <a-select-option :value="2">
                  提案类
                </a-select-option>
              </a-select>
            </template>
            <template v-else>
              {{ text === 1?"决策类":"提案类"}}
            </template>
          </template>
          <template slot="councilGroupOperation" slot-scope="text, record">
            <template v-if="record.isNew">
              <a @click="doRemoveCouncilGroup(record)">删除</a>
            </template>
            <template v-else-if="record.isEdit">
              <a @click="notDoEditCouncilGroup(record)">取消修改</a>
            </template>
            <template v-else-if="record.isCancel === 1">
              <a @click="doEditCouncilGroup(record)">修改</a>
            </template>
            <template v-else>
              <a @click="doEditCouncilGroup(record)">修改</a>
              <a-divider type="vertical" />
              <a @click="cancelCouncilGroup(record)">注销</a>
            </template>
          </template>
          <template slot="footer">
            <a-row>
              <a-col>
                <div style="text-align: center">
                  <a-button @click="doAddCouncilGroup">新增</a-button>
                  <a-divider type="vertical"/>
                  <a-button @click="doSaveCouncilGroup">保存</a-button>
                </div>
              </a-col>
            </a-row>
          </template>
        </a-table>
      </a-col>

      <a-col :span="12">
        <span >骨干成员组-成员名单</span><br>
<!--        <person-select :allow-clear="true" @change="personChange"></person-select>-->
<!--        <memory-dept-select :with="100" @change="deptChange"> </memory-dept-select>-->

        <a-row style="padding: 10px 0">
          <a-input-search style="width: 180px" v-model="queryManagerListParam.personName" @search="onMemberSearch" placeholder="成员名称">
          </a-input-search>
        </a-row>
        <a-table :columns="memberColumns"
                 :data-source="memberData"
                 :body-style="{height: tableHeight + 'px'}"
                 :scroll="{x: false, y: tableScrollHeight }"
                 :rowKey="(record) => record.id"
                 :pagination="false"
                 :customRow="onCilckMemberTableRow"
                 ref="memberTable"
                 size="small"
                 v-watermark
        >
          <template slot="memberRowIndex" slot-scope="text, record, index">
                    <span>
                      {{ index + 1 }}
                    </span>
          </template>
          <template slot="personName" slot-scope="text, record">
            <template v-if="(record.isNew && !readOnly) || (record.isEdit && !readOnly)">
              <person-select :allow-clear="true" @change="personChange" style="width: 120px">
              </person-select>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="memberOperation" slot-scope="text, record">
            <template v-if="record.isNew">
              <a @click="doRemoveMember(record)">删除</a>
            </template>
            <template v-else-if="record.isEdit">
              <a @click="notDoEditMember(record)">取消修改</a>
            </template>
            <template v-else>
              <a @click="doEditMemberGroup(record)">修改</a>
              <a-divider type="vertical" />
              <a @click="doDeleteMember(record)">删除</a>
            </template>
          </template>
          <template slot="footer" v-if="queryManagerListParam.councilId != null">
            <a-row>
              <a-col>
                <div style="text-align: center">
                  <a-button @click="doAddMemberGroup">新增</a-button>
                  <a-divider type="vertical"/>
                  <a-button @click="doSaveMemberGroup">保存</a-button>
                </div>
              </a-col>
            </a-row>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>

  import PersonSelect from "@/module/Person/PersonSelect/PersonSelect";
  import DeptSelect from "@/module/Dept/DeptSelect";
  import MemoryDeptSelect from "@/components/MemorySelect/MemoryDeptSelect";
  import {doLoadManagerGroupList,doCancelManagerGroup,doSaveManagerGroup,
  doDeleteManager,doLoadManagerList,doSaveManager
  } from "@/api/managerGroup";

  export default {
    name: "CouncilGroupView",
    components: {MemoryDeptSelect, DeptSelect, PersonSelect},
    comments: {PersonSelect},


    data() {
      return {
        countNumber: 0,
        CouncilGroupSelectedRow: {},
        beforeEditCouncilGroupRow: [],
        CouncilGroupSelectedRowId: '',
        CouncilGroupDeletes: [],
        memberSelectedRow: {},
        beforeEditMemberRow: [],
        memberSelectedRowId: '',
        memberDeletes: [],
        tableScrollHeight: window.innerHeight - 300,
        tableHeight: window.innerHeight - 300,
        cardHeight: window.innerHeight - 110,
        inputContent: '',
        queryManagerGroupListParam: {
          councilName : '',
          isCancel : 0
        },
        queryManagerListParam: {
          personName : '',
          councilId : null
        },
        councilGroupData: [],
        memberData: [],
        councilGroupColumns,
        memberColumns,
        readOnly: false,
      }
    },
    created() {

    },
    mounted() {
      doLoadManagerGroupList(this.queryManagerGroupListParam).then(res => {
        if (res.code === 200) {
          this.councilGroupData = res.body
        }
      })
    },
    methods: {
      //保存成员
      doSaveMemberGroup(){
        var flag = this.memberData.some(item => {
          if(item.personId == null){
            return item
          }
        })
        if(flag){
          this.$message.error("请选择成员！")
        }else{
          doSaveManager(this.memberData).then(res => {
            if (res.code === 200) {
              this.$message.info("保存成功！")
              this.onSearch()
              this.onMemberSearch()
            }
          })
        }
      },
      //保存委员会组
      doSaveCouncilGroup(){
        var flag = this.councilGroupData.some(item => {
          if(item.councilName == null || item.councilName == ''){
            return item
          }
        })
        if(flag){
          this.$message.error("请输入组名称！")
        }else{
          doSaveManagerGroup(this.councilGroupData).then(res => {
            if (res.code === 200) {
              this.$message.info("保存成功！")
              this.onSearch()
            }
          })
        }
      },
      //删除成员
      doDeleteMember(record){
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
          onCancel: () =>{
            doDeleteManager({id:record.id}).then(res => {
              if (res.code === 200) {
                this.$message.info("删除成功！")
                this.onMemberSearch()
                this.onSearch()
              }
            })
          }
        })
      },
      //注销委员会组
      cancelCouncilGroup(record){
        this.$confirm({
          title: '是否注销该行记录？',
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
          onCancel: () =>{
            var param = {}
            param.councilId = record.councilId
            param.isCancel = 1
            doCancelManagerGroup(param).then(res => {
              if (res.code === 200) {
                  this.$message.info("注销成功！")
                  this.onSearch()
              }
            })
          }
        })
      },
      //委员会组表格内容变化时，更新到councilGroupData
      councilRowChange(record){
        var newData = [...this.councilGroupData]
        var target = newData.find(item => item.councilId === record.councilId)
        target._origionalData = { ...target }
        if (target) {
          target.councilName = record.councilName
          target.type = record.type
        }
        this.councilGroupData = newData
        console.log(this.councilGroupData)
      },
      personChange(personId, personData) {
        var newData = [...this.memberData]
        var target = newData.find(item => item.id === this.memberSelectedRow.id)
        target._origionalData = { ...target }
        if (target) {
          target.dept = personData.deptName
          target.personName = personData.personName
          target.personId = personData.personId
        }
        this.memberData = newData
        //console.log(this.memberData)
      },
      onSearch () {
        doLoadManagerGroupList(this.queryManagerGroupListParam).then(res => {
          if (res.code === 200) {
            this.councilGroupData = res.body
          }
        })
      },
      onMemberSearch () {
        doLoadManagerList(this.queryManagerListParam).then(res => {
          if(res.code == 200) {
            this.memberData = res.body
          }
        })
      },
      onIsCancelChange() {
        doLoadManagerGroupList(this.queryManagerGroupListParam).then(res => {
          if (res.code === 200) {
            this.councilGroupData = res.body
          }
        })
      },
      onDateChange (dateArr, dateArrStr) {
        console.log(dateArr)
        console.log(dateArrStr)
      },
      doAddCouncilGroup () {
        this.countNumber = this.countNumber - 1
        this.councilGroupData.push({
          councilId: this.countNumber,
          councilName: '',
          type: 2,
          memberNum: 0,
          isCancel: this.queryManagerGroupListParam.isCancel,
          isNew: true
        })
        this.councilGroupScrollToBottom()
      },
      doAddMemberGroup () {
        this.countNumber = this.countNumber - 1
        this.memberData.push({
          id: this.countNumber,
          councilId: this.queryManagerListParam.councilId,
          personId: null,
          personName: "",
          dept: "",
          isNew: true
        })
        this.memberScrollToBottom()
      },
      doEditCouncilGroup (record) {
        this.CouncilGroupSelectedRowId = record.councilId
        var newData = [...this.councilGroupData]
        var target = newData.find(item => item.councilId === this.CouncilGroupSelectedRowId)
        this.beforeEditCouncilGroupRow = newData.map(item => ({...item}))
        target._origionalData = { ...target }
        if (target) {
          target.isEdit = true
        }
        this.councilGroupData = newData
      },
      doEditMemberGroup (record) {
        this.memberSelectedRowId = record.id
        var newData = [...this.memberData]
        var target = newData.find(item => item.id === this.memberSelectedRowId)
        this.beforeEditMemberRow = newData.map(item => ({...item}))
        console.log("doEditMemberGroup --- 赋值")
        console.log(this.beforeEditMemberRow)
        target._origionalData = { ...target }
        if (target) {
          target.isEdit = true
        }
        this.memberData = newData
      },
      notDoEditCouncilGroup (record) {
        this.CouncilGroupSelectedRowId = record.councilId
        var newData = [...this.councilGroupData]
        var target = newData.find(item => item.councilId === this.CouncilGroupSelectedRowId)
        target._origionalData = { ...target }
        if (target) {
          var beforeEditRow = this.beforeEditCouncilGroupRow.find(item => item.councilId === record.councilId)
          target.councilName = beforeEditRow.councilName
          target.type = beforeEditRow.type
          target.isEdit = false
        }
        this.councilGroupData = newData
        console.log(this.councilGroupData)
      },
      notDoEditMember (record) {
        this.memberSelectedRowId = record.id
        var newData = [...this.memberData]
        var target = newData.find(item => item.id === this.memberSelectedRowId)
        target._origionalData = { ...target }
        if (target) {
          var beforeEditRow = this.beforeEditMemberRow.find(item => item.id === record.id)
          target.memberName = beforeEditRow.memberName
          target.dept = beforeEditRow.dept
          target.isEdit = false
        }
        this.memberData = newData
      },
      councilGroupScrollToBottom () {
        const table = this.$refs.councilGroupTable.$el
        // 获取到具有 'scroll' 属性的这一层dom元素
        const tableBody = table.querySelector('.ant-table-body')
        if (tableBody) {
          this.$nextTick(() => {
            tableBody.scrollTop = tableBody.scrollHeight
          })
        }
      },
      memberScrollToBottom () {
        const table = this.$refs.memberTable.$el
        // 获取到具有 'scroll' 属性的这一层dom元素
        const tableBody = table.querySelector('.ant-table-body')
        if (tableBody) {
          this.$nextTick(() => {
            tableBody.scrollTop = tableBody.scrollHeight
          })
        }
      },
      onClickCouncilGroupTableRow(record) {
        return {
          on: {
            click: () => {
              this.queryManagerListParam.councilId = record.councilId
              this.CouncilGroupSelectedRow = {... record}
              this.onMemberSearch()
            },
          }
        }
      },
      setRowClassName(record) {
        return this.CouncilGroupSelectedRow.councilId == record.councilId ? "selectRowStyle" : ""
      },
      onCilckMemberTableRow(record) {
        return {
          on: {
            click: () => {
              this.memberSelectedRow = {... record}
            },
          }
        }
      },
      doRemoveCouncilGroup (record) {
        this.CouncilGroupSelectedRowId = record.councilId
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
            if (me.CouncilGroupSelectedRowId > 0) {
              me.CouncilGroupDeletes.push(me.CouncilGroupSelectedRow)
            }
            me.councilGroupData = me.councilGroupData.filter(item => item.councilId !== me.CouncilGroupSelectedRowId)
            me.CouncilGroupSelectedRowId = ''
          }
        })
      },
      doRemoveMember (record) {
        this.memberSelectedRowId = record.id
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
            if (me.memberSelectedRowId > 0) {
              me.memberDeletes.push(me.memberSelectedRow)
            }
            me.memberData = me.memberData.filter(item => item.id !== me.memberSelectedRowId)
            me.memberSelectedRowId = ''
          }
        })
      },
    }
  }

  const councilGroupColumns = [
    {
      key: 'councilGroupRowIndex',
      title: '序号',
      dataIndex: 'councilGroupRowIndex',
      scopedSlots: { customRender: 'councilGroupRowIndex' },
      width: '15%',
      align: 'center',
    },
    {
      title: '组名称',
      dataIndex: 'councilName',
      key: 'councilName',
      scopedSlots: { customRender: 'councilName' },
      width: '25%',
      align: 'center',
      ellipsis: false,
    },
    {
      title: '类型',
      dataIndex: 'type',
      scopedSlots: { customRender: 'type' },
      key: 'type',
      width: '20%',
      align: 'center',
      ellipsis: false,
    },
    {
      title: '组员数量',
      key: 'memberNum',
      dataIndex: 'memberNum',
      //scopedSlots: { customRender: 'memberNum' },
      width: '20%',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'operation',
      scopedSlots: { customRender: 'councilGroupOperation' },
      width: '20%',
      align: 'center',
      ellipsis: true,
    },
  ];

  const memberColumns = [
    {
      key: 'memberRowIndex',
      title: '序号',
      dataIndex: 'memberRowIndex',
      scopedSlots: { customRender: 'memberRowIndex' },
      width: '15%',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'personName',
      key: 'personName',
      scopedSlots: { customRender: 'personName' },
      width: '25%',
      align: 'center',
      ellipsis: false,
    },
    {
      title: '所在部门',
      dataIndex: 'dept',
      //scopedSlots: { customRender: 'type' },
      key: 'dept',
      width: '20%',
      align: 'center',
      ellipsis: false,
    },
    {
      title: '操作',
      key: 'memberOperation',
      scopedSlots: { customRender: 'memberOperation' },
      width: '25%',
      align: 'center',
      ellipsis: true,
    },
  ];


</script>

<style scoped>

  /deep/ .ant-table-placeholder{
    display:none;
  }
  /deep/ .selectRowStyle {
    background-color: #d5fffe;
  }
</style>