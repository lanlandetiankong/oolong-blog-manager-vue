//ajax远程调用
import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const AnnouncementMyDraftListApi = {
    getAllAnnouncementTagEnums() {  //取得 公告标签 列表
        let obj = HttpUtil.formatQueryPage({},{});
        //查询所有公告标签信息
        return axios.post('/oblCtl/announcementTag/gainEnumSelect',obj).then(res => res.data);
    },
    getPageQuery(queryArr,tableConf) {   //取得 所有公告
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        obj['onlySelf'] = true ;
        //查询所有公告信息
        return axios.post('/oblCtl/announcementDraft/queryPage',obj).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/announcementDraft/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/announcementDraft/deleteById",obj).then(res => res.data) ;
    },
    publishOneById(publishId) {  //草稿转发布
        var obj = {
            draftId:publishId
        }
        return axios.post("/oblCtl/announcementDraft/publishDraft",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    batchPublishByIds(ids) {  //批量发布
        var obj = {
            draftIds:ids
        }
        return axios.post("/oblCtl/announcementDraft/batchPublishDraft",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },

}

