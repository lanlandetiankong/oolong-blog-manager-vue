//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const AnnouncementCreateApi = {
    createByForm(formObj) {     //发布公告
        return axios.post("/oblCtl/announcement/createByForm",qs.stringify(formObj)).then(res => res.data);
    },
    createFromDraft(formObj) {     //发布 更新后的公告草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        return axios.post("/oblCtl/announcement/createFromDraft",qs.stringify(formObj)).then(res => res.data);
    },
    createDraftByForm(formObj) {     //提交公告到草稿箱
        return axios.post("/oblCtl/announcementDraft/createByForm",qs.stringify(formObj)).then(res => res.data);
    },
    updateDraftByForm(formObj) {     //更新公告草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        return axios.post("/oblCtl/announcementDraft/updateByForm",qs.stringify(formObj)).then(res => res.data);
    },
    getIDraftItemById(draftId){  //根据 公告草稿id 取得公告草稿
        var params = {
            draftId:draftId
        }
        return axios.post("/oblCtl/announcementDraft/queryOneById",qs.stringify(params)).then(res => res.data);
    },
    getAllAnnouncementTagEnums() {  //取得 公告标签 列表
        const sortObj = {     //固定 order字段 排序
            "weights":true
        }
        var obj = {
            queryObj:JSON.stringify([]),
            //paginationObj:JSON.stringify({}),
            sortObj:JSON.stringify(sortObj),
        }
        //查询所有公告标签信息
        return axios.post('/oblCtl/announcementTag/gainEnumSelect',qs.stringify(obj)).then(res => res.data);
    },

}
