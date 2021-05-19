<template>
  <a-select show-search
            :value="primaryKey"
            :placeholder="placeholder"
            :allowClear="allowClear"
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
            @focus="getDicList"
            @search="handleSearch"
            @select="handleSelect">
    <a-icon slot="clearIcon" type="close-circle" theme="filled" @click="handleClear" v-if="showClearIcon && this.list != null"/>
    <a-spin v-if="searching" slot="notFoundContent" size="small" />
    <a-select-option :label="item.name" v-for="item in list" :key="item.id">
      <a-row v-if="item.useful">
        <a-col :span="15" style="fontWeight:bold">{{ item.name }}</a-col>
        <a-col :span="9"><a-badge style="float:right" status="success"/></a-col>
      </a-row>
      <a-row v-else>
        <a-col>{{ item.name }}</a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>

<script>
  import {getHrDicList} from "@/api/common";

  export default {
    name: "HrDicSelect",
    props: {
      type: {
        type: Number,
        default: 30,
      },
      width: {
        type: Number,
        default: 300,
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
        default: null,
      },
      searchable: {
        type: Boolean,
        default: false,
      },
      storageKey: {
        type: String,
        default: 'pubDicHistory'
      },
      customList: {
        type: Array,
        default: ()=>[],
      },
      notFocus:{ //focus不调用查询数据的方法
        type: Boolean,
        default: false,
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
    created() {
      this.list = this.customList
      if(!this.registrant){
        this.primaryKey = undefined
      }else{
        this.primaryKey = this.registrant
      }
    },
    mounted() {
      // this.getDicList()
    },
    watch: {
      customList(value) {
        this.list = value
      },
      registrant (value) {
        if (!value) {
          this.primaryKey = undefined
        } else {
          this.primaryKey = value
        }
      }
    },
    data() {
      return {
        list: [],
        searching: false,
        showClearIcon: false,
        primaryKey: undefined
      }
    },
    methods: {
      triggerChange (id, name) {
        this.$emit('change', id, name)
      },
      getDicList() {
        if (this.notFocus){
          let historyList = localStorage.getItem(this.storageKey) == null ? [] : JSON.parse(localStorage.getItem(this.storageKey));
          historyList.forEach(item => {
            if (this.list.findIndex(x => x.id==item.id) > -1) {
              this.list.splice(this.list.findIndex(x => x.id == item.id), 1)
              this.list.unshift(item)
            }
          })
        }else{
          const params = {
            'type': this.type,
            //'flag': this.logout ? 1 : 0,
          }
          let historyList = localStorage.getItem(this.storageKey) == null ? [] : JSON.parse(localStorage.getItem(this.storageKey));
          this.searching = true
          getHrDicList(params).then(res=> {
            this.searching = false
            if(res.code === 200){
              this.list = res.body
              historyList.forEach(item => {
                if (this.list.findIndex(x => x.id==item.id) > -1) {
                  this.list.splice(this.list.findIndex(x => x.id == item.id), 1)
                  this.list.unshift(item)
                }
              })
            }
          })
        }
        this.$emit("focus");
      },
      handleSearch(value) {
        if (!this.searchable) {
          return
        }
        const params = {
          'type': this.type,
          //'flag': this.logout ? 1 : 0,
          'inputContent': value,
        }
        let historyList = localStorage.getItem(this.storageKey) == null ? [] : JSON.parse(localStorage.getItem(this.storageKey));
        this.searching = true
        getHrDicList(params).then(res=> {
          this.searching = false
          if(res.code === 200){
            this.list = res.body
            historyList.forEach(item => {
              if (this.list.findIndex(x => x.id==item.id) > -1) {
                this.list.splice(this.list.findIndex(x => x.id == item.id), 1)
                this.list.unshift(item)
              }
            })
          }
        })
      },
      handleSelect (value, option) {
        let historyList = localStorage.getItem(this.storageKey) == null ? [] : JSON.parse(localStorage.getItem(this.storageKey));
        let data = {...this.list.find(x => x.id==value)}
        data['useful'] = 1
        if (historyList.findIndex(x=> x.id ==data.id  ) < 0) {
          if (historyList.length < 3) {
            historyList.push(data)
          } else {
            historyList.splice(0, 1)
            historyList.push(data)
          }
        } else {
          historyList.splice(historyList.findIndex(x => x.id == data.id), 1)
          historyList.push(data)
        }
        localStorage.setItem(this.storageKey, JSON.stringify(historyList))

        this.list.forEach(item => {
          item['useful'] = 0
        })
        historyList.forEach(item => {
          if (this.list.findIndex(x => x.id==item.id) > -1) {
            this.list.splice(this.list.findIndex(x => x.id == item.id), 1)
            this.list.unshift(item)
          }
        })
        this.primaryKey = value
        this.showClearIcon = true
        let record = this.list.find(item => item.id === value)
        this.triggerChange(record.id, record.name)
      },
      handleClear() {
        this.getDicList()
        this.primaryKey = undefined
        this.triggerChange(null, null)
      },
    }
  }
</script>

<style scoped>

</style>