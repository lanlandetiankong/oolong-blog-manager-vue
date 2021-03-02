<template>
    <div class="page-header-index-wide page-header-wrapper-grid-content-main">
        <a-row :gutter="24">
            <a-col :md="24" :lg="7">
                <a-card :bordered="false">
                    <div class="account-center-avatarHolder">
                        <div class="avatar">
                            <img :src="userBaseInfo.avatarUrl">
                        </div>
                        <div class="username">{{ userBaseInfo.userName }}</div>
                        <div class="bio">{{userBaseInfo.email}}</div>
                    </div>
                    <div class="account-center-detail">
                        <p>
                            <a-icon type="idcard" />{{userBaseInfo.account}}
                        </p>
                        <p>
                            <a-icon type="home" />{{userBaseInfo.address}}
                        </p>
                        <p>
                            <a-icon type="phone" />{{userBaseInfo.phone}}
                        </p>
                        <p>
                            <a-icon :type="userBaseInfo.sex == 1 ? 'man' : 'woman'" />{{userBaseInfo.sexStr}}
                        </p>
                        <p>
                            <a-icon type="align-left" />{{userBaseInfo.userTypeStr}}
                        </p>
                        <p>
                            <a-icon type="deployment-unit" />{{userBaseInfo.belongDepartmentName}}
                        </p>
                        <p>
                            <a-icon type="clock-circle" />{{userBaseInfo.createTime  | formatBaseDateTime}}
                        </p>
                    </div>
                    <a-divider/>
                </a-card>
            </a-col>
            <a-col :md="24" :lg="17">
                <a-card
                    style="width:100%"
                    :bordered="false"
                    :tabList="tabListNoTitle"
                    :activeTabKey="currentTabKey"
                    @tabChange="key => handleTabChange(key, 'currentTabKey')"
                >
                    <my-article-list v-if="currentTabKey === 'article'"/>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import {AllEnum, EnumUtils} from "~Config/selectData";
    import {UserZoneCenterApi} from "~Pages/index/regular/userZone/center/userZoneCenterApi";
    import MyArticleList from "~Components/index/obl/article/mylist/OblMyArticleListComp";
    export default {
        name:'UserZoneCenterView',
        components: {
            MyArticleList
        },
        data () {
            return {
                userBaseInfo:{},
                currentTabKey: 'article'
            }
        },
        computed: {
            tabListNoTitle(){
                let arr = [
                    {
                        key: 'article',
                        tab: '文章(8)'
                    },
                    {
                        key: 'announcement',
                        tab: '公告(8)'
                    }
                ];
                return  arr ;
            }
        },
        methods: {
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

<style lang="less" scoped>
    .page-header-wrapper-grid-content-main {
        width: 100%;
        height: 100%;
        min-height: 100%;
        transition: 0.3s;

        .account-center-avatarHolder {
            text-align: center;
            margin-bottom: 24px;

            & > .avatar {
                margin: 0 auto;
                width: 104px;
                height: 104px;
                margin-bottom: 20px;
                border-radius: 50%;
                overflow: hidden;
                img {
                    height: 100%;
                    width: 100%;
                }
            }

            .username {
                color: rgba(0, 0, 0, 0.85);
                font-size: 20px;
                line-height: 28px;
                font-weight: 500;
                margin-bottom: 4px;
            }
        }

        .account-center-detail {
            p {
                margin-bottom: 8px;
                padding-left: 26px;
                position: relative;
            }

            i {
                position: absolute;
                height: 14px;
                width: 14px;
                left: 0;
                top: 4px;
            }
            .title {
                background-position: 0 0;
            }
            .group {
                background-position: 0 -22px;
            }
            .address {
                background-position: 0 -44px;
            }
        }
    }
</style>
