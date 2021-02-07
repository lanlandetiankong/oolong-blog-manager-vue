import axios from '~Config/axios/httpConfig'

export const LoginMainApi = {
    doGetAllMenu() {    //取得用户 能访问菜单列表
        return axios.post('/oblCtl/define/defineMenu/user/gainGrantTree').then(res => res.data) ;
    },
    reflushCacheAndGetAllMenu() {    //刷新缓存并取得用户 能访问菜单列表
        return axios.post('/oblCtl/define/defineMenu/user/reflushCacheAndGainGrantTree').then(res => res.data) ;
    }
};
