import axios from '~Config/axios/httpConfig'

export const ForgetPwdApi = {
    verifyPassword(formObj) {    //验证旧密码
        return axios.post('/oblCtl/user/password/verifyPassword',formObj).then(res => res.data) ;
    },
    renewPassword(formObj) {    //验证旧密码
        return axios.post('/oblCtl/user/password/renewPassword',formObj).then(res => res.data) ;
    }
};
