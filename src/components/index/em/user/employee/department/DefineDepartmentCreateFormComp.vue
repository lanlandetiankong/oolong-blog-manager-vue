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
                <a-form-item :label="$t('langMap.table.fields.common.superiorName')">
                    <a-tree-select
                        :placeholder="$t('langMap.button.placeholder.filterSuperiors')"
                        showSearch allowClear
                        :treeNodeFilterProp="treeSelectConf.pid.treeNodeFilterProp"
                        :treeDefaultExpandAll="treeSelectConf.pid.treeDefaultExpandAll"
                        v-decorator="formFieldConf.pid"
                        :treeData="treeSelectConf.pid.selftTreeData"
                        @change="handleParentTreeOfSearchChange"
                    >
                    </a-tree-select>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.name')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.name"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.code')"
                     v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.code"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table..fields.common.Val')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input-number v-decorator="formFieldConf.weights"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.description')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.description"/>
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

    import {EmployeeDepartmentCompsApi} from '../employeeCompsApi'
    export default {
        name: "DefineDepartmentCreateFormComp",
        components: {ATextarea, AFormItem},
        props:{
            visible:Boolean,
            actionType:String,
            formObj:Object,
            parentSelectTrees:Array
        },
        data(){
            var paramsRules ={
                pid:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseSelect',[this.$t('langMap.table.fields.common.superiorName')])}
                ],
                name:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.name')])}
                ],
                code:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.code')])}
                ],
                weights:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.weights')])}
                ],
                description:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.description')])}
                ],
                remark:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.remark')])}
                ]
            };
            return {
                FormBaseConfObj,
                formFieldConf:{
                    pid:["pid",{rules:paramsRules.pid}],
                    name:["name",{rules:paramsRules.name}],
                    code:["code",{rules:paramsRules.code}],
                    weights:["weights",{rules:paramsRules.weights}],
                    description:["description",{rules:paramsRules.description}],
                    remark:["remark",{rules:paramsRules.remark}]
                },
                createForm:{},
                treeSelectConf:{
                    pid:{
                        treeDefaultExpandAll:false,
                        treeNodeFilterProp:"title",
                        selftTreeData:[]
                    }
                }
            }
        },
        methods:{
            dealUpdateFormValue(formObj){
                var _this = this ;
               if(typeof _this.createForm.updateFields != "undefined"){ //避免未初始化form的时候就调用了updatefield
                   _this.createForm.updateFields({
                       pid: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.pid,
                       }),
                       name: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.name,
                       }),
                       code: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.code,
                       }),
                       weights: _this.$form.createFormField({
                           ...formObj,
                           value: formObj.weights,
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
            handleParentTreeOfSearchChange(value){  //[上级部门] SelectTree cchange事件
                console.log("handleParentTreeOfSearchChange",value);
            },
            handleCreateActionInit(){   //弹窗展示为[创建-操作]的初始化
                var _this = this ;
                _this.treeSelectConf.pid.selftTreeData = _this.parentSelectTrees ;
            },
            handleUpdateActionInit(){   //弹窗展示为[更新-操作]的初始化
                var _this = this ;
                EmployeeDepartmentCompsApi.getDefineDepartmentTreeFilterChildrens(_this.formObj.fid).then((res) => { //更新 上级部门 树
                    if(res && res.success){
                        _this.treeSelectConf.pid.selftTreeData  = res.gridList ;
                    }
                })
            },
        },
        computed:{
            modalCompTitle() {
                return "create" == this.actionType ?  this.$t('langMap.button.actions.addByForm') : this.$t('langMap.button.actions.updateByForm') ;
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
                        pid: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.pid
                        }),
                        name: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.name
                        }),
                        code: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.code
                        }),
                        weights: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.weights
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
