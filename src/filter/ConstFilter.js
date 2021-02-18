import Vue from 'vue'
import {i18nUtil} from "~Config/i18n/i18nUtil";

/**
 * 常量格式化-性别
 */
Vue.filter('formatConstOfSex', function(value) {
    if(typeof value == "undefined" || value == null){
        return '' ;
    }
    //是否中文环境
    var zhCnFlag = i18nUtil.isZhCnLocale();
    if(zhCnFlag){
        const valMap = {
            0:"女",
            1:"男"
        };
        return valMap[value] ;
    }   else {
        const valMap = {
            0:"Woman",
            1:"Man"
        };
        return valMap[value] ;
    }
});




const ConstFilter = Vue ;
export default ConstFilter ;
