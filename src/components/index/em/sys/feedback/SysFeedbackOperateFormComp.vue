<template>
    <div>
        <a-modal
            :visible="visible"
            :maskClosable=false
            :title="$t('langMap.button.actions.operate')"
            :okText="$t('langMap.button.actions.confirmSubmit')"
            :cancelText="$t('langMap.button.actions.cancel')"
            @cancel="() => { $emit('createFormCancel')}"
            @ok="handleFormSubmit"
        >
            <a-form
                layout="vertical"
                :form="createForm"
            >
                <a-form-item :label="$t('langMap.table.fields.em.sysFeedbackOperate.operateProgress')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-select allowClear
                              :placeholder="$t('langMap.commons.forms.pleaseChoose')"
                              optionFilterProp="children"
                              :options="operateProgressSelect"
                              :filterOption="mixin_getFilterOption"
                              v-decorator="formFieldConf.operateProgress"
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
    import {SysFeedbackOperateFormCompApi} from './SysFeedbackOperateFormCompApi'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormBaseConfObj} from "~Components/constant_define";
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ATextarea from "ant-design-vue/es/input/TextArea";
    import {AllEnum, EnumUtils} from "~Config/selectData";
    import {SysFeedbackTypeApi} from "~Pages/index/em/sys/feedback/type/SysFeedbackTypeApi";

    export default {
        name: "SysFeedbackOperateFormComp",
        components: {ATextarea, AFormItem},
        mixins:[OblCommonMixin],
        props: {
            visible: Boolean,
            actionType: String,
            formObj: Object
        },
        data() {
            var paramsRules = {
                operateProgress: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.em.sysFeedbackOperate.operateProgress')])
                    }
                ],
                remark: [
                    {
                        required: false,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.common.remark')])
                    }
                ]
            };
            return {
                FormBaseConfObj,
                formFieldConf: {
                    operateProgress: ["operateProgress", {rules: paramsRules.operateProgress}],
                    remark: ["remark", {rules: paramsRules.remark}]
                },
                createForm: {},
                binding:{
                    operateProgressList:EnumUtils.listToSelectData(AllEnum.FeedBackOperateProgressEnum)
                }
            }
        },
        computed:{
            operateProgressSelect(){
                let _this = this ;
                let o = this.binding.operateProgressList ;
                let r = o.filter(item => item.value != _this.formObj.operateProgress);
                return r;
            }
        },
        methods: {
            dealUpdateFormValue(formObj) {
                var _this = this;
                if (typeof _this.createForm.updateFields != "undefined") { //避免未初始化form的时候就调用了updatefield
                    _this.createForm.updateFields({
                        operateProgress: _this.$form.createFormField({
                            ...formObj,
                            value: undefined,
                        }),
                        remark: _this.$form.createFormField({
                            ...formObj,
                            value: undefined,
                        })
                    });
                }
            },
            handleFormSubmit(){
                var _this = this;
                _this.createForm.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    let obj = values ;
                    obj['feedbackId'] = _this.formObj.fid ;
                    SysFeedbackOperateFormCompApi.createByForm(obj).then((res) => {
                        _this.$emit('createFormSubmit',values,res);
                    })
                });
            },
            handleCreateActionInit(){   //弹窗展示为[创建-操作]的初始化

            },
            handleUpdateActionInit(){   //弹窗展示为[更新-操作]的初始化

            },
        },
        created() {
            var _this = this;
            _this.createForm = this.$form.createForm(_this, {
                name: 'createForm',
                onFieldsChange: (_, changedFields) => {
                    this.$emit('change', changedFields);
                },
                mapPropsToFields: () => {
                    return {
                        operateProgress: this.$form.createFormField({
                            ..._this.formObj,
                            value: undefined
                        }),
                        remark: this.$form.createFormField({
                            ..._this.formObj,
                            value: undefined
                        }),
                    }
                }
            });
        },
        watch: {
            formObj: {
                handler(val, oval) {
                    var _this = this;
                    _this.dealUpdateFormValue(val);
                },
                deep: true,
                immediate: true
            },
            visible:{
                handler(val,oval){  //隐藏与展示弹窗时监听
                    var _this = this ;
                    if(val === true){
                        if("create" == _this.actionType){   //打开=>创建
                            _this.handleCreateActionInit();
                        }   else if("update" == _this.actionType){  //打开=>更新
                            _this.handleUpdateActionInit();
                        }
                    }   else {  //弹窗关闭
                        //console.log("弹窗展示状态变更:关闭");
                    }
                },
                immediate:true
            }
        }
    }
</script>

<style scoped>

</style>
