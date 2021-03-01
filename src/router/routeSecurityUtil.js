import router from '@/router/index';
import {message} from 'ant-design-vue';
import {i18nUtil} from "~Config/i18n/i18nUtil";



/**
 * routeSecurityUtil 路由安全工具
 */
const RoutePageConst = {
    login:'/member/login',
    register:'/member/register',
    forgetPassword:'/member/password/forget',
    serverDown:'/errorPage/server_down'
};
const whiteUrlList = [
    RoutePageConst.login,
    RoutePageConst.register,
    RoutePageConst.forgetPassword,
    RoutePageConst.serverDown
];

function removeTokenSession(){
    window.sessionStorage.removeItem("userToken");
    window.sessionStorage.removeItem("grantedPermissions");
    window.sessionStorage.removeItem("grantedMenuUrlMap");
    window.sessionStorage.removeItem("grantedMenuList");
    window.sessionStorage.removeItem("visibleRouterUrls");
    window.sessionStorage.removeItem("authorization");
}
/**
 * 跳转到 登录页面
 * @param router
 */
function jumpToLoginPage() {
    removeTokenSession();
    if(RoutePageConst.login == router.app._route.fullPath){
        //当前已经是登录界面
    }   else {
        //跳转到登录界面
        router.push(RoutePageConst.login);
    }
}

/**
 * 验证会话是否有效，无效情况将自动跳转 登录界面
 */
function verifySessionValid() {
    if(isTokenValid() == false){
        message.error(i18nUtil.getKey('langMap.http.notify.description.sessionExpired'));
        jumpToLoginPage();
    }
    return true ;
}
/**
 * 验证会话是否有效，无效情况将自动跳转 登录界面
 */
function isTokenValid() {
    var userTokenTemp = window.sessionStorage.getItem("userToken");
    var authorizationTemp = window.sessionStorage.getItem("authorization");
    if(!userTokenTemp || !authorizationTemp){
       return false ;
    }   else {
        return true ;
    }
}

function getUserToken() {
    if(verifySessionValid() == true){
        const userTokenCache = window.sessionStorage.getItem("userToken");
        return JSON.parse(userTokenCache);
    }
    return null ;
}

export const TokenUtil = {
    loginOut(){
        jumpToLoginPage() ;
    },
    handleVerifyToken(){
        return verifySessionValid();
    },
    isTokenValid(){
        return isTokenValid();
    },
    isRouteCarryOn(to,from){
        if(isTokenValid() == false){
            removeTokenSession();
            if(whiteUrlList.includes(to.path)){
                return true ;
            }
            return false ;
        }
        return true ;
    },
    getUserToken(){
        return getUserToken();
    },
    goToServerDown(){
        router.push(RoutePageConst.serverDown);
    }
};
export const RouteConst = RoutePageConst;
