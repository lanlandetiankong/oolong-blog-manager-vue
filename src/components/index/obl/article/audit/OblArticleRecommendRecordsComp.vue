<template>
    <div>
        <a-modal
            class="modal-big-cls"
            :zIndex="overZIndex ? 2000 : 1000"
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.viewRecommendRecord')"
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
                        <a-timeline-item v-if="item.isConfirmed == 1">
                            <a-icon slot="dot" type="question-circle" />
                            <a-descriptions :column="1"
                                :title="item.updateTime | formatBaseDateTime">
                                <a-descriptions-item
                                    :label="$t('langMap.table.fields.obl.articleRecommend.articleTitle')">
                                    {{item.articleTitle}}
                                </a-descriptions-item>
                                <a-descriptions-item
                                    :label="$t('langMap.table.fields.obl.articleRecommend.startTime')">
                                    {{item.startTime | formatBaseDateTime}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.endTime')">
                                    {{item.endTime | formatBaseDateTime}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.reason')">
                                    {{item.reason}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.recommendUserName')">
                                    {{item.recommendUserName}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.isConfirmed')">
                                    {{item.isConfirmedStr}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.confirmedTime')">
                                    {{item.confirmedTime | formatBaseDateTime}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.confirmedUserName')">
                                    {{item.confirmedUserName}}
                                </a-descriptions-item>
                            </a-descriptions>
                        </a-timeline-item>
                        <a-timeline-item v-else-if="item.isConfirmed == 0">
                            <a-icon slot="dot" type="check-circle" />
                            <a-descriptions :column="1"
                                            :title="item.updateTime | formatBaseDateTime">
                                <a-descriptions-item
                                    :label="$t('langMap.table.fields.obl.articleRecommend.articleTitle')">
                                    {{item.articleTitle}}
                                </a-descriptions-item>
                                <a-descriptions-item
                                    :label="$t('langMap.table.fields.obl.articleRecommend.startTime')">
                                    {{item.startTime | formatBaseDateTime}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.endTime')">
                                    {{item.endTime | formatBaseDateTime}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.reason')">
                                    {{item.reason}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.recommendUserName')">
                                    {{item.recommendUserName}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.isConfirmed')">
                                    {{item.isConfirmedStr}}
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
    import {AllEnum,EnumUtils} from '~Config/selectData.js';
    import {OblArticleRecommendRecordsCompApi} from './OblArticleRecommendRecordsCompApi'
    export default {
        name: "OblArticleRecommendRecordsComp",
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
                let flagSwitchValMap = EnumUtils.toValMap(AllEnum.FlagSwitchEnum);
                for (let idx in data){
                    let item = data[idx] ;
                    item['isConfirmedStr'] = flagSwitchValMap[item.isConfirmed];
                }
            },
            handleGetData(){
                let _this = this ;
                OblArticleRecommendRecordsCompApi.getRecommendRecords(_this.formValObj).then((res) => {
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
                    //文章id
                    _this.formValObj['articleId'] = _this.formValObj['articleId'] ? _this.formValObj['articleId'] : _this.formValObj['fid'] ;
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
