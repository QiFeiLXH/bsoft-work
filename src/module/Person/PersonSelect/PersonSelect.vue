<template>
  <a-select
    show-search
    :value="personId"
    :allowClear="allowClear"
    :placeholder="placeholder"
    style="width: 200px;background: #ffffff"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="searchIng ? undefined : null"
    :dropdownMatchSelectWidth="false"
    :dropdownStyle="{width: '300px'}"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    :disabled="disabled"
    option-label-prop="label"
    @search="handleSearch"
    @select="handleSelect"
  >
    <a-icon slot="clearIcon" type="close-circle" theme="filled" @click="handleClear" v-if="allowClear"/>
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />
    <a-select-option :label="item.personName" v-for="item in personSelectList" :key="item.personId">
      <a-row>
        <a-col :span="15">
          {{ item.deptName }}
        </a-col>
        <a-col :span="9">
          {{ item.personName }}
        </a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>
<script>
import { getPersonSelectList } from '@/api/common'

export default {
  name: 'PersonSelect',
  data () {
    return {
      searchIng: false,
      personSelectList: [],
      personId: undefined
    }
  },
  props: {
    registrant: {
      // v-model绑值
      type: String,
      default: ''
    },
    disabled: {
      // 不可选状态
      type: Boolean,
      default: false
    },
    allowClear: {
      // 允许清空
      type: Boolean,
      default: false
    },
    placeholder: {
      // 默认提示
      type: String,
      default: '工号、姓名、简拼检索'
    }
  },
  model: {
    prop: 'registrant',
    event: 'change'
  },
  methods: {
    triggerChange (personId, personData) {
      this.$emit('change', personId, personData)
    },
    /** 设置初始值 */
    getCurrent (personId, personName) {
      if (personId || personName) { // 工号姓名至少传一个
        const params = {
          personId: personId,
          personName: personName
        }
        getPersonSelectList(params).then(res => {
          if (res.code === 200) {
            if (res.body && res.body.length > 0) {
              this.personId = res.body[0].personId
              this.personSelectList = res.body
              const record = res.body[0]
              this.triggerChange(this.personId, record)
            } else {
              this.personId = undefined
              this.personSelectList = []
              const record = {
                personId: personId,
                personName: personName
              }
              this.triggerChange(this.personId, record)
            }
          }
        })
      } else { // 工号姓名都不传
        this.personId = undefined
        this.personSelectList = []
        const record = {
          personId: personId,
          personName: personName
        }
        this.triggerChange(this.personId, record)
      }
    },
    personSelectSearch (value) {
      if (value.length > 1) {
        this.searchIng = true
        const params = { inputContent: value }
        getPersonSelectList(params).then((res) => {
          if (res.code === 200) {
            if (res.body != null || res.body !== undefined) {
              this.personSelectList = res.body
            }
          } else {
            this.$message.error(res.msg)
          }
          this.searchIng = false
        }).catch((res) => {
          this.searchIng = false
        })
      }
    },
    handleSearch (value) {
      if (value) {
        this.personSelectSearch(value)
      } else {
        this.personId = undefined
        this.personSelectList = []
      }
    },
    handleSelect (value, option) {
      this.personId = value
      const record = this.personSelectList.find(item => item.personId === value)
      this.$emit('setPerson', record)
      this.triggerChange(value, record)
    },
    handleClear () {
      this.personId = undefined
      const record = {
        personId: null,
        personName: null
      }
      this.triggerChange(this.personId, record)
    }
  }
}
</script>

<style scoped>
  /deep/ .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
  }
</style>
