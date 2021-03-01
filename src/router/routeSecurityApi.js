import axios from '~Config/axios/httpConfig'

export const RouteSecurityApi = {
    loginOut(){  //退出登录
        var params = {};
        return axios.post("/oblCtl/user/login/loginOut",params).then(res => res.data) ;
    }
};
