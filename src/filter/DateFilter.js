import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
/**
 * 全局定义-时间过滤器
 */


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




const DateFilter = Vue ;
export default DateFilter ;
