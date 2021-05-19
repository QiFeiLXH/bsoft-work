<template>
  <a-cascader
    :field-names="{ label: 'name', value: 'id', children: 'children' }"
    :options="options"
    :value="value"
    :show-search="{ filter }"
    :disabled="disabled"
    :allowClear="allowClear"
    style="color: #000000;background: #ffffff"
    placeholder="请选择"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    @focus="handleFocus"
    @change="onChange"
  />
</template>

<script>
import { getArea } from '@/api/common'
export default {
  name: 'AdministrativeNewDivision',
  data () {
    return {
      value: [],
      area: [],
      options: []
    }
  },
  props: {
    /* division:{
      type:Array,
      default:() => []
    }, */
    division: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'division',
    event: 'change'
  },
  methods: {
    triggerChange (changedValue) {
      this.$emit('change', changedValue)
    },
    filter (inputValue, path) {
      return path.some(option => option.name.indexOf(inputValue.toLowerCase()) > -1 || option.pinyin.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    getCurrent (value, option) {
      if (value[value.length - 1] === null) {
        this.value = undefined
        this.options = []
      } else {
        this.value = value
        this.options = option
      }
    },
    onChange (value, option) {
      this.value = value
      const newVal = { province: null, provinceText: null, city: null, cityText: null, county: null, countyText: null }
      if (option !== undefined) {
        for (let i = 0; i < option.length; i++) {
          if (option[i].level === 1) {
            newVal.province = option[i].id
            newVal.provinceText = option[i].name
          } else if (option[i].level === 2) {
            newVal.city = option[i].id
            newVal.cityText = option[i].name
          } else if (option[i].level === 3) {
            newVal.county = option[i].id
            newVal.countyText = option[i].name
          }
        }
      }
      this.$emit('setDivision', newVal)
      this.triggerChange(value[value.length - 1])
    },
    handleFocus () {
      const me = this
      if (this.options.length === 0 || this.options.length === 1) {
        const me = this
        getArea().then(res => {
          if (res.code === 200) {
            me.options = res.body
          }
        })
      }
    }
  }
}
</script>
