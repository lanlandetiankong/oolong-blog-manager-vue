//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const ArticleCreateApi = {
    createByForm(formObj) {     //发布文章
        return axios.post("/oblCtl/oblArticle/createByForm",qs.stringify(formObj)).then(res => res.data);
    },
    createFromDraft(formObj) {     //发布 更新后的文章草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        return axios.post("/oblCtl/oblArticle/createFromDraft",qs.stringify(formObj)).then(res => res.data);
    },
    createDraftByForm(formObj) {     //提交文章到草稿箱
        return axios.post("/oblCtl/oblArticle/createDraftByForm",qs.stringify(formObj)).then(res => res.data);
    },
    updateDraftByForm(formObj) {     //更新文章草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        return axios.post("/oblCtl/oblArticle/updateDraftByForm",qs.stringify(formObj)).then(res => res.data);
    },
    getIDraftItemById(fid){  //根据 文章草稿id 取得文章草稿
        var params = {
            fid:fid
        }
        return axios.post("/oblCtl/oblArticle/queryOneById",qs.stringify(params)).then(res => res.data);
    },
    getAllArticleTagEnums() {  //取得 文章标签 列表
        const sortObj = {     //固定 order字段 排序
            "weights":true
        }
        var obj = {
            queryObj:JSON.stringify({}),
            //paginationObj:JSON.stringify({}),
            sortObj:JSON.stringify(sortObj),
        }
        //查询所有文章标签信息
        return axios.post('/oblCtl/oblArticleTag/gainEnumSelect',qs.stringify(obj)).then(res => res.data);
    },
    getAllArticleCategoryTree() {  //取得 文章分类 树
        var obj = {
            queryObj:JSON.stringify({}),
        }
        //查询所有文章标签信息
        return axios.post('/oblCtl/oblArticleCategory/queryTreeSelect',qs.stringify(obj)).then(res => res.data);
    },

}
