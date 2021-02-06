//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const DashBoardApi = {
    getSomeAnnouncementList(limitSize,onlySelf) {       //取得部分 公告列表
        var obj = {
            limitSize:limitSize,
            onlySelf:onlySelf
        };
        //查询所有职务信息
        return axios.post('/oblCtl/announcement/queryFilteredPage',qs.stringify(obj)).then(res => res.data);
    }
}
