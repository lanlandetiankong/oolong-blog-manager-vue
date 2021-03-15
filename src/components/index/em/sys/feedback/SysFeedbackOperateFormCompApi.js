import axios from '~Config/axios/httpConfig'

export const SysFeedbackOperateFormCompApi = {
    createByForm(formObj) {
        return axios.post("/oblCtl/emSysFeedbackOperateRecord/createByForm",formObj).then(res => res.data);
    }

};
