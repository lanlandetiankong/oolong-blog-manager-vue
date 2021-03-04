<template>
    <div style="height: 100%">
        <div>
            <a-page-header :backIcon="false"
                           :ghost="false"
            >
                <template slot="title" >
                    <a-avatar size="large" :src="userInfoStore_userToken.avatarUrl"/> {{userInfoStore_userToken.userName}}
                </template>
                <template slot="subTitle">
                    <a-tag v-show="userInfoStore_userToken.belongDepartmentName">
                        {{userInfoStore_userToken.belongDepartmentName}}
                    </a-tag>
                </template>
                <template slot="extra">

                </template>
            </a-page-header>
        </div>
        <div>
            <a-layout style="height: 100%">
                <a-layout>
                    <a-layout-sider theme="light">

                    </a-layout-sider>
                    <a-layout-content>
                        <a-card
                            style="width:100%"
                            :bordered="false"
                            :tabList="tabListNoTitle"
                            :activeTabKey="currentTabKey"
                            @tabChange="key => handleTabChange(key, 'currentTabKey')"
                        >
                            <obl-recent-hot-article-list-comp v-if="currentTabKey === 'recentHotArticleList'"/>
                            <obl-my-announcement-list-comp v-if="currentTabKey === 'myAnnouncementList'"/>
                        </a-card>
                    </a-layout-content>
                </a-layout>
                <a-layout-footer>
                    <obl-project-title :goAble="false" />
                </a-layout-footer>
            </a-layout>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import UniversalShowComp from '~Components/regular/dashboard/UniversalShowComp'
    import AnnouncementListComp from '~Components/regular/dashboard/announcement/AnnouncementListComp'
    import OblRecentHotArticleListComp from "~Components/index/obl/article/hotlist/OblRecentHotArticleListComp";
    import OblMyAnnouncementListComp from "~Components/index/em/announcement/mylist/OblMyAnnouncementListComp";
    import OblProjectTitle from '~Components/regular/common/OblProjectTitle';
    import {AllEnum, EnumUtils} from "~Config/selectData";
    import {UserZoneCenterApi} from "~Pages/index/regular/userZone/center/userZoneCenterApi";
    export default {
        name: "DashBoardPage",
        components: {UniversalShowComp,AnnouncementListComp,OblRecentHotArticleListComp,
            OblMyAnnouncementListComp,OblProjectTitle},
        data(){
            return {
                userBaseInfo:{},
                currentTabKey: 'recentHotArticleList',
            }
        },
        computed:{
            ...mapGetters([
                'userInfoStore_userToken'
            ]),
            tabListNoTitle(){
                let arr = [{
                    key: 'recentHotArticleList',
                    tab: this.$t('langMap.commons.dashBoard.recentHotArticleList')
                }, {
                    key: 'myAnnouncementList',
                    tab: this.$t('langMap.commons.dashBoard.myAnnouncementList')
                }
                ];
                return  arr ;
            }
        },
        methods:{
            handleTabChange (key, type) {
                this[type] = key
            },
            transformBaseInfo(){    //转换基本数据
                const obj = this.userBaseInfo;
                //Map
                let userSexMap = EnumUtils.toValMap(AllEnum.UserSexEnum);
                let userTypeMap = EnumUtils.toValMap(AllEnum.UserTypeEnum);
                let lockedStateMap = EnumUtils.toValMap(AllEnum.LockStateEnum);
                obj['sexStr'] = userSexMap[obj.sex];
                obj['userTypeStr'] = userTypeMap[obj.userType];
                obj['lockedStr'] = lockedStateMap[obj.locked];
            },
            dealGetMyBaseInfo() {    //查询当前登录用户的基本信息
                UserZoneCenterApi.getMyBaseInfo().then((res) => {
                    this.userBaseInfo = res.bean ;
                    this.transformBaseInfo();
                })
            }
        },
        mounted () {
            this.dealGetMyBaseInfo();
        },
    }
</script>

<style scoped>

</style>
