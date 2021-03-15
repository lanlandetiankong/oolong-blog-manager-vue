import axios from '~Config/axios/httpConfig'

export const SysFeedbackOperateRecordsCompApi = {
    getOperateRecords(params) {  //查询文章的-审批记录
        let obj = {
           feedbackId:params.feedbackId
        };
        return axios.post('/oblCtl/emSysFeedbackOperateRecord/queryOperateRecords',obj).then(res => res.data);
    },
};
