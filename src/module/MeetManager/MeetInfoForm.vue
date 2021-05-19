<template>
  <a-card :bordered="false" :body-style="{ padding: '0 24px'}">
    <a-form-model :model="meetForm" ref="meetForm" :rules="meetFormRules">
      <a-col :md="24">
        <a-form-model-item
          label="会议名称"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="name"
          style="margin: 10px 0">
          <a-input v-model="meetForm.name"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24">
        <a-form-model-item
          label="会议子名称"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="name"
          style="margin: 10px 0">
          <a-input v-model="meetForm.subName"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24">
        <a-form-model-item
          label="会议时间"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="startDate"
          style="margin: 10px 0">
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            v-model="meetDateRange"
            :placeholder="['开始时间', '结束时间']"
            @change="onTimeChange"
            @ok="onOk"
          />
        </a-form-model-item>
      </a-col>
      <a-col :md="24">
        <a-form-model-item
          label="会议地址"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="address"
          style="margin: 10px 0">
          <a-input v-model="meetForm.address"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24">
        <a-form-model-item
          label="会议备注"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="remark"
          style="margin: 10px 0">
          <a-input v-model="meetForm.remark"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24">
        <a-form-model-item
          label="会议日期"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="meetDate"
          style="margin: 10px 0">
          <a-input v-model="meetForm.meetDate"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="24">
        <a-form-model-item
          label="发放参会证"
          :labelCol="{lg: {span: 4}, sm: {span: 2}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="flag"
          style="margin-bottom: 10px;"
        >
<!--          <a-switch-->
<!--            checked-children="是"-->
<!--            un-checked-children="否"-->
<!--            :checked="meetForm.flag"-->
<!--            v-if="readOnly || firstStepAudited"/>-->
          <a-switch checked-children="是" un-checked-children="否" v-model="meetForm.flag == 1" @click="handleSwithchChange"/>
        </a-form-model-item>
      </a-col>
    </a-form-model>
  </a-card>
</template>

<script>
    import {
      saveMeet
    } from "@/api/meetmanager";
    import moment from 'moment'
    export default {
      name: "MeetInfoForm",
      data(){
          return{
            meetDateRange:null,
            meetForm: {
              id:null,
              name: null,
              startDate: null,
              endDate: null,
              remark: null,
              flag: 0,
              address:null,
              meetDate:null
            },
            meetFormRules: {
              name: [{ required: true, message: '请填写会议名称!', trigger: 'blur' }],
              startDate: [{ required: true, message: '请选择会议时间!', trigger: 'blur' }],
              remark: [{ required: true, message: '请填写会议备注!', trigger: 'blur' }],
              meetDate: [{ required: true, message: '请填写会期!', trigger: 'blur' }],
              address: [{ required: true, message: '请填写会议地址!', trigger: 'blur' }]
            },
          }
      },
      methods:{
        moment,
        onTimeChange(value, dateString) {
          // console.log('Selected Time: ', value);
          // console.log('Formatted Selected Time: ', dateString);
        },
        onOk(value) {
          this.meetForm.startDate = value[0].format('YYYY-MM-DD HH:mm:ss').toString();
          this.meetForm.endDate = value[1].format('YYYY-MM-DD HH:mm:ss').toString();

        },
        handleSwithchChange(checked){
          if(checked){
            this.meetForm.flag = 1
          }else{
            this.meetForm.flag = 0
          }
        },
        save(){
          let isValid = true
          this.$refs.meetForm.validate(valid => {
            if(valid) {
            } else {
              isValid = false
            }
          })
          if (!isValid) {
            return
          }
          saveMeet(this.meetForm).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.$emit("onMeetSaveSuccess")
            }
          })
        },
        resetForm() {
          this.$refs.meetForm.resetFields()
          this.meetDateRange = null;
          this.meetForm.id = null;
          // this.meetForm.type = 1
          // this.money = 0
          // this.$refs.meetForm.clearName()
        },
        setForm(record) {
          this.meetForm.id = record.id
          this.meetForm.name = record.name
          this.meetForm.startDate = record.startDate
          this.meetForm.endDate = record.endDate
          this.meetForm.remark = record.remark
          this.meetForm.flag = record.flag
          this.meetForm.address = record.address
          this.meetForm.meetDate = record.meetDate
          this.meetForm.subName = record.subName
          this.meetDateRange = []
          this.meetDateRange.push(moment(record.startDate))
          this.meetDateRange.push(moment(record.endDate))
        },
      }
    }
</script>

<style scoped>

</style>