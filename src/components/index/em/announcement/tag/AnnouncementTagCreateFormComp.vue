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
                <a-form-item :label="$t('langMap.table.fields.common.tagName')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.name"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.description')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.description"/>
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
        </a-modal>
    </div>
</template>
<script>
    import {FormBaseConfObj} from "~Components/constant_define";

    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";
    export default {
        name: "AnnouncementTagCreateFormComp",
        components: {ATextarea, AFormItem},
        props:{
            visible:Boolean,
            actionType:String,
            formObj:Object
        },
        data(){
            var paramsRules ={
                name:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.em.announcementTag.tagName')])}
                ],
                description:[],
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
                    name:["name",{rules:paramsRules.name}],
                    description:["description",{rules:paramsRules.description}],
                    weights:["weights",{rules:paramsRules.weights}],
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
                       description: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.description,
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
                        description: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.description
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
