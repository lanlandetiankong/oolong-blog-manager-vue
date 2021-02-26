import axios from '~Config/axios/httpConfig'

export const OblArticleAuditCompApi = {
    batchAudit(values,idList) {  //审批文章
        let obj = values ;
        obj['articleIdList'] = idList ;
        return axios.post('/oblCtl/oblArticleAuditRecord/batchAuditArticle',obj).then(res => res.data);
    },
};
