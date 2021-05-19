import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  var reg = value.toString().indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  const intPartFormat = value.toString().replace(reg, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('DateFormat', function (dataStr, pattern = 'YYYY-MM-DD') {
  return moment(dataStr).format(pattern)
})

Vue.filter('PercentFormat', function (value, number) {
  if (!value) {
    return ''
  }
  var percentNum = number ? Number(value * 100).toFixed(number) : Number(value * 100).toFixed()
  percentNum += '%'
  return percentNum
})

Vue.filter('AmountFormat', function (value) {
  if (!value) {
    return '0'
  }
  value = value.toFixed(2)
  var reg = value.toString().indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  const intPartFormat = value.toString().replace(reg, '$1,') // 将整数部分逢三一断
  return intPartFormat
})
