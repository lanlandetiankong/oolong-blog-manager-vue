import axios from '~Config/axios/httpConfig'

export const OblArticleCommentAuditCompApi = {
    batchAudit(values,idList) {  //批量-审批评论
        let obj = values ;
        obj['articleIdList'] = idList ;
        return axios.post('/oblCtl/oblArticleAuditRecord/batchAuditArticle',obj).then(res => res.data);
    },
};
