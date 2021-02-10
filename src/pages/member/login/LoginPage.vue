<template>
    <div class="login-page-root">
        <a-layout id="login-top-layout" class="login-page-layout">
            <login-main-comp
                @login-form-submit="handleLoginFormSubmit"
            >
            </login-main-comp>
        </a-layout>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import {CacheMixin} from '~Layout/mixin/CacheMixin';
    import LoginMainComp from '~Components/login/LoginMainComp.vue'

    export default {
        name: "LoginPage",
        components: {
            LoginMainComp
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
            handleLoginFormSubmit(e,loginForm,submitRes){
                var _this = this ;
                if(submitRes.success){ //后台登录验证成功
                    const rstBean = submitRes.bean ;
                    _this.cacheMixin_handleSetUserTokenToCache(_this,rstBean);
                    _this.cacheMixin_handleSetAuthorizationToCache(_this,rstBean.authorization);
                    _this.cacheMixin_handleSetRouterUrlsToCache(_this,rstBean.urls);
                    _this.cacheMixin_handleSetGrantedPermissionsToCache(_this,rstBean.permissionCodes);
                    _this.cacheMixin_handleMenuListToCache(_this,false);
                    _this.$router.push("/index");
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "_LoginPage.less";


</style>
