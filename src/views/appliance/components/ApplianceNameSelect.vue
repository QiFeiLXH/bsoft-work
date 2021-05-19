<template>
  <a-select
    show-search
    :value="id"
    placeholder="物品名称、简拼检索"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="searchIng ? undefined : null"
    :dropdownMatchSelectWidth="false"
    :dropdownStyle="{width: '200px'}"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    :disabled="disabled"
    option-label-prop="label"
    @search="handleSearch"
    @select="handleSelect"
  >
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />
    <a-select-option :label="item.name" v-for="item in applianceNameList" :key="item.id">{{ item.name}}</a-select-option>
  </a-select>
</template>

<script>
  import {getApplianceNameSelectList} from "@/api/applianceEntry";

  export default {
    name: 'ApplianceNameSelect',
    data() {
      return {
        searchIng: false,
        id: undefined,
        applianceNameList: [],
      };
    },
    props: {
      type: {
        type: Number,
        default: 1,
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getApplianceNameList (inputContent) {
        if(inputContent.length > 0){
          this.searchIng = true
          let params = {
            'type': this.type,
            'inputContent': inputContent
          }
          getApplianceNameSelectList(params).then((res) => {
            if (res.code === 200) {
              if (res.body != null || res.body !== undefined) {
                this.applianceNameList = res.body
              }
            }
            this.searchIng = false
          })
        }
      },
      handleSearch(value) {
        if(value === '' || value === null){
          this.id = undefined
          this.applianceNameList = []
        }else{
          this.getApplianceNameList(value)
        }
      },
      handleSelect(value, option){
        this.id = value
        let record = this.applianceNameList.find(item => item.id === value)
        this.$emit('setName', record)
      },
      getCurrent(nameId) {
        if(nameId) {
          let params = {
            'type': this.type,
            'inputContent': '',
          }
          getApplianceNameSelectList(params).then((res) => {
            if (res.code === 200) {
              if (res.body) {
                this.applianceNameList = res.body
                let record = this.applianceNameList.find(item => item.id === nameId)
                if(record !== null) {
                  this.id = record.id
                } else {
                  this.id = null
                }
              }
            }
          })
        } else {
          this.id = undefined
          this.applianceNameList = []
        }


      },
      clearName() {
        this.id = undefined
        this.applianceNameList = []
      }
    }
  }

</script>

<style scoped>

</style>