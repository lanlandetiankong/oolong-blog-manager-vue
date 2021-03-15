import axios from '~Config/axios/httpConfig'

export const SysFeedbackDisplayApi = {
    getItemById(fid){  //根据 文章id 取得文章信息
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/emSysFeedback/queryOneById",params).then(res => res.data);
    }

};
