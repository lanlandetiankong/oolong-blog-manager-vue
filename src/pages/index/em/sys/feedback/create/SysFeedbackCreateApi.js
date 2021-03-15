import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const SysFeedbackCreateApi = {
    createByForm(formObj) {     //发布文章
        formObj['typeIdList'] = HttpUtil.strToList(formObj['typeIdList']);
        return axios.post("/oblCtl/emSysFeedback/createByForm",formObj).then(res => res.data);
    },
    createFromDraft(formObj) {     //发布 更新后的文章草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        formObj['typeIdList'] = HttpUtil.strToList(formObj['typeIdList']);
        return axios.post("/oblCtl/emSysFeedback/createFromDraft",formObj).then(res => res.data);
    },
    createDraftByForm(formObj) {     //提交文章到草稿箱
        formObj['typeIdList'] = HttpUtil.strToList(formObj['typeIdList']);
        return axios.post("/oblCtl/emSysFeedback/createDraftByForm",formObj).then(res => res.data);
    },
    updateDraftByForm(formObj) {     //更新文章草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        formObj['typeIdList'] = HttpUtil.strToList(formObj['typeIdList']);
        return axios.post("/oblCtl/emSysFeedback/updateDraftByForm",formObj).then(res => res.data);
    },
    queryTypeTree() {
        let obj = {
            withRoot:true  ,   //是否包含根节点
        };
        return axios.post('/oblCtl/emSysFeedbackType/queryTree',obj).then(res => res.data);
    },
    getItemById(fid){  //根据id 取得反馈
        let params = {
            fid:fid
        };
        return axios.post("/oblCtl/emSysFeedbackType/queryOneById",params).then(res => res.data);
    },
};
