<template>
  <div :style="{height: formHeight+'px',overflowY:'scroll'}">
    <a-form-model :model="printingForm" ref="printingForm">
      <a-card :body-style="{ padding: '10px 0 10px 10px' }">
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="申 请 人"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="applicantName">
              <a-input :readOnly="true" v-model="printingForm.applicantName" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="申请时间"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="applyDate">
              <a-input :readOnly="true" v-model="printingForm.applyDate" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="申请部门"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="deptName">
              <a-input :readOnly="true" v-model="printingForm.deptName" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="费用归属人"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="belongerName">
              <a-input :readOnly="true" v-model="printingForm.belongerName" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="费用归属部门"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="belongDeptName">
              <a-input :readOnly="true" v-model="printingForm.belongDeptName" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="归属项目"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="projectName">
              <template v-if="printingForm.projectName">
                <a-tooltip>
                  <template slot="title">
                    {{ printingForm.projectName }}
                  </template>
                  <a-input :readOnly="true" v-model="printingForm.projectName" style="width: 257px;color: #000000"/>
                </a-tooltip>
              </template>
              <template v-else>
                <a-input :readOnly="true" v-model="printingForm.projectName" style="width: 257px;color: #000000"/>
              </template>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="费用类别"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="costTypeText">
              <a-input :readOnly="true" v-model="printingForm.costTypeText" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="核算口径归属"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="accountCaliberText">
              <a-input :readOnly="true" v-model="printingForm.accountCaliberText" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="订单编号"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="orderNum">
              <a-input :readOnly="true" v-model="printingForm.orderNum" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="流 水 号"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="lshid">
              <a-input :readOnly="true" v-model="printingForm.lshid" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="文印单位"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="printUnitName">
              <template v-if="printingForm.printUnitName">
                <a-tooltip>
                  <template slot="title">
                    {{ printingForm.printUnitName }}
                  </template>
                  <a-input :readOnly="true" v-model="printingForm.printUnitName" style="width: 300px;color: #000000"/>
                </a-tooltip>
              </template>
              <template v-else>
                <a-input :readOnly="true" v-model="printingForm.printUnitName" style="width: 300px;color: #000000"/>
              </template>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="文印日期"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="printDate">
              <a-input :readOnly="true" v-model="printingForm.printDate" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="合计金额"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="sumAmount">
              <a-input :readOnly="true" :value="printingForm.sumAmount | AmountFormat" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="核准金额"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="approval">
              <a-input :readOnly="true" :value="printingForm.approval | AmountFormat" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item
              label="申领事由"
              :labelCol="{lg: {span: 4}, sm: {span: 2},style: { marginLeft: '-29px'}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="reason">
              <a-textarea
                :readOnly="true"
                v-model="printingForm.reason"
                style="width: 751px;color: #000000"
                :autoSize="{ minRows: 2, maxRows: 2 }"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :body-style="{ padding: '20px 10 20px 10px' }" :bordered="false">
        <a-table
          :loading="loading"
          size="small"
          :scroll="{ x: false, y: 150 }"
          :rowKey="(record) => record.id"
          :columns="printingDetailColumns"
          :dataSource="printingDetailList"
          :pagination="false"
        >
          <template slot="context" slot-scope="text">
            <a-tooltip>
              <template slot="title">
                {{ text }}
              </template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="printType" slot-scope="text">
            <span>{{ text | typeTextFilter }}</span>
          </template>
          <template slot="unitPrice" slot-scope="text">
            {{ text | AmountFormat }}
          </template>
          <template slot="amount" slot-scope="text">
            {{ text | AmountFormat }}
          </template>
          <template slot="remark" slot-scope="text">
            <a-tooltip>
              <template slot="title">
                {{ text }}
              </template>
              {{ text }}
            </a-tooltip>
          </template>
        </a-table>
      </a-card>
    </a-form-model>
  </div>
</template>

<script>

import { doLoadPrintingDetailList } from '@/api/printing'

const typeMap = {
  1: {
    text: '标书'
  },
  2: {
    text: '复印'
  },
  3: {
    text: '其他'
  }
}
export default {
  name: 'PrintingInfoModule',
  data () {
    return {
      printingForm: {},
      printingDetailColumns: [
        {
          dataIndex: 'printType',
          width: '16%',
          title: '文印类别',
          scopedSlots: { customRender: 'printType' }
        },
        {
          dataIndex: 'context',
          width: '24%',
          title: '文印内容',
          scopedSlots: { customRender: 'context' },
          ellipsis: true
        },
        {
          dataIndex: 'printNum',
          width: '10%',
          title: '数量'
        },
        {
          dataIndex: 'unitPrice',
          width: '10%',
          title: '单价',
          scopedSlots: { customRender: 'unitPrice' },
          align: 'right'
        },
        {
          dataIndex: 'amount',
          width: '10%',
          title: '金额',
          scopedSlots: { customRender: 'amount' },
          align: 'right'
        },
        {
          dataIndex: 'remark',
          width: '30%',
          title: '备注',
          scopedSlots: { customRender: 'remark' },
          ellipsis: true
        }
      ],
      printingDetailList: [],
      loading: false
    }
  },
  props: {
    printingInfo: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    viewHeight: function () {
      return window.innerHeight - 100
    },
    formHeight: function () {
      return window.innerHeight - 110
    }
  },
  filters: {
    typeTextFilter (type) {
      return typeMap[type].text
    }
  },
  methods: {
    initFormFields () {
      this.printingForm = {
        belongerName: null,
        belongDeptName: null,
        projectName: null,
        costTypeText: null,
        accountCaliberText: null,
        reason: null,
        recipient: null,
        cardType: null,
        received: 0,
        workCardNo: null,
        applicantName: null,
        deptName: null,
        applyDate: null,
        amount: null,
        shipmentDate: null,
        approval: null
      }
      this.printingDetailList = []
    },
    loadPrintingDetailList () {
      this.loading = true
      doLoadPrintingDetailList({ printingId: this.printingInfo.id }).then(res => {
        if (res.code === 200) {
          this.printingDetailList = res.body
          this.loading = false
        }
        this.loading = false
      })
    },
    initFormData () {
      this.printingForm = { ...this.printingInfo }
    },
    initPage () {
      this.initFormFields()
      this.initFormData()
      this.loadPrintingDetailList()
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style scoped>

</style>
