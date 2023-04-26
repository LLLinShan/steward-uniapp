// 手机号
export const matchMobile = /^1\d{10}$/
// 邮箱
export const matchEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
// 固话
export const matchPhone = /^(\d{3,4}-)?(\d{7,14})$/
// 车牌
export const matchCarBoard =
  /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/
// 汉字
export const matchWordCn = /^[\u4e00-\u9fa5]+$/
// 密码
export const matchPassword = /^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/
// 金额
export const matchMoney = /^([1-9]\d{0,8}(\.\d{1,2})?|0\.\d{1,2})$/
// url
export const matchUrl =
  /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9$\-_.+!*'(),;?&=]|(?:%[a-fA-F0-9]{2})){1,64}(?::(?:[a-zA-Z0-9$\-_.+!*'(),;?&=]|(?:%[a-fA-F0-9]{2})){1,25})?@)?)?(?:(([-_a-zA-Z0-9]([-_a-zA-Z0-9-]{0,61}[-_a-zA-Z0-9]){0,1}\.)+[a-zA-Z]{2,63}|((25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9]))))(?::\d{1,5})?)(\/(?:(?:[-_a-zA-Z0-9;/?:@&=#~\-.+!*'(),_])|(?:%[a-fA-F0-9]{2}))*)?/
// 整数
export const matchInteger = /^\+?[0-9]*$/
// 邮编
export const matchPostcode = /^[0-9]{6}$/
// 身份证
export const isChnID = ID => {
  let Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1] // 加权因子
  let ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 身份证验证位值.10代表X
  const IdCardValidate = idCard => {
    if (idCard.length === 15) {
      return isValidityBrithBy15IdCard(idCard) //进行15位身份证的验证
    } else if (idCard.length === 18) {
      let a_idCard = idCard.split('') // 得到身份证数组
      if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {
        //进行18位身份证的基本验证和第18位的验证
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  /**
   * 判断身份证号码为18位时最后的验证位是否正确
   * @param a_idCard 身份证号码数组
   * @return
   */
  const isTrueValidateCodeBy18IdCard = a_idCard => {
    let sum = 0 // 声明加权求和变量
    if (a_idCard[17].toLowerCase() === 'x') {
      a_idCard[17] = 10 // 将最后位为x的验证码替换为10方便后续操作
    }
    for (let i = 0; i < 17; i++) {
      sum += Wi[i] * a_idCard[i] // 加权求和
    }
    let valCodePosition = sum % 11 // 得到验证码所位置
    if (String(a_idCard[17]) === String(ValideCode[valCodePosition])) {
      return true
    } else {
      return false
    }
  }
  /**
   * 验证18位数身份证号码中的生日是否是有效生日
   * @param idCard 18位书身份证字符串
   * @return
   */
  const isValidityBrithBy18IdCard = idCard18 => {
    let year = idCard18.substring(6, 10)
    let month = idCard18.substring(10, 12)
    let day = idCard18.substring(12, 14)
    let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day))
    // 这里用getFullYear()获取年份，避免千年虫问题
    if (
      temp_date.getFullYear() !== parseFloat(year) ||
      temp_date.getMonth() !== parseFloat(month) - 1 ||
      temp_date.getDate() !== parseFloat(day)
    ) {
      return false
    } else {
      return true
    }
  }
  /**
   * 验证15位数身份证号码中的生日是否是有效生日
   * @param idCard15 15位书身份证字符串
   * @return
   */
  const isValidityBrithBy15IdCard = idCard15 => {
    let year = idCard15.substring(6, 8)
    let month = idCard15.substring(8, 10)
    let day = idCard15.substring(10, 12)
    let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day))
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    if (
      temp_date.getYear() !== parseFloat(year) ||
      temp_date.getMonth() !== parseFloat(month) - 1 ||
      temp_date.getDate() !== parseFloat(day)
    ) {
      return false
    } else {
      return true
    }
  }
  return IdCardValidate(ID)
}
// 只能输入数字或者大小写字母
export const matchRate = /^[a-zA-Z0-9]*$/

// 户口本验证
export const matchHKB = /^[a-zA-Z0-9]{3,21}$/

// 护照
export const isPassWord = password => {
  return !/^[a-zA-Z0-9]{5,17}$/.test(password) || /^[a-zA-Z]{5,17}$/.test(password)
}
