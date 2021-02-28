import axios from '~Config/axios/httpConfig'

export const OblArticleRecommendRecordsCompApi = {
    getRecommendRecords(params) {  //查询文章的-推荐记录
        let obj = {
           articleId:params.articleId
        };
        return axios.post('/oblCtl/oblArticleRecommend/queryArticleRecommendRecords',obj).then(res => res.data);
    },
};
