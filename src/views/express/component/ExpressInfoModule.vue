<template>
  <div :style="{height: formHeight+'px',overflowY:'hidden'}">
    <a-form-model :model="expressForm" ref="expressForm">
      <a-card :body-style="{ padding: '10px 0 10px 10px' }">
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="申请人"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="applicantName">
              <a-input :readOnly="true" v-model="expressForm.applicantName" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="申请部门"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="deptName">
              <a-input :readOnly="true" v-model="expressForm.deptName" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="申请日期"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="applyDate">
              <a-input :readOnly="true" v-model="expressForm.applyDate" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="寄件日期"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="expressNo">
              <a-input :readOnly="true" v-model="expressForm.shipmentDate" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="费用归属人"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="belongerName">
              <a-input :readOnly="true" v-model="expressForm.belongerName" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="费用归属部门"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="belongDeptName">
              <a-input :readOnly="true" v-model="expressForm.belongDeptName" style="width: 257px;color: #000000"/>
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
              <a-input :readOnly="true" v-model="expressForm.costTypeText" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="核算口径归属"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="accountCaliberText">
              <a-input :readOnly="true" v-model="expressForm.accountCaliberText" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="归属项目"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="projectName">
              <template  v-if="expressForm.projectName">
                <a-tooltip>
                  <template slot="title">
                    {{ expressForm.projectName }}
                  </template>
                  <a-input :readOnly="true" v-model="expressForm.projectName" style="width: 300px;color: #000000"/>
                </a-tooltip>
              </template>
              <template v-else>
                <a-input :readOnly="true" v-model="expressForm.projectName" style="width: 300px;color: #000000"/>
              </template>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="快递单号"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="expressNo">
              <a-input :readOnly="true" v-model="expressForm.expressNo" style="width: 257px;color: #000000"/>
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
                v-model="expressForm.reason"
                style="width: 751px;color: #000000"
                :autoSize="{ minRows: 2, maxRows: 2 }"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :body-style="{ padding: '20px 10 20px 10px' }">
        <a-table
          size="small"
          :scroll="{ x: false, y: false }"
          :rowKey="(record) => record.id"
          :columns="expressColumns"
          :dataSource="expressList"
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
          <template slot="area" slot-scope="text">
            <a-tooltip>
              <template slot="title">
                {{ text }}
              </template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="address" slot-scope="text">
            <a-tooltip>
              <template slot="title">
                {{ text }}
              </template>
              {{ text }}
            </a-tooltip>
          </template>
          <template slot="amount" slot-scope="text">
            {{ text | NumberFormat }}
          </template>
        </a-table>
      </a-card>
    </a-form-model>
  </div>
</template>

<script>

export default {
  name: 'ExpressInfoModule',
  data () {
    return {
      expressForm: {},
      expressColumns: [
        {
          dataIndex: 'context',
          width: '15%',
          title: '快递内容',
          scopedSlots: { customRender: 'context' },
          ellipsis: true
        },
        {
          dataIndex: 'recipient',
          width: '12%',
          title: '收件人'
        },
        {
          dataIndex: 'area',
          width: '25%',
          title: '收件地区',
          scopedSlots: { customRender: 'area' },
          ellipsis: true
        },
        {
          dataIndex: 'address',
          width: '27%',
          title: '详细地址',
          scopedSlots: { customRender: 'address' },
          ellipsis: true
        },
        {
          dataIndex: 'weight',
          width: '9%',
          title: '重量(kg)',
          align: 'right'
        },
        {
          dataIndex: 'approval',
          width: '12%',
          title: '核准金额',
          scopedSlots: { customRender: 'approval' },
          align: 'right'
        }
      ],
      expressList: []
    }
  },
  props: {
    expressInfo: {
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
  methods: {
    initFormFields () {
      this.expressForm = {
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
      this.expressList = []
    },
    initFormData () {
      this.expressForm = { ...this.expressInfo }
    },
    initPage () {
      this.initFormFields()
      this.initFormData()
      this.expressList.push(this.expressInfo)
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style scoped>

</style>
