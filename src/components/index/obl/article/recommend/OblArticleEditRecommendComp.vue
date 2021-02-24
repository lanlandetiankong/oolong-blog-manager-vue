<template>
    <div>
        <a-modal
            class="modal-big-cls"
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.batchEdit')"
            :okText="$t('langMap.button.actions.confirmSubmit')"
            :cancelText="$t('langMap.button.actions.cancel')"
            @cancel="() => { $emit('cancel')}"
            @ok="handleSubmit"
        >
            <div>
                <a-form
                    layout="vertical"
                    :form="createForm"
                >
                    <a-form-item :label="$t('langMap.table.fields.obl.articleRecommend.rangeTime')">
                        <a-range-picker
                            v-decorator="formFieldConf.rangeTime"
                            :show-time="{ format: 'HH:mm' }"
                            format="YYYY-MM-DD HH:mm"
                        />
                    </a-form-item>
                    <a-form-item :label="$t('langMap.table.fields.obl.articleRecommend.reason')"
                                 v-bind="FormBaseConfObj.formItemLayout"
                    >
                        <a-textarea v-decorator="formFieldConf.reason"/>
                    </a-form-item>
                    <a-form-item :label="$t('langMap.table.fields.common.weights')"
                                 v-bind="FormBaseConfObj.formItemLayout"
                    >
                        <a-input-number v-decorator="formFieldConf.weights"/>
                    </a-form-item>
                    <a-form-item :label="$t('langMap.table.fields.common.remark')"
                                 v-bind="FormBaseConfObj.formItemLayout"
                    >
                        <a-textarea v-decorator="formFieldConf.remark"/>
                    </a-form-item>
                </a-form>
                <div class="list-infinite-container">
                    <a-tag color="blue" >
                        {{$t('langMap.table.fields.obl.articleRecommend.selectArticles')}}
                    </a-tag>
                    <a-list :split=true
                            :data-source="itemList"
                    >
                        <a-list-item slot="renderItem" slot-scope="item,index">
                            {{ item.articleTitle }}
                        </a-list-item>
                    </a-list>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import {OblArticleEditRecommendCompApi} from './oblArticleEditRecommendCompApi'
    import {FormBaseConfObj} from "~Components/constant_define";
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";

    export default {
        name: "OblArticleEditRecommendComp",
        components: {ATextarea, AFormItem},
        props:{
            visible:Boolean,
            itemList:{
                type:Array,
                required:true
            },
            formObj:{
                type:Object,
                default(){
                    return {
                        reason:'',
                        weights:undefined,
                        remark:''
                    };
                }
            }
        },
        data(){
            var paramsRules ={
                rangeTime:[
                    {type:'array',required:true,message:this.$t('langMap.commons.forms.pleaseSelectRangeTime',[this.$t('langMap.table.fields.obl.articleRecommend.rangeTime')])}
                ],
                reason:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.obl.articleRecommend.reason')])}
                ],
                weights:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.weights')])},
                ],
                remark:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.remark')])}
                ]
            };
            return {
                FormBaseConfObj,
                formFieldConf:{
                    rangeTime:["rangeTime",{rules:paramsRules.rangeTime}],
                    reason:["reason",{rules:paramsRules.reason}],
                    weights:["weights",{rules:paramsRules.weights}],
                    remark:["remark",{rules:paramsRules.remark}]
                },
                formValObj:{},
                createForm:{}
            }
        },
        computed:{
            itemIdList(){
                let idArr = [] ;
                if(!this.itemList){
                    return idArr ;
                }
                this.itemList.forEach((item) =>{
                    if(item){
                        idArr.push(item.fid) ;
                    }
                });
                return idArr;
            }
        },
        methods:{
            dealUpdateFormValue(){
                var _this = this ;
                _this.formValObj = _this.formObj ;
                let formValObj = _this.formValObj ;
                if(typeof _this.createForm.updateFields != "undefined"){ //避免未初始化form的时候就调用了updatefield
                    _this.createForm.updateFields({
                        rangeTime: _this.$form.createFormField({
                            ...formValObj,
                            value: formValObj.rangeTime,
                        }),
                        reason: _this.$form.createFormField({
                            ...formValObj,
                            value: formValObj.reason,
                        }),
                        weights: _this.$form.createFormField({
                            ...formValObj,
                            value: formValObj.weights,
                        }),
                        remark: _this.$form.createFormField({
                            ...formValObj,
                            value: formValObj.remark,
                        })
                    });
                }
            },
            handleSubmit(){
                this.createForm.validateFields((err, values) => {
                    if (err) {
                        return ;
                    }
                    OblArticleEditRecommendCompApi.editRecommended(values,this.itemIdList).then((res) => {
                        if(res.success){
                            this.$message.success(res.msg);
                            this.emitSubmit();
                        }
                    }) ;
                })
            },
            emitSubmit(){
                this.$emit('submit');
            }
        },
        created(){
            var _this = this ;
            _this.createForm = this.$form.createForm(_this,{
                name:'createForm',
                onFieldsChange: (_, changedFields) => {
                    if(changedFields){
                        var formValObjTemp = _this.formValObj ;
                        const changeFieldNames = Object.keys(changedFields) ;
                        if(changeFieldNames && changeFieldNames.length > 0){
                            for(var i=0;i<changeFieldNames.length;i++){
                                //当前修改的字段名
                                var changeFieldNameTemp = changeFieldNames[i] ;
                                var fieldChangeObj = changedFields[changeFieldNameTemp];
                                if(fieldChangeObj){
                                    formValObjTemp[changeFieldNameTemp] = fieldChangeObj.value;
                                }
                            }
                        }
                        _this.formValObj = formValObjTemp ;
                    }
                    //通知给父组件
                    this.$emit('change', changedFields);
                },
                mapPropsToFields:() =>{
                    return {
                        rangeTime: this.$form.createFormField({
                            ..._this.formValObj,
                            value: _this.formValObj.rangeTime
                        }),
                        reason: this.$form.createFormField({
                            ..._this.formValObj,
                            value: _this.formValObj.reason
                        }),
                        weights: this.$form.createFormField({
                            ..._this.formValObj,
                            value: _this.formValObj.weights
                        }),
                        remark: this.$form.createFormField({
                            ..._this.formValObj,
                            value: _this.formValObj.remark
                        }),
                    }
                }
            });
        },
        watch:{
            formObj: {
                handler (val, oval) {
                    debugger;
                    var _this = this ;
                    _this.dealUpdateFormValue(val);
                },
                deep: true,
                immediate:true
            },
            visible:{
                handler(val,oval){  //隐藏与展示弹窗时监听
                    debugger;
                    if(val === true){
                        this.dealUpdateFormValue(val);
                    }   else {  //弹窗关闭
                        this.formValObj = {} ;
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
        width: 180px;
    }
    .list-infinite-container {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        padding: 2px 10px;
    }
</style>
