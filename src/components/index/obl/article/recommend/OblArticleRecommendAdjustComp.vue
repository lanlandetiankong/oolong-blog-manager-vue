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
                    <a-form-item v-bind="FormBaseConfObj.mediumFormItemLayout"
                        :label="$t('langMap.table.fields.obl.articleRecommend.delayStartDays')">
                        <a-input-number v-decorator="formFieldConf.startDays"/>
                    </a-form-item>
                    <a-form-item v-bind="FormBaseConfObj.mediumFormItemLayout"
                        :label="$t('langMap.table.fields.obl.articleRecommend.delayEndDays')"
                    >
                        <a-input-number v-decorator="formFieldConf.endDays"/>
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
    import {OblArticleRecommendAdjustCompApi} from './oblArticleRecommendAdjustCompApi'
    import {FormBaseConfObj} from "~Components/constant_define";
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";

    export default {
        name: "OblArticleRecommendAdjustComp",
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
                        startDays:0,
                        endDays:0
                    };
                }
            }
        },
        data(){
            var paramsRules ={
                startDays:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.obl.articleRecommend.delayStartDays')])}
                ],
                endDays:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.obl.articleRecommend.delayEndDays')])}
                ],
            };
            return {
                FormBaseConfObj,
                formFieldConf:{
                    startDays:["startDays",{rules:paramsRules.startDays}],
                    endDays:["endDays",{rules:paramsRules.endDays}]
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
                        startDays: _this.$form.createFormField({
                            ...formValObj,
                            value: formValObj.startDays,
                        }),
                        endDays: _this.$form.createFormField({
                            ...formValObj,
                            value: formValObj.endDays,
                        })
                    });
                }
            },
            handleSubmit(){
                this.createForm.validateFields((err, values) => {
                    if (err) {
                        return ;
                    }
                    OblArticleRecommendAdjustCompApi.adjustTime(values,this.itemIdList).then((res) => {
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
                        startDays: this.$form.createFormField({
                            ..._this.formValObj,
                            value: _this.formValObj.startDays
                        }),
                        endDays: this.$form.createFormField({
                            ..._this.formValObj,
                            value: _this.formValObj.endDays
                        })
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
