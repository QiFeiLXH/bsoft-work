// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)

import * as plugins from 'bsoft-plugin'
Vue.use(plugins)

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
