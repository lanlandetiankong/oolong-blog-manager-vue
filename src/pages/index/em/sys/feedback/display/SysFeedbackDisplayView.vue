<template>
    <div>
        <div >
            <a-page-header
                style="background-color: #F5F5F5; padding: 24px;border: 1px solid rgb(235, 237, 240)"
                :backIcon="false"
                :ghost="false"
                :title="formData.title"
                @back="() => null"
            >
                <template slot="extra">

                </template>
                <template slot="footer">
                    <a-descriptions
                        size="small"
                        :column="{ xxl: 5, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }"
                    >
                        <a-descriptions-item :label="$t('langMap.table.fields.em.sysFeedback.type')">
                            {{formData.typeName}}
                        </a-descriptions-item>
                        <a-descriptions-item :label="$t('langMap.table.fields.em.sysFeedback.operateUserName')">
                            {{formData.operateUserName}}
                        </a-descriptions-item>
                        <a-descriptions-item :label="$t('langMap.table.fields.em.sysFeedback.operateProgress')">
                            {{formData.operateProgressStr}}
                        </a-descriptions-item>
                        <a-descriptions-item :label="$t('langMap.table.fields.em.sysFeedback.operateTime')">
                            {{formData.publishTime | operateTime}}
                        </a-descriptions-item>
                        <a-descriptions-item :label="$t('langMap.table.fields.em.sysFeedback.isFinish')">
                            {{formData.isFinishStr}}
                        </a-descriptions-item>
                    </a-descriptions>
                </template>
            </a-page-header>
            <mavon-read-only-comp
                :formData="formData"
            />
        </div>
        <!-- 弹窗dom-区域 -->
        <div>

        </div>
    </div>
</template>

<script>
    import {AllEnum,EnumUtils} from '~Config/selectData.js';
    import MavonReadOnlyComp from '~Components/regular/common/mavon/MavonReadOnlyComp';
    import {SysFeedbackDisplayApi} from './SysFeedbackDisplayApi'
    import {FeedBackOperateProgressEnum} from "~Config/selectData";
    export default {
        name: "SysFeedbackDisplayView",
        components: {MavonReadOnlyComp},
        data(){
            return {
                formData:{
                    fid:'',
                    title:'',
                    auditState:undefined,
                    auditStateStr:'',
                    createTime:undefined,
                    originContent:'',
                    isPublished:undefined,
                    isPublishedStr:'',
                    publishTime:undefined
                },
                dialog:{

                }
            }
        },
        computed:{
            formFid(){
                if(this.queryConf){
                    return this.queryConf.fid ;
                }
                return '';
            },
            queryConf(){
                return this.$route.query ;
            }
        },
        methods:{
            handleTransformData(){
                const formData  = this.formData;
                if(!formData){
                    return ;
                }
                let flagSwitchValMap = EnumUtils.toValMap(AllEnum.FlagSwitchEnum);
                let feedBackOperateProgressValMap = EnumUtils.toValMap(AllEnum.FeedBackOperateProgressEnum);
                formData['isFinishStr'] = flagSwitchValMap[formData.isFinish] ;
                formData['operateProgressStr'] = feedBackOperateProgressValMap[formData.operateProgress] ;
            },
            renderFormData(){
                var _this = this ;
                if(!this.formFid){
                    return ;
                }
                SysFeedbackDisplayApi.getItemById(this.formFid).then((res) =>{
                    if(res.success){
                        _this.formData = res.bean ;
                        _this.handleTransformData();
                    }
                });
            },
        },
        watch: {
            $route(route) {
                if(!this.formFid){
                    return ;
                }
                this.renderFormData();
            }
        },
        mounted() {
            this.renderFormData();
        }
    }
</script>

<style scoped>
    .v-note-wrapper{ z-index:1 !important; }
</style>
