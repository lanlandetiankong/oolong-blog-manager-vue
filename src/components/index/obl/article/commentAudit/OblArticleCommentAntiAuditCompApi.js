import axios from '~Config/axios/httpConfig'

export const OblArticleCommentAntiAuditCompApi = {
    batchAntiAudit(values,idList) {  //批量-反审批评论
        let obj = values ;
        obj['commentIdList'] = idList ;
        return axios.post('/oblCtl/oblArticleCommentAuditRecord/batchAntiAuditComment',obj).then(res => res.data);
    },
};
