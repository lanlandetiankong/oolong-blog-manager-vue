//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const DepartmentManagerApi = {
    getAllDefineDepartmentTree() {
        //查询所有部门信息(树结构)
        return axios.post('/oblCtl/define/defineDepartment/queryTreeSelect').then(res => res.data);
    },
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
        //查询所有部门信息
        return axios.post('/oblCtl/define/defineDepartment/queryPage',qs.stringify(obj)).then(res => res.data);
    },
    getItemById(defineDepartmentId){  //根据部门id查询部门信息
        var params = {
            defineDepartmentId:defineDepartmentId
        }
        return axios.post("/oblCtl/define/defineDepartment/queryOneById",qs.stringify(params)).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增部门
        return axios.post("/oblCtl/define/defineDepartment/createByForm",qs.stringify(formObj)).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新部门
        return axios.post("/oblCtl/define/defineDepartment/updateByForm",qs.stringify(formObj)).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/define/defineDepartment/batchDeleteByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/define/defineDepartment/deleteById",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    }
}
