<template>
    <div>
        <div >
            <a-page-header
                style="background-color: #F5F5F5; padding: 24px;border: 1px solid rgb(235, 237, 240)"
                :backIcon="false"
                :ghost="false"
                :title="formData.title"
                :sub-title="formData.summary"
                @back="() => null"
            >
                <template slot="extra">
                    <a-button @click="handleViewAuditRecords($event)">
                        {{$t('langMap.button.actions.viewAuditRecord')}}
                    </a-button>
                    <a-button @click="handleViewRecommendRecords($event)">
                        {{$t('langMap.button.actions.viewRecommendRecord')}}
                    </a-button>
                </template>
                <template slot="footer">
                    <a-descriptions
                        size="small"
                        :column="{ xxl: 5, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }"
                    >
                        <a-descriptions-item :label="$t('langMap.table.fields.obl.article.tagNames')">
                            <a-tag color="#2db7f5">
                                {{formData.tagNames}}
                            </a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item :label="$t('langMap.table.fields.obl.article.categoryNames')">
                            <a-tag color="#108ee9">
                                {{formData.categoryNames}}
                            </a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item :label="$t('langMap.table.fields.obl.article.auditState')">
                            {{formData.auditStateStr}}
                        </a-descriptions-item>
                        <a-descriptions-item :label="$t('langMap.table.fields.obl.article.isPublished')">
                            {{formData.isPublishedStr}}
                        </a-descriptions-item>
                        <a-descriptions-item :label="$t('langMap.table.fields.obl.article.publishTime')">
                            {{formData.publishTime | formatBaseDateTime}}
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
            <obl-article-audit-records-comp
                v-if="dialog.viewAuditRecords.visible"
                v-bind="dialog.viewAuditRecords"
                @cancel="()=> this.dialog.viewAuditRecords.visible = false"
                @submit="()=> this.dialog.viewAuditRecords.visible = false"
            />
            <obl-article-recommend-records-comp
                v-if="dialog.viewRecommendRecords.visible"
                v-bind="dialog.viewRecommendRecords"
                @cancel="()=> this.dialog.viewRecommendRecords.visible = false"
                @submit="()=> this.dialog.viewRecommendRecords.visible = false"
            />
        </div>
    </div>
</template>

<script>
    import {AllEnum,EnumUtils} from '~Config/selectData.js';
    import MavonReadOnlyComp from '~Components/regular/common/mavon/MavonReadOnlyComp';
    import OblArticleAuditRecordsComp from '~Components/index/obl/article/audit/OblArticleAuditRecordsComp'
    import OblArticleRecommendRecordsComp from '~Components/index/obl/article/audit/OblArticleRecommendRecordsComp'
    import {OblArticleDisplayApi} from './oblArticleDisplayApi'
    export default {
        name: "OblArticleDisplayView",
        components: {MavonReadOnlyComp,OblArticleAuditRecordsComp,OblArticleRecommendRecordsComp},
        data(){
            return {
                formData:{
                    fid:'',
                    title:'',
                    summary:'',
                    auditState:undefined,
                    auditStateStr:'',
                    createTime:undefined,
                    originContent:'',
                    isPublished:undefined,
                    isPublishedStr:'',
                    publishTime:undefined
                },
                dialog:{
                    viewAuditRecords:{
                        visible: false,
                        formObj:{},
                        overZIndex:true
                    },
                    viewRecommendRecords:{
                        visible: false,
                        formObj:{},
                        overZIndex:true
                    }
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
                let publishStatusValMap = EnumUtils.toValMap(AllEnum.PublishStatusEnum);
                let articleAuditStateValMap = EnumUtils.toValMap(AllEnum.ArticleAuditStateEnum);
                formData['isPublishedStr'] = publishStatusValMap[formData.isPublished] ;
                formData['auditStateStr'] = articleAuditStateValMap[formData.auditState] ;
            },
            renderFormData(){
                var _this = this ;
                if(!this.formFid){
                    return ;
                }
                OblArticleDisplayApi.getItemById(this.formFid).then((res) =>{
                    if(res.success){
                        _this.formData = res.bean ;
                        _this.handleTransformData();
                    }
                });
            },
            handleViewAuditRecords(e){   //查看文章的审批记录
                this.dialog.viewAuditRecords.formObj = this.formData;
                this.dialog.viewAuditRecords.visible = true ;
            },
            handleViewRecommendRecords(e){   //查看文章的推荐记录
                this.dialog.viewRecommendRecords.formObj = this.formData;
                this.dialog.viewRecommendRecords.visible = true ;
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
