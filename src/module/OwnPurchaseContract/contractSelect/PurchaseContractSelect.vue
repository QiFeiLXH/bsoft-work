<template>
  <a-select
    show-search
    :value="contractInput"
    placeholder="请输入采购合同号检索"
    style="width:220px;color: #000000"
    :default-active-first-option="false"
    :show-arrow="false"
    :allowClear="allowClear"
    :filter-option="false"
    :not-found-content="searchIng ? undefined : null"
    :dropdownMatchSelectWidth="false"
    :dropdownStyle="{width: '300px'}"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    :disabled="disabled"
    option-label-prop="label"
    @search="handleContractSearch"
    @select="handleContractSelect">
    <a-icon slot="clearIcon" type="close-circle" theme="filled" @click="handleContractClear" v-if="showClearIcon"/>
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />
    <a-select-option v-for="item in contractList" :key="item.purchaseContractId" :label="item.purchaseContractNo">
      {{ item.purchaseContractNo }}
    </a-select-option>
  </a-select>
</template>

<script>
import { doFindPurchaseContractList } from '@/api/ownPurchaseContractProgress'

export default {
  name: 'PurchaseContractSelect',
  data () {
    return {
      searchIng: false,
      contractList: [],
      contractInput: undefined,
      showClearIcon: false
    }
  },
  props: {
    purchaseContractId: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'purchaseContractId',
    event: 'change'
  },
  methods: {
    triggerChange (changedValue) {
      this.$emit('change', changedValue)
    },
    getCurrent (purchaseContractId, purchaseContractNo) {
      this.contractList = []
      if (purchaseContractId) {
        this.contractInput = purchaseContractId
        this.contractList.push({ purchaseContractId: purchaseContractId, purchaseContractNo: purchaseContractNo })
        this.showClearIcon = true
      } else {
        this.contractInput = undefined
        this.showClearIcon = false
      }
    },
    handleContractSelect (val) {
      this.contractInput = val
      this.showClearIcon = true
      var target = this.contractList.find(item => item.purchaseContractId === val || item.purchaseContractId === val)
      this.$emit('setPurchaseContract', target)
      this.triggerChange(val)
    },
    handleContractClear () {
      this.contractInput = undefined
      var target = { purchaseContractId: null, purchaseContractNo: '' }
      this.$emit('setPurchaseContract', target)
      this.triggerChange('')
    },
    handleContractSearch (val) {
      if (!val) {
        this.contractInput = undefined
        this.contractList = []
        this.showClearIcon = false
      } else {
        this.showClearIcon = true
        this.doLoadContractList(val)
      }
    },
    doLoadContractList (val) {
      var param = { inputContent: val }
      this.searchIng = true
      doFindPurchaseContractList(param).then((res) => {
        if (res.code === 200) {
          this.contractList = res.body
          this.searchIng = false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
