<template>
  <div>
    <a-select show-search
              :value="record[customLabel]"
              :disabled="disabled"
              :style="{width: disabled ? width+'px' : width-35+'px'}"
              :default-active-first-option="true"
              :show-arrow="false"
              :filter-option="false"
              :dropdownMatchSelectWidth="false"
              :dropdownStyle="{width: '400px'}"
              :getPopupContainer="triggerNode => triggerNode.parentNode"
              option-label-prop="label"
              @select="handleSelect">
      <a-select-opt-group>
        <span slot="label"><a-icon type="clock-circle" />&nbsp;常用</span>
        <a-select-option :label="item.customerName" v-for="item in historyList" :key="item.id">
          <a-row style="height: 24px; font-size: 12px">
            <a-col>
              {{ item.customerName }}
            </a-col>
          </a-row>
        </a-select-option>
      </a-select-opt-group>
    </a-select>
    <a-icon v-if="!disabled" type="search" @click="doCustomerSearch" style="margin-left: 10px;font-size: 15px"/>

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
  </div>
</template>

<script>
    import {getCustomerContractList} from "@/api/common";
    import store from "@/store";

    export default {
      name: "CustomerContactSelect",
      props: {
        width: {
          type: Number,
          default: 300,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
        record: {
          type: Object,
          default: () => {}
        },
        customKey: {
          type: String,
          default: 'customerId',
        },
        customLabel: {
          type: String,
          default: 'customerName',
        },
      },
      data() {
        return {
          historyList: [],
          customerModalVisible: false,
          isCustomerLoading: false,
          customerModalHeight: 400,
          listCustomerScrollHeight: 280,
          customerModalQueryParam: { pageNo: 1, pageSize: 25, inputContent: null },
          customerModalPage: { pageNumber: 0, pageSize: 0, totalCount: 0 },
          customerList: [],
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
        }
      },
      methods: {
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
        loadCustomerList () {
          this.isCustomerLoading = true
          getCustomerContractList(this.customerModalQueryParam).then(res => {
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
        handleSelect (value, option) {
          this.record[this.customKey] = value
          this.record[this.customLabel] = option.componentOptions.propsData.label
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
                this.record[this.customKey] = record.id
                this.record[this.customLabel] = record.customerName
                this.pushStorage(record)
                this.customerModalVisible = false
                /*let validateField = ['supplierName']
                this.$refs.applianceForm.validateField(validateField, errorMessage => {
                })*/
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
        onCustomerModalConfirm () {
          if (!this.customerSelectedRow) {
            this.$message.warning('请先选择供货商！')
            return
          }
          this.record[this.customKey] = this.customerSelectedRow
          this.record[this.customLabel] = this.customerSelectedRowInfo.customerName
          this.pushStorage(this.customerSelectedRowInfo)
          this.customerModalVisible = false
          this.customerModalQueryParam.inputContent = ''
          this.customerList = []
          /*var validateField = ['supplierName']
          this.$refs.applianceForm.validateField(validateField, errorMessage => {})*/
        },
        onCustomerModalCancel () {
          this.customerSelectedRow = ''
          this.customerSelectedRowInfo = {}
          this.customerModalVisible = false
          this.customerModalQueryParam.inputContent = ''
          this.customerList = []
        },
        pushStorage(record) {
          let historyList = JSON.parse(localStorage.getItem("customerHistory"))
          console.log(historyList)
          if(this.historyList.find(x => x.id == record.id) == null) {
            this.historyList.push({...record})
          }
          console.log(this.historyList)
          localStorage.setItem("customerHistory", JSON.stringify(this.historyList))
        }
      }
    }
</script>

<style scoped>

</style>