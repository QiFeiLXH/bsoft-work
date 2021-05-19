<template>
  <a-card :bordered="false" :body-style="{ padding: '0 24px'}">
    <a-form-model :model="personForm" ref="personForm" :rules="personFormRules">
      <a-col :md="24">
        <a-form-model-item
          label="姓名"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="personName"
          style="margin: 10px 0">
          <a-input v-model="personForm.personName"></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :md="24">
        <a-form-model-item
          label="手机号码"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
          prop="mobileNo"
          style="margin: 10px 0">
          <a-input v-model="personForm.mobileNo"></a-input>
        </a-form-model-item>
      </a-col>
    </a-form-model>
  </a-card>
</template>

<script>
    import {
      saveMeetPerson,
      personExitsMeet,
      havePersonExits
    } from "@/api/meetmanager";

    const validateIdPhone = (rule, value, callback) => {
      const reg = /^[1][0-9][0-9]{9}$/
      if(value === ''){
        callback(new Error('请输入手机号'));
      }else if(reg.test(value) === false){
        callback(new Error("请输入正确的手机号"));
      }else{
        callback()
      }
    }
    export default {
      name: "MeetPersonForm",
      data(){
          return{
            personForm:{
              id:null,
              meetId:null,
              personName:null,
              mobileNo:null,
            },
            personFormRules:{
              personName: [{ required: true, message: '请填写姓名!', trigger: 'blur' }],
              mobileNo: [{ required: true, validator: validateIdPhone, trigger: 'blur' }],
            },
            oldMobileNo:null,
          }
      },
      methods:{
        havePersonExits(){//判断手机号是否已经被使用
          const me = this
          havePersonExits(this.personForm).then(res => {
            const exitsName = res.body
            if(exitsName != null && exitsName != this.personForm.personName){
              this.$confirm({
                title: '该手机号已被【'+exitsName+'】使用，是否替换为当前人？',
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
                  me.saveMeetPerson()
                }
              })
            }else{
              this.saveMeetPerson()
            }
          })
        },
        save(){
          let isValid = true
          this.$refs.personForm.validate(valid => {
            if(valid) {
            } else {
              isValid = false
            }
          })
          if (!isValid) {
            return
          }
          if(this.oldMobileNo != this.personForm.mobileNo){
            personExitsMeet(this.personForm).then(res => {
              if(res.body){
                this.$message.error('该手机号已存在会议中')
              }else{
                this.havePersonExits();
              }
            })
          }else{
            this.havePersonExits();
          }

        },
        saveMeetPerson(){
          saveMeetPerson(this.personForm).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.$emit("onMeetPersonSaveSuccess")
            }
          })
        },
        resetForm(meetId) {
          this.$refs.personForm.resetFields()
          this.personForm.personName = null
          this.personForm.mobileNo = null
          this.personForm.id = null
          this.personForm.meetId = meetId
          this.oldMobileNo = null
        },
        setForm(record) {
          this.personForm.id = record.id
          this.personForm.meetId = record.meetId
          this.personForm.personName = record.personName
          this.personForm.mobileNo = record.mobileNo
          this.oldMobileNo = record.mobileNo
        },
      }
    }
</script>

<style scoped>

</style>