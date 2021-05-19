<template>
  <a-tree-select
    :allowClear="allowClear"
    :treeDefaultExpandAll="true"
    :treeData="deptList"
    :size="size"
    @change="onChange"
    @search="onSearch"
    :filterTreeNode="filterTreeNode"
    :value="value"
    style="color: #000000"
    searchPlaceholder="请输入拼音码或部门名称"
    :placeholder="placeholder"
    :disabled="disabled"
    :searchValue="searchValue"
    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
    showSearch>
    <a-spin v-if="searchIng" slot="notFoundContent" size="small" />

  </a-tree-select>
</template>

<script>
import { getDeptTree } from '@/api/common'
export default {
  name: 'DeptSelect',
  props: {
    // 部门注销标志 ''为搜索全部 0为未注销 1已注销
    logout: {
      type: String,
      default: '0'
    },
    size: {
      // 规格大小，default small large
      type: String,
      default: 'default'
    },
    dept: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'dept',
    event: 'change'
  },
  data () {
    return {
      searchIng: false,
      value: undefined,
      deptList: [],
      searchValue: undefined,
      filterTreeNode: (inputValue, treeNode) => {
        const simpleCode = treeNode.data.props.simpleCode
        if (simpleCode !== undefined) {
          const deptName = treeNode.data.props.title
          if (deptName.indexOf(inputValue) > -1 || simpleCode.indexOf(inputValue.toUpperCase()) > -1) {
            return true
          }
        }
      }
    }
  },

  methods: {
    triggerChange (changedValue) {
      this.$emit('change', changedValue)
    },
    loadDeptSelect () {
      this.searchIng = true
      const param = { logout: this.logout }
      getDeptTree(param).then((res) => {
        if (res.code === 200) {
          this.deptList = res.body
        } else {
          this.$message.error(res.msg)
        }
        this.searchIng = false
      }).catch((res) => {
        console.log(res)
      })
    },
    getCurrent (dept, deptText) {
      this.deptList = []
      if (dept) {
        this.searchValue = null
        this.deptList.push({ value: dept, title: deptText })
        this.value = dept
      } else {
        this.searchValue = null
        this.value = undefined
      }
    },
    onChange (e) {
      this.value = e
      this.triggerChange(e)
    },
    onSearch (e) {
      this.searchValue = e
      this.loadDeptSelect()
    }

  }

}
</script>

<style scoped>
  /deep/ .ant-select-disabled .ant-select-selection {
    background: #ffffff;
    cursor: not-allowed;
    color: #000000;
  }
</style>
