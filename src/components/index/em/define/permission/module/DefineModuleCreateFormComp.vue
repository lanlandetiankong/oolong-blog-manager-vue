<template>
    <div>
        <a-modal
            :visible="visible"
            :maskClosable=false
            :title="modalCompTitle"
            :okText="$t('langMap.button.actions.confirmSubmit')"
            :cancelText="$t('langMap.button.actions.cancel')"
            @cancel="() => { $emit('createFormCancel')}"
            @ok="() => { $emit('createFormSubmit')}"
        >
            <a-form
                layout="vertical"
                :form="createForm"
            >
                <a-form-item :label="$t('langMap.table.fields.em.module.moduleName')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.name"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.code')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.code"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.em.menu.iconName')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <span>
                        <a target="_blank" href="https://www.antdv.com/components/icon-cn/">{{$t('langMap.commons.forms.tips.lookUpIcon')}}</a>
                        <span v-show="typeof formValObj.iconVal != 'undefined' && formValObj.iconVal.length > 0">
                            ( {{$t('langMap.commons.forms.tips.selectedIcon')}} :&nbsp;&nbsp; <a-icon :type="formValObj.iconVal"/> &nbsp;&nbsp;)
                        </span>
                    </span>
                    <a-input v-decorator="formFieldConf.iconVal"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.styleVal')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.styleVal"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.type')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-select showSearch allowClear
                              :placeholder="$t('langMap.commons.forms.pleaseChoose')"
                              optionFilterProp="children"
                              :options="moduleTypes"
                              :filterOption="getFilterOption"
                              v-decorator="formFieldConf.typeVal"
                    >
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.remark')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-textarea v-decorator="formFieldConf.remark"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
    import {FormBaseConfObj} from "~Components/constant_define";

    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";
    export default {
        name: "DefineModuleCreateFormComp",
        components: {ATextarea, AFormItem},
        props:{
            visible:Boolean,
            actionType:String,
            formObj:Object,
            moduleTypes:Array
        },
        data(){
            var paramsRules ={
                name:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.module.moduleName')])}
                ],
                code:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.code')])}
                ],
                iconVal:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.module.iconName')])}
                ],
                styleVal:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.styleVal')])}
                ],
                typeVal:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.type')])},
                ],
                remark:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.remark')])}
                ]
            };
            return {
                FormBaseConfObj,
                formFieldConf:{
                    name:["name",{rules:paramsRules.name}],
                    code:["code",{rules:paramsRules.code}],
                    iconVal:["iconVal",{rules:paramsRules.iconVal}],
                    styleVal:["styleVal",{rules:paramsRules.styleVal}],
                    typeVal:["typeVal",{rules:paramsRules.typeVal}],
                    remark:["remark",{rules:paramsRules.remark}]
                },
                createForm:{},
                formValObj:{}
            }
        },
        methods:{
            getFilterOption(input,option){
                return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
            },
            dealUpdateFormValue(formObj){
                var _this = this ;
                _this.formValObj = _this.formObj ;
               if(typeof _this.createForm.updateFields != "undefined"){ //避免未初始化form的时候就调用了updatefield
                   _this.createForm.updateFields({
                       name: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.name,
                       }),
                       code: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.code,
                       }),
                       iconVal: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.iconVal,
                       }),
                       styleVal: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.styleVal,
                       }),
                       typeVal: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.typeVal,
                       }),
                       remark: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.remark,
                       })
                   });
               }
            }
        },
        computed:{
            modalCompTitle() {
                return "create" == this.actionType ? this.$t('langMap.button.actions.addByForm') : this.$t('langMap.button.actions.updateByForm') ;
            }
        },
        created(){
            var _this = this ;
            _this.createForm = this.$form.createForm(_this,{
                name:'createForm',
                onFieldsChange: (_, changedFields) => {     //表单字段发生修改
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
                    //console.log(_this.formObj);
                    return {
                        name: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.name
                        }),
                        code: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.code
                        }),
                        iconVal: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.iconVal
                        }),
                        styleVal: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.styleVal
                        }),
                        typeVal: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.typeVal
                        }),
                        remark: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.remark
                        }),
                    }
                }
            });
        },
        mounted(){

        },
        watch:{
            formObj: {
                handler (val, oval) {
                    var _this = this ;
                    _this.dealUpdateFormValue(val);
                },
                deep: true,
                immediate:true
            }
        }
    }
</script>

<style scoped>

</style>
