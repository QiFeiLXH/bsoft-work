<template>
  <a-card :bordered="false" :bodyStyle="{height:'2000px',padding: '10px 10px'}">

    <template>
      <div style="margin-bottom:10px">
        <a-radio-group v-model="value" :default-value="null" @change="onRadioChange">
          <a-radio :value="null" >
            全部
          </a-radio>
          <a-divider type="vertical" />
          <a-radio :value="2">
            分公司
          </a-radio>
          <a-divider type="vertical" />
          <a-radio :value="1" >
            子公司
          </a-radio>
        </a-radio-group>
        <a-divider type="vertical" />
        <a-input-search placeholder="公司名称或保管人"
                        v-model="queryParam.inputContent"
                        style="width: 200px"
                        :allowClear="true"
                        @search="onfindChange"
                        @pressEnter="onfindChange"
        />
        <a-divider type="vertical" />
        <a-button type="primary" style="margin-left:10px" @click="() => findCompanySeal()" >
<!--          <a-icon type="plus" />-->
          查询
        </a-button>
        <a-divider type="vertical" />
        <a-button type="primary" style="margin-left:10px" @click="() => add()">
          新增
        </a-button>
      </div>
    </template>

    <a-table :columns="columns"
             :dataSource="data"
             :loading="loading"
             size="small"
             :rowKey="(record,index)=> record.companyId"
             :showPagination = 'false'
             :pagination = 'false'
             :scroll="{ x: false,y: listScrollHeight }"
             :bodyStyle="{ height: listScrollHeight + 'px' }">

      <template slot="rowIndex" slot-scope="text, record, index">
        {{ (page.pageNo-1) * page.pageSize + index + 1}}
      </template>
      <template slot="companyType" slot-scope="text, record, index">
        <span v-if="record.companyType==2">
        分公司
        </span>
        <span v-else-if="record.companyType==1">
        子公司
        </span>
        <span v-else-if="record.companyType==3">
        其他
        </span>
        <span v-else-if="record.companyType==0">
        总公司
        </span>
      </template>


      <template slot="sealCompanyFlag" slot-scope="text, record, index">
        <a-checkbox  :disabled="true"
                   :checked="record.sealCompanyFlag==1">
        </a-checkbox>
      </template>

      <template slot="officialSealFlag" slot-scope="text, record, index">
        <a-checkbox  :disabled="true"
                   :checked="record.officialSealFlag==1"
                  >
        </a-checkbox>
      </template>

      <template slot="contractSealFlag" slot-scope="text, record, index">
        <a-checkbox  :disabled="true"
                   :checked="record.contractSealFlag==1">
        </a-checkbox>
      </template>



      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span >
            <a type="primary" @click="() => update(record,index)">修改</a>
            <a type="primary" @click="() => find(record,index)">查看</a>
          </span>
        </div>
      </template>
    </a-table>
    <footer-tool-bar>
      <a-pagination
        :total="page.totalCount"
        :pageSize.sync="page.pageSize"
        v-model="page.pageNo"
        @change="pageChange"
        :showTotal="total => `共 ${total} 条`"
        style="margin-top: 10px"/>
    </footer-tool-bar>

    <a-drawer
      title="公司印章信息"
      :wrapStyle="{overflow: 'hidden'}"
      placement="right"
      :closable="false"
      :width="850"
      @close="onDrawerClose"
      :visible="drawerVisible"
      :bodyStyle="{ padding: '0px 0px 0px 0px' }"
    >
      <a-card :bordered="false" :body-style="{ height:drawerCardHeight + 'px',padding:'0px 0px 0px 0px'}">
            <a-form-model v-model="CompanySealForm" ref="CompanySealForm" :rules="rules">
              <a-row>
                <a-col :span="24">
                  <a-form-model-item
                    label="单位名称"
                    :labelCol="{lg: {span: 4}, sm: {span: 3}}"
                    :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
                    prop="companyId"
                    style="margin: 10px 0">
                    <!--<a-select v-model="CompanySealForm.companyId"
                              placeholder="请输入公司名称/拼音简码查询"
                              @search="handleSearch"
                               :dropdownMatchSelectWidth="true"
                              :filter-option="false"
                              @change="onCompanyTypeChange"
                              style="margin: -5px 0;height: 32px;width:300px"
                              :disabled="updateFlag"
                              class="companyName"
                              size="small" >
                      <a-select-option v-for="e in companyData" :key="e.companyId" :label="e.companyName">
                        {{ e.companyName }}
                      </a-select-option>
                    </a-select>-->
                    <company-select v-model="CompanySealForm.companyId"
                                    ref="companySelect"
                                    :disabled="updateFlag"
                                    @change="onCompanyTypeChange"></company-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item
                    label="单位简称"
                    :labelCol="{lg: {span: 8}, sm: {span: 3}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                    prop="companyId"
                    style="margin: 10px 0">
                    <a-input style="height: 32px; width: 300px"v-model="CompanySealForm.pinyin" :readOnly="true"/>
                  </a-form-model-item>
                </a-col>
                <a-col :md="12">
                  <a-form-model-item
                    label=""
                    :labelCol="{lg: {span: 8}, sm: {span: 4}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
                    prop="companyType"
                    style="margin-left: 90px">
                    <a-radio-group v-model="CompanySealForm.companyType"   @change="onDrawerRadioChange">
                      <a-radio :value="2" :disabled="CompanySealForm.companyType!=2">分公司</a-radio>
                      <a-radio :value="1" :disabled="CompanySealForm.companyType!=1">子公司</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="10">
                  <a-form-model-item
                    label="印章是否在公司"
                    :labelCol="{lg: {span: 12}, sm: {span: 4}}"
                    :wrapperCol="{lg: {span: 12}, sm: {span: 20} }"
                    style="margin-left: 10px ;height: 32px"
                    prop="sealCompanyFlag">
                    <a-switch checked-children="是"
                              un-checked-children="否"
                              :checked="CompanySealForm.sealCompanyFlag == 1"
                              @change="sealCompanyFlagChange"
                              />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item
                    label="印章信息"
                    :labelCol="{lg: {span: 4}, sm: {span: 3}}"
                    :wrapperCol="{lg: {span: 1}, sm: {span: 20} }">
                  </a-form-model-item>
                </a-col>
              </a-row>

      <a-row>
        <a-col :span="12" style="padding-left: 75px">
          <a-form-model-item
            label=""
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="officialSealFlag"
            style="margin-bottom: 10px">
            <a-checkbox @change="officialSealFlagChange"  :checked="CompanySealForm.officialSealFlag == 1">公章</a-checkbox>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="保管人"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20}}"
            prop="officialSealCustodianName"
            style="margin-bottom: 10px">
            <person-select ref="officialSealCustodianPerson"  :disabled="offSealNameReadOnly"  v-model="CompanySealForm.officialSealCustodianId" @change="handleOfficalChange"></person-select>
          </a-form-model-item>
        </a-col>
      </a-row>
       <a-row>
        <a-col :span="12" style="padding-left: 75px">
          <a-form-model-item
            label=""
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="contractSealFlag"
            style="margin-bottom: 10px">
            <a-checkbox @change="contractSealFlagChange"  :checked="CompanySealForm.contractSealFlag==1">合同章</a-checkbox>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item
            label="保管人"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20}}"
            prop="contractSealCustodianName"
            style="margin-bottom: 10px">
