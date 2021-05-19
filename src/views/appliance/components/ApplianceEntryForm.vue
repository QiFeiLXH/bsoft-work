<template>
  <a-card :bordered="false" :body-style="{ padding: '0 24px'}">

    <a-form-model :model="applianceForm" ref="applianceForm" :rules="applianceFormRules">
      <a-row>
        <a-col :md="12">
          <a-form-model-item
            label="物品类别"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="type"
            style="margin: 10px 0">
            <a-select v-model="applianceForm.type" @change="onTypeChange" v-show="!readOnly">
              <a-select-option v-for="item in typeList" :key="item.id" :value="item.id" >{{ item.name }}</a-select-option>
            </a-select>
            <a-input v-model="applianceForm.typeName" v-show="readOnly"></a-input>
          </a-form-model-item>

        </a-col>
        <a-col :md="12">
          <a-form-model-item
            label="物品名称"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="name"
            style="margin: 10px 0">
            <appliance-name-select ref="applianceNameSelect"
                                   v-show="!readOnly"
                                   v-model="applianceForm.name"
                                   :type="applianceForm.type"
                                   @setName="setName"
                                   :disabled="readOnly"></appliance-name-select>
            <a-input v-show="readOnly" v-model="applianceForm.nameName"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12">
          <a-form-model-item
            label="规格"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="standards"
            style="margin-bottom: 10px">
            <a-input v-model="applianceForm.standards" readOnly></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="12">
          <a-form-model-item
            label="数量"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="quantity"
            style="margin-bottom: 10px">
            <a-input-number :min="0" :precision="0" v-if="!readOnly" @change="onMoneyChange" v-model="applianceForm.quantity" style="width: 100%"/>
            <a-input :value="applianceForm.quantity" v-if="readOnly"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12">
          <a-form-model-item
            label="单价"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="unitPrice"
            style="margin-bottom: 10px">
            <a-input-number :min="0"
                            :precision="2"
                            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            v-model="applianceForm.unitPrice"
                            v-if="!readOnly"
                            @change="onMoneyChange"
                            style="width: 100%"/>
            <a-input :value="applianceForm.unitPrice" v-if="readOnly"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="12">
          <a-form-model-item
            label="金额"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20}}"
            prop="money"
            style="margin-bottom: 10px">
            <a-input prefix="￥" :value="applianceForm.money | NumberFormat" :readOnly="true"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24">
          <a-form-model-item
            label="供应商"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 22} }"
            prop="supplierName"
            style="margin-bottom: 10px">
            <a-input v-model="applianceForm.supplierName" style="width: 425px;" :readOnly="true"/>
            <a-icon v-if="!readOnly" type="search" @click="doCustomerSearch" style="margin-left: 10px;font-size: 15px"/>
          </a-form-model-item>

        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24">
          <a-form-model-item
            label="备注"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 22}}"
            prop="remark"
            style="margin-bottom: 10px">
            <a-textarea v-model="applianceForm.remark" :readOnly="readOnly" :rows="2"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row v-show="readOnly">
        <a-col :md="12">
          <a-form-model-item
            label="登记人"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="registerName"
            style="margin-bottom: 10px">
            <a-input v-model="applianceForm.registerName" readOnly/>
          </a-form-model-item>
        </a-col>
        <a-col :md="12">
          <a-form-model-item
            label="入库日期"
            :labelCol="{lg: {span: 8}, sm: {span: 4}}"
            :wrapperCol="{lg: {span: 16}, sm: {span: 20} }"
            prop="inDate"
            style="margin-bottom: 10px">
            <a-input v-model="applianceForm.inDate" readOnly/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row v-show="readOnly">
        <a-col :md="24">
          <a-form-model-item
            label="流水号"
            :labelCol="{lg: {span: 4}, sm: {span: 2}}"
            :wrapperCol="{lg: {span: 20}, sm: {span: 22}}"
            prop="lshId"
            style="margin-bottom: 10px">
            <a-input v-model="applianceForm.lshId" readOnly/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <a-modal
      title="客户往来单位选择"
      style="top: 30px;"
      v-model="customerModalVisible"
      :width="700"
      :maskClosable="false"
      :bodyStyle="{ height: customerModalHeight + 'px'}"
      :closable="false"
      :destroyOnClose="true">
      <a-row style="margin-bottom: 10px;margin-top:10px;">
        <a-input-search
          placeholder="客户名称或拼音简码"
          v-model="customerModalQueryParam.inputContent"
          style="width: 270px"
          allow-clear
          :pressEnter="doQueryCustomer"
          @search="doQueryCustomer"/>
      </a-row>
      <a-table
        size="small"
        :bordered="false"
        :loading="isCustomerLoading"
        :columns="customerColumns"
        :dataSource="customerList"
        :rowKey="(record) => record.id"
        :pagination="false"
        :customRow="onCustomerClickRow"
        :rowClassName="setCustomerCurrentRow"
        :scroll="{ x: false, y: listCustomerScrollHeight + 'px' }">
        <template slot="rowIndex" slot-scope="text, record, index">
          <span>
            {{ (customerCurrentPage - 1) * customerModalPage.pageSize + index + 1 }}
          </span>
        </template>
      </a-table>
      <template slot="footer">
        <a-pagination
          size="small"
          :total="customerModalPage.totalCount"
          :pageSize.sync="customerModalPage.pageSize"
          v-model="customerModalPage.pageNumber"
          @change="onCustomerModalCurrentChange"
          style="margin-bottom: 10px"/>
        <a-button key="submit" type="primary" @click="onCustomerModalConfirm">确定</a-button>
        <a-button key="back" @click="onCustomerModalCancel">取消</a-button>
      </template>
    </a-modal>
  </a-card>

