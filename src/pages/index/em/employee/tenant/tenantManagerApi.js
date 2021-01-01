//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const TenantManagerApi = {
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
        //查询所有租户信息
        return axios.post('/oblCtl/organization/defineTenant/queryDtoPage',qs.stringify(obj)).then(res => res.data);
    },
    getItemById(defineTenantId){  //根据租户id查询租户信息
        var params = {
            defineTenantId:defineTenantId
        }
        return axios.post("/oblCtl/organization/defineTenant/queryOneById",qs.stringify(params)).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增租户
        return axios.post("/oblCtl/organization/defineTenant/createByForm",qs.stringify(formObj)).then(res => res.data);
    },
    updateByForm(formObj) {  //更新租户
        return axios.post("/oblCtl/organization/defineTenant/updateByForm",qs.stringify(formObj)).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/organization/defineTenant/batchDeleteByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/organization/defineTenant/deleteById",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    }
}
