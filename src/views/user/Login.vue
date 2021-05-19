<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit.native.prevent="handleSubmit"
    >
      <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="  工号"
            @pressEnter="Idpress"
            ref='username'
            allowClear
            v-decorator="[
              'username',
              {rules: [{ required: true, message: '请输入工号' }]}
            ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-input
            size="large"
            type="password"
            autocomplete="false"
            placeholder="  密码"
            allowClear
            ref='password'
            v-decorator="[
              'password',
              {rules: [{ required: true, message: '请输入密码' }]}
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

      <a-form-item
        v-if="times >= 5 && times < 10"
      >
        <a-input
          size="large"
          autocomplete="false"
          placeholder="  验证码"
          style="width: 60%"
          v-decorator="[
              'inputCode',
              {rules: [{ required: true, message: '请输入验证码' }]}
            ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
        <a
          @click.stop="refresh"
          style="width: 40%;text-align: center;letter-spacing:8px;cursor:pointer;"
        >
          <img src="/api/code/refresh" ref="verificationCode">
        </a>
      </a-form-item>
      <a-alert v-if="isLoginError && times >= 1" type="error" showIcon style="margin-bottom: 24px;" :message = message />
      <a-alert v-if="isLoginError && times >= 10 && time >= 0 && clockTime != ''" type="warning" showIcon style="margin-bottom: 24px;" :message = clockTime />
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loginBtn"
          :disabled="times >= 10 && time >= 0"
        >确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { checkEnable, codeRefresh } from '@/api/login'

export default {
  data () {
    return {
      loginBtn: false,
      isLoginError: false,
      form: this.$form.createForm(this),
      message: '',
      times: 0,
      time:'',
      clockTime: ''
    }
  },
  mounted() {
    this.check()
    this.$refs.username.focus();
  },
  destroyed(){
    clearInterval(this.Interval)
  },
  methods: {
    ...mapActions(['Login']),
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        Login
      } = this
      this.loginBtn = true
      const validateFieldsKey = ['username', 'password', 'inputCode']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams.username = values.username
          loginParams.password = md5(values.password).toUpperCase()
          loginParams.inputCode = values.inputCode
          // 登录actions
          Login(loginParams)
            .then((res) => {
              if (res.code === 200){
                this.loginSuccess(res)
              } else if (res.code === 10004){
                this.requestFailed(res)
              } else {
                const properties = res.properties
                this.message = res.msg + "已累计错误" +properties.times+"次"
                this.isLoginError = true
                this.times = properties.times
                this.time = properties.count
                if (this.times >= 10 && this.time >0){
                  this.clock()
                } else {
                  clearInterval(this.Interval)
                }
              }
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              this.loginBtn = false
            })
        } else {
          setTimeout(() => {
            this.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      this.$router.push({ path: '/' })
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      // this.$notification['error']({
      //   message: err.msg || '请求出现错误，请稍后再试',
      //   duration: 4
      // })
    },
    check () {
      checkEnable().then((res)=>{
        if (res.code !== 200){
          const properties = res.properties
          this.message = "账号或密码错误已有"+properties.times+"次"
          this.isLoginError = true
          this.times = properties.times
          this.time = properties.count
          if (this.times >= 10 && this.time >0){
            this.clock()
          } else {
            clearInterval(this.Interval)
          }
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    //时钟功能，一秒执行一次
    clock(){
      var Interval =setInterval(()=>{
        this.updateTime()
      },1000)
      this.Interval = Interval;
    },
    updateTime() {
      this.time = this.time - 1000
      this.clockTime = this.PrefixInteger(parseInt(this.time/1000/60),2) + ":" + this.PrefixInteger(parseInt(this.time/1000%60),2) + "    请稍后再试"
    },
    PrefixInteger(num, length) {
      return (Array(length).join('0') + num).slice(-length);
    },
    refresh () {
      var timenow = new Date().getTime();
      this.$refs.verificationCode.src = '/api/code/refresh?date='+timenow
    },
    Idpress(e){
      this.$refs.password.focus()
      e.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
