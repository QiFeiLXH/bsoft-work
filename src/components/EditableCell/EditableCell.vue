<template>
  <span class="editable-cell">
    <span v-if="editable" class="editable-cell-input-wrapper" style="width:150px;">
      <a-input :value="value"  @blur="check" @change="handleChange" @pressEnter="check" style="width:68%;" placeholder="新增子计划"/><a-icon
        type="check"
        class="editable-cell-icon-check"
        @click="check"
      />
    </span>
    <span v-else class="editable-cell-text-wrapper">
      <a-tooltip placement="right" v-if="value.length > 20">
        <template slot="title">
          {{ value }}
        </template>
        {{ value.length > 20 ? value.substring(0,20)+'...' : value }}
      </a-tooltip>
      <span v-if="value.length <= 20">{{ value }}</span>
      <a-icon type="edit" v-if="record.milepostLevel > 1 && record.logoff == 0 && record.finishFlag !== 1" class="editable-cell-icon" @click="edit" />
    </span>
  </span>
</template>
<script>
export default {
  props: {
    text: String,
    record:Object
  },
  data () {
    return {
      value: this.text,
      editable: this.record.newFlag ? this.record.newFlag : false
    }
  },
  methods: {
    handleChange (e) {
      const value = e.target.value
      this.value = value
    },
    check () {
      if (this.value == null || this.value === '') {
        this.$message.error('请输入计划名称')
        return
      }
      if (this.value.length > 50) {
        this.$message.error('阶段名称长度请控制在50字以内！')
        return
      }
      this.editable = false
      this.$emit('change', this.value)
    },
    edit () {
      this.editable = true
    }
  }
}
</script>
<style>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
    width:150px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>
