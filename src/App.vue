<template>
  <a-config-provider :locale="locale">
    <div id="app" style="overflow: hidden">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
  import { mapActions } from 'vuex'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import 'moment/locale/zh-cn';
import moment from 'moment'
moment.locale('zh-cn');

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {

  },
  methods:{
    ...mapActions(['setCurrentRoute']),
  },
  watch: {
    $route: {
      handler: function(route) {
        this.setCurrentRoute(route)
      },
      immediate: true
    }
  },
}
</script>
<style>
  #app {
    height: 100%;
    font-family:"微软雅黑", Helvetica;
  }
</style>
