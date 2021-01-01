<template>
    <div>
        <a-tabs
            :defaultActiveKey="layoutConf.tab.defaultActiveKey"
            :tabPosition="layoutConf.tab.mode"
            @change="handleTabChange"
        >
            <a-tab-pane :tab="layoutConf.tab.conf.universal.title"
                        :key="layoutConf.tab.conf.universal.key">
                <universal-show-comp />
            </a-tab-pane>
            <a-tab-pane :tab="layoutConf.tab.conf.announcementList.title"
                        :key="layoutConf.tab.conf.announcementList.key">
                <announcement-list-comp
                    :dataList="tabConf.announcementList.dataList"
                    @viewItemClick="handleAnnouncementViewItemClick"
                />
            </a-tab-pane>
            <a-tab-pane :tab="layoutConf.tab.conf.articleList.title"
                        :key="layoutConf.tab.conf.articleList.key">
                {{$t('langMap.commons.dashBoard.articleList')}} Todo
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    import {DashBoardApi} from './dashBoardApi.js'
    import { mapGetters } from 'vuex';
    import UniversalShowComp from '~Components/regular/dashboard/UniversalShowComp'
    import AnnouncementListComp from '~Components/regular/dashboard/announcement/AnnouncementListComp'

    export default {
        name: "DashBoardPage",
        components: {UniversalShowComp,AnnouncementListComp},
        data(){
            return {
                layoutConf:{
                    tab:{
                        mode: 'left',
                        conf:{
                            universal:{
                                title: this.$t('langMap.commons.dashBoard.universal'),
                                key: 'universal',
                                initFlag:false
                            },
                            announcementList:{
                                title: this.$t('langMap.commons.dashBoard.announcementList'),
                                key: 'announcementList',
                                initFlag:false
                            },
                            articleList:{
                                title: this.$t('langMap.commons.dashBoard.articleList'),
                                key: 'articleList',
                                initFlag:false
                            }
                        },
                        defaultActiveKey:"universal"
                    }
                },
                tabConf:{
                    announcementList:{
                        dataList:[],
                        limitSize:10
                    }
                }
            }
        },
        computed:{
            ...mapGetters([
                'styleStore_appMain'
            ])
        },
        methods:{
            dealGetTabItem(tabKey){     //根据tab的key 取得tab对应的项
                var _this = this;
                var tabList = _this.layoutConf.tab.conf ;
                if(tabList){
                    var tabItem = tabList[tabKey];
                    if(tabItem){
                        return tabItem ;
                    }
                }
            },
            dealTabInit(tabKey){    //根据tab的key对tab对应的项 进行初始化
                var _this = this ;
                if(tabKey){
                    if(tabKey == _this.layoutConf.tab.conf.announcementList.key){      //公告列表
                        _this.dealInitAnnouncementListTab();
                    }
                }
            },
            dealInitAnnouncementListTab(){  //公告列表-初始化
                var announcementListTemp = this.tabConf.announcementList ;
                DashBoardApi.getSomeAnnouncementList(announcementListTemp.limitSize,false).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        announcementListTemp.dataList = res.gridList ;
                    }
                })
            },
            dealGoToShowAnnouncementView(fid){   //处理-跳转到 [公告] 展示页面
                var routeParam = {
                    fid: fid
                }
                this.$router.push({ path: '/index/announcement/display', query: routeParam});
            },
            handleTabChange(tabKey){
                var _this = this;
                var tabItem = _this.dealGetTabItem(tabKey);
                if(tabItem){    //取得到tab item
                    if(tabItem.initFlag == false){  //尚未初始化
                        _this.dealTabInit(tabKey);
                        tabItem.initFlag = true ;
                    }
                }
            },
            handleAnnouncementViewItemClick(e,item){    //公告列表-点击查看事件
                var _this = this ;
                _this.dealGoToShowAnnouncementView(item.fid);
            }
        },
        created(){
            var _this = this ;
            var defaultActiveKeyTemp = _this.layoutConf.tab.defaultActiveKey ;
            if(defaultActiveKeyTemp){   //初始化第一个 tab
                _this.dealTabInit(defaultActiveKeyTemp);
            }
        }
    }
</script>

<style scoped>

</style>
