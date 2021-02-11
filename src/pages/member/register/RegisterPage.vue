<template>
    <div class="login-page-root">
        <a-page-header
            style="border: 1px solid rgb(235, 237, 240)"
            :title="$t('langMap.button.member.registerAnAccount')"
            @back="goBack"
        >
            <template slot="extra">
                <a-button @click="goLogin">
                    {{$t('langMap.button.member.login')}}
                </a-button>
                <a-button @click="goForgetPwd" >
                    {{$t('langMap.button.member.forgetPassword')}}
                </a-button>
            </template>
        </a-page-header>
    </div>
</template>

<script>
    import {RouteConst} from '~Router/routeSecurityUtil';
    export default {
        name: "RegisterPage",
        components: {
        },
        data() {
            return {
                RouteConst
            }
        },
        methods:{
            goBack(){
                //跳转到-回退
                this.$router.push(RouteConst.login);
            },
            goLogin(){
                //跳转到-登录页面
                this.$router.push(RouteConst.login);
            },
            goForgetPwd(){
                //跳转到-修改密码
                this.$router.push(RouteConst.forgetPassword);
            },
        }
    }
</script>
<style lang="less" scoped>

</style>
