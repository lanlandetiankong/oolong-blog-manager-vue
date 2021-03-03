import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import BeeUtil from "~Assets/js/util/bee/BeeUtil";

/**
 * 常规日期格式化
 */
Vue.filter('formatBaseDateTime', function(value) {
    if(!value){
        return '' ;
    }
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
});


/**
 * 常规日期格式化
 */
Vue.filter('formatCnDateTime', function(value) {
    if(!value){
        return '' ;
    }
    return moment(value).format('YYYY年MM月DD日 HH:mm:ss');
});
/**
 * 距离现在多少天前
 */
Vue.filter('formatStartDayFromNow', function(value) {
    if(!value){
        return '' ;
    }
    return moment(value).startOf('day').fromNow();
});
/**
 * 判断是星期几
 */
Vue.filter('formatDayOfWeek', function(value) {
    if(!value){
        return '' ;
    }
    return moment(value).format('dddd');
});


/**
 * 数据转化-集合/字符串
 */
Vue.filter('formatArrayToStr', function(value) {
    if(!value){
        return '' ;
    }
    return BeeUtil.ArrayUtils.toStr(value,",");
});




const DataFilter = Vue ;
export default DataFilter ;
