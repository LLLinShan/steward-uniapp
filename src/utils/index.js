import store from '@/store'
// 唯一id
let UUID = 0

// 全局静态变量
export const Data = () => {
  return {
    primaryColor: '#00c8cf',
    defaultStr: '--'
  }
}

export default {
  // 函数防抖
  debounce(func, delay = 300, immediate = false) {
    let timer = null
    return function () {
      if (timer) {
        clearTimeout(timer)
      }
      if (immediate && !timer) {
        console.log('enter')
        func.apply(this, arguments)
      }
      timer = setTimeout(() => {
        func.apply(this, arguments)
      }, delay)
    }
  },
  // 获取字典的label
  getDicLabel(key, value) {
    let dicList = store.state.user.dic
    if (dicList.length) {
      const curList = dicList.find(item => item.dataType === key)?.labels || []
      const curLabel = curList.find(item => item.value === String(value))?.label
      return curLabel || Data().defaultStr
    }
    return Data().defaultStr
  },

  // 获取字典的list
  getDicList(key) {
    let dicList = store.state.user.dic
    if (dicList.length) {
      const curList = dicList.find(item => item.dataType === key)?.labels || []
      return curList || Data().defaultStr
    }
    return Data().defaultStr
  },
  /**
   * 版本比较（版本号格式：'主版本号.次版本号.修订版本号'）
   * @author chenrenbin
   * @param {String} v1 版本号1
   * @param {String} v2 版本号2
   * @return {Number} 比较结果--（-1：小于；0：等于; 1：大于）
   */
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) v1.push('0')
    while (v2.length < len) v2.push('0')

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },
  uniqueID() {
    return 'UUID' + new Date().getTime() + (Math.random() + UUID++).toString(36).replace('.', '')
  }
}
