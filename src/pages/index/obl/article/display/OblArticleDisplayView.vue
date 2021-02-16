<template>
    <div>
        <div >
            <a-page-header
                style="border: 1px solid rgb(235, 237, 240)"
                :backIcon="false"
                :ghost="false"
                :title="formData.title"
                :sub-title="formData.summary"
                @back="() => null"
            >
                <template slot="footer">
                    <a-descriptions
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
    </div>
</template>

<script>
    import {AllEnum,EnumUtils} from '~Config/selectData.js';
    import MavonReadOnlyComp from '~Components/regular/common/mavon/MavonReadOnlyComp';
    import {OblArticleDisplayApi} from './oblArticleDisplayApi'
    export default {
        name: "OblArticleDisplayView",
        components: {MavonReadOnlyComp},
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
            }
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

</style>
