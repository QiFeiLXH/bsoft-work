export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function downFile (blob, fileName) {
  // 非IE下载
  if ('download' in document.createElement('a')) {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob) // 创建下载的链接
    link.download = fileName // 下载后文件名
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click() // 点击下载
    window.URL.revokeObjectURL(link.href) // 释放掉blob对象
    document.body.removeChild(link) // 下载完成移除元素
  } else {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName)
  }
}

export function PriceFormat (value) {
  if (!value) {
    return '0'
  }
  value = value.toFixed(2)
  var reg = value.toString().indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  const intPartFormat = value.toString().replace(reg, '$1,') // 将整数部分逢三一断
  return intPartFormat
}
