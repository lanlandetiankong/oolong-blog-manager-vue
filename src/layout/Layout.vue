<template>
    <div class="layout-page-root" >
        <a-layout id="index-layout-root">
            <a-layout-sider
                collapsible
                v-model="sideBar.conf.collapsed"
            >
                <sider-bar
                    class="sidebar-container"
                    :menuList="routingStore_grantedMenuList"
                    :siderCollapsed="sideBar.conf.collapsed"
                    @sideBar-menu-open="doSiderbarMenuOpenView"
                />
            </a-layout-sider>
            <a-layout>
                <a-layout-header
                    style="background: #fff; padding: 0;height:70px;line-height:50px;margin-top: 0px;margin-bottom: 0px;"
                >
                    <nav-bar
                        :userInfo="navBarConf.userInfo"
                        @userLoginOut="handleUserLoginOut"
                        @goToUserCenter="handleGoToUserCenter"
                        @refreshMenuCache="handleRefreshMenuCache"
                    />
                </a-layout-header>
                <a-layout-content
                    :style="{ margin: '0px 0' }"
                >
                    <tags-view
                        :tagsArray="tagViewOpendArray"
                        :selectedTag="tagsConf.selectedTag"
                        @tag-item-native-click="doTagItemNativeClick"
                        @tag-item-selected-close="doTagItemSelectedClose"
                        @tag-item-others-close="doTagItemOthersClose"
                        @tag-item-all-close="doTagItemAllClose"
                        @toggle-current-tag="doToggleCurrentTag"
                        :style="{paddingBottom:'0px'}"
                    >
                    </tags-view>
                    <app-main
                        :style="{ padding: '5px', background: '#fff', textAlign: 'center' }"
                    />
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    import {TokenUtil} from '~Router/routeSecurityUtil';
    import { mapGetters } from 'vuex'
    import ResizeMixin from './mixin/ResizeHandler';
    import {CacheMixin} from './mixin/CacheMixin';

    import { NavBar, SiderBar, AppMain, TagsView,BaseFooter } from './components'
    import ALayoutSider from "ant-design-vue/es/layout/Sider";

    export default {
        name: "Layout",
        components: {
            ALayoutSider,
            NavBar,
            SiderBar,
            AppMain,
            TagsView,
            BaseFooter
        },
        mixins: [ResizeMixin,CacheMixin],
        data() {
            return {
                routerDefineObj:{   //路径定义对象,请勿修改！(请保持与外部$router一致)
                    userCenterView:"/index/regular/userZone/center"
                },
                sideBar:{
                    conf:{
                        collapsed: false,
                    },
                },
                tagsConf: {
                    tagsArray:[],
                    selectedTag:{}
                },
                navBarConf:{
                    userInfo:{
                        imgSrc: '~UserImgPath/panda-egg.jpg'
                    }
                },

            }
        },
        computed: {
            tagViewOpendArray() {
                return this.$store.state.tagsView.visitedViews ;
            },
            ...mapGetters([
                'routingStore_grantedMenuList',
            ])
        },
        methods: {
            dealGotoIndex(){
                var _currentRoute = this.$route;
                if(_currentRoute){
                    if(_currentRoute.fullPath == "" || _currentRoute.fullPath == "/index"){
                        //当前已经在 index页面了，无需再跳转
                    }   else {
                        this.$router.push('/index');
                    }
                }
            },
            doSiderbarMenuOpenView(item,key,keypath) {
                var _this = this ;
                _this.tagsConf.selectedTag = _this.$route ;
                this.$store.dispatch('doSetContextMenuPosition',{
                    visible:false,
                    left:0,
                    top:0
                });

            },
            doTagItemNativeClick(e,clickTag) {
                this.doToggleCurrentTag(clickTag) ;
            },
            doToggleCurrentTag(tag) {
                //console.log("doToggleCurrentTag",tag);
                this.tagsConf.selectedTag = tag ;
            },
            doTagItemSelectedClose(e,selectedTag,isTagActive){
                //关闭当前所选标签
                this.$store.dispatch('doDelVisitedViews',selectedTag).then((views) => {
                    if(isTagActive == true){
                        const latestView = views.slice(-1)[0] ;
                        if(latestView) {
                            this.$router.push(latestView.path) ;
                        }   else {
                            this.dealGotoIndex();
                        }
                    }
                })
            },
            doTagItemOthersClose(e){
                //关闭其他标签
                var _this = this ;
                _this.$store.dispatch('doDelOthersViews',_this.tagsConf.selectedTag).then((views) => {
                    const latestView = views.slice(-1)[0] ;
                    if(!latestView) {
                        this.dealGotoIndex();
                    }
                })
            },
            doTagItemAllClose(e){
                //关闭所有标签
                this.$store.dispatch('doDelAllViews').then((views) => {
                    //do something
                });
                //切换到主页
                this.$router.push("/");
            },
            dealMenuClick(obj) {
                //console.log("dealMenuClick",obj);
            },
            handleUserLoginOut(e){     //子组件命令-退出登录
                TokenUtil.loginOut();
            },
            handleGoToUserCenter(){ //子组件命令-跳转到用户中心
                this.$router.push(this.routerDefineObj.userCenterView);
            },
            handleRefreshMenuCache(e){    //子组件命令-清理菜单缓存
                this.cacheMixin_handleMenuListToCache(this,true);
            }
        },
        created(){
            TokenUtil.handleVerifyToken();
        }
    }
</script>
<style lang="less" scoped>
    @import "_Layout.less";
</style>
<style lang="less" scoped>


</style>