<!--            <a-input :readOnly="conSealNameReadOnly"  v-model="CompanySealForm.contractSealCustodianName" ></a-input>-->
            <person-select ref="contractSealCustodianPerson" :disabled="conSealNameReadOnly"  v-model="CompanySealForm.contractSealCustodianId" @change="handleContractChange" ></person-select>
          </a-form-model-item>
        </a-col>
      </a-row>
            </a-form-model>
        <div :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
            <a-button type="primary" v-if="findFlag" @click="handleSubmit" style="margin-left: 20px">保存</a-button>
          <a-button  @click="onDrawerClose" style="margin-left: 20px">退出</a-button>
        </div>
      </a-card>
    </a-drawer>
  </a-card>
</template>
<script>
  import FooterToolBar from '@/components/FooterToolbar'
  import {STable} from '@/components'
  import {saveCompanySeal,getCompanySeals,getSeal,getcompany } from '@/api/companyseal'
  import GeneralDicSelect from "@/components/MemorySelect/GeneralDicSelect";
  import PersonSelect from "@/module/Person/PersonSelect/PersonSelect";
  import CompanySelect from "@/module/Person/PersonSelect/CompanySelect";
  const columns = [
    {
      title: '序号',
      width:'8%',
      dataIndex:'rowIndex',
      align: 'left',
      scopedSlots: { customRender: 'rowIndex' },
    },
    {
      title: '公司名称',
      width:'20%',
      dataIndex: 'companyName',
      scopedSlots: { customRender: 'companyName' },
    },
    {
      title: '公司类别',
      width:'10%',
      dataIndex: 'companyType',
      scopedSlots: { customRender: 'companyType' },
    },
    {
      title: '印章在公司',
      width:'10%',
      dataIndex: 'sealCompanyFlag',
      scopedSlots: { customRender: 'sealCompanyFlag' },
    },
    {
      title: '公章',
      width:'10%',
      dataIndex: 'officialSealFlag',
      scopedSlots: { customRender: 'officialSealFlag' },
    },
    {
      title: '公章保管人',
      width:'10%',
      dataIndex: 'officialSealCustodianName',
      scopedSlots: { customRender: 'officialSealCustodianName' },
    },
    {
      title: '合同章',
      width:'10%',
      dataIndex: 'contractSealFlag',
      scopedSlots: { customRender: 'contractSealFlag' },
    },
    {
      title: '合同章保管人',
      width:'10%',
      dataIndex: 'contractSealCustodianName',
      scopedSlots: { customRender: 'contractSealCustodianName' },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width:'10%',
      scopedSlots: { customRender: 'operation' },
    },
  ];
  export default {
    components:{
      CompanySelect,
      PersonSelect,
      GeneralDicSelect,
      FooterToolBar,
      STable,
    },
    data() {
      return {
        data:[],
        columns,
        selectRecordId:0,//抽屉查找修改印章ID
        companyData:[],//公司名称集合
        pinyinData:[],//公司简称集合
        itemData:[],
        listScrollHeight:window.innerHeight - 10,
        editingKey: '',
        queryParam: {'context': null,'pageNo':1,'pageSize':25,'companyType':null,'inputContent':null},
        value: null,
        customId: 0,
        loading: false,
        page: { pageNo: 1, pageSize: 25, totalCount: 0 },
        isLoading: false,
        formLayout: 'horizontal',


        readOnly: false,
        conSealNameReadOnly:true,
        offSealNameReadOnly:true,
        updateFlag:false,//新增修改提醒判断
        addFlag:false,//新增修改提醒判断
        findFlag:true,
        CompanySealForm: {
          companyId:undefined,
          companyName: null,
          pinyin: null,
          sealCompanyFlag:1,
          id:null,
          officialSealFlag: 1,
          officialSealCustodianId: undefined,
          officialSealCustodianName: null,
          contractSealFlag: 1,
          contractSealCustodianId: undefined,
          contractSealCustodianName: null,
          companyType: 1,
          submitFlag: 0,
        },
        defaultRules: {
          // companyId: [{ required: true, message: '请选择公司名称!', trigger: 'blur' }],
          // pinyin: [{ required: true, message: '请选择公司简称!', trigger: 'blur' }],

        },
        rules: {
          // companyId: [{ required: true, message: '请选择公司名称!', trigger: 'blur' }]
          // officialSealCustodianName: [{ required: true, message: '请选择合同章保管人!', trigger: 'blur' }],
          // contractSealCustodianName: [{ required: true, message: '请选择公章保管人!', trigger: 'blur' }],
        },


        // recordColumn,
        // recordQueryParam: { personId: '', pageNumber: 1, pageSize: 25 },
        // recordRowSelected: '',
        drawerVisible: false,
        // tableHeight: 0,
        drawerCardHeight: window.innerHeight - 75,
        formHeight: window.innerHeight - 100,
        recordListScrollHeight: window.innerHeight - 230,



      };
    },
    computed: {
      rowSelection() {
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },


          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            },
          }),
        };
      },

    },

    mounted(){
      this.doQuery();
      this.handleCompanyChange();
      this.listScrollHeight = window.innerHeight - 265
    },

    methods: {
      doQuery() {
        const params = {
          companyType: this.queryParam.companyType,
          inputContent: this.queryParam.inputContent,
          pageNo: this.queryParam.pageNo,
          pageSize: this.queryParam.pageSize,
        }
        this.isLoading = true
        getCompanySeals(params).then(res => {
          if(res.code===200){
            this.page.totalCount = res.body.totalCount;
            this.data = res.body.items;
            console.log(this.data)
          }
        })
      },

      pageChange(current) {
        this.queryParam.pageNo = current;
        this.queryParam.companyType = this.value;
        getCompanySeals(this.queryParam)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items;
              this.page.totalCount = res.body.totalCount;
            }
          })
      },
      findCompanySeal(){
        const params = {
          companyType: this.queryParam.companyType,
          inputContent: this.queryParam.inputContent,
          pageNo: 1,
          pageSize: 25,
        }
        getCompanySeals(params).then(res => {
          if(res.code===200){
            this.page.totalCount = res.body.totalCount;
            this.data = res.body.items;
            console.log(this.data)
            this.page.pageNo=1
          }
        })
      },



      handleOfficalChange(val, data) {
        this.CompanySealForm.officialSealCustodianName = data.personName
      },
      handleContractChange(val, data) {
        this.CompanySealForm.contractSealCustodianName = data.personName
      },

      onCompanyTypeChange(companyId, companyData) {
        console.log(companyId)
        console.log(companyData)
        this.CompanySealForm.companyType = companyData.subsidiary
        this.CompanySealForm.pinyin = companyData.abbreviation
      },
      onRadioChange(e) {
        this.queryParam.companyType = e.target.value
        const param = {
          companyType: e.target.value,
          inputContent: this.queryParam.inputContent,
          pageNo: 1,
          pageSize: 25
        }

        getCompanySeals(param)
          .then(res => {
            if (res.code === 200) {
              this.data = res.body.items;
              this.page.pageNo = 1;
              this.page.totalCount = res.body.totalCount;
            }
          })
        this.editingKey = '';
      },
      onDrawerRadioChange(e){
        console.log(e)
        this.CompanySealForm.companyType = e.target.value
      },
      onfindChange(value) {
        this.page.pageNo = 1
        this.findCompanySeal()
      },
      sealCompanyFlagChange(checked, event){
        if(this.readOnly) {
          return
        }
        if(checked) {
          this.CompanySealForm.sealCompanyFlag = 1
        } else {
          this.CompanySealForm.sealCompanyFlag = 0
        }
      },
      officialSealFlagChange(e){
        if(this.readOnly) {
          return
        }
        if(e.target.checked){
          this.offSealNameReadOnly=false
          this.CompanySealForm.officialSealFlag = 1
          console.log(this.offSealNameReadOnly)
        }else{
          this.offSealNameReadOnly=true
          this.CompanySealForm.officialSealFlag = 0
          this.$nextTick(() => {
            this.$refs.officialSealCustodianPerson.getCurrent(null,null)
          })
          this.CompanySealForm.officialSealCustodianId = null
          this.CompanySealForm.officialSealCustodianName=null
        }
      },
      contractSealFlagChange(e) {
        if(this.readOnly) {
          return
        }
        if(e.target.checked){
          this.conSealNameReadOnly=false
          this.CompanySealForm.contractSealFlag = 1
        }else{
          this.conSealNameReadOnly=true
          this.CompanySealForm.contractSealFlag = 0
          this.$nextTick(() => {
            this.$refs.contractSealCustodianPerson.getCurrent(null,null)
          })
          this.CompanySealForm.contractSealCustodianId = null
          this.CompanySealForm.contractSealCustodianName = null
        }
      },

      update(record, index){
        this.updateFlag = true
        this.addFlag = false
        this.findFlag = true
        this.rules = this.defaultRules
        this.readOnly = false
        if(!this.drawerVisible){
          this.conSealNameReadOnly = true
          this.offSealNameReadOnly = true
        }
        var id = record.companyId
        console.log(id)
        if(id!=null){
          getSeal({id}).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.initForm()
              this.CompanySealForm = {...res.body}

              if(this.CompanySealForm.officialSealFlag==1){
                this.offSealNameReadOnly  = false
              }
              if(this.CompanySealForm.contractSealFlag==1){
                this.conSealNameReadOnly  = false
              }
              this.drawerVisible = true
              this.$nextTick(() => {
                this.$refs.companySelect.getCurrent(this.CompanySealForm.companyId)
                this.$refs.officialSealCustodianPerson.getCurrent(record.officialSealCustodianId, record.officialSealCustodianName)
                this.$refs.contractSealCustodianPerson.getCurrent(record.contractSealCustodianId, record.contractSealCustodianName)
              })
            }
          })
        }

      },
      add(){
        this.readOnly = false
        this.addFlag = true
        this.updateFlag = false
        this.findFlag = true
        this.offSealNameReadOnly=true
        this.conSealNameReadOnly=true

        this.initForm()
        this.drawerVisible = true
          this.$nextTick(() => {
            this.$refs.companySelect.getCurrent(null)
            this.$refs.officialSealCustodianPerson.getCurrent(this.CompanySealForm.officialSealCustodianId, this.CompanySealForm.officialSealCustodianName)
            this.$refs.contractSealCustodianPerson.getCurrent(this.CompanySealForm.contractSealCustodianId, this.CompanySealForm.contractSealCustodianName)
          })
      },
      find(record, index){
        this.readOnly = true
        this.rules = {}
        this.conSealNameReadOnly=true
        this.offSealNameReadOnly=true
        this.updateFlag = true
        this.findFlag = false
        var id = record.companyId
        console.log(id)
        if(id!=null){
          getSeal({id}).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.initForm()
              this.CompanySealForm = {...res.body}
              this.drawerVisible = true
              this.$nextTick(() => {
                this.$refs.companySelect.getCurrent(this.CompanySealForm.companyId)
                this.$refs.officialSealCustodianPerson.getCurrent(record.officialSealCustodianId, record.officialSealCustodianName)
                this.$refs.contractSealCustodianPerson.getCurrent(record.contractSealCustodianId, record.contractSealCustodianName)
              })
            }
          })
        }
      },
      handleCompanyChange(){
        getcompany()
          .then(res => {
            if (res.code === 200) {
              this.companyData = res.body;
              this.pinyinData = res.body;
            }
          })
      },


      onRecordClickRow (record, index) {
        return {
          on: {
            click: () => {
              this.recordRowSelected = record.id
            }
          }
        }
      },
      setRecordCurrentRow (record, index) {
        var styleClassName = ''
        if (record.id === this.recordRowSelected) {
          styleClassName = 'clickRowStyle hoverRowStyle'
        }
        return styleClassName
      },
      onSaveSeal () {
        const param = {
          id:this.CompanySealForm.id,
          companyId:this.CompanySealForm.companyId,
          sealCompanyFlag:this.CompanySealForm.sealCompanyFlag,
          contractSealFlag:this.CompanySealForm.contractSealFlag,
          contractSealCustodianId:this.CompanySealForm.contractSealCustodianId,
          contractSealCustodianName:this.CompanySealForm.contractSealCustodianName,
          officialSealFlag:this.CompanySealForm.officialSealFlag,
          officialSealCustodianId:this.CompanySealForm.officialSealCustodianId,
          officialSealCustodianName:this.CompanySealForm.officialSealCustodianName,

        }

        console.log(this.CompanySealForm)
        saveCompanySeal(param)
          .then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功');
              this.doQuery()
              this.drawerVisible = false
            }
          })
      },
      onDrawerClose () {
        this.offSealNameReadOnly = false
        this.conSealNameReadOnly = false
        this.drawerVisible = false
      },
      openDrawer(){
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.CompanySealForm.resetFields()
        })
      },
      checkData() {
        var result = false
        this.$refs.CompanySealForm.validate(valid => {
          if(valid) {
            result = true
          }
        })
        return result
      },


      handleSearch(value) {
        if (value) {
          getcompany({input: value}).then(res => {
            if (res.code === 200) {
              this.companyData = res.body;
            }
          })
        }

      },

      handleSubmit() {
        // if(!this.checkData()) {
        //   return
        // }
        console.log(this.CompanySealForm)

        // e.preventDefault();
        if(this.CompanySealForm.companyId==null) {
          this.$message.error('请先选择公司名称');
          return
        }else{
          var target = this.data.find(x => x.companyId === this.CompanySealForm.companyId)
          if(target&&this.addFlag==true){
            this.$message.warning('当前公司已维护过印章信息,无法新增新印章信息,请到修改页面进行维护');
            return
          }
        // else if(target&&this.updateFlag==true){
        //     this.$message.success('当前公司已成功维护印章信息');
        //   }
        }
        if(this.conSealNameReadOnly===false&&(this.CompanySealForm.contractSealCustodianName===null||this.CompanySealForm.contractSealCustodianName==="")){
          this.$message.error('合同章保管人不能为空');
          console.log(this.CompanySealForm)
          return
        }
        if(this.offSealNameReadOnly===false&&(this.CompanySealForm.officialSealCustodianName===""||this.CompanySealForm.officialSealCustodianName===null)){
          this.$message.error('公章保管人不能为空');
          console.log(this.CompanySealForm)
          return
        }
        this.onSaveSeal()


      },
      initForm () {
        this.CompanySealForm = {
          companyId:undefined,
          companyName: null,
          pinyin: null,
          sealCompanyFlag:1,
          id:null,
          officialSealFlag: null,
          officialSealCustodianId: "",
          officialSealCustodianName: "",
          contractSealFlag: null,
          contractSealCustodianId: "",
          contractSealCustodianName: "",
          companyType: 3,
          submitFlag: 0,
        }
      }
    }
  };
</script>
<style>
  components-table-demo-size h4 {
    margin-bottom: 16px;
  }
  .editable-row-operations a {
    margin-right: 8px;
  }
  .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
    color: #000000;
  }
  .ant-checkbox-disabled + span {
    color: #000000;
    cursor: not-allowed;
  }
  .ant-radio-disabled + span {
    color: #000000;
    cursor: not-allowed;
  }
  .ant-select-selection__rendered{
    height: 32px;
  }
  .ant-select-sm .ant-select-selection--single {
    height: 32px;
    width:625px;
  }
  .companyName .ant-select-selection-selected-value {

    margin-top: 3px;
  }
  .ant-input {
    color: #000000;
  }
  .ant-select{
    color: #000000;
  }
  .ant-radio-group{
    margin-top: 18px;
  }
</style>
