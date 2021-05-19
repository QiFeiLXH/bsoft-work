<template>
  <div :class="prefixCls">
    <div style="float: left">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <slot name="left"/>
    <slot name="content"/>
    <div style="float: right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FooterToolBar',
    props: {
      prefixCls: {
        type: String,
        default: 'ant-pro-footer-toolbar'
      },
      extra: {
        type: [String, Object],
        default: ''
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
