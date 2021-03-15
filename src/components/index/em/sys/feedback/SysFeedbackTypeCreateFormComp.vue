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
                    <a-tree-select
                        :placeholder="$t('langMap.button.placeholder.filterSuperiors')"
                        showSearch allowClear
                        :treeNodeFilterProp="treeSelectConf.pid.treeNodeFilterProp"
                        :treeDefaultExpandAll="treeSelectConf.pid.treeDefaultExpandAll"
                        v-decorator="formFieldConf.pid"
                        :treeData="treeSelectConf.pid.selfTreeData"
                    />
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
    import {SysFeedbackTypeCreateFormCompApi} from  './SysFeedbackTypeCreateFormCompApi'
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
                pid: [
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
                    pid: ["pid", {rules: paramsRules.pid}],
                    name: ["name", {rules: paramsRules.name}],
                    description: ["description", {rules: paramsRules.description}],
                    weights: ["weights", {rules: paramsRules.weights}],
                    remark: ["remark", {rules: paramsRules.remark}]
                },
                createForm: {},
                treeSelectConf:{
                    pid:{
                        treeDefaultExpandAll:false,
                        treeNodeFilterProp:"title",
                        selfTreeData:[]
                    }
                }
            }
        },
        methods: {
            dealUpdateFormValue(formObj) {
                var _this = this;
                if (typeof _this.createForm.updateFields != "undefined") { //避免未初始化form的时候就调用了updatefield
                    _this.createForm.updateFields({
                        pid: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.pid,
                        }),
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
            },
            handleCreateActionInit(){   //弹窗展示为[创建-操作]的初始化
                var _this = this ;
                SysFeedbackTypeCreateFormCompApi.getTreeFilterChildrens(_this.formObj.fid).then((res) => { //更新 上级文章类别 树
                    if(res.success){
                        _this.treeSelectConf.pid.selfTreeData  = res.gridList ;
                    }
                })
            },
            handleUpdateActionInit(){   //弹窗展示为[更新-操作]的初始化
                var _this = this ;
                SysFeedbackTypeCreateFormCompApi.getTreeFilterChildrens(_this.formObj.fid).then((res) => { //更新 上级文章类别 树
                    if(res.success){
                        _this.treeSelectConf.pid.selfTreeData  = res.gridList ;
                    }
                })
            },
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
                        pid: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.pid
                        }),
                        name: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.name
                        }),
                        description: _this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.description,
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
