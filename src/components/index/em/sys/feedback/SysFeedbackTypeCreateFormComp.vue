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
                <a-form-item :label="$t('langMap.table.fields.em.sysFeedbackType.parentName')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.parentName"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.em.sysFeedbackType.name')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.name"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.em.sysFeedbackType.description')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.description"/>
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
        name: "SysFeedbackTypeCreateFormComp",
        components: {ATextarea, AFormItem},
        props: {
            visible: Boolean,
            actionType: String,
            formObj: Object
        },
        data() {
            var paramsRules = {
                parentName: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.em.sysFeedbackType.parentName')])
                    }
                ],
                name: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.em.sysFeedbackType.name')])
                    }
                ],
                description: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseFillOut', [this.$t('langMap.table.fields.em.sysFeedbackType.description')])
                    }
                ]
            };
            return {
                FormBaseConfObj,
                formFieldConf: {
                    parentName: ["parentName", {rules: paramsRules.parentName}],
                    name: ["name", {rules: paramsRules.name}],
                    description: ["description", {rules: paramsRules.description}]
                },
                createForm: {}
            }
        },
        methods: {
            dealUpdateFormValue(formObj) {
                var _this = this;
                if (typeof _this.createForm.updateFields != "undefined") { //避免未初始化form的时候就调用了updatefield
                    _this.createForm.updateFields({
                        parentName: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.parentName,
                        }),
                        name: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.name,
                        }),
                        description: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.description,
                        }),
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
                        parentName: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.parentName
                        }),
                        name: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.name
                        }),
                        description: _this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.description,
                        })
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
