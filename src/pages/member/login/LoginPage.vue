<template>
    <div class="login-page-root">
        <a-page-header
            :title="$t('langMap.button.member.login')"
            :subTitle="$t('langMap.button.member.loginForManager')"
        >
            <template slot="extra">
                <i18n-change-comp />
                <a-button @click="goRegister()">
                    {{$t('langMap.button.member.registerAnAccount')}}
                </a-button>
                <a-button @click="goForgetPwd">
                    {{$t('langMap.button.member.forgetPassword')}}
                </a-button>
            </template>
        </a-page-header>
        <a-layout id="login-top-layout" class="login-page-layout">
            <login-main-comp
                @login-form-submit="handleLoginFormSubmit"
            />
        </a-layout>
    </div>
</template>
<script>
    import {routerConst} from  '~Config/BaseDataConst.js'
    import { mapGetters } from 'vuex'
    import {CacheMixin} from '~Layout/mixin/CacheMixin';
    import I18nChangeComp from "~Components/regular/i18n/I18nChangeComp";
    import LoginMainComp from '~Components/login/LoginMainComp.vue'

    export default {
        name: "LoginPage",
        components: {
            LoginMainComp,I18nChangeComp
        },
        mixins:[CacheMixin],
        data() {
            return {
            }
        },
        computed: {
            tagViewOpendArray() {
                return this.$store.state.tagsView.visitedViews ;
            },
            ...mapGetters([
                'routingStore_grantedMenuList',
                'routingStore_grantedMenuUrlMap'
            ])
        },
        methods:{
            goRegister(){
                //跳转到-注册页面
                this.$router.push(routerConst.basic.register);
            },
            goForgetPwd(){
                //跳转到-修改密码
                this.$router.push(routerConst.basic.forgetPassword);
            },
            handleLoginFormSubmit(e,loginForm,submitRes){
                var _this = this ;
                if(submitRes.success){ //后台登录验证成功
                    const rstBean = submitRes.bean ;
                    _this.cacheMixin_handleSetUserTokenToCache(_this,rstBean);
                    _this.cacheMixin_handleSetAuthorizationToCache(_this,rstBean.authorization);
                    _this.cacheMixin_handleSetRouterUrlsToCache(_this,rstBean.urls);
                    _this.cacheMixin_handleSetGrantedPermissionsToCache(_this,rstBean.permissionCodes);
                    _this.cacheMixin_handleMenuListToCache(_this,false);
                    _this.$router.push(routerConst.basic.index);
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "_LoginPage.less";


</style>
