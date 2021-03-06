import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const ModuleManagerApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有模块信息
        return axios.post('/oblCtl/module/define_module/queryPage',obj).then(res => res.data);
    },
    getItemById(fid){  //根据模块id查询模块信息
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/module/define_module/queryOneById",params).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增模块
        return axios.post("/oblCtl/module/define_module/createByForm",formObj).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新模块
        return axios.post("/oblCtl/module/define_module/updateByForm",formObj).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        };
        return axios.post("/oblCtl/module/define_module/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        };
        return axios.post("/oblCtl/module/define_module/deleteById",obj).then(res => res.data) ;
    }
};
