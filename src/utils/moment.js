import Moment from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
Moment.extend(advancedFormat)

const instance = function (Vue) {
  const moment = (time, type = 1) => {
    if (time === undefined) return '--'
    let format
    if (type === 1) format = 'YYYY-MM-DD HH:mm:ss'
    else if (type === 2) format = 'YYYY-MM-DD'
    else if (type === 3) format = 'HH:mm:ss'
    else format = type
    const result = Moment(time).format(format)
    return result !== 'Invalid date' ? result : '--'
  }
  Vue.prototype.$Moment = Moment
  Vue.prototype.$moment = moment
}
export default instance
