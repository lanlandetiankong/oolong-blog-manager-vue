import axios from '~Config/axios/httpConfig'
import {HttpUtil} from "~Config/axios/httpUtil";

export const ArticleCreateApi = {
    createByForm(formObj) {     //发布文章
        formObj['categoryIdList'] = HttpUtil.strToList(formObj['categoryIdList']);
        return axios.post("/oblCtl/oblArticle/createByForm",formObj).then(res => res.data);
    },
    createFromDraft(formObj) {     //发布 更新后的文章草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        formObj['categoryIdList'] = HttpUtil.strToList(formObj['categoryIdList']);
        return axios.post("/oblCtl/oblArticle/createFromDraft",formObj).then(res => res.data);
    },
    createDraftByForm(formObj) {     //提交文章到草稿箱
        formObj['categoryIdList'] = HttpUtil.strToList(formObj['categoryIdList']);
        return axios.post("/oblCtl/oblArticle/createDraftByForm",formObj).then(res => res.data);
    },
    updateDraftByForm(formObj) {     //更新文章草稿
        if(formObj){
            formObj["createTime"] = undefined;
            formObj["updateTime"] = undefined;
        }
        formObj['categoryIdList'] = HttpUtil.strToList(formObj['categoryIdList']);
        return axios.post("/oblCtl/oblArticle/updateDraftByForm",formObj).then(res => res.data);
    },
    getIDraftItemById(fid){  //根据 文章草稿id 取得文章草稿
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/oblArticle/queryOneById",params).then(res => res.data);
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
