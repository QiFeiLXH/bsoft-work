<template>
  <div class=logo>
    <a>
      <img v-if="collapsed" src="../../assets/B2.png" style="width: 38px;height: 38px;padding-left: -4px;">
      <img v-if="!collapsed" src="../../assets/blogo.png" style="width: 210px;height: 38px">
<!--      <h1  style="display: inline-block;display: inline;color:rgb(24, 144, 255)" v-if="showTitle">{{ title }}</h1>-->
    </a>
  </div>
</template>

<script>

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: '创业慧康',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: false,
      required: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
