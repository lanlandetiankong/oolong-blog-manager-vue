<template>
    <div>
        <a-modal
            class="modal-big-cls"
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.audit')"
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
                    <a-form-item :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditState')"
                                 v-bind="FormBaseConfObj.formItemLayout"
                    >
                        <a-select allowClear
                                  :placeholder="$t('langMap.commons.forms.pleaseChoose')"
                                  optionFilterProp="children"
                                  :options="binding.auditStateList"
                                  :filterOption="mixin_getFilterOption"
                                  v-decorator="formFieldConf.auditState"
                        >
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="$t('langMap.table.fields.obl.articleCommentAuditRecord.auditComments')"
                                 v-bind="FormBaseConfObj.formItemLayout"
                    >
                        <a-textarea v-decorator="formFieldConf.auditComments"/>
                    </a-form-item>
                </a-form>
                <div class="list-infinite-container">
                    <a-tag color="blue" >
                        {{$t('langMap.table.fields.obl.articleCommentAuditRecord.selectComments')}}
                    </a-tag>
                    <a-list :split=true
                            :data-source="commentList"
                    >
                        <a-list-item slot="renderItem" slot-scope="item,index">
                            {{ item.content }}
                        </a-list-item>
                    </a-list>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import {ArticleCommentAuditStateEnum,EnumUtils} from '~Config/selectData';
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {OblArticleCommentAuditCompApi} from './OblArticleCommentAuditCompApi'
    import {FormBaseConfObj} from "~Components/constant_define";
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";

    export default {
        name: "OblArticleCommentAuditComp",
        components: {ATextarea, AFormItem},
        mixins:[OblCommonMixin],
        props:{
            visible:Boolean,
            commentList:{
                type:Array,
                required:true
            },
            formObj:{
                type:Object,
                default(){
                    return {
                        auditComments:'',
                        auditState:undefined
                    };
                }
            }
        },
        data(){
            let paramsRules ={
                auditComments:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.obl.articleCommentAuditRecord.auditComments')])}
                ],
                auditStateList:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.obl.articleCommentAuditRecord.auditState')])}
                ]
            };
            //允许选择的[审批值]
            let auditStateArr = [ArticleCommentAuditStateEnum.ApprovalFailed,ArticleCommentAuditStateEnum.Approved] ;
            return {
                FormBaseConfObj,
                binding:{
                    auditStateList:EnumUtils.listToSelectData(auditStateArr)
                },
                formFieldConf:{
                    auditComments:["auditComments",{rules:paramsRules.auditComments}],
                    auditState:["auditState",{rules:paramsRules.auditStateList}],
                },
                formValObj:{},
                createForm:{}
            }
        },
        computed:{
            commentIdList(){
                let idArr = [] ;
                if(!this.commentList){
                    return idArr ;
                }
                this.commentList.forEach((item) =>{
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
                        auditComments: _this.$form.createFormField({
                            ...formValObj,
                            value: formValObj.auditComments,
                        }),
                        auditState: _this.$form.createFormField({
                            ...formValObj,
                            value: formValObj.auditState,
                        }),
                    });
                }
            },
            handleSubmit(){
                this.createForm.validateFields((err, values) => {
                    var _this = this;
                    if (err) {
                        return ;
                    }
                    OblArticleCommentAuditCompApi.batchAudit(values,this.commentIdList).then((res) => {
                        if(res.success){
                            _this.$message.success(res.msg);
                            _this.emitSubmit();
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
                        auditComments: this.$form.createFormField({
                            ..._this.formValObj,
                            value: _this.formValObj.auditComments
                        }),
                        auditState: this.$form.createFormField({
                            ..._this.formValObj,
                            value: _this.formValObj.auditState
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
