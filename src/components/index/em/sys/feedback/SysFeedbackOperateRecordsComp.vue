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
                        <a-timeline-item >
                            <a-icon slot="dot" type="audit" />
                            <a-descriptions :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }"
                                :title="item.operateTime | formatBaseDateTime">
                                <a-descriptions-item
                                    :label="$t('langMap.table.fields.em.sysFeedbackOperate.operateUserName')">
                                    {{item.operateUserName}}
                                </a-descriptions-item>
                                <a-descriptions-item
                                    :label="$t('langMap.table.fields.em.sysFeedbackOperate.operateProgress')">
                                    {{item.operateProgressStr}}
                                </a-descriptions-item>
                                <a-descriptions-item :label="$t('langMap.table.fields.em.sysFeedbackOperate.isFinish')">
                                    {{item.isFinishStr}}
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
    import {SysFeedbackOperateRecordsCompApi} from './SysFeedbackOperateRecordsCompApi'
    export default {
        name: "SysFeedbackOperateRecordsComp",
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
                let feedBackOperateProgressValMap = EnumUtils.toValMap(AllEnum.FeedBackOperateProgressEnum);
                for (let idx in data){
                    let item = data[idx] ;
                    item['isFinishStr'] = flagSwitchValMap[item.isFinish];
                    item['operateProgressStr'] = feedBackOperateProgressValMap[item.operateProgress];
                }
            },
            handleGetData(){
                let _this = this ;
                SysFeedbackOperateRecordsCompApi.getOperateRecords(_this.formValObj).then((res) => {
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
                    _this.formValObj['feedbackId'] = _this.formValObj['feedbackId'] ? _this.formValObj['feedbackId'] : _this.formValObj['fid'] ;
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
