//ajax远程调用
import axios from '~Config/axios/httpConfig';
import {HttpUtil} from '~Config/axios/httpUtil';
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const ArticleAllListApi = {
    getAllArticleTagEnums() {  //取得 文章标签 列表
        let obj = HttpUtil.formatQueryPage({},{});
        //查询所有文章标签信息
        return axios.post('/oblCtl/oblArticleTag/gainEnumSelect',obj).then(res => res.data);
    },
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有文章
        return axios.post('/oblCtl/oblArticle/queryPage',obj).then(res => res.data);
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
        return axios.post("/oblCtl/oblArticle/deleteById",obj).then(res => res.data) ;
    },

}

