import axios from '~Config/axios/httpConfig'
import {HttpUtil} from "~Config/axios/httpUtil";

export const AnnouncementCreateApi = {
    createByForm(formObj) {     //发布公告
        return axios.post("/oblCtl/announcement/createByForm",formObj).then(res => res.data);
    },
    createFromDraft(formObj) {     //发布 更新后的公告草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        return axios.post("/oblCtl/announcement/createFromDraft",formObj).then(res => res.data);
    },
    createDraftByForm(formObj) {     //提交公告到草稿箱
        return axios.post("/oblCtl/announcementDraft/createByForm",formObj).then(res => res.data);
    },
    updateDraftByForm(formObj) {     //更新公告草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        return axios.post("/oblCtl/announcementDraft/updateByForm",formObj).then(res => res.data);
    },
    getIDraftItemById(fid){  //根据 公告草稿id 取得公告草稿
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/announcementDraft/queryOneById",params).then(res => res.data);
    },
    getAllAnnouncementTagEnums() {  //取得 公告标签 列表
        let obj = HttpUtil.formatQueryPage({},{});
        //查询所有公告标签信息
        return axios.post('/oblCtl/announcementTag/gainEnumSelect',obj).then(res => res.data);
    },

};
