//ajax远程调用
import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const AnnouncementAllListApi = {
    getAllAnnouncementTagEnums() {  //取得 公告标签 列表
        const sortObj = {     //固定 order字段 排序
            "weights":true
        }
        var obj = {
            queryObj:JSON.stringify({}),
            //paginationObj:JSON.stringify({}),
            sortObj:JSON.stringify(sortObj),
        }
        //查询所有公告标签信息
        return axios.post('/oblCtl/announcementTag/gainEnumSelect',qs.stringify()).then(res => res.data);
    },
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有公告信息
        return axios.post('/oblCtl/announcement/queryPage',obj).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/announcement/batchDeleteByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/announcement/deleteById",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },

}

