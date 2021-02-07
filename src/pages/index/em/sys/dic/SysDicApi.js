import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const SysDicApi = {
    getPageQuery(queryArr, tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //分页查询
        return axios.post('/oblCtl/emSysDic/queryPage', obj).then(res => res.data);
    },
    getItemById(fid) {  //根据id查询
        var params = {
            fid: fid
        };
        return axios.post("/oblCtl/emSysDic/queryOneById", params).then(res => res.data);
    },
    createByForm(formObj) {     //新增
        return axios.post("/oblCtl/emSysDic/createByForm", formObj).then(res => res.data);
    },
    updateByForm(formObj) {  //更新
        return axios.post("/oblCtl/emSysDic/updateByForm",formObj).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds: ids
        };
        return axios.post("/oblCtl/emSysDic/batchDeleteByIds", obj).then(res => res.data);
    },
    deleteById(delId) {  //删除
        var obj = {
            delId: delId
        };
        return axios.post("/oblCtl/emSysDic/deleteById", obj).then(res => res.data);
    }
};
