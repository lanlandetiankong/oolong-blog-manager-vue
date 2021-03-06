import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const DepartmentManagerApi = {
    getAllDefineDepartmentTree() {
        let obj = {} ;
        //查询所有部门信息(树结构)
        return axios.post('/oblCtl/define/defineDepartment/queryTreeSelect',obj).then(res => res.data);
    },
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有部门信息
        return axios.post('/oblCtl/define/defineDepartment/queryPage',obj).then(res => res.data);
    },
    getItemById(fid){  //根据部门id查询部门信息
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/define/defineDepartment/queryOneById",params).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增部门
        return axios.post("/oblCtl/define/defineDepartment/createByForm",formObj).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新部门
        return axios.post("/oblCtl/define/defineDepartment/updateByForm",formObj).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        };
        return axios.post("/oblCtl/define/defineDepartment/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        };
        return axios.post("/oblCtl/define/defineDepartment/deleteById",obj).then(res => res.data) ;
    }
};
