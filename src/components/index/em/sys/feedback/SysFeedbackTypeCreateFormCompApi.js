import axios from '~Config/axios/httpConfig'

export const SysFeedbackTypeCreateFormCompApi = {
    getTreeFilterChildrens(filterId) {
        var obj = {
            filterId:filterId
        };
        //查询过滤的树结构 ->过滤当前id及子节点
        return axios.post('/oblCtl/emSysFeedbackType/queryTree',obj).then(res => res.data);
    }
};
