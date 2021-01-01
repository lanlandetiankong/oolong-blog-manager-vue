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
                <a-form-item :label="$t('langMap.table.fields.em.job.jobName')"
                    v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.name"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.type')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-select allowClear
                              :placeholder="$t('langMap.commons.forms.pleaseChoose')"
                              optionFilterProp="children"
                              :options="typeEnumArr"
                              :filterOption="getFilterOption"
                              v-decorator="formFieldConf.type"
                    >
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.description')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-textarea v-decorator="formFieldConf.description"/>
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
        name: "EmployeeJobCreateFormComp",
        components: {ATextarea, AFormItem},
        props:{
            visible:Boolean,
            actionType:String,
            formObj:Object,
            typeEnumArr:Array
        },
        data(){
            var paramsRules ={
                name:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.job.jobName')])}
                ],
                type:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.type')])}
                ],
                description:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.description')])},
                ],
                remark:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.remark')])}
                ]
            };
            return {
                FormBaseConfObj,
                formFieldConf:{
                    name:["name",{rules:paramsRules.name}],
                    type:["type",{rules:paramsRules.type}],
                    description:["description",{rules:paramsRules.description}],
                    remark:["remark",{rules:paramsRules.remark}]
                },
                createForm:{}
            }
        },
        methods:{
            dealUpdateFormValue(formObj){
                var _this = this ;
               if(typeof _this.createForm.updateFields != "undefined"){ //避免未初始化form的时候就调用了updatefield
                   _this.createForm.updateFields({
                       name: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.name,
                       }),
                       type: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.type,
                       }),
                       description: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.description,
                       }),
                       remark: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.remark,
                       })
                   });
               }
            },
            getFilterOption(input,option){
                return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
            }
        },
        computed:{
            modalCompTitle() {
                return "create" == this.actionType ? this.$t('langMap.button.actions.addByForm') : this.$t('langMap.button.actions.updateByForm') ;
            }
        },
        beforeCreate(){
            var _this = this ;

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
                        name: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.name
                        }),
                        type: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.type
                        }),
                        description: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.description
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
