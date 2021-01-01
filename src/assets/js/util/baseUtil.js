/**
 * components util
 */

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty (children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

/**
 * 获取字符串长度，英文字符 长度1，中文字符长度2
 * @param {*} str
 */
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

/**
 * 截取字符串，根据 maxLength 截取后返回
 * @param {*} str
 * @param {*} maxLength
 */
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}


export const dealNumberToStr = (num,defaultVal) => {
    if(typeof num == "undefined" || num == null){
        if(typeof defaultVal == "undefined"){
            return 0;
        }   else {
            return defaultVal;
        }
    }   else {
        return num.toString();
    }
}


export function jsObjectToFormData(confObj,formData) { //对象转formdata格式
    formData = (typeof formData != "undefined" && formData != null) ? formData : new FormData();
    if(typeof confObj != "undefined" && confObj != null){
        for(var confItem in confObj){
            formData.append(confItem,confObj[confItem]);
        }
    }
    return formData;
}
