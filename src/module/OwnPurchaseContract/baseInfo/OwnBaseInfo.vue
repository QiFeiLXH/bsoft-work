<template>
  <a-spin :spinning="isSpinning">
    <div :style="{ height: formHeight + 'px',paddingBottom: '50px', overflowY: 'auto' }">
      <a-form-model
        :model="purchaseContractForm"
        ref="purchaseContractForm"
        :rules="purchaseContractFormRules"
        :hideRequiredMark="readOnly">
        <a-card :body-style="{ padding: '10px 0 10px 10px' }">
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="采购合同号"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="purchaseContractNo"
                style="margin-bottom: 10px;"
              >
                <a-input
                  v-if="readOnly || firstStepAudited"
                  v-model="purchaseContractForm.purchaseContractNo"
                  style="width: 250px;color: #000000"
                  :readOnly="true"/>
                <a-input
                  v-else-if="!supplementFlag"
                  v-model="purchaseContractNo"
                  style="width: 250px;color: #000000"
                  :readOnly="true"/>
                <a-input
                  v-else
                  v-model="purchaseContractForm.purchaseContractNo"
                  style="width: 250px;color: #000000"
                  :readOnly="true"/>
                <a-icon
                  v-show="supplementFlag && !readOnly && !firstStepAudited"
                  type="search"
                  @click="doContractSearch"
                  style="margin-left: 10px;font-size: 15px"/>
                <a-modal
                  title="公司采购合同选择"
                  style="top: 30px;"
                  v-model="contractModalVisible"
                  :width="700"
                  :maskClosable="false"
                  :bodyStyle="{ height: contractModalHeight }"
                  :closable="false"
                  :destroyOnClose="true">
                  <a-row style="margin-bottom: 10px;margin-top:10px;">
                    <a-input-search
                      placeholder="采购合同号/合同名称"
                      v-model="contractModalQueryParam.inputContent"
                      style="width: 270px"
                      allow-clear
                      :pressEnter="doQueryContract"
                      @search="doQueryContract"/>
                  </a-row>
                  <a-table
                    size="small"
                    :bordered="false"
                    :loading="isContractLoading"
                    :columns="contractColumns"
                    :dataSource="contractList"
                    :rowKey="(record) => record.purchaseContractId"
                    :pagination="false"
                    :customRow="onContractClickRow"
                    :rowClassName="setContractCurrentRow"
                    :scroll="{ x: false, y: listContractScrollHeight }">
                    <template slot="rowIndex" slot-scope="text, record, index">
                      <span>
                        {{ (contractCurrentPage - 1) * contractModalPage.pageSize + index + 1 }}
                      </span>
                    </template>
                  </a-table>
                  <template slot="footer">
                    <a-pagination
                      size="small"
                      :total="contractModalPage.totalCount"
                      :pageSize.sync="contractModalPage.pageSize"
                      v-model="contractModalPage.pageNumber"
                      @change="onContractModalCurrentChange"
                      style="margin-bottom: 10px"/>
                    <a-button key="submit" type="primary" @click="onContractModalConfirm">确定</a-button>
                    <a-button key="back" @click="onContractModalCancel">取消</a-button>
                  </template>
                </a-modal>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="是否补充协议"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="supplementFlag"
                style="margin-bottom: 10px;"
              >
                <a-switch
                  checked-children="是"
                  un-checked-children="否"
                  :checked="supplementFlag"
                  v-if="readOnly || firstStepAudited"/>
                <a-switch checked-children="是" un-checked-children="否" :checked="supplementFlag" v-else @click="handleSwithchChange"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="合同分类"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="classification"
                style="margin-bottom: 10px;"
              >
                <a-select
                  :value="purchaseContractForm.classification"
                  :disabled="readOnly || firstStepAudited || supplementFlag"
                  show-search
                  option-filter-prop="children"
                  style="width: 250px;color: #000000"
                  :filter-option="filterOption"
                  @change="handleClassificationChange">
                  <a-select-option v-for="item in classificationsDic" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="合同类型"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="hasContract"
                style="margin-bottom: 10px;"
              >
                <a-select
                  :value="purchaseContractForm.hasContract"
                  :disabled="readOnly || firstStepAudited || supplementFlag"
                  show-search
                  option-filter-prop="children"
                  style="width: 220px;color: #000000"
                  :filter-option="filterOption"
                  @change="handleHasContractChange">
                  <a-select-option :value="0">
                    无合同
                  </a-select-option>
                  <a-select-option :value="1">
                    有合同
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="合同金额"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="totalAmount"
                style="margin-bottom: 10px;"
              >
                <a-input-number
                  :disabled="readOnly || firstStepAudited"
                  :min="0"
                  :step="0.01"
                  v-model="purchaseContractForm.totalAmount"
                  @blur="handleTotalAmountBlur"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  :style="operation === 'audit1' ? 'width: 250px;font-size: 20px;font-weight: bold;color: black' : 'width: 250px;color: #000000'"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="合同决算金额"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="finalCostAmount"
                style="margin-bottom: 10px;"
              >
                <a-input-number
                  :disabled="readOnly || operation === 'add' || !firstStepAudited"
                  :min="0"
                  :step="0.01"
                  v-model="purchaseContractForm.finalCostAmount"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  :style="operation === 'audit1' ? 'width: 220px;font-size: 20px;font-weight: bold;color: red' : 'width: 220px;color: #000000'"></a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="签定日期"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="signDate"
                style="margin-bottom: 10px;"
              >
                <a-date-picker
                  v-model="purchaseContractForm.signDate"
                  :disabled="readOnly || firstStepAudited"
                  style="width: 250px"
                  @change="handleSignDateChange"
                  :allowClear="false"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="采购大类"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="flag"
                style="margin-bottom: 10px;"
              >
                <a-select v-model="purchaseContractForm.flag" style="width: 220px;color: #000000" :disabled="true">
                  <a-select-option :value="3">
                    募投基建
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-model-item
                label="对方单位"
                :labelCol="{lg: {span: 3}, sm: {span: 2},style: { marginLeft: '-12px'}}"
                :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                prop="suppliersText"
                style="margin-bottom: 10px;"
              >
                <a-input
                  v-model="purchaseContractForm.suppliersText"
                  style="width: 776px;color: #000000"
                  :readOnly="true"/>
                <a-icon
                  v-if="!readOnly && !firstStepAudited"
                  type="search"
                  @click="doCustomerSearch"
                  style="margin-left: 10px;font-size: 15px"/>
                <a-modal
                  title="客户往来单位选择"
                  style="top: 30px;"
                  v-model="customerModalVisible"
                  :width="700"
                  :maskClosable="false"
                  :bodyStyle="{ height: customerModalHeight }"
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
                    :scroll="{ x: false, y: listCustomerScrollHeight }">
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
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="合同名称"
                :labelCol="{lg: {span: 3}, sm: {span: 2},style: { marginLeft: '-12px'}}"
                :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                prop="contractName"
                style="margin-bottom: 10px;"
              >
                <a-input
                  v-model="purchaseContractForm.contractName"
                  style="width: 776px;color: #000000"
                  :readOnly="readOnly || firstStepAudited"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="采购内容"
                :labelCol="{lg: {span: 3}, sm: {span: 2},style: { marginLeft: '-12px'}}"
                :wrapperCol="{lg: {span: 21}, sm: {span: 20} }"
                prop="productName"
                style="margin-bottom: 10px;"
              >
                <a-textarea
                  v-model="purchaseContractForm.productName"
                  placeholder="文字输入 （200字内容）"
                  style="width: 776px;color: #000000"
                  :maxLength="200"
                  :auto-size="{ minRows: 2, maxRows: 2 }"
                  :readOnly="readOnly || firstStepAudited"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card :body-style="{ padding: '10px 0 10px 10px' }">
          <a-row>
            <a-col :span="24">
              <a-form-model-item
                label="付款条件"
                :labelCol="{lg: {span: 5}, sm: {span: 2},style: { marginLeft: '-100px'}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="paymentCondition"
                style="margin-bottom: 10px;"
              >
                <a-table
                  ref="paymentTable"
                  size="small"
                  :bordered="false"
                  :loading="isPaymentLoading"
                  :columns="paymentColumns"
                  :dataSource="paymentList"
                  :rowKey="(record) => record.id"
                  :pagination="false"
                  class="paymentClass"
                  :customRow="onPaymentClickRow"
                  :rowClassName="setPaymentCurrentRow"
                  :scroll="{ x: false, y: listPaymentScrollHeight }"
                  :style="{background: 'white', margin: '0 0'}">
                  <template slot="rowIndex" slot-scope="text, record, index">
                    <span>
                      {{ index + 1 }}
                    </span>
                  </template>
                  <template slot="paymentAccount" slot-scope="text, record">
                    <template v-if="readOnly || !record.isNew">
                      {{ record.paymentAccountText }}
                    </template>
                    <template v-else>
                      <a-select
                        :class="record.isError && !text? 'has-error': ''"
                        :value="{ key: text }"
                        show-search
                        label-in-value
                        option-filter-prop="children"
                        style="width: 100px"
                        :filter-option="filterOption"
                        @focus="handleItemFocus(record)"
                        @change="handleItemChange">
                        <a-select-option v-for="item in paymentItemsDic" :key="item.id" :value="item.id">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </template>
                  </template>
                  <template slot="payment" slot-scope="text, record">
                    <template v-if="readOnly || !record.isNew">
                      <span v-if="text > 0">￥{{ text | AmountFormat }}</span>
                    </template>
                    <template v-else>
                      <a-input-number
                        :class="record.isError && !text? 'errorClass': ''"
                        v-model="record.payment"
                        @blur="handlePaymentBlur"
                        style="width: 100%"
                        :min="0"
                        :step="0.01"
                        :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="value => value.replace(/\￥\s?|(,*)/g, '')"></a-input-number>
                    </template>
                  </template>
                  <template slot="rate" slot-scope="text">
                    <template>
                      <span v-if="text > 0">{{ text | PercentFormat(2) }}</span>
                    </template>
                  </template>
                  <template slot="remarks" slot-scope="text, record">
                    <template v-if="record.isNew && !readOnly">
                      <a-textarea
                        placeholder="文字输入 （200字内容）"
                        :class="record.isError && !text? 'errorClass': ''"
                        :auto-size="{ minRows: 2, maxRows: 2 }"
                        v-model="record.remarks"
                        :maxLength="200"/>
                    </template>
                    <template v-else>
                      {{ text }}
                    </template>
                  </template>
                  <template slot="operate" slot-scope="text, record">
                    <template v-if="record.id === paymentSelectedRow && !readOnly && !firstStepAudited">
                      <a-icon type="edit" theme="twoTone" @click="doEditPayment(record)"/>
                      <a-divider type="vertical"/>
                      <a-icon type="delete" theme="twoTone" @click="doRemovePayment(record)"/>
                    </template>
                  </template>
                  <template slot="footer">
                    <a-row>
                      <a-col :span="9">
                        <div style="text-align: right;margin-right: 10px">合计：<span :style="error?{color: 'red'}:{}">￥{{ totalPaymentAmount | AmountFormat }}</span>
                        </div>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col>
                        <div style="text-align: center">
                          <a-button @click="doAddPaymentCondition" v-if="!readOnly && !firstStepAudited">新增付款条件
                          </a-button>
                          <a-button v-else disabled>新增付款条件</a-button>
                        </div>
                      </a-col>
                    </a-row>
                  </template>
                </a-table>
                <div
                  class="ant-form-explain"
                  v-if="showError"
                  style="margin-top:2px;color: #f5222d;transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);">
                  {{ callbackMsg }}
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="合同附件"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="contractEnclosure"
                style="margin-bottom: 10px;"
              >
                <span
                  v-if="topThreeFiles.length > 0"
                  v-for="file in topThreeFiles"
                  :key="file.id"
                  @click="downloadSpecifiedFile(file)"
                  style="cursor:pointer"><img
                    :src=" require(`@/assets/fileicon/fileicon-m-${file.fileName.substring(file.fileName.lastIndexOf('.') + 1)}.png`) "
                    style="width: 30px;"/></span>
                <a @click="doHandleFileUpload" v-if="this.currentPurchaseContractId">点击设置</a>
                <span v-else style="color: lightgrey">点击设置</span>
                <a-modal
                  style="top: 30px;"
                  v-model="docModalVisible"
                  :width="700"
                  :maskClosable="false"
                  :bodyStyle="{ height: docModalHeight }"
                  :closable="false"
                  :destroyOnClose="true">
                  <a-row style="margin: 10px 0px">
                    <a-col>
                      <a-upload
                        v-if="!readOnly"
                        :customRequest="handleUpload"
                        :showUploadList="false"
                        :fileList="fileList"
                        :remove="handleRemove"
                        :beforeUpload="beforeUpload">
                        <a-button type="primary" :loading="uploading">
                          <a-icon type="upload"/>
                          上传
                        </a-button>
                      </a-upload>
                      <a-divider type="vertical" v-if="!readOnly"/>
                      <a-button @click="downloadFile" type="primary" :loading="downloading" icon="download">查看
                      </a-button>
                      <a-divider type="vertical" v-if="!readOnly"/>
                      <a-button @click="deleteFile" type="danger" v-if="!readOnly" icon="delete">删除
                      </a-button>
                    </a-col>
                  </a-row>
                  <a-table
                    size="small"
                    :scroll="{ x: false, y: 200 }"
                    :rowKey="(record) => record.id"
                    :loading="isFileLoading"
                    :columns="fileColumns"
                    :dataSource="documentList"
                    :customRow="onDocClickRow"
                    :rowClassName="setDocCurrentRow"
                    :pagination="docPagination"
                    @change="docPageChange"
                  >
                    <template slot="rowIndex" slot-scope="text, record, index">
                      <span>
                        {{ (docCurrentPage - 1) * docPagination.pageSize + index + 1 }}
                      </span>
                    </template>
                    <span slot="renderFileSize" slot-scope="text">
                      {{ text }}Mb
                    </span>
                  </a-table>
                  <template slot="footer">
                    <a-button key="back" @click="onDocModalCancel">关闭</a-button>
                  </template>
                </a-modal>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="采购合同原件"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="originalStatus"
                style="margin-bottom: 10px;"
              >
                <a-radio-group
                  v-model="purchaseContractForm.originalStatus"
                  button-style="solid"
                  :disabled="readOnly || firstStepAudited">
                  <a-radio-button :value="1">已回</a-radio-button>
                  <a-radio-button :value="2">未回</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card :body-style="{ padding: '10px 0 10px 10px' }">
          <a-row>
            <a-col :span="13">
              <a-form-model-item
                label="签定人"
                :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                prop="signer"
                style="margin-bottom: 10px;"
              >
                <person-select
                  ref="person"
                  v-model="purchaseContractForm.signer"
                  style="color: #000000;width:220px"
                  :disabled="readOnly || firstStepAudited"></person-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item
                label="签定部门"
                :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                prop="signDept"
                style="margin-bottom: 10px;"
              >
                <memory-select
                  :storageKey="'OwnBaseInfo_deptUseful_01'"
                  ref="dept"
                  :allowClear="false"
                  v-model="purchaseContractForm.signDept"
                  style="width:220px"
                  :disabled="readOnly || firstStepAudited"></memory-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div v-if="this.operation === 'read'">
            <a-row>
              <a-col :span="13">
                <a-form-model-item
                  label="已支付金额"
                  :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                  prop="payAmount"
                  style="margin-bottom: 10px;"
                >
                  <a-input-number
                    :disabled="true"
                    :step="0.01"
                    v-model="purchaseContractForm.payAmount"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                    style="width: 220px;color: #000000"></a-input-number>
                </a-form-model-item>
              </a-col>
              <a-col :span="11">
                <a-form-model-item
                  label="剩余未支付金额"
                  :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                  prop="unpaidAmount"
                  style="margin-bottom: 10px;"
                >
                  <a-input-number
                    :disabled="true"
                    :step="0.01"
                    v-model="unpaidAmount"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                    style="width: 220px;color: #000000"></a-input-number>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="13">
                <a-form-model-item
                  label="合同进度"
                  :labelCol="{lg: {span: 5}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 19}, sm: {span: 20} }"
                  prop="progress"
                  style="margin-bottom: 10px;"
                >
                  <a-input-number
                    :disabled="true"
                    v-model="purchaseContractForm.progress"
                    style="width: 220px;color: #000000"></a-input-number>
                </a-form-model-item>
              </a-col>
              <a-col :span="11">
                <a-form-model-item
                  label="确认时间"
                  :labelCol="{lg: {span: 7}, sm: {span: 2}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
                  prop="confirmDate"
                  style="margin-bottom: 10px;"
                >
                  <a-date-picker
                    v-model="purchaseContractForm.confirmDate"
                    :disabled="true"
                    style="width: 220px"
                    :allowClear="false"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-form-model>
    </div>

  </a-spin>
