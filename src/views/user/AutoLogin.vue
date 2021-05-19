<template>

</template>

<script>
import { checklogin } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from "vue"
export default {
  name: "AutoLogin",
  data () {
    return {

    }
  },
  mounted() {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      const { $store } = this
      checklogin().then((res) => {
        if (res.code === 200){
          Vue.ls.set(ACCESS_TOKEN, res.properties.sessionid, 24 * 60 * 60 * 1000)
          $store.commit('SET_TOKEN', res.properties.sessionid)
          this.loginSuccess(res)
        }
      }).catch((err) => {

      })
    },
    loginSuccess (res) {
      const toPath = res.properties.toPath
      if (toPath == null || toPath == ''){
        this.$router.push({ path: '/'})
      } else {
        this.$router.push({ path: toPath})
      }
    }
  }
}
</script>

<style scoped>

</style>