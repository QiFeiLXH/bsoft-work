import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/defaultSettings'

// base library
import '@/core/lazy_lib/components_use'
// 图表
// import Viser from 'viser-vue'

// ECharts
import echarts from 'echarts'

// ext library
// 剪切板
// import VueClipboard from 'vue-clipboard2'
import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'
import PermissionHelper from '@/utils/helper/permission'
import './directives/action'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.prototype.$echarts = echarts
// VueClipboard.config.autoSetContainer = true

// Vue.use(Viser)
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(VueStorage, config.storageOptions)
// Vue.use(VueClipboard)
Vue.use(PermissionHelper)
Vue.use(Viewer)
