import axios from '~Config/axios/httpConfig'

export const RegisterApi = {
    registerUser(formObj) {    //注册用户
        return axios.post('/oblCtl/user/register/registerUser',formObj).then(res => res.data) ;
    }
};
