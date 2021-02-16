import axios from '~Config/axios/httpConfig';
import {HttpUtil} from '~Config/axios/httpUtil';

export const ArticleMyDraftListApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        obj['categoryIdList'] = HttpUtil.strToList(obj['categoryIdList']);
        //查询所有文章
        return axios.post('/oblCtl/oblArticle/querySelfDraftDtoPage',obj).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        };
        return axios.post("/oblCtl/oblArticle/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        };
        return axios.post("/oblCtl/oblArticle/deleteById",obj).then(res => res.data) ;
    },
    getAllArticleTagEnums() {  //取得 文章标签 列表
        let obj = HttpUtil.formatQueryPage({},{});
        //查询所有文章标签信息
        return axios.post('/oblCtl/oblArticleTag/gainEnumSelect',obj).then(res => res.data);
    },
    getAllArticleCategoryTree() {  //取得 文章分类 树
        let obj = HttpUtil.formatQueryPage({},{});
        //查询所有文章标签信息
        return axios.post('/oblCtl/oblArticleCategory/queryTreeSelect',obj).then(res => res.data);
    },
};

