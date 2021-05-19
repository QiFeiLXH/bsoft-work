<template>
  <a-select :value="companyId"
            :placeholder="placeholder"
            :disabled="disabled"
            :filter-option="false"
            :dropdownMatchSelectWidth="false"
            :dropdownStyle="{width: 625}"
            :allowClear="allowClear"
            show-search
            @search="handleSearch"
            @select="handleSelect"
            class="companyName"
            style="margin: -5px 0;height: 32px;width:625px"
            size="small" >
    <a-icon slot="clearIcon" type="close-circle" theme="filled" @click="handleClear" v-if="allowClear"/>
    <a-select-option v-for="e in companyList" :key="e.companyId" :label="e.companyName">
      {{ e.companyName }}
    </a-select-option>
  </a-select>
</template>

<script>
    import {getcompany} from "@/api/companyseal";

    export default {
      name: "CompanySelect",
      data(){
        return{
          companyId: null,
          companyList:[],
        }
      },
      props: {
        registrant: {
          type: Number,
          default: 0,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
        placeholder: {
          type: String,
          default: "请输入公司名称/拼音简码查询"
        },
        initSearch: {
          type: Boolean,
          default: true,
        },
        allowClear: {
          type: Boolean,
          default: true,
        }
      },
      model: {
        prop: 'registrant',
        event: 'change'
      },
      mounted() {
        if(this.initSearch) {
          this.getCompany()
        }
      },
      methods: {
        triggerChange(companyId, companyData) {
          this.$emit("change", companyId, companyData)
        },
        getCompany() {
          getcompany({input: null}).then(res => {
            if (res.code === 200) {
              this.companyList = res.body;
            }
          })
        },
        handleSearch(value) {
          if (value) {
            getcompany({input: value}).then(res => {
              if (res.code === 200) {
                this.companyList = res.body;
              }
            })
          }
        },
        handleSelect(value, option) {
          this.companyId = value
          var target = this.companyList.find(x => x.companyId === value)
          this.triggerChange(value, target)
        },

        getCurrent(companyId) {
          getcompany({input: null}).then(res => {
            if (res.code === 200) {
              if(companyId) {
                var target = res.body.find(x => x.companyId === companyId)
                this.companyId = companyId
                this.companyList = []
                this.companyList.push(target)
              } else {
                this.companyId = undefined
                this.companyList = res.body
              }
            }
          })
        },
        handleClear() {
          this.companyId = undefined
          const record = {
            companyId: null,
            companyName: null,
            subsidiary : null,
            abbreviation: null
          }
          this.triggerChange(null, record)
        }

      }
    }
</script>

<style scoped>
  .companyName .ant-select-selection-selected-value {

    margin-top: 3px;
  }
</style>