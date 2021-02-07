//ajax远程调用
import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const EmpJobApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有职务信息
        return axios.post('/oblCtl/define/defineJob/queryPage',obj).then(res => res.data);
    },
    getItemById(fid){  //根据职务id查询职务信息
        var params = {
            fid:fid
        }
        return axios.post("/oblCtl/define/defineJob/queryOneById",qs.stringify(params)).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增职务
        return axios.post("/oblCtl/define/defineJob/createByForm",qs.stringify(formObj)).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新职务
        return axios.post("/oblCtl/define/defineJob/updateByForm",qs.stringify(formObj)).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/define/defineJob/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/define/defineJob/deleteById",obj).then(res => res.data) ;
    }
}
