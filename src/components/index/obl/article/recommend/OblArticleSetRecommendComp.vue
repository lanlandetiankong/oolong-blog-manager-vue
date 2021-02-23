<template>
    <div>
        <a-modal
            class="modal-big-cls"
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.setAsRecommended')"
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
                            :data-source="articleList"
                    >
                        <a-list-item slot="renderItem" slot-scope="item,index">
                            {{ item.title }}
                        </a-list-item>
                    </a-list>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import {OblArticleSetRecommendCompApi} from './oblArticleSetRecommendCompApi'
    import {FormBaseConfObj} from "~Components/constant_define";
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";

    export default {
        name: "OblArticleSetRecommendComp",
        components: {ATextarea, AFormItem},
        props:{
            visible:Boolean,
            articleList:{
                type:Array,
                required:true
            }
        },
        data(){
            var paramsRules ={
                rangeTime:[
                    {type:'array',required:true,message:this.$t('langMap.commons.forms.pleaseSelectRangeTime',[this.$t('langMap.table.fields.obl.articleRecommend.reason')])}
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
            //默认的form对象
            let defaultFormObj = {
                reason:'',
                weights:undefined,
                remark:''
            };
            return {
                FormBaseConfObj,
                formFieldConf:{
                    rangeTime:["rangeTime",{rules:paramsRules.rangeTime}],
                    reason:["reason",{rules:paramsRules.reason}],
                    weights:["weights",{rules:paramsRules.weights}],
                    remark:["remark",{rules:paramsRules.remark}]
                },
                defaultFormObj,
                formObj:defaultFormObj,
                createForm:{}
            }
        },
        computed:{
            articleIdList(){
                let idArr = [] ;
                if(!this.articleList){
                    return idArr ;
                }
                this.articleList.forEach((item) =>{
                    if(item){
                        idArr.push(item.fid) ;
                    }
                });
                return idArr;
            }
        },
        methods:{
            dealUpdateFormValue(formObj){
                var _this = this ;
                if(typeof _this.createForm.updateFields != "undefined"){ //避免未初始化form的时候就调用了updatefield
                    _this.createForm.updateFields({
                        reason: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.reason,
                        }),
                        weights: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.weights,
                        }),
                        remark: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.remark,
                        })
                    });
                }
            },
            handleSubmit(){
                this.createForm.validateFields((err, values) => {
                    if (err) {
                        return ;
                    }
                    OblArticleSetRecommendCompApi.setAsRecommended(values,this.articleIdList).then((res) => {
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
                    //console.log(changedFields);
                    this.$emit('change', changedFields);
                },
                mapPropsToFields:() =>{
                    //console.log(_this.formObj);
                    return {
                        reason: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.reason
                        }),
                        weights: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.weights
                        }),
                        remark: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.remark
                        }),
                    }
                }
            });
        },
        watch:{
            formObj: {
                handler (val, oval) {
                    var _this = this ;
                    _this.dealUpdateFormValue(val);
                },
                deep: true,
                immediate:true
            },
            visible:{
                handler(val,oval){  //隐藏与展示弹窗时监听
                    this.formObj = this.defaultFormObj;
                    this.dealUpdateFormValue(val);
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
