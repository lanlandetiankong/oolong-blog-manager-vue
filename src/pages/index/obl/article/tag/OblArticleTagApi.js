//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const OblArticleTagApi = {
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
        return axios.post('/oblCtl/oblArticleTag/queryDtoPage',qs.stringify(obj)).then(res => res.data);
    },
    getItemById(fid){  //根据id查询item
        var params = {
            fid:fid
        }
        return axios.post("/oblCtl/oblArticleTag/queryOneById",qs.stringify(params)).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增
        return axios.post("/oblCtl/oblArticleTag/createByForm",qs.stringify(formObj)).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新
        return axios.post("/oblCtl/oblArticleTag/updateByForm",qs.stringify(formObj)).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/oblArticleTag/batchDeleteByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/oblArticleTag/deleteById",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    }
}

