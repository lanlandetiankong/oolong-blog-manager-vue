<template>
    <div id="rootDiv">
        <a-spin id="rootSpin" size="large"
                wrapperClassName="spinCls"
                :spinning="globalStore_ajaxLoading"
        >
            <div id="app" ref="appRootPage">
                <a-config-provider :locale="antvLocale">
                    <router-view/>
                </a-config-provider>
            </div>
        </a-spin>
    </div>
</template>

<script>
    import {SupportI18nLocale} from '~Components/constant_define';
    import {i18nUtil} from "~Config/i18n/i18nUtil";
    import $ from 'jquery';
    import { mapGetters } from 'vuex' ;
    import {AsyncRouterUtil} from '~Router/asyncRouterUtil.js';
    import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
    import moment from 'moment';
    import 'moment/locale/zh-cn';

    moment.locale('zh-cn');

    export default {
        name: 'App',
        data() {
            return {
                antvLocale:zh_CN,
                clientHeight: '',
                constantKey: {
                    userToken: 'userToken'
                }
            }
        },
        computed:{
            ...mapGetters([
                'routingStore_grantedMenuList',
                'routingStore_grantedMenuUrlMap',
                'i18nStore_locale',
                'globalStore_ajaxLoading',
            ])
        },
        methods: {
            changeFixed(clientHeight) {
                this.$refs.appRootPage.style.height = clientHeight + 'px';
            },
            initHeight() {
                //获取浏览器可视区域高度
                this.clientHeight = $(document).height();
                //console.log($(document).height()) ;//浏览器可视区域对象宽度
                window.onresize = () => {
                    this.clientHeight = $(document).height();
                }
            },
            handleSetSessionStorageToVuex(){    //刷新时，从设置SessionStorage取得缓存 设置到 vuex
                this.handleSetUserTokenToCache();
                this.handleSetAuthorizationToCache();
                this.handleSetRouterUrlsToCache();
                this.handleSetGrantedPermissionToCache();
                this.handleSetGrantedMenuListToCache();
                this.handleSetGrantedMenuUrlMapToCache();
            },
            handleSetUserTokenToCache(){    //设置 token
                var userTokenJson = window.sessionStorage.getItem("userToken");
                if(userTokenJson){
                    this.$store.dispatch('doSetUserToken',JSON.parse(userTokenJson)) ;
                }
            },
            handleSetAuthorizationToCache(){   //设置 JWT 值
                var authorization = window.sessionStorage.getItem("authorization");
                if(authorization){
                    this.$store.dispatch('doSetAuthorization',authorization) ;
                }
            },
            handleSetRouterUrlsToCache(){   //设置 可访问的router路径-Set集合
                var routerUrls = window.sessionStorage.getItem("visibleRouterUrls");
                if(routerUrls){
                    this.$store.dispatch('doSetVisibleRouterUrls',JSON.parse(routerUrls)) ;
                }
            },
            handleSetGrantedPermissionToCache(){   //设置 可访问的router路径-Set集合
                var grantedPermissions = window.sessionStorage.getItem("grantedPermissions");
                if(grantedPermissions){
                    this.$store.dispatch('doSetGrantedPermissions',JSON.parse(grantedPermissions)) ;
                }
            },
            handleSetGrantedMenuListToCache(){   //设置 侧边菜单
                var grantedMenuList = window.sessionStorage.getItem("grantedMenuList");
                if(grantedMenuList){
                    this.$store.dispatch('doSetGrantedMenuList',JSON.parse(grantedMenuList)) ;
                }
            },
            handleSetGrantedMenuUrlMapToCache(){   //设置 侧边菜单 菜单url配置映射
                var grantedMenuUrlMap = window.sessionStorage.getItem("grantedMenuUrlMap");
                if(grantedMenuUrlMap){
                    this.$store.dispatch('doSetGrantedMenuUrlMap',JSON.parse(grantedMenuUrlMap)) ;
                }
            },
            handleAfterPageRefresh(){
                this.$store.dispatch("doDelAllViews");
                if(this.$route.path != "/index"){
                    this.$router.push("/index");
                }
            },
            handleMenuListToRouters(){
                AsyncRouterUtil.dealMenuListToRouters(this.routingStore_grantedMenuUrlMap,this);
            }
        },
        watch: {
            clientHeight: function () {
                this.changeFixed(this.clientHeight);
            },
            i18nStore_locale:function(old,newd){
                if(i18nUtil.equalsLocale(SupportI18nLocale.zhCn)){
                    this.antvLocale = zh_CN ;
                }   else {
                    this.antvLocale = null ;
                }
            }
        },
        mounted () {
            //开发环境->允许在console取得vue
            if(AsyncRouterUtil.verifyProcessEnvIsDev()){
                window.vue = this;
            }
            //this.initHeight();        //触发高度计算
            this.handleSetSessionStorageToVuex();


            if (window.performance.navigation.type == 1) {
                //console.log("页面被刷新");
                this.handleAfterPageRefresh();
            } else {
                //console.log("首次被加载")
            }
            this.handleMenuListToRouters();
        }

    }
</script>
<style>
    html, body ,#rootDiv,#app,#rootSpin {
        height: 100%;
    }
    .spinCls {
        height: 100%;
    }
    .ant-spin-container{
        height: 100%;
    }
</style>
