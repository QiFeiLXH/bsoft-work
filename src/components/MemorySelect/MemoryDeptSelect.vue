<template>
  <div ref="selectDiv" style="display: inline-block;">
    <a-select
      @focus="showSelect"
      style="width: 100%;color: #000000;"
      v-model="text"
      :disabled="disabled"
      :readOnly="true"
      allowClear
      :showArrow="false"
      :open="false"
      :placeholder="placeholder">
      <a-icon slot="clearIcon" type="close-circle" theme="filled" @click="handleClear" v-if="showClearIcon"/>
    </a-select>
    <div v-show="showVisible" class="select-div">
      <a-input class="search-input" v-model="searchValue" placeholder="请输入拼音码或部门名称" @change="onSearch" allowClear></a-input>
      <div class="views">
        <div class="option-div" style="">
          <h2 class="ng-binding-useful">常用</h2>
          <a class="content-a" v-for="item in deptUseful" @click="selectOption(item)">{{ item.title }}</a>
        </div>
        <div class="option-div" v-for="item in deptList">
          <h2 class="ng-binding" @click="selectOption(item)">{{ item.title }}</h2>
          <a class="content-a" v-for="child in item.children" @click="selectOption(child)">{{ child.title }}</a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getDeptSelectTree } from '@/api/common'
export default {
  name: 'MemoryDeptSelect',
  props: {
    // 部门注销标志 ''为搜索全部， 0为未注销， 1已注销， 2含注销且部门内有人员的
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
    placeholder: {
      type: String,
      default: '请选择部门'
    },
    deptType: {
      type: String,
      default: ''
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    storageKey: {// 存到localStorage的key值
      type: String,
      default: 'deptUseful'
    },
    deptListParent:{
      type:Array,
      default:()=>[],
    },
    initDataFlag:{
      type:Boolean,
      default:true,
    }
    // value:{
    //   type:String,
    //   default:''
    // }
  },
  beforeMount () { // 添加点击其他地方隐藏本组件事件
    this._close = e => {
      // 如果点击发生在当前组件内部，则不处理
      if (this.$refs.selectDiv.contains(e.target)) {
        return
      }
      this.showVisible = false
    }
    document.body.addEventListener('click', this._close)
  },
  beforeDestroy () {
    document.body.removeEventListener('click', this._close)
  },
  mounted () {
    if(this.initDataFlag){
      this.loadDeptSelect()
    }else{
      this.deptListAll = this.deptListParent
    }
    this.getDeptUseful()
  },
  model: { // 此属性为v-model，实现数据绑定
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      showVisible: false,
      deptList: [],
      deptListAll: [],
      text: undefined,
      deptUseful: [],
      searchValue: '',
      searchIng: false,
      showClearIcon: false
    }
  },
  methods: {
    handleClear () {
      this.value = null
      this.triggerChange(this.value)
    },
    triggerChange (changedValue) {
      this.$emit('change', changedValue)
    },
    showSelect () {
      if (this.disabled) {
        return
      }
      this.getDeptUseful()
      this.loadDeptSelect()
      this.showVisible = true
    },
    hideSelect () {
      this.showVisible = false
    },
    getCurrent (dept, deptText) {
      this.value = dept
      this.text = deptText
    },
    selectOption (child) {
      const exits = this.checkExits(child.value)
      if (!exits) {
        this.deptUseful.unshift({ value: child.value, title: child.title })
      }
      if (this.deptUseful.length > 3) {
        this.deptUseful.splice(3, 1)
      }
      localStorage.setItem(this.storageKey, JSON.stringify(this.deptUseful))
      this.value = child.value
      this.text = child.title
      this.showClearIcon = true
      this.triggerChange(this.value)
      this.showVisible = false
    },
    getDeptUseful () {
      this.deptUseful = localStorage.getItem(this.storageKey) == null ? [] : JSON.parse(localStorage.getItem(this.storageKey))
      this.$emit('focus')
      // this.deptList = this.deptUseful
    },
    checkExits (e) {
      for (const data of this.deptUseful) {
        if (data.value === e) {
          return true
        }
      }
      return false
    },
    onSearch (inputValue) {
      // es6 filter过滤匹配，有则返回当前，无则返回所有
      var me = this
      if (me.searchValue.length > 0) {
        this.deptList = this.deptListAll.filter(function (e) {
          // 匹配所有字段
          // return Object.keys(e).some(function(key) {
          //   return e[key].match(reg);
          // })
          // 匹配某个字段
          var data = ''
          if (e.simpleCode != undefined) {
            if (e.title.indexOf(me.searchValue) > -1 || e.simpleCode.indexOf(me.searchValue.toUpperCase()) > -1) {
              data = e
            }
            // return e.title.indexOf(me.searchValue) > -1 || e.simpleCode.indexOf(me.searchValue.toUpperCase()) > -1;
          } else {
            if (e.title.indexOf(me.searchValue) > -1) {
              data = e
            }
            // return e.title.indexOf(me.searchValue) > -1;
          }
          if (e.children && e.children.length > 0) {
            e.children.filter(function (e1) {
              if (e1.simpleCode != undefined) {
                if (e1.title.indexOf(me.searchValue) > -1 || e1.simpleCode.indexOf(me.searchValue.toUpperCase()) > -1) {
                  data = e1
                }
                // return e.title.indexOf(me.searchValue) > -1 || e.simpleCode.indexOf(me.searchValue.toUpperCase()) > -1;
              } else {
                if (e1.title.indexOf(me.searchValue) > -1) {
                  data = e1
                }
                // return e.title.indexOf(me.searchValue) > -1;
              }
            })
          }
          return data
        })
      } else {
        this.deptList = this.deptListAll
      }
    },
    loadDeptSelect () {
      this.searchIng = true
      const param = {
        logout: this.logout,
        deptType: this.deptType
      }
      getDeptSelectTree(param).then((res) => {
        if (res.code === 200) {
          this.deptList = res.body
          this.deptListAll = res.body
        } else {
          this.$message.error(res.msg)
        }
        this.searchIng = false
      }).catch((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>
  .select-div{
    padding: 4px;
    width: 500px;
    height: 450px;
    position: absolute;
    z-index: 100;
    background-color: #fff;
    border-radius: 4px;
    outline: none;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  .search-input{

  }
  .ng-binding{
    font-size: 13px;
    line-height: 1;
    color: #333;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 5px;
  }
  .ng-binding-useful{
    font-size: 13px;
    line-height: 1;
    color: #333;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 5px;
  }
  .ng-binding:hover{
    color: #1890ff;
    cursor: pointer;
  }
  .option-div{
    padding: 14px;
    border-bottom: 1px dashed #dfdfdf;
    white-space: normal;
    font-weight: 400;
  }
  .views{
    max-height: 380px;
    overflow-y: auto;
  }
  .content-a{
    display: inline-block;
    padding: 0 8px;
    outline: 0;
    white-space: nowrap;
    text-decoration: none;
    color: #333;
    cursor: pointer;
    line-height: 26px;
    border-radius: 2px;
  }
  .content-a:hover{
    color: #1890ff;
    /*background-color: #1890ff;*/
  }
</style>
