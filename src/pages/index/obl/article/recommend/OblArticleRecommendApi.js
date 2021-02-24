import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const OblArticleRecommendApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        return axios.post('/oblCtl/oblArticleRecommend/queryPage',obj).then(res => res.data);
    },
    getItemById(fid){  //根据id查询item
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/oblArticleRecommend/queryOneById",params).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        };
        return axios.post("/oblCtl/oblArticleRecommend/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        };
        return axios.post("/oblCtl/oblArticleRecommend/deleteById",obj).then(res => res.data) ;
    },
    updateToConfirmed(ids) {  //批量确认推荐
        let obj = {
           idList:ids
        };
        return axios.post("/oblCtl/oblArticleRecommend/updateToConfirmed",obj).then(res => res.data) ;
    },
};

