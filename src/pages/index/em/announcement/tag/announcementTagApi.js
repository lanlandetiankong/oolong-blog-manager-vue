//ajax远程调用
import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const AnnouncementTagApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有公告标签信息
        return axios.post('/oblCtl/announcementTag/queryPage',obj).then(res => res.data);
    },
    getItemById(fid){  //根据公告标签id查询公告标签信息
        var params = {
            fid:fid
        }
        return axios.post("/oblCtl/announcementTag/queryOneById",qs.stringify(params)).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增公告标签
        return axios.post("/oblCtl/announcementTag/createByForm",qs.stringify(formObj)).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新公告标签
        return axios.post("/oblCtl/announcementTag/updateByForm",qs.stringify(formObj)).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/announcementTag/batchDeleteByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/announcementTag/deleteById",obj).then(res => res.data) ;
    }
}

