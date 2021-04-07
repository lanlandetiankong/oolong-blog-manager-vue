import axios from '~Config/axios/httpConfig'

export const OblArticleCommentAuditCompApi = {
    batchAudit(values,idList) {  //批量-审批评论
        let obj = values ;
        obj['commentIdList'] = idList ;
        return axios.post('/oblCtl/oblArticleCommentAuditRecord/batchAuditComment',obj).then(res => res.data);
    },
};
