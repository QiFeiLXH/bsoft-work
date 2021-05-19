import Vue from 'vue'
import store from '@/store'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters.roles
    const elVal = vnode.context.$route.meta.permission
    const permissionId = elVal instanceof String && [elVal] || elVal

    if (roles.permissions.length <= 0){
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      return
    }
    if (!roles.permissionList.includes(permissionId)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      return
    }
    roles.permissions.forEach(p => {
      if (permissionId.includes(p.permissionId)) {
        if (!p.actionList.includes(actionName)) {
          el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
        }
      }
    })
  }
})

const watermark = Vue.directive('watermark',(el)=>{
  function addWaterMarker(str){// 水印文字，父元素，字体，文字颜色
    var can = document.createElement('canvas');
    can.width = 80;
    can.height = 60;
    can.style.display = 'none';
    var cans = can.getContext('2d');
    cans.rotate(-20 * Math.PI / 180);
    cans.font = "normal bold 18px 宋体";
    cans.fillStyle = "rgb(240,240,240)";
    cans.textAlign = 'left';
    cans.textBaseline = 'Middle';
    cans.fillText(str, can.width / 8, can.height / 2);
    el.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  }
  addWaterMarker(store.getters.userInfo.personId)
})

export default { action,watermark }