</template>

<script>
import {
  loadCustomerSelectList,
  loadContractSelectList,
  doLoadDic,
  doSavePurchaseContract,
  doLoadPaymentList,
  getPurchaseContractNo,
  existPurchaseContractNo,
  getPurchaseContract,
  getOwnSuplementCount
} from '@/api/ownPurchaseContractList'
import MemorySelect from '@/components/MemorySelect/MemoryDeptSelect'
import { doAuditPurchaseContract, doDisagreePurchaseContract } from '@/api/ownPurchaseContractAudit'
import { fileUpload, fileDownload, fileDelete, doLoadFilesUploadedList } from '@/api/publicWords'
import moment from 'moment/moment'
import { downFile } from '@/utils/util'
import { PersonSelect, DeptSelect } from '@/module'
import { Decimal } from 'decimal.js'
import store from '@/store'

const userInfo = store.getters.userInfo

const fileColumns = [
  {
    title: '序号',
    dataIndex: 'rowIndex',
    scopedSlots: { customRender: 'rowIndex' },
    width: '8%'
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
    width: '45%'
  },
  {
    title: '大小',
    dataIndex: 'fileSize',
    width: '12%',
    scopedSlots: { customRender: 'renderFileSize' }
  },
  {
    title: '上传人',
    dataIndex: 'uploaderName',
    width: '15%'
  },
  {
    title: '上传日期',
    dataIndex: 'uploadDate',
    width: '20%'
  }
]
export default {
  name: 'OwnBaseInfo',
  components: {
    PersonSelect,
    DeptSelect,
    MemorySelect
  },
  data () {
    var validatePayments = (rule, value, callback) => {
      if (this.paymentList.length === 0) {
        callback()
        this.callbackMsg = '请填写付款条件！'
        this.showError = true
      } else if (this.isError) {
        callback()
        this.callbackMsg = '数据内容不能为空，内容请填写完整！'
        this.showError = true
      } else {
        this.showError = false
        callback()
      }
    }
    return {
      boolValue: false,
      moment,
      customerModalVisible: false,
      contractModalVisible: false,
      docModalVisible: false,
      formHeight: window.innerHeight - 60,
      purchaseContractData: {},
      readOnly: false,
      firstStepAudited: false,
      isSpinning: false,
      purchaseContractForm: {},
      customerModalHeight: 400 + 'px',
      contractModalHeight: 400 + 'px',
      docModalHeight: 400 + 'px',
      isContractLoading: false,
      isCustomerLoading: false,
      isFileLoading: false,
      isPaymentLoading: false,
      downloading: false,
      uploading: false,
      customerColumns: [
        {
          dataIndex: 'rowIndex',
          title: '',
          width: '10%',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'customerName',
          title: '客户名称',
          width: '90%'
        }
      ],
      contractColumns: [
        {
          dataIndex: 'rowIndex',
          title: '',
          width: '10%',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'purchaseContractNo',
          title: '采购合同号',
          width: '30%'
        },
        {
          dataIndex: 'contractName',
          title: '合同名称',
          width: '60%'
        }
      ],
      paymentColumns: [
        {
          dataIndex: 'rowIndex',
          title: '',
          width: '5%',
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          dataIndex: 'paymentAccount',
          title: '付款科目',
          width: '16%',
          scopedSlots: { customRender: 'paymentAccount' }
        },
        {
          dataIndex: 'payment',
          title: '付款金额',
          width: '17%',
          scopedSlots: { customRender: 'payment' }
        },
        {
          dataIndex: 'rate',
          title: '比例',
          width: '9%',
          scopedSlots: { customRender: 'rate' }
        },
        {
          dataIndex: 'remarks',
          title: '付款条件',
          width: '43%',
          scopedSlots: { customRender: 'remarks' }
        },
        {
          dataIndex: 'operate',
          title: '',
          width: '10%',
          scopedSlots: { customRender: 'operate' },
          align: 'right'
        }

      ],
      fileColumns,
      paymentSelectedRow: '',
      customerSelectedRow: '',
      customerSelectedRowInfo: {},
      contractSelectedRow: '',
      contractSelectedRowInfo: {},
      rowDocSelected: '',
      rowDocSelectedInfo: {},
      customerList: [],
      contractList: [],
      documentList: [],
      paymentList: [],
      fileList: [],
      fileTypesDic: [],
      paymentItemsDic: [],
      classificationsDic: [],
      listCustomerScrollHeight: 280,
      listContractScrollHeight: 280,
      listPaymentScrollHeight: 250,
      customerModalPage: { pageNumber: 0, pageSize: 0, totalCount: 0 },
      contractModalPage: { pageNumber: 0, pageSize: 0, totalCount: 0 },
      docPagination: {
        total: 0,
        size: 'small',
        current: 0,
        pageSize: 0
      },
      customerModalQueryParam: { pageNo: 1, pageSize: 25, inputContent: null },
      contractModalQueryParam: { pageNo: 1, pageSize: 25, inputContent: null, purchaseContractId: null },
      docQueryParam: { pageNo: 1, pageSize: 25, mainId: null, menuId: null, type: 1 },
      customerCurrentPage: 1,
      contractCurrentPage: 1,
      docCurrentPage: 1,
      currentPurchaseContractId: null,
      countNumber: 0,
      paymentDeletes: [],
      unpaidAmount: 0,
      purchaseContractFormRules: {
        signDate: [{ required: true, message: '请选择签定日期!', trigger: 'change' }],
        suppliersText: [{ required: true, message: '请选择对方单位!', trigger: 'change' }],
        totalAmount: [{ required: true, message: '请填写采购金额!', trigger: 'blur' }],
        classification: [{ required: true, message: '请选择合同分类!', trigger: 'change' }],
        hasContract: [{ required: true, message: '请选择合同类型!', trigger: 'change' }],
        flag: [{ required: true, message: '请选择采购大类!', trigger: 'change' }],
        contractName: [{ required: true, message: '请填写合同名称!', trigger: 'blur' }],
        productName: [{ required: true, message: '请填写采购内容!', trigger: 'blur' }],
        signer: [{ required: true, message: '请选择签定人!', trigger: 'change' }],
        signDept: [{ required: true, message: '请选择签定部门!', trigger: 'change' }],
        originalStatus: [{ required: true, message: '请选择采购合同原件!', trigger: 'change' }],
        paymentCondition: [{ required: true, validator: validatePayments }],
        finalCostAmount: [{ required: true, message: '请填写合同决算金额!', trigger: 'blur' }]
      },
      isError: false,
      showError: false,
      callbackMsg: '',
      topThreeFiles: [],
      supplementFlag: false,
      generateFlag: false, // 用于修改采购合同（补充协议）时是否会重新生成采购合同号
      supplementPurchaseContract: {},
      originalPurchaseContract: {},
      error: false,
      signDateStr: ''
    }
  },
  props: {
    baseInfo: {
      type: Object,
      default: null
    },
    operation: {
      type: String,
      default: ''
    },
    usageFlag: {
      type: Number,
      default: 0
    },
    purchaseContractId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClassificationChange (val) {
      if (this.currentPurchaseContractId > 0 && this.purchaseContractForm.purchaseContractNo) {
        const me = this
        this.$confirm({
          title: '修改后可能会重新生成新的合同号，是否继续？',
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
            me.purchaseContractForm.classification = val
          }
        })
      } else {
        this.purchaseContractForm.classification = val
      }
    },
    handleHasContractChange (val) {
      if (this.currentPurchaseContractId > 0 && this.purchaseContractForm.purchaseContractNo) {
        const me = this
        this.$confirm({
          title: '修改后可能会重新生成新的合同号，是否继续？',
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
            me.purchaseContractForm.hasContract = val
          }
        })
      } else {
        this.purchaseContractForm.hasContract = val
      }
    },
    handleSignDateChange (val) {
      if (this.currentPurchaseContractId > 0 && this.purchaseContractForm.purchaseContractNo) {
        const me = this
        this.$confirm({
          title: '修改后可能会重新生成新的合同号，是否继续？',
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
            me.purchaseContractForm.signDate = val
            me.signDateStr = val.format('YYYYMMDD')
          }
        })
      } else {
        this.purchaseContractForm.signDate = val
        this.signDateStr = val.format('YYYYMMDD')
      }
    },
    doCustomerSearch () {
      this.customerSelectedRow = ''
      this.customerSelectedRowInfo = {}
      this.customerModalVisible = true
      this.loadCustomerList()
    },
    doContractSearch () {
      this.contractSelectedRow = ''
      this.contractSelectedRowInfo = {}
      this.contractModalVisible = true
      this.loadContractList()
    },
    doQueryCustomer () {
      this.customerModalQueryParam.pageNo = 1
      this.doCustomerSearch()
    },
    doQueryContract () {
      this.contractModalQueryParam.pageNo = 1
      this.doContractSearch()
    },
    handleTotalAmountBlur () {
      if (this.purchaseContractForm.totalAmount && this.purchaseContractForm.totalAmount > 0 && this.paymentList.length > 0) {
        const data = [...this.paymentList]
        data.forEach(item => {
          if (item.payment > 0) {
            item.rate = new Decimal(item.payment).dividedBy(new Decimal(this.purchaseContractForm.totalAmount)).toFixed(4)
          }
        })
        this.paymentList = data
      }
    },
    doHandleFileUpload () {
      this.docModalVisible = true
      this.loadUploadedDocList()
    },
    doEditPayment (record) {
      this.paymentSelectedRow = record.id
      var newData = [...this.paymentList]
      var target = newData.find(item => item.id === this.paymentSelectedRow)
      if (target) {
        target.isNew = true
      }
      this.paymentList = newData
    },
    doRemovePayment (record) {
      this.paymentSelectedRow = record.id
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
          if (me.paymentSelectedRow > 0) {
            me.paymentDeletes.push(me.paymentSelectedRow)
          }
          me.paymentList = me.paymentList.filter(item => item.id !== me.paymentSelectedRow)
          me.paymentSelectedRow = ''
        }
      })
    },
    doAddPaymentCondition () {
      this.countNumber = this.countNumber - 1
      this.paymentList.push({
        id: this.countNumber,
        contractId: this.currentPurchaseContractId,
        paymentAccount: '',
        paymentAccountText: '',
        payment: null,
        rate: null,
        remarks: '',
        isNew: true
      })
      this.scrollToBottom()
    },
    doDisagree () {
      const me = this
      this.$confirm({
        title: '是否退回该采购合同？',
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
          var id = me.purchaseContractId
          var oldStatus = me.purchaseContractForm.status
          doDisagreePurchaseContract({ contractId: id, oldStatus: oldStatus }).then(res => {
            if (res.code === 200) {
              me.$message.success('驳回成功！')
              me.$emit('refresh', true)
              me.onDrawerClose()
            }
          })
        }
      })
    },
    doAudit () {
      var id = this.currentPurchaseContractId
      var oldStatus = this.purchaseContractForm.status
      doAuditPurchaseContract({ contractId: id, oldStatus: oldStatus }).then(res => {
        if (res.code === 200) {
          this.$message.success('审核成功！')
          this.$emit('refresh', true)
          this.onDrawerClose()
        }
      })
    },
    existPurchaseContractNo (purchaseContract, flag, btn) {
      existPurchaseContractNo({ purchaseContractNo: purchaseContract.purchaseContractNo })
        .then(res => {
          if (res.code === 200) {
            if (!res.body) {
              this.saveFunc(purchaseContract, flag, btn)
            } else {
              this.$message.error(purchaseContract.purchaseContractNo + '-该采购合同号已存在，请检查后修改！')
            }
          }
        })
    },
    saveFunc (purchaseContract, flag, btn) {
      if (purchaseContract.supplementFlag === 0) {
        purchaseContract.originalContractId = null
      }
      this.isSpinning = true
      doSavePurchaseContract({
        purchaseContract: purchaseContract,
        saves: this.paymentList,
        deletes: this.paymentDeletes
      })
        .then(res => {
          if (res.code === 200) {
            this.isSpinning = false
            this.currentPurchaseContractId = res.body
            this.purchaseContractForm.purchaseContractId = res.body
            this.originalPurchaseContract = { ...this.purchaseContractForm }
            if (btn === 'save') {
              this.$message.success('保存成功！')
            } else {
              this.$message.success('提交成功！')
            }
            if (flag === 1) {
              // 保存不关闭
              this.loadPurchaseContract()
              this.getTopThreeFiles()
            } else {
              // 提交关闭
              this.onDrawerClose()
            }
            this.$emit('refresh', true)
          }
          this.isSpinning = false
        })
    },
    doInfoSave () {
      if (this.isSpinning) {
        return
      }
      var validateResult = true
      var validateField = ['contractName']
      this.$refs.purchaseContractForm.validateField(validateField, errorMessage => {
        if (errorMessage) {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      var purchaseContract = {}
      Object.assign(purchaseContract, this.purchaseContractForm)
      if (purchaseContract.signDate) {
        purchaseContract.signDate = purchaseContract.signDate.format('YYYY-MM-DD')
      }
      purchaseContract.supplementFlag = this.supplementFlag ? 1 : 0
      if (this.supplementFlag && purchaseContract.purchaseContractNo === this.supplementPurchaseContract.purchaseContractNo) {
        this.$message.warning('补充协议采购合同号与原采购合同号冲突，请修改补充协议采购合同号！')
        return
      }
      if (this.supplementFlag && !purchaseContract.originalContractId) {
        this.$message.warning('请选择补充协议原合同！')
        return
      }
      purchaseContract.status = -1
      if ((this.originalPurchaseContract.purchaseContractId === purchaseContract.purchaseContractId && this.originalPurchaseContract.purchaseContractNo === purchaseContract.purchaseContractNo) || !purchaseContract.purchaseContractNo) {
        this.saveFunc(purchaseContract, 1, 'save')
      } else {
        this.existPurchaseContractNo(purchaseContract, 1, 'save')
      }
    },
    doInfoCommit () {
      if (this.isSpinning) {
        return
      }
      var validateResult = true
      this.$refs.purchaseContractForm.validate(valid => { // 校验
        if (valid) {
        } else {
          validateResult = false
        }
      })
      var newData = [...this.paymentList]
      var totalPaymentAmount = 0
      if (newData.length > 0) {
        newData.forEach(item => {
          if (!item.paymentAccount || !item.payment || !item.remarks) {
            item.isNew = true
            item.isError = true
            validateResult = false
          } else {
            item.isError = false
          }
          if (item.payment) {
            totalPaymentAmount = new Decimal(totalPaymentAmount).add(new Decimal(item.payment)).toNumber()
          }
        })
      } else {
        validateResult = false
      }
      if (totalPaymentAmount > this.purchaseContractForm.totalAmount) {
        this.$message.error('付款总和不能超过合同金额！')
        this.error = true
        validateResult = false
      } else {
        this.error = false
      }
      this.paymentList = newData
      if (this.paymentList.filter(item => item.isError).length > 0) {
        this.isError = true
      } else {
        this.isError = false
      }
      var validateField = ['paymentCondition']
      this.$refs.purchaseContractForm.validateField(validateField, errorMessage => {
        if (errorMessage) {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }

      var purchaseContract = {}
      Object.assign(purchaseContract, this.purchaseContractForm)
      if (purchaseContract.signDate) {
        purchaseContract.signDate = purchaseContract.signDate.format('YYYY-MM-DD')
      }
      purchaseContract.supplementFlag = this.supplementFlag ? 1 : 0
      if (this.supplementFlag && purchaseContract.purchaseContractNo === this.supplementPurchaseContract.purchaseContractNo) {
        this.$message.warning('补充协议采购合同号与原采购合同号冲突，请修改补充协议采购合同号！')
        return
      }
      if (this.supplementFlag && !purchaseContract.originalContractId) {
        this.$message.warning('请选择补充协议原合同！')
        return
      }
      purchaseContract.status = purchaseContract.status > 1 ? purchaseContract.status : 0
      if (this.originalPurchaseContract.purchaseContractId === purchaseContract.purchaseContractId && this.originalPurchaseContract.purchaseContractNo === purchaseContract.purchaseContractNo) {
        this.saveFunc(purchaseContract, 2, 'commit')
      } else {
        this.existPurchaseContractNo(purchaseContract, 2, 'commit')
      }
    },
    handlePaymentBlur () {
      if (this.purchaseContractForm.totalAmount && this.purchaseContractForm.totalAmount > 0) {
        const data = [...this.paymentList]
        var target = data.find(item => this.paymentSelectedRow === item.id)
        target.rate = new Decimal(target.payment).dividedBy(new Decimal(this.purchaseContractForm.totalAmount)).toFixed(4)
        this.paymentList = data
      }
    },
    initFormFields () {
      this.purchaseContractForm = {
        purchaseContractId: null,
        purchaseContractNo: '',
        signDept: undefined,
        signDeptName: null,
        suppliers: null,
        suppliersText: null,
        totalAmount: null,
        hasContract: 1,
        signer: null,
        signerText: null,
        signDate: moment(),
        payAmount: null,
        flag: 3,
        originalStatus: null,
        endMark: null,
        productName: null,
        finalCostAmount: null,
        status: null,
        contractName: null,
        classification: undefined,
        progress: null,
        confirmDate: null,
        paymentCondition: null,
        supplementFlag: 0,
        originalContractId: null,
        committed: 0
      }
      this.signDateStr = this.purchaseContractForm.signDate.format('YYYYMMDD')
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
            this.purchaseContractForm.suppliers = record.id
            this.purchaseContractForm.suppliersText = record.customerName
            this.customerModalVisible = false
            var validateField = ['suppliersText']
            this.$refs.purchaseContractForm.validateField(validateField, errorMessage => {
            })
          }
        }
      }
    },
    setCustomerCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.customerSelectedRow) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onContractClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.contractSelectedRow = record.purchaseContractId
            this.contractSelectedRowInfo = record
          },
          dblclick: () => {
            this.supplementPurchaseContract = record
            this.contractSelectedRow = record.purchaseContractId
            this.contractSelectedRowInfo = record
            this.getSupplementCount(record.purchaseContractId)
            this.purchaseContractForm.originalContractId = record.purchaseContractId
            this.purchaseContractForm.classification = record.classification
            this.purchaseContractForm.hasContract = record.hasContract
            this.purchaseContractForm.contractName = this.contractSelectedRowInfo.contractName + '-补充协议'
            this.purchaseContractForm.suppliers = this.contractSelectedRowInfo.suppliers
            this.purchaseContractForm.suppliersText = this.contractSelectedRowInfo.suppliersText
            this.purchaseContractForm.signDate = moment()
            this.contractModalVisible = false
          }
        }
      }
    },
    setContractCurrentRow (record, index) {
      var styleClassName = ''
      if (record.purchaseContractId === this.contractSelectedRow) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onDocClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.rowDocSelected = record.id
            this.rowDocSelectedInfo = record
          }
        }
      }
    },
    setDocCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.rowDocSelected) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onPaymentClickRow (record, index) {
      return {
        on: {
          click: () => {
            this.paymentSelectedRow = record.id
          }
        }
      }
    },
    setPaymentCurrentRow (record, index) {
      var styleClassName = ''
      if (record.id === this.paymentSelectedRow) {
        styleClassName = 'clickRowStyle hoverRowStyle'
      }
      return styleClassName
    },
    onCustomerModalCurrentChange (pageNo) {
      this.customerModalQueryParam.pageNo = pageNo
      this.loadCustomerList()
    },
    onContractModalCurrentChange (pageNo) {
      this.contractModalQueryParam.pageNo = pageNo
      this.loadContractList()
    },
    handleItemFocus (record) {
      this.paymentSelectedRow = record.id
    },
    handleItemChange (data) {
      const newData = [...this.paymentList]
      const target = newData.find(item => this.paymentSelectedRow === item.id)
      if (target) {
        target['paymentAccount'] = data.key
        target['paymentAccountText'] = data.label
        this.paymentList = newData
      }
    },
    loadCustomerList () {
      this.isCustomerLoading = true
      loadCustomerSelectList(this.customerModalQueryParam)
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
    loadContractList () {
      this.isContractLoading = true
      loadContractSelectList(this.contractModalQueryParam)
        .then(res => {
          if (res.code === 200) {
            this.contractModalPage.pageNumber = res.body.pageNumber + 1
            this.contractModalPage.pageSize = res.body.pageSize
            this.contractModalPage.totalCount = res.body.totalCount
            this.contractList = res.body.items
            this.contractCurrentPage = res.body.pageNumber + 1
          }
          this.isContractLoading = false
        })
    },
    onCustomerModalConfirm () {
      if (!this.customerSelectedRow) {
        this.$message.warning('请先选择对方单位！')
        return
      }
      this.purchaseContractForm.suppliers = this.customerSelectedRow
      this.purchaseContractForm.suppliersText = this.customerSelectedRowInfo.customerName
      this.customerModalVisible = false
      this.customerModalQueryParam.inputContent = ''
      this.customerList = []
      var validateField = ['suppliersText']
      this.$refs.purchaseContractForm.validateField(validateField, errorMessage => {
      })
    },
    onCustomerModalCancel () {
      this.customerSelectedRow = ''
      this.customerSelectedRowInfo = {}
      this.customerModalVisible = false
      this.customerModalQueryParam.inputContent = ''
      this.customerList = []
    },
    onContractModalConfirm () {
      if (!this.contractSelectedRow) {
        this.$message.warning('请先选择公司采购合同！')
        return
      }
      this.supplementPurchaseContract = this.contractSelectedRowInfo
      this.getSupplementCount(this.contractSelectedRowInfo.purchaseContractId)
      this.purchaseContractForm.originalContractId = this.contractSelectedRowInfo.purchaseContractId
      this.purchaseContractForm.classification = this.contractSelectedRowInfo.classification
      this.purchaseContractForm.hasContract = this.contractSelectedRowInfo.hasContract
      this.purchaseContractForm.contractName = this.contractSelectedRowInfo.contractName + '-补充协议'
      this.purchaseContractForm.suppliers = this.contractSelectedRowInfo.suppliers
      this.purchaseContractForm.suppliersText = this.contractSelectedRowInfo.suppliersText
      this.purchaseContractForm.signDate = moment()
      this.contractModalVisible = false
      this.contractModalQueryParam.inputContent = ''
      this.contractList = []
    },
    onContractModalCancel () {
      this.contractSelectedRow = ''
      this.contractSelectedRowInfo = {}
      this.contractModalVisible = false
      this.contractModalQueryParam.inputContent = ''
      this.contractList = []
    },
    onDocModalCancel () {
      this.rowDocSelected = ''
      this.rowDocSelectedInfo = {}
      this.docModalVisible = false
    },
    onDrawerClose () {
      this.$emit('closeDrawer', true)
    },
    beforeUpload (file) {
      if (this.readOnly) {
        return
      }
      const isLt20M = file.size / 1024 / 1024 < 20
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)
      const index = this.fileTypesDic.findIndex(obj => obj.name === suffix)
      if (!isLt20M) {
        this.$message.error('单个文件不超过20M!')
        return false
      } else if (index === -1) {
        this.$message.error('文件格式不对!')
        return false
      } else {
        this.fileList = [file]
        return true
      }
    },
    handleUpload () {
      if (this.readOnly) {
        return
      }
      this.uploading = true
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      formData.append('menuId', this.$route.meta.id) // 菜单id
      formData.append('contractId', this.currentPurchaseContractId)
      const me = this
      fileUpload(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('文件上传成功！')
          this.loadUploadedDocList()
          this.getTopThreeFiles()
        }
        me.uploading = false
      })
    },
    handleRemove (file) {
      if (this.readOnly) {
        return
      }
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    downloadFile () {
      if (!this.rowDocSelected) {
        this.$message.error('未选择文档')
        return
      }
      this.downloading = true
      const param = { fileId: this.rowDocSelectedInfo.fileId, wordId: this.rowDocSelected }
      fileDownload(param).then(res => {
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
          this.downloading = false
        }
        this.downloading = false
      })
    },
    downloadSpecifiedFile (file) {
      this.$confirm({
        title: '是否下载查看该文档?',
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
          const param = { fileId: file.fileId, wordId: file.id }
          fileDownload(param).then(res => {
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
          })
        }
      })
    },
    deleteFile () {
      if (this.readOnly) {
        return
      }
      if (!this.rowDocSelected) {
        this.$message.error('未选择文档')
        return
      }
      const me = this
      this.$confirm({
        title: '是否确认删除该文档?',
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
          const param = { fileId: me.rowDocSelectedInfo.fileId, wordId: me.rowDocSelected }
          fileDelete(param).then(res => {
            if (res.code === 200) {
              me.$message.success('删除成功')
              me.rowDocSelectedInfo = {}
              me.rowDocSelected = ''
              me.loadUploadedDocList()
              me.getTopThreeFiles()
            }
          })
        }
      })
    },
    loadUploadedDocList () {
      this.isFileLoading = true
      doLoadFilesUploadedList(this.docQueryParam)
        .then(res => {
          if (res.code === 200) {
            this.docPagination.current = res.body.pageNumber + 1
            this.docCurrentPage = res.body.pageNumber + 1
            this.docPagination.pageSize = res.body.pageSize
            this.docPagination.total = res.body.totalCount
            this.documentList = res.body.items
            this.isFileLoading = false
          }
          this.isFileLoading = false
        })
    },
    getTopThreeFiles () {
      if (this.currentPurchaseContractId === 0) {
        return
      }
      this.docQueryParam.menuId = this.usageFlag === 1 ? Number(this.$route.meta.id) : null
      this.docQueryParam.mainId = this.currentPurchaseContractId
      this.topThreeFiles = []
      doLoadFilesUploadedList(this.docQueryParam)
        .then(res => {
          if (res.code === 200) {
            if (res.body.items.length > 0) {
              this.topThreeFiles = res.body.items.slice(0, 3)
            }
          }
        })
    },
    loadPaymentList () {
      this.isPaymentLoading = true
      doLoadPaymentList({ contractId: this.currentPurchaseContractId, alterFlag: 0 })
        .then(res => {
          if (res.code === 200) {
            this.paymentList = res.body
            if (this.purchaseContractForm.totalAmount && this.purchaseContractForm.totalAmount > 0 && res.body.length > 0) {
              const data = [...this.paymentList]
              this.paymentList.forEach(item => {
                if (item.payment && item.payment > 0) {
                  item.rate = new Decimal(item.payment).dividedBy(new Decimal(this.purchaseContractForm.totalAmount)).toFixed(4)
                }
              })
              this.paymentList = data
            }
            this.isPaymentLoading = false
          }
          this.isPaymentLoading = false
        })
    },
    docPageChange (pagination) {
      this.docQueryParam.pageNo = pagination.current
      this.loadUploadedDocList()
    },
    getDicData () {
      doLoadDic()
        .then(res => {
          if (res.code === 200) {
            this.fileTypesDic = res.body.fileTypes
            this.paymentItemsDic = res.body.paymentItems
            this.classificationsDic = res.body.contractClassifications
          }
        })
    },
    getSupplementCount (purchaseContractId) {
      getOwnSuplementCount({ purchaseContractId: purchaseContractId }).then(res => {
        if (res.code === 200) {
          var supplementCount = res.body + 1
          this.purchaseContractForm.purchaseContractNo = this.contractSelectedRowInfo.purchaseContractNo + '(' + supplementCount + ')'
        }
      })
    },
    scrollToBottom () {
      const table = this.$refs.paymentTable.$el
      // 获取到具有 'scroll' 属性的这一层dom元素
      const tableBody = table.querySelector('.ant-table-body')
      if (tableBody) {
        this.$nextTick(() => {
          tableBody.scrollTop = tableBody.scrollHeight
        })
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    initPageData (purchaseContract) {
      this.contractModalQueryParam.purchaseContractId = this.currentPurchaseContractId
      this.purchaseContractForm = { ...purchaseContract }
      if (this.purchaseContractForm.signDate) {
        this.purchaseContractForm.signDate = moment(this.purchaseContractForm.signDate)
      } else {
        this.purchaseContractForm.signDate = moment()
      }
      this.signDateStr = this.purchaseContractForm.signDate.format('YYYYMMDD')
      if (this.purchaseContractForm.confirmDate) {
        this.purchaseContractForm.confirmDate = moment(this.purchaseContractForm.confirmDate)
      } else {
        this.purchaseContractForm.confirmDate = null
      }
      this.supplementFlag = this.purchaseContractForm.supplementFlag === 1
      this.$nextTick(() => {
        this.$refs.person.getCurrent(this.purchaseContractForm.signer, this.purchaseContractForm.signerText)
        this.$refs.dept.getCurrent(this.purchaseContractForm.signDept, this.purchaseContractForm.signDeptName)
      })
      if (!this.purchaseContractForm.totalAmount && !this.purchaseContractForm.payAmount) {
        this.unpaidAmount = null
      } else {
        if (this.purchaseContractForm.finalCostAmount && this.purchaseContractForm.status === 3) {
          this.unpaidAmount = this.purchaseContractForm.payAmount ? this.purchaseContractForm.finalCostAmount - this.purchaseContractForm.payAmount : this.purchaseContractForm.finalCostAmount
        } else {
          this.unpaidAmount = this.purchaseContractForm.payAmount ? this.purchaseContractForm.totalAmount - this.purchaseContractForm.payAmount : this.purchaseContractForm.totalAmount
        }
      }
      this.originalPurchaseContract = { ...this.purchaseContractForm }
      this.loadPaymentList()
    },
    resetFields () {
      this.$refs.purchaseContractForm.resetFields()
    },
    resetForm () {
      this.initFormFields()
      this.fileList = []
      this.customerList = []
      this.contractList = []
      this.documentList = []
      this.paymentList = []
      this.fileTypesDic = []
      this.paymentItemsDic = []
      this.topThreeFiles = []
      this.customerModalPage = { pageNumber: 0, pageSize: 0, totalCount: 0 }
      this.contractModalPage = { pageNumber: 0, pageSize: 0, totalCount: 0 }
      this.docPagination = {
        total: 0,
        size: 'small',
        current: 0,
        pageSize: 0
      }
      this.customerModalQueryParam = { pageNo: 1, pageSize: 25, inputContent: null }
      this.docQueryParam = { pageNo: 1, pageSize: 25, mainId: null, menuId: null, type: 1 }
      this.contractModalQueryParam = { pageNo: 1, pageSize: 25, inputContent: null, purchaseContractId: null }
      this.customerCurrentPage = 1
      this.contractCurrentPage = 1
      this.docCurrentPage = 1
      this.purchaseContractId = null
      this.isError = false
      this.showError = false
      this.supplementFlag = false
      this.supplementPurchaseContract = {}
      this.originalPurchaseContract = {}
      this.error = false
      this.$nextTick(() => {
        this.$refs.person.getCurrent(null, null)
        this.$refs.dept.getCurrent(null, null)
      })
      this.paymentSelectedRow = ''
      this.customerSelectedRow = ''
      this.customerSelectedRowInfo = {}
      this.contractSelectedRow = ''
      this.contractSelectedRowInfo = {}
      this.rowDocSelected = ''
      this.rowDocSelectedInfo = {}
    },
    loadPurchaseContract () {
      this.isSpinning = true
      var param = { purchaseContractId: this.currentPurchaseContractId }
      getPurchaseContract(param).then((res) => {
        if (res.code === 200) {
          var purchaseContract = res.body
          this.initPageData(purchaseContract)
          this.isSpinning = false
        }
        this.isSpinning = false
      })
    },
    handleSwithchChange (checked) {
      var bool = this.purchaseContractForm.purchaseContractNo.includes('(')
      if (this.supplementFlag && this.currentPurchaseContractId && !checked && bool) {
        const me = this
        this.$confirm({
          title: '修改后可能会重新生成新的合同号，是否继续？',
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
            me.supplementFlag = checked
            me.generateFlag = true
          }
        })
      } else {
        this.supplementFlag = checked
        this.generateFlag = false
      }

      if (!checked) {
        this.purchaseContractForm.originalContractId = null
      }
    },
    initPage () {
      this.getDicData()
      this.initFormFields()
      if (this.operation === 'read' || this.operation === 'audit0' || this.operation === 'audit1') {
        this.currentPurchaseContractId = this.purchaseContractId
        this.loadPurchaseContract()
        this.getTopThreeFiles()
        this.readOnly = true
      }
      if (this.operation === 'modify') {
        this.currentPurchaseContractId = this.purchaseContractId
        this.loadPurchaseContract()
        this.getTopThreeFiles()
        this.readOnly = false
      }
      if (this.operation === 'add') {
        this.$nextTick(() => {
          this.$refs.person.getCurrent(userInfo.personId, userInfo.personName)
          this.$refs.dept.getCurrent(userInfo.deptId, userInfo.deptIdText)
        })
        this.purchaseContractForm.signer = userInfo.personId
        this.purchaseContractForm.signDept = userInfo.deptId
        this.readOnly = false
      }
      const rules = { ...this.purchaseContractFormRules }
      if (this.operation === 'finalcost') {
        this.firstStepAudited = true
        this.readOnly = false
        this.currentPurchaseContractId = this.purchaseContractId
        this.loadPurchaseContract()
        this.getTopThreeFiles()
        rules.finalCostAmount = [{ required: true, message: '请填写合同决算金额!', trigger: 'blur' }]
      } else {
        this.firstStepAudited = false
        delete rules.finalCostAmount
      }
      this.purchaseContractFormRules = rules
    },
    doGenerateContractNo (bool) {
      if (bool) { // 若有一值为空则返回
        return
      }
      const params = {
        hasContract: this.purchaseContractForm.hasContract,
        classification: this.purchaseContractForm.classification,
        signDate: this.signDateStr
      }
      getPurchaseContractNo(params)
        .then(res => {
          if (res.code === 200) {
            this.purchaseContractForm.purchaseContractNo = res.body
          }
        })
    },
    calculateTotalAmount () {
      var totalPaymentAmount = 0
      if (this.paymentList.length > 0) {
        this.paymentList.forEach(item => {
          if (item.payment) {
            totalPaymentAmount = new Decimal(totalPaymentAmount).add(new Decimal(item.payment)).toNumber()
          }
        })
      }
      return totalPaymentAmount
    }
  },
  computed: {
    purchaseContractNo: function () {
      var bool = this.originalPurchaseContract.classification === this.purchaseContractForm.classification && this.originalPurchaseContract.flag === this.purchaseContractForm.flag && this.originalPurchaseContract.hasContract === this.purchaseContractForm.hasContract && (this.originalPurchaseContract.signDate && this.originalPurchaseContract.signDate.format('YYYYMMDD') === this.signDateStr)
      if (this.readOnly || this.supplementFlag || this.firstStepAudited || (this.currentPurchaseContractId && bool && !this.generateFlag)) {
        return this.originalPurchaseContract.purchaseContractNo
      } else {
        this.doGenerateContractNo(!this.purchaseContractForm.classification || !this.purchaseContractForm.flag || this.purchaseContractForm.hasContract === null || !this.signDateStr)
        return this.purchaseContractForm.purchaseContractNo
      }
    },
    totalPaymentAmount: function () {
      return this.calculateTotalAmount()
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style scoped>
  /deep/ .ant-select-auto-complete.ant-select .ant-input {
    color: black;
    background-color: #f5f5f5;
    opacity: 1;
    background-color: transparent;
  }

  /deep/ .ant-calendar-picker-input.ant-input {
    line-height: 1.5;
    color: #000000;
    background: #ffffff;
  }

  /deep/ .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
  }

  /deep/ .ant-radio-disabled + span {
    color: rgb(0, 0, 0);
    cursor: not-allowed;
  }

  /deep/ .ant-table-footer {
    position: relative;
    padding: 5px;
    color: rgba(0, 0, 0, 0.85);
    background: #fafafa;
    border-top: 1px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
  }

  .paymentClass /deep/ .ant-table-placeholder {
    display: none;
  }

  /deep/ .ant-radio-button-wrapper-disabled.ant-radio-button-wrapper-checked {
    color: #fff;
    background-color: #1890ff;
    border-color: #d9d9d9;
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  /deep/ .ant-radio-button-wrapper-disabled {
    color: black;
    background-color: white;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }

  /deep/ .ant-input-number-disabled .ant-input-number-input {
    cursor: not-allowed;
    background: white;
  }

  .errorClass {
    border-color: #f5222d;
  }

</style>
