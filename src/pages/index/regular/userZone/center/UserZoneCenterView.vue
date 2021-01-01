<template>
    <div>
        <div>
            <a-row :gutter="layoutConf.default.gutter">
                <a-col :span="layoutConf.default.span">
                    <a-card hoverable style="width: 240px">
                        <img
                            alt="example"
                            :src="loginUserAvatarUrl"
                            slot="cover"
                        />
                        <a-card-meta>
                            <span slot="title">
                                <a-tag color="blue">{{userTokenCacheObj.userName}}</a-tag>
                            </span>
                        </a-card-meta>
                    </a-card>
                </a-col>
                <a-col :span="24 - layoutConf.default.span">
                    <a-row>
                        <a-card
                            :headStyle="layoutConf.roleCard.headStyle"
                            :bodyStyle="layoutConf.roleCard.bodyStyle"
                            :style="layoutConf.roleCard.style"
                        >
                            <span slot="title" style="float:left">
                                <a-button type="primary">已拥有角色</a-button>
                            </span>
                            <a-row :gutter="layoutConf.default.gutter">
                                <a-col
                                    :span="layoutConf.roleCard.rows.span"
                                    :key="roleItem.fid"
                                    v-for="roleItem in dataObj.role.checkArr"
                                >
                                    <a-tag
                                        :color="layoutConf.roleCard.rows.tag.color">
                                        {{roleItem.name}}
                                    </a-tag>
                                </a-col>
                            </a-row>
                        </a-card>
                    </a-row>
                </a-col>
                <a-col :span="24 - layoutConf.default.span">
                    <a-row>
                        <a-card
                            :headStyle="layoutConf.permissionCard.headStyle"
                            :bodyStyle="layoutConf.permissionCard.bodyStyle"
                            :style="layoutConf.permissionCard.style"
                        >
                            <span slot="title" style="float:left">
                                <a-button type="primary">已拥有权限</a-button>
                            </span>
                            <a-row :gutter="layoutConf.default.gutter">
                                <a-col
                                    :span="layoutConf.permissionCard.rows.span"
                                    :key="permissionItem.fid"
                                    v-for="permissionItem in dataObj.permission.checkArr"
                                >
                                    <a-tag :key="permissionItem.fid"
                                           :color="layoutConf.permissionCard.rows.tag.color">
                                        {{permissionItem.name}}
                                    </a-tag>
                                </a-col>
                            </a-row>
                        </a-card>
                    </a-row>
                </a-col>
                <a-col :span="24 - layoutConf.default.span">
                    <a-row>
                        <a-card
                            :headStyle="layoutConf.jobCard.headStyle"
                            :bodyStyle="layoutConf.jobCard.bodyStyle"
                            :style="layoutConf.jobCard.style"
                        >
                            <span slot="title" style="float:left">
                                <a-button type="primary">分配的职务</a-button>
                            </span>
                            <a-row :gutter="layoutConf.default.gutter">
                                <a-col
                                    :span="layoutConf.jobCard.rows.span"
                                    :key="jobItem.fid"
                                    v-for="jobItem in dataObj.job.checkArr"
                                >
                                    <a-tag :key="jobItem.fid"
                                           :color="layoutConf.jobCard.rows.tag.color">
                                        {{jobItem.name}}
                                    </a-tag>
                                </a-col>
                            </a-row>
                        </a-card>
                    </a-row>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
    import {TokenUtil} from '~Router/routeSecurityUtil';
    import constantParams from '~Config/constantParams' ;
    import {UserZoneCenterApi} from './userZoneCenterApi.js'

    export default {
        name: "UserZoneCenterView",
        data() {
            return {
                layoutConf:{
                    default:{
                        gutter:6,
                        span:6
                    },
                    roleCard:{
                        headStyle:{

                        },
                        bodyStyle:{

                        },
                        style:{
                            width:"100%"
                        },
                        rows:{
                            span:2,
                            tag:{
                                color:"#87d068"
                            }
                        }
                    },
                    permissionCard:{
                        headStyle:{

                        },
                        bodyStyle:{

                        },
                        style:{
                            width:"100%"
                        },
                        rows:{
                            span:2,
                            tag:{
                                color:"#87d068"
                            }
                        }
                    },
                    jobCard:{
                        headStyle:{

                        },
                        bodyStyle:{

                        },
                        style:{
                            width:"100%"
                        },
                        rows:{
                            span:2,
                            tag:{
                                color:"#87d068"
                            }
                        }
                    }
                },
                dataObj:{
                    role:{
                        checkArr:[]
                    },
                    permission:{
                        checkArr:[]
                    },
                    job:{
                        checkArr:[]
                    }
                }
            }
        },
        computed: {
            loginUserAvatarUrl() {   //取得登录用户的头像
                var userTokenCache = window.sessionStorage.getItem("userToken");
                if (userTokenCache) {
                    var userTokenObj = JSON.parse(userTokenCache);
                    var avatarUrl = userTokenObj.avatarUrl;
                    if (avatarUrl) {
                        var urlPrefix = constantParams.props.upload.url.prefix;
                        return urlPrefix + avatarUrl;
                    }
                }
            },
            userTokenCacheObj(){    //取得用户缓存信息
                var userTokenCache = window.sessionStorage.getItem("userToken");
                if(typeof userTokenCache == "undefined" || userTokenCache == null){
                    return {} ;
                }   else {
                    var userTokenObj = JSON.parse(userTokenCache);
                    return userTokenObj ;
                }
            }
        },
        methods:{
            dealGetAllUserRoles(){      //查询当前登录用户的所有角色
                var userTokenObj = TokenUtil.getUserToken();
                if(userTokenObj){
                    UserZoneCenterApi.getAllRoleByUserAccountId(userTokenObj.userAccountId).then((res) => {
                        if (res) {
                            this.dataObj.role.checkArr = res.gridList;
                        }
                    })
                }
            },
            dealGetAllUserPermissions(){    //查询当前登录用户的所有权限
                var userTokenObj = TokenUtil.getUserToken();
                if(userTokenObj){
                    UserZoneCenterApi.getAllPermissionByUserAccountId(userTokenObj.userAccountId).then((res) => {
                        if (res) {
                            this.dataObj.permission.checkArr = res.gridList;
                        }
                    })
                }
            },
            dealGetAllUserJobs(){    //查询当前登录用户的所有职务
                var userTokenObj = TokenUtil.getUserToken();
                if(userTokenObj){
                    UserZoneCenterApi.getAllJobByUserAccountId(userTokenObj.userAccountId).then((res) => {
                        if (res) {
                            this.dataObj.job.checkArr = res.gridList;
                        }
                    })
                }
            }
        },
        mounted(){
            this.dealGetAllUserRoles() ;
            this.dealGetAllUserPermissions();
            this.dealGetAllUserJobs();
        }
    }
</script>

<style scoped>

</style>
