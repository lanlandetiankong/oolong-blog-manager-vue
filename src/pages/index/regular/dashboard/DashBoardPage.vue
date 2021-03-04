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
                            <obl-recent-announcement-list-comp v-if="currentTabKey === 'recentAnnouncementList'"/>
                            <obl-recent-hot-article-list-comp v-if="currentTabKey === 'recentHotArticleList'"/>
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
    import OblRecentHotArticleListComp from "~Components/index/obl/article/hotlist/OblRecentHotArticleListComp";
    import OblRecentAnnouncementListComp from "~Components/index/em/announcement/recentlist/OblRecentAnnouncementListComp";
    import OblProjectTitle from '~Components/regular/common/OblProjectTitle';
    export default {
        name: "DashBoardPage",
        components: {OblRecentHotArticleListComp,OblRecentAnnouncementListComp,OblProjectTitle},
        data(){
            return {
                currentTabKey: 'recentAnnouncementList',
            }
        },
        computed:{
            ...mapGetters([
                'userInfoStore_userToken'
            ]),
            tabListNoTitle(){
                let arr = [
                    {
                        key: 'recentAnnouncementList',
                        tab: this.$t('langMap.commons.dashBoard.recentAnnouncementList')
                    },{
                        key: 'recentHotArticleList',
                        tab: this.$t('langMap.commons.dashBoard.recentHotArticleList')
                    }
                ];
                return  arr ;
            }
        },
        methods:{
            handleTabChange (key, type) {
                this[type] = key
            }
        }
    }
</script>

<style scoped>

</style>
