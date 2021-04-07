import axios from '~Config/axios/httpConfig'

export const OblArticleCommentAuditRecordsCompApi = {
    getAuditRecords(params) {  //查询评论的-审批记录
        let obj = {
           commentId:params.commentId
        };
        return axios.post('/oblCtl/oblArticleCommentAuditRecord/queryCommentAuditRecords',obj).then(res => res.data);
    },
};