</template>

<script>
  import ApplianceNameSelect from "@/views/appliance/components/ApplianceNameSelect";
  import {getCustomerList, saveAppliance, submitAppliance} from "@/api/applianceEntry";
  import { Decimal } from 'decimal.js'

  export default {
    name: "ApplianceEntryForm",
    components: {ApplianceNameSelect},
    data() {
      return {
        readOnly: false,
        customerModalVisible: false,
        isCustomerLoading: false,
        customerModalHeight: 400,
        listCustomerScrollHeight: 280,
        customerModalQueryParam: { pageNo: 1, pageSize: 25, inputContent: null },
        customerModalPage: { pageNumber: 0, pageSize: 0, totalCount: 0 },
        customerList: [],
        typeList: [
          {id: 1, name: '办公用品'},
          {id: 2, name: '礼品'},
          {id: 3, name: '饮用水'},
        ],
        customerColumns: [
          {
            dataIndex: 'rowIndex',
            title: '',
            width: '10%',
            scopedSlots: { customRender: 'rowIndex' }
          },{
            dataIndex: 'customerName',
            title: '客户名称',
            width: '90%'
          }
        ],
        applianceForm: {
          type: null,
          name: null,
          standards: '',
          quantity: null,
          unitPrice: null,
          money: 0,
          supplier: null,
          supplierName: '',
          remark: '',
          register: '',
          registerName: '',
          inDate: null,
          lshId: null,
          submitFlag: 0,
        },
        applianceFormRules: {
          type: [{ required: true, message: '请选择物品类型!', trigger: 'blur' }],
          name: [{ required: true, message: '请选择物品名称!', trigger: 'blur' }],
          quantity: [{ required: true, message: '请填物品数量!', trigger: 'blur' }],
          unitPrice: [{ required: true, message: '请填物品单价!', trigger: 'blur' }],
          supplierName: [{ required: true, message: '请选择供货商!', trigger: 'change' }],
        },
      }
    },
    mounted() {
    },
    methods: {
      onTypeChange(value) {
        this.applianceForm.type = value
        this.applianceForm.name = null
        this.$nextTick(() => {
          this.$refs.applianceNameSelect.clearName()
        })
      },
      setName(record) {
        this.applianceForm.name = record.id
        this.applianceForm.standards = record.standards
      },
      save() {
        if (this.checkData()) {
          this.applianceForm.money = this.applianceForm.unitPrice * this.applianceForm.quantity
          console.log(this.applianceForm)
          saveAppliance(this.applianceForm).then(res => {
            this.$message.success('新增成功')
            this.$emit("onEntrySaveSuccess")
          })
        }
      },
      submit() {
        if (this.checkData()) {
          this.applianceForm.money = this.applianceForm.unitPrice * this.applianceForm.quantity
          console.log(this.applianceForm)
          submitAppliance(this.applianceForm).then(res => {
            this.$message.success('提交成功')
            this.$emit("onEntrySaveSuccess")
          })
        }
      },
      checkData() {
        let isValid = true
        this.$refs.applianceForm.validate(valid => {
          if(!valid) {
            isValid = false
          }
        })
        return isValid
      },
      onMoneyChange() {
        let money = this.applianceForm.unitPrice*this.applianceForm.quantity
        this.applianceForm.money = new Decimal(money).toNumber().toFixed(2)
      },
      resetForm() {
        this.$refs.applianceForm.resetFields()
        this.applianceForm.type = 1
        this.$refs.applianceNameSelect.clearName()
      },
      setForm(record) {
        this.applianceForm = record
        console.log(this.applianceForm)
        this.$nextTick(() => {
          this.$refs.applianceNameSelect.getCurrent(record.name)
        })
        if(this.applianceForm.submitFlag == 1){
          this.readOnly = true
        } else {
          this.readOnly = false
        }
      },



      doCustomerSearch () {
        this.customerSelectedRow = ''
        this.customerSelectedRowInfo = {}
        this.customerModalVisible = true
        this.loadCustomerList()
      },
      doQueryCustomer () {
        this.customerModalQueryParam.pageNo = 1
        this.doCustomerSearch()
      },
      onCustomerClickRow (record, index) {
        return {
          on: {
            click: () => {
              this.customerSelectedRow = record.id
              this.customerSelectedRowInfo = record
            },
            dblclick: () => {
              this.customerSelectedRow = record.id
              this.customerSelectedRowInfo = record
              this.applianceForm.supplier = record.id
              this.applianceForm.supplierName = record.customerName
              this.customerModalVisible = false
              let validateField = ['supplierName']
              this.$refs.applianceForm.validateField(validateField, errorMessage => {
              })
            }
          }
        }
      },
      setCustomerCurrentRow (record, index) {
        return record.id === this.customerSelectedRow ? 'clickRowStyle hoverRowStyle' : ''
      },
      onCustomerModalCurrentChange (pageNo) {
        this.customerModalQueryParam.pageNo = pageNo
        this.loadCustomerList()
      },
      loadCustomerList () {
        this.isCustomerLoading = true
        getCustomerList(this.customerModalQueryParam)
          .then(res => {
            if (res.code === 200) {
              this.customerModalPage.pageNumber = res.body.pageNumber + 1
              this.customerModalPage.pageSize = res.body.pageSize
              this.customerModalPage.totalCount = res.body.totalCount
              this.customerList = res.body.items
              this.customerCurrentPage = res.body.pageNumber + 1
            }
            this.isCustomerLoading = false
          })
      },
      onCustomerModalConfirm () {
        if (!this.customerSelectedRow) {
          this.$message.warning('请先选择供货商！')
          return
        }
        this.applianceForm.supplier = this.customerSelectedRow
        this.applianceForm.supplierName = this.customerSelectedRowInfo.customerName
        this.customerModalVisible = false
        this.customerModalQueryParam.inputContent = ''
        this.customerList = []
        var validateField = ['supplierName']
        this.$refs.applianceForm.validateField(validateField, errorMessage => {})
      },
      onCustomerModalCancel () {
        this.customerSelectedRow = ''
        this.customerSelectedRowInfo = {}
        this.customerModalVisible = false
        this.customerModalQueryParam.inputContent = ''
        this.customerList = []
      },
    }
  }
</script>

<style scoped>

</style>