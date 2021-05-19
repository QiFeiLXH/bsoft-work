<template>
  <a-select
    mode="multiple"
    show-search
    :value="userIds"
    :placeholder="disabled ? '':'姓名简拼检索'"
    style="width: 200px"
    :default-active-first-option="false"
    :show-arrow="false"
    :allowClear="true"
    :filter-option="false"
    :not-found-content="searchIng ? undefined : null"
    :dropdownMatchSelectWidth="false"
    :dropdownStyle="{width: '300px'}"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    :disabled="disabled"
    option-label-prop="label"
    @change="handleChange"
    @popupScroll="popupScroll"
    @search="handleSearch"
    @select="handleSelect"
    @deselect="handleDeselect"
  >
    <a-icon slot="clearIcon" type="close-circle" theme="filled" @click="handleClear"/>
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />
    <a-select-option :label="item.personName" v-for="item in (personSelectList.length === 0 ? initSelectList : personSelectList)" :key="item.personId">
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
import { findPersonSelectList } from '@/api/common'

export default {
  name: 'MultipePersonSearchSelect',
  data () {
    return {
      size: 'default',
      searchIng: false,
      personSelectList: [],
      personId: undefined,
      userIds: [],
      userNames: [],
      initSelectList: []
    }
  },
  props: {
    disabled: {
      // 不可选状态
      type: Boolean,
      default: false
    },
    record: {
      type: Object,
      default: () => {}
    },
    customKey: {
      type: String,
      default: 'userId'
    },
    customLabel: {
      type: String,
      default: 'userName'
    }
  },
  watch: {
    record: function (val, oldVal) {
      this.userIds = []
      this.initSelectList = []
      this.personSelectList = []
      var key = val[this.customKey]
      var label = val[this.customLabel]
      if (key != null && key.indexOf(',') > -1) {
        this.userIds = key.split(',')
        this.userNames = label.split(',')
        const deptNames = val.userDeptName ? val.userDeptName.split(',') : []
        for (var i in this.userIds) {
          const user = {
            personId: this.userIds[i],
            personName: this.userNames[i],
            deptName: deptNames[i]
          }
          this.initSelectList.push(user)
          this.personSelectList.push(user)
        }
      } else if (key == null) {
        this.userIds = []
        this.userNames = []
        this.initSelectList = []
      } else {
        this.userIds.push(key)
        this.userNames.push(label)
        const user = {
          personName: label,
          personId: key,
          deptName: val.userDeptName
        }
        this.initSelectList.push(user)
        this.personSelectList.push(user)
      }
    }

  },
  mounted () {
    if (this.record[this.customKey]) {
      this.userIds = this.record[this.customKey].split(',')
      this.userNames = this.record[this.customLabel].split(',')
      const deptNames = this.record.userDeptName ? this.record.userDeptName.split(',') : []
      for (var i in this.userIds) {
        const user = {
          personId: this.userIds[i],
          personName: this.userNames[i],
          deptName: deptNames[i]
        }
        this.initSelectList.push(user)
      }
    } else if (this.record[this.customKey] == null) {
      this.userIds = []
    } else {
      this.userIds.push(this.record[this.customKey])
      this.initSelectList = [{
        personName: this.record[this.customLabel],
        personId: this.record[this.customKey],
        deptName: this.record.userDeptName
      }]
    }
  },

  methods: {
    handleChange (value) {
      // console.log(`Selected: ${value}`);
    },
    popupScroll () {
      // console.log('popupScroll');
    },
    triggerChange (changedValue, changedLabel) {
      var userId = ''
      var userName = ''
      for (const i of changedValue) {
        userId += i + ','
      }
      userName = changedLabel.join()
      userId = userId.substring(0, userId.length - 1)
      this.record[this.customKey] = userId
      this.record[this.customLabel] = userName
      this.record.isChanged = true
      this.$emit('change', changedValue)
    },

    personSelectSearch (value) {
      if (value.length > 1) {
        this.searchIng = true
        const params = { simpleCode: value }
        findPersonSelectList(params).then((res) => {
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
      if (value === '' || value === null) {
        this.personId = undefined
        this.personSelectList = []
      } else {
        this.personSelectSearch(value)
      }
    },
    handleDeselect (value, option) {
      var userName = option.componentOptions.propsData.label
      for (var i = 0; i < this.userIds.length; i++) {
        if (this.userIds[i] === value) {
          this.userIds.splice(i, 1)
        }
      }
      for (var j = 0; j < this.userNames.length; j++) {
        if (this.userNames[j] === userName) {
          this.userNames.splice(j, 1)
        }
      }
      this.triggerChange(this.userIds, this.userNames)
    },
    handleSelect (value, option) {
      var userName = option.componentOptions.propsData.label
      this.open = false
      this.personId = value
      this.userIds.push(value)
      this.userNames.push(userName)
      this.triggerChange(this.userIds, this.userNames)
    },

    handleClear () {
      this.userIds = []
      this.userNames = []
      this.personId = undefined
      this.personSelectList = []
      this.triggerChange(this.userIds, this.userNames)
    }
  }
}
</script>
