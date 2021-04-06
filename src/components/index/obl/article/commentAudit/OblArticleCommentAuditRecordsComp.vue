<template>
    <div>
        <a-modal
            class="modal-big-cls"
            :zIndex="overZIndex ? 2000 : 1000"
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.viewAuditRecord')"
            @cancel="() => { $emit('cancel')}"
            @ok="handleSubmit"
        >
            <template slot="footer">
                <a-button type="primary" @click="handleSubmit">
                    {{$t('langMap.button.actions.close')}}
                </a-button>
            </template>
            <div>
                <a-empty v-show="!hasData"/>
                <a-timeline v-show="hasData">
                    <template v-for="item in timelines.data">
                        <a-timeline-item v-if="item.auditType == 1"
                         >
                            <a-icon slot="dot" type="audit" />
                            <a-descriptions :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }"
                                :title="item.auditTime | formatBaseDateTime">
                                <a-descriptions-item
                                    :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditComments')">
                                    {{item.auditComments}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditState')">
                                    {{item.auditStateStr}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditType')">
                                    {{item.auditTypeStr}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditUserName')">
                                    {{item.auditUserName}}
                                </a-descriptions-item>
                            </a-descriptions>
                        </a-timeline-item>
                        <a-timeline-item color="red"
                                         v-if="item.auditType == 2">
                            <a-icon slot="dot" type="rollback" />
                            <a-descriptions :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }"
                                            :title="item.auditTime | formatBaseDateTime">
                                <a-descriptions-item span="2"
                                                     :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditComments')">
                                    {{item.auditComments}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditState')">
                                    {{item.auditStateStr}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditType')">
                                    {{item.auditTypeStr}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditUserName')">
                                    {{item.auditUserName}}
                                </a-descriptions-item>
                            </a-descriptions>
                        </a-timeline-item>
                    </template>
                </a-timeline>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import {AllEnum,EnumUtils} from '~Config/selectData';
    import {OblArticleCommentAuditRecordsCompApi} from './OblArticleCommentAuditRecordsCompApi'
    export default {
        name: "OblArticleCommentAuditRecordsComp",
        components: {},
        props:{
            visible:Boolean,
            overZIndex:{
                type: Boolean,
                default: false
            },
            formObj:{
                type:Object,
                required:true
            }
        },
        data(){
            return {
                formValObj:{},
                timelines:{
                    data:[]
                }
            }
        },
        computed:{
            hasData(){
                return this.timelines.data.length > 0 ;
            }
        },
        methods:{
            handleTransformData(){  //数据转化
                const data = this.timelines.data;
                if(!data){
                    return ;
                }
                let auditStateValMap = EnumUtils.toValMap(AllEnum.ArticleCommentAuditStateEnum);
                let auditTypeValMap = EnumUtils.toValMap(AllEnum.ArticleCommentAuditTypeEnum);
                for (let idx in data){
                    let item = data[idx] ;
                    item['auditStateStr'] = auditStateValMap[item.auditState];
                    item['auditTypeStr'] = auditTypeValMap[item.auditType];
                }
            },
            handleGetData(){
                let _this = this ;
                OblArticleCommentAuditRecordsCompApi.getAuditRecords(_this.formValObj).then((res) => {
                    _this.timelines.data = res.gridList ;
                    _this.handleTransformData();
                })
            },
            handleSubmit(){
                this.$emit('submit');
            }
        },
        watch:{
            formObj: {
                handler (val, oval) {
                    var _this = this ;
                    _this.formValObj = val ;
                    //评论id
                    _this.formValObj['commentId'] = _this.formValObj['commentId'] ? _this.formValObj['commentId'] : _this.formValObj['fid'] ;
                    _this.handleGetData();
                },
                deep: true,
                immediate:true
            },
            visible:{
                handler(val,oval){  //隐藏与展示弹窗时监听
                    if(val === true){
                    }   else {  //弹窗关闭
                    }
                },
                deep: true,
                immediate:true
            }
        }
    }
</script>

<style scoped>
    .modal-big-cls{
        height: 400px;
        width: 280px;
    }
</style>
