import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const PermissionManagerApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有权限信息
        return axios.post('/oblCtl/define/definePermission/queryPage',obj).then(res => res.data);
    },
    getItemById(fid){  //根据权限id查询权限信息
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/define/definePermission/queryOneById",params).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增权限
        if(formObj){
            if(formObj.codePrefix){
                formObj.code = formObj.codePrefix[0] + formObj.code ;
            }
        }
        return axios.post("/oblCtl/define/definePermission/createByForm",formObj).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新权限
        return axios.post("/oblCtl/define/definePermission/updateByForm",formObj).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        };
        return axios.post("/oblCtl/define/definePermission/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        };
        return axios.post("/oblCtl/define/definePermission/deleteById",obj).then(res => res.data) ;
    },
    batchEnsureByIds(ids) {  //批量启用
        var obj = {
            ensureIds:ids
        };
        return axios.post("/oblCtl/define/definePermission/batchEnsureByIds",obj).then(res => res.data) ;
    },
};
