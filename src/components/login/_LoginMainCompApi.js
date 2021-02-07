import axios from '~Config/axios/httpConfig'

export const LoginMainCompApi = {
    submitLoginFormByAccount(loginForm) {
        const formObj = {
            account:loginForm.userAccount,
            password:loginForm.password
        };
        return axios.post('/oblCtl/user/login/loginByForm',formObj).then(res => res.data);
    }
};
