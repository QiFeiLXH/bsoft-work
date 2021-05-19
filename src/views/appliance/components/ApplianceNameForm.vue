<template>
  <div>
    <a-card :bordered="false" :body-style="{height: cardHeight + 'px', padding: '0 24px'}">
      <a-form-model :model="applianceNameForm" ref="applianceNameForm" :rules="applianceNameFormRules">
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="物品类别"
              :labelCol="{lg: {span: 4}, sm: {span: 4}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              prop="applianceType"
              style="margin: 10px 0">
              <a-select v-model="applianceNameForm.applianceType" :disabled="readOnly">
                <a-select-option v-for="item in typeList" :key="item.id" :value="item.id" >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="物品名称"
              :labelCol="{lg: {span: 4}, sm: {span: 4}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              prop="name"
              style="margin: 10px 0">
              <a-input v-model="applianceNameForm.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="规格"
              :labelCol="{lg: {span: 4}, sm: {span: 4}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              prop="standards"
              style="margin-bottom: 10px">
              <a-input v-model="applianceNameForm.standards"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="拼音码"
              :labelCol="{lg: {span: 4}, sm: {span: 4}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              v-show="readOnly"
              prop="pinyin"
              style="margin-bottom: 10px">
              <a-input v-model="applianceNameForm.pinyin" :disabled="true"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24">
            <a-form-model-item
              label="注销标志"
              :labelCol="{lg: {span: 4}, sm: {span: 4}}"
              :wrapperCol="{lg: {span: 20}, sm: {span: 20} }"
              v-show="readOnly"
              prop="logout"
              style="margin-bottom: 10px">
              <a-switch checked-children="未注销" un-checked-children="已注销" :checked="applianceNameForm.logout == 0" @change="onLogoutChange" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

    </a-card>
    <div :style="{ position: 'absolute', right: 10, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '9px 16px', background: '#fff', textAlign: 'right', }">
      <a-button type="default" style="margin-right: 20px" @click="onClose">取消</a-button>
      <a-button type="primary" :loading="saving" @click="saveApplianceName" >保存</a-button>
    </div>


  </div>


</template>

<script>
  import {saveApplianceName} from "@/api/applianceName";

  export default {
    name: "ApplianceNameForm",
    props: {
      readOnly: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        cardHeight: window.innerHeight -100,
        saving: false,
        typeList: [
          {id: 1, name: '办公用品'},
          {id: 2, name: '礼品'},
          {id: 3, name: '饮用水'},
        ],
        applianceNameForm: {
          applianceType: null,
          name: null,
          standards: null,
          pinyin: null,
          logout: 0,
        },
        applianceNameFormRules: {
          applianceType: [{required: true, message: '请选择物品类型!', trigger: 'blur'}],
          name: [{required: true, message: '请填物品名称!', trigger: 'blur'}],
          standards: [{required: true, message: '请填物品规格!', trigger: 'blur'}],
        },
      }
    },
    methods: {
      saveApplianceName() {
        console.log(this.applianceNameForm)
        let isValid = true
        this.$refs.applianceNameForm.validate(valid => {
          if (valid) {
          } else {
            isValid = false
          }
        })
        if (!isValid) {
          return
        }
        console.log(1)
        saveApplianceName(this.applianceNameForm).then(res => {
          if (res.code == 200) {
            this.onClose()
            this.$emit("onSaveSuccess")
            this.resetForm()
          }
        })
      },
      onClose() {
        this.$emit("onClose")
      },
      resetForm() {
        this.$refs.applianceNameForm.resetFields()
        this.applianceNameForm.applianceType = 1
      },
      setForm(record) {
        this.applianceNameForm = record
      },
      onLogoutChange(checked) {
        if(checked) {
          this.applianceNameForm.logout = 0
        } else {
          this.applianceNameForm.logout = 1
        }
      }
    }
  }

</script>

<style scoped>

</style>