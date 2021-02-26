import axios from '~Config/axios/httpConfig'

export const OblArticleAntiAuditCompApi = {
    batchAntiAudit(values,idList) {  //批量-反审批文章
        let obj = values ;
        obj['articleIdList'] = idList ;
        return axios.post('/oblCtl/oblArticleAuditRecord/batchAntiAuditArticle',obj).then(res => res.data);
    },
};
