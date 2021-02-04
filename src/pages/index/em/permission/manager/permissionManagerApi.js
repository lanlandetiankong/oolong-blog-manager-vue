//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const PermissionManagerApi = {
    getPageQuery(queryArr,pagination,sorter) {
        var sortObj = {}
        if(sorter){
            sorter.field = sorter.order ;
        }
        var obj = {
            queryObj:JSON.stringify(queryArr),
            paginationObj:JSON.stringify(pagination),
            sortObj:JSON.stringify(sortObj),
        }
        //查询所有权限信息
        return axios.post('/oblCtl/define/definePermission/queryPage',qs.stringify(obj)).then(res => res.data);
    },
    getItemById(fid){  //根据权限id查询权限信息
        var params = {
            fid:fid
        }
        return axios.post("/oblCtl/define/definePermission/queryOneById",qs.stringify(params)).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增权限
        if(formObj){
            if(formObj.codePrefix){
                formObj.code = formObj.codePrefix[0] + formObj.code ;
            }
        }
        return axios.post("/oblCtl/define/definePermission/createByForm",qs.stringify(formObj)).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新权限
        return axios.post("/oblCtl/define/definePermission/updateByForm",qs.stringify(formObj)).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/define/definePermission/batchDeleteByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/define/definePermission/deleteById",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    batchEnsureByIds(ids) {  //批量启用
        var obj = {
            ensureIds:ids
        }
        return axios.post("/oblCtl/define/definePermission/batchEnsureByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
}
