//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const ArticleAllListApi = {
    getAllArticleTagEnums() {  //取得 文章标签 列表
        const sortObj = {     //固定 order字段 排序
            "weights":true
        }
        var obj = {
            queryObj:JSON.stringify([]),
            //paginationObj:JSON.stringify({}),
            sortObj:JSON.stringify(sortObj),
        }
        //查询所有文章标签信息
        return axios.post('/oblCtl/oblArticleTag/gainEnumSelect',qs.stringify(obj)).then(res => res.data);
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
        //查询所有文章
        return axios.post('/oblCtl/oblArticle/queryDtoPage',qs.stringify(obj)).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/oblArticle/batchDeleteByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/oblArticle/deleteById",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },

}

