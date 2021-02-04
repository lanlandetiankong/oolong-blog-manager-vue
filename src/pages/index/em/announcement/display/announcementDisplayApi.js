//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const AnnouncementDisplayApi = {
    getItemById(fid){  //根据 公告草稿id 取得公告草稿
        var params = {
            fid:fid
        }
        return axios.post("/oblCtl/announcement/queryOneById",qs.stringify(params)).then(res => res.data);
    }

}
