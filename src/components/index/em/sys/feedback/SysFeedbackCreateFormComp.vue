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
                <a-form-item :label="$t('langMap.table.fields.em.sysFeedback.title')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.title"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.em.sysFeedback.content')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.content"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.em.sysFeedback.type')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.type"/>
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
        name: "SysFeedbackCreateFormComp",
        components: {ATextarea, AFormItem},
        props: {
            visible: Boolean,
            actionType: String,
            formObj: Object
        },
        data() {
            var paramsRules = {
                title: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.em.sysFeedback.title')])
                    }
                ],
                content: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.em.sysFeedback.content')])
                    }
                ],
                type: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.em.sysFeedback.type')])
                    }
                ],
                value: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.em.sysFeedback.value')])
                    }
                ],
                weights: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.common.weights')])
                    },
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
                    title: ["title", {rules: paramsRules.title}],
                    content: ["content", {rules: paramsRules.content}],
                    type: ["type", {rules: paramsRules.type}]
                },
                createForm: {}
            }
        },
        methods: {
            dealUpdateFormValue(formObj) {
                var _this = this;
                if (typeof _this.createForm.updateFields != "undefined") { //避免未初始化form的时候就调用了updatefield
                    _this.createForm.updateFields({
                        title: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.title,
                        }),
                        content: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.content,
                        }),
                        type: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.type,
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
        computed: {
            modalCompTitle() {
                return "create" == this.actionType ? this.$t('langMap.button.actions.addByForm') : this.$t('langMap.button.actions.updateByForm');
            }
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
                        title: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.title
                        }),
                        content: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.content
                        }),
                        type: _this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.type,
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
        watch: {
            formObj: {
                handler(val, oval) {
                    var _this = this;
                    _this.dealUpdateFormValue(val);
                },
                deep: true,
                immediate: true
            }
        }
    }
</script>

<style scoped>

</style>
