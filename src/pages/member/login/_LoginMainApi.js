import axios from '~Config/axios/httpConfig'

export const LoginMainApi = {
    doGetAllMenu() {    //取得用户 能访问菜单列表
        return axios.post('/oblCtl/define/defineMenu/user/gainGrantTree').then(res => res.data) ;
    },
    flushLoginerInfo(){ //刷新*查询-当前用户信息
        return axios.post('/oblCtl/flushCache/user/flushLoginerInfo').then(res => res.data) ;
    },
    flushUserVisitAbleUrls(){   //刷新*查询-用户可访问的[菜单url]
        return axios.post('/oblCtl/flushCache/user/flushUserVisitAbleUrls').then(res => res.data) ;
    },
    flushUserVisitAbleMenuTree() {    //刷新*查询-用户可访问的[菜单定义]Tree
        return axios.post('/oblCtl/flushCache/user/flushUserVisitAbleMenuTree').then(res => res.data) ;
    },
    flushUserHasPermissionCodes(){  //刷新*查询-用户所拥有的[权限code-Set集合]
        return axios.post('/oblCtl/flushCache/user/flushUserHasPermissionCodes').then(res => res.data) ;
    },
    flushUserHasRoleCodes(){    //刷新*查询-取得用户所拥有的[角色code-Set集合]
        return axios.post('/oblCtl/flushCache/user/flushUserHasRoleCodes').then(res => res.data) ;
    }
};
