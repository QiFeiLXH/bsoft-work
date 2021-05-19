<template>
  <a-select
    show-search
    @focus="doSearch"
    :value="primaryKey"
    :allowClear="allowClear"
    :placeholder="placeholder"
    :style="{width: width+'px'}"
    :default-active-first-option="false"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="searching ? undefined : null"
    :dropdownMatchSelectWidth="false"
    :dropdownStyle="{width: width+'px'}"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    :disabled="disabled"
    option-label-prop="label"
    @search="handleSearch"
    @select="handleSelect">
    <a-icon slot="clearIcon" type="close-circle" theme="filled" @click="handleClear" v-if="showClearIcon && this.list != null"/>
    <a-spin v-if="searching" slot="notFoundContent" size="small" />
    <a-select-option :label="item[customLabel]" v-for="item in list" :key="item[customKey]">
      <a-row v-if="item.useful">
        <a-col :span="15" style="fontWeight:bold">{{ item[customLabel] }}</a-col>
        <a-col :span="9"><a-badge style="float:right" status="success"/></a-col>
      </a-row>
      <a-row v-else>
        <a-col>{{ item[customLabel] }}</a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'GeneralDicSelect',
  props: {
    type: {
      type: Number,
      default: 30
    },
    width: {
      type: Number,
      default: 300
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    logout: {
      type: Boolean,
      default: false
    },
    registrant: {
      type: Number,
      default: null
    },
    searchable: {
      type: Boolean,
      default: false
    },
    customList: {
      type: Array,
      default: () => []
    },
    storageKey: {
      type: String,
      default: 'GeneralDicHistory'
    },
    customKey: {
      type: String,
      default: 'id'
    },
    customLabel: {
      type: String,
      default: 'name'
    },
    customSearchCondition: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'registrant',
    event: 'change'
  },
  watch: {
    customList (value) {
      this.initDicList()
    },
    registrant (value) {
      if (!value) {
        this.primaryKey = undefined
      } else {
        this.primaryKey = value
      }
    }
  },
  data () {
    return {
      list: [],
      searching: false,
      showClearIcon: false,
      primaryKey: undefined
    }
  },
  created () {
    this.list = this.customList
    if(!this.registrant){
      this.primaryKey = undefined
    }else{
      this.primaryKey = this.registrant
    }
  },
  mounted () {
    // this.doSearch()
  },
  methods: {
    triggerChange (id, name, data) {
      this.$emit('change', id, name, data)
    },
    initDicList () {
      const historyList = localStorage.getItem(this.storageKey) == null ? [] : JSON.parse(localStorage.getItem(this.storageKey))
      this.list = JSON.parse(JSON.stringify(this.customList))
      historyList.forEach(item => {
        if (this.list.findIndex(x => x[this.customKey] === item[this.customKey]) > -1) {
          this.list.splice(this.list.findIndex(x => x[this.customKey] === item[this.customKey]), 1)
          this.list.unshift(item)
        }
      })
    },
    handleSearch (value) {
      if (!this.searchable) {
        return
      }
      const historyList = localStorage.getItem(this.storageKey) == null ? [] : JSON.parse(localStorage.getItem(this.storageKey))
      this.list = JSON.parse(JSON.stringify(this.customList))
      historyList.forEach(item => {
        if (this.list.findIndex(x => x[this.customKey] === item[this.customKey]) > -1) {
          this.list.splice(this.list.findIndex(x => x[this.customKey] === item[this.customKey]), 1)
          this.list.unshift(item)
        }
      })
      this.list = this.list.filter(x => {
        let result = x[this.customLabel].includes(value) ||
          x[this.customLabel].includes(value.toLowerCase()) ||
          x[this.customLabel].includes(value.toUpperCase())
        if (this.customSearchCondition.length > 0) {
          this.customSearchCondition.forEach(item => {
            result = result ||
              (x[item] && (x[item].includes(value) ||
              x[item].includes(value.toLowerCase()) ||
              x[item].includes(value.toUpperCase())))
          })
        }
        return result
      })
    },
    handleSelect (value, option) {
      const historyList = localStorage.getItem(this.storageKey) == null ? [] : JSON.parse(localStorage.getItem(this.storageKey))
      this.list = JSON.parse(JSON.stringify(this.customList))

      // 保存到历史记录
      const data = JSON.parse(JSON.stringify(this.customList.find(x => x[this.customKey] === value)))
      data['useful'] = 1
      if (historyList.findIndex(x => x[this.customKey] === value) < 0) {
        if (historyList.length < 3) {
          historyList.push(data)
        } else {
          historyList.splice(0, 1)
          historyList.push(data)
        }
      } else {
        historyList.splice(historyList.findIndex(x => x[this.customKey] === value), 1)
        historyList.push(data)
      }
      localStorage.setItem(this.storageKey, JSON.stringify(historyList))

      // 设置状态
      historyList.forEach(item => {
        if (this.list.findIndex(x => x[this.customKey] === item[this.customKey]) > -1) {
          this.list.splice(this.list.findIndex(x => x[this.customKey] === item[this.customKey]), 1)
          this.list.unshift(item)
        }
      })
      this.primaryKey = value
      this.showClearIcon = true
      const record = this.list.find(item => item[this.customKey] === value)
      this.triggerChange(record[this.customKey], record[this.customLabel], record)
    },
    handleClear () {
      this.initDicList()
      this.primaryKey = undefined
      this.triggerChange(null, null, null)
    },
    doSearch () {
      this.$emit('getGeneralDicList')
    }
  }
}
</script>

<style scoped>

</style>
