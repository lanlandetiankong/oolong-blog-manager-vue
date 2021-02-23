//ajax远程调用
import axios from '~Config/axios/httpConfig'

export const OblArticleRecommendDelayRecordApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //分页查询
        return axios.post('/oblCtl/oblArticleRecommendDelayRecord/queryPage', obj).then(res => res.data);
    },
    getItemById(fid) {  //根据id查询
        var params = {
            fid: fid
        };
        return axios.post("/oblCtl/oblArticleRecommendDelayRecord/queryOneById",params).then(res => res.data);
    },
    createByForm(formObj) {     //新增
        return axios.post("/oblCtl/oblArticleRecommendDelayRecord/createByForm",formObj).then(res => res.data);
    },
    updateByForm(formObj) {  //更新
        return axios.post("/oblCtl/oblArticleRecommendDelayRecord/updateByForm",formObj).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds: ids
        };
        return axios.post("/oblCtl/oblArticleRecommendDelayRecord/batchDeleteByIds",obj).then(res => res.data);
    },
    deleteById(delId) {  //删除
        var obj = {
            delId: delId
        };
        return axios.post("/oblCtl/oblArticleRecommendDelayRecord/deleteById",obj).then(res => res.data);
    }
};
