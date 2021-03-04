<template>
    <div>
        <a-page-header
            :backIcon="false"
            :ghost="false"
        >
            <span slot="title">
                <obl-project-title />
            </span>
            <obl-breadcrumb slot="subTitle" />
            <template slot="extra">
                <i18n-change-comp />
                <a-button type="primary" ghost>
                    {{loginUserName}}
                </a-button>
                <a-avatar
                    :src="loginUserAvatarUrl"
                    :alt="$t('langMap.commons.valueMap.uploader.popover.altInfo')"
                />
                <a-dropdown
                    :trigger="['click']"
                    placement="bottomCenter"
                    :style="{marginBottom:0}"
                >
                    <a-icon type="rest"
                            :style="{fontSize:'26px'}"
                            theme="filled"
                    />
                    <a-menu slot="overlay" @click="handleClearCacheClick">
                        <a-menu-item key="refreshMenuCache">
                            {{$t('langMap.button.actions.refreshMenuCache')}}
                        </a-menu-item>
                    </a-menu>
                    <a-icon slot="icon" type="rest" />
                </a-dropdown>
                <a-dropdown
                    :trigger="['click']"
                    placement="bottomCenter"
                    :style="{marginBottom:0}"
                >
                    <a-icon type="setting"
                            :style="{fontSize:'26px'}"
                            :spin=true
                            theme="filled"
                    />
                    <a-menu slot="overlay" @click="handleMoreSettingClick">
                        <a-menu-item key="user_loginout"
                        >
                            {{$t('langMap.button.member.logOut')}}
                        </a-menu-item>
                        <a-menu-item key="user_center">
                            {{$t('langMap.button.member.ersonalCenter')}}
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </template>
        </a-page-header>
    </div>
</template>

<script>
    import ACol from "ant-design-vue/es/grid/Col";
    import ARow from "ant-design-vue/es/grid/Row";
    import I18nChangeComp from '~Components/regular/i18n/I18nChangeComp.vue'
    import OblBreadcrumb from '~Components/regular/common/breadcrumb/OblBreadcrumb.vue'
    import OblProjectTitle from '~Components/regular/common/OblProjectTitle'

    export default {
        name: "NavBar",
        components: {I18nChangeComp, ARow, ACol,OblBreadcrumb,OblProjectTitle},
        props: {
            userInfo:Object
        },
        data() {
            return {
            }
        },
        computed:{
            loginUserName(){
                var userTokenCache = window.sessionStorage.getItem("userToken");
                if(userTokenCache){
                    var userTokenObj = JSON.parse(userTokenCache);
                    return userTokenObj.userName ;
                }   else {
                    return this.$t('langMap.message.error.unknowUser');
                }
            },
            loginUserAvatarUrl(){   //取得登录用户的头像
                var userTokenCache = window.sessionStorage.getItem("userToken");
                if(userTokenCache){
                    var userTokenObj = JSON.parse(userTokenCache);
                    var avatarUrl = userTokenObj.avatarUrl ;
                   return avatarUrl ;
                }
            }

        },
        methods:{
            handleClearCacheClick(e){  //清理缓存-点击事件
                var _this = this ;
                if(e.key == "refreshMenuCache"){   //退出登录
                    _this.$emit('refreshMenuCache',e);
                }
            },
            handleMoreSettingClick(e){  //更多操作-点击事件
                var _this = this ;
                if(e.key == "user_loginout"){   //退出登录
                    _this.$emit('userLoginOut',e);
                }   else if(e.key == "user_center"){ //个人中心
                    _this.$emit('goToUserCenter',e);
                }
            }
        },
        mounted(){}
    }
</script>
<style lang="less" scoped>
    .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color .3s;
        :hover {
            color: #1890ff;
        }
    }
</style>
