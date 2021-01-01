import {LoginMainApi} from "../../pages/member/login/_LoginMainApi";
import {AsyncRouterUtil} from '~Router/asyncRouterUtil.js';

export const CacheMixin = {
    data(){

    },
    computed:{

    },
    created(){

    },
    methods:{
        cacheMixin_handleSetUserTokenToCache(self,userTokenObj){    //设置 token
            var _this = self ;
            _this.$store.dispatch('doSetUserToken',userTokenObj) ;
            window.sessionStorage.setItem("userToken",JSON.stringify(userTokenObj));
            console.log(JSON.stringify(window.sessionStorage.getItem("userToken")));
        },
        cacheMixin_handleSetAuthorizationToCache(self,authorization){   //设置 JWT 值
            var _this = self ;
            _this.$store.dispatch('doSetAuthorization',authorization) ;
            window.sessionStorage.setItem("authorization",authorization);
        },
        cacheMixin_handleSetRouterUrlsToCache(self,routerUrls){   //设置 可访问的router路径-Set集合
            var _this = self ;
            _this.$store.dispatch('doSetVisibleRouterUrls',routerUrls) ;
            window.sessionStorage.setItem("visibleRouterUrls",JSON.stringify(routerUrls));
        },
        cacheMixin_handleSetGrantedPermissionsToCache(self,grantedPermissions){   //设置 可使用的 权限code 集合
            var _this = self ;
            _this.$store.dispatch('doSetGrantedPermissions',grantedPermissions) ;
            window.sessionStorage.setItem("grantedPermissions",JSON.stringify(grantedPermissions));
        },
        cacheMixin_handleMenuListToCache(self,reflush){  //将后台的[菜单配置]更新到 VueRouter配置中
            var _this = self ;
            if(reflush == true){
                LoginMainApi.reflushCacheAndGetAllMenu().then(res => {
                    _this.cacheMixin_handleMenuInfoCacheLocal(_this,res);
                });
            }   else {
                LoginMainApi.doGetAllMenu().then(res => {
                    _this.cacheMixin_handleMenuInfoCacheLocal(_this,res);
                });
            }
        },
        cacheMixin_handleMenuInfoCacheLocal(self,res){  //缓存菜单信息到本地
            var _this = self ;
            if(res.success){
                var menuList = res.gridList;
                var urlMap = res.dataMap ;
                _this.$store.dispatch('doDelAllViews') ; //登录前清空已访问页面的tag缓存
                window.sessionStorage.setItem("grantedMenuList",JSON.stringify(menuList));
                window.sessionStorage.setItem("grantedMenuUrlMap",JSON.stringify(urlMap));
                _this.$store.dispatch('doSetGrantedMenuList',menuList) ;
                _this.$store.dispatch('doSetGrantedMenuUrlMap',urlMap) ;
                _this.cacheMixin_handleMenuListToRouters(urlMap);
            }
        },
        cacheMixin_handleMenuListToRouters(self,grantedMenuUrlMap){      //将后台的[菜单配置]更新到 VueRouter配置中
            var _this = self ;
            AsyncRouterUtil.dealMenuListToRouters(grantedMenuUrlMap,_this);
        }
    }
}
