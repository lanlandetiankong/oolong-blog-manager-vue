import axios from '~Config/axios/httpConfig'

export const OblArticleAuditRecordsCompApi = {
    getAuditRecords(params) {  //查询文章的-审批记录
        let obj = {
           articleId:params.articleId
        };
        return axios.post('/oblCtl/oblArticleAuditRecord/queryArticleAuditRecords',obj).then(res => res.data);
    },
};
