<template>
    <div>
        <div>
            <a-descriptions bordered layout="vertical"
                            :column="{ xxl: 5, xl: 4, lg: 4, md: 4, sm: 3, xs: 2 }"
                    :title="$t('langMap.descriptions.userInfo.title')" >
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.account')">
                    {{userBaseInfo.account}}
                </a-descriptions-item>

                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.userName')">
                    {{userBaseInfo.userName}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.phone')">
                    {{userBaseInfo.phone}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.email')">
                    {{userBaseInfo.email}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.sex')">
                    {{userBaseInfo.sexStr}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.address')">
                    {{userBaseInfo.address}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.userType')">
                    {{userBaseInfo.userTypeStr}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.locked')">
                    {{userBaseInfo.lockedStr}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.createTime')">
                    {{userBaseInfo.createTime  | formatBaseDateTime}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.hasRoles')">
                    {{userBaseInfo.roleNameList | formatArrayToStr}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.hasPermissions')" >
                    {{userBaseInfo.permissionNameList  | formatArrayToStr}}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('langMap.descriptions.userInfo.labels.hasJobs')">
                    {{userBaseInfo.jobNameList  | formatArrayToStr}}
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </div>
</template>

<script>
    import {AllEnum,EnumUtils} from '~Config/selectData.js';
    import {UserZoneCenterApi} from './userZoneCenterApi.js'

    export default {
        name: "UserZoneCenterView",
        data() {
            return {
                userBaseInfo:{}
            }
        },
        methods: {
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
        mounted() {
            this.dealGetMyBaseInfo();
        }
    }
</script>

<style scoped>

</style>
