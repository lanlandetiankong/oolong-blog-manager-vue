import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const SysFeedbackMyCreateListApi = {
    querySelfDtoPage(queryArr, tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //分页查询
        return axios.post('/oblCtl/emSysFeedback/querySelfDtoPage', obj).then(res => res.data);
    },
    getItemById(fid) {  //根据id查询
        var params = {
            fid: fid
        };
        return axios.post("/oblCtl/emSysFeedback/queryOneById", params).then(res => res.data);
    },
    queryTypeTree() {
        let obj = {
            withRoot:true  ,   //是否包含根节点
        };
        return axios.post('/oblCtl/emSysFeedbackType/queryTree',obj).then(res => res.data);
    },
    createByForm(formObj) {     //新增
        return axios.post("/oblCtl/emSysFeedback/createByForm", formObj).then(res => res.data);
    },
    updateByForm(formObj) {  //更新
        return axios.post("/oblCtl/emSysFeedback/updateByForm",formObj).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds: ids
        };
        return axios.post("/oblCtl/emSysFeedback/batchDeleteByIds", obj).then(res => res.data);
    },
    deleteById(delId) {  //删除
        var obj = {
            delId: delId
        };
        return axios.post("/oblCtl/emSysFeedback/deleteById", obj).then(res => res.data);
    }
};
