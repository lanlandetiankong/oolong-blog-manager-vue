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
                <a-form-item :label="$t('langMap.table.fields.obl.articleCategory.name')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.name"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.obl.articleCategory.iconName')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <span>
                        <a target="_blank" href="https://www.antdv.com/components/icon-cn/">{{$t('langMap.commons.forms.tips.lookUpIcon')}}</a>
                        <span v-show="typeof formValObj.iconName != 'undefined' && formValObj.iconName.length > 0">
                            ( {{$t('langMap.commons.forms.tips.selectedIcon')}} :&nbsp;&nbsp; <a-icon :type="formValObj.iconName"/> &nbsp;&nbsp;)
                        </span>
                    </span>
                    <a-input v-decorator="formFieldConf.iconName"/>
                </a-form-item>
                <a-form-item :label="$t('langMap.table.fields.common.weights')"
                             v-bind="FormBaseConfObj.formItemLayout"
                >
                    <a-input v-decorator="formFieldConf.weights"/>
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

    import {OblArticleCategoryCreateFormCompApi} from './oblArticleCategoryCreateFormCompApi'

    export default {
        name: "OblArticleCategoryCreateFormComp",
        components: {ATextarea, AFormItem},
        props:{
            visible:Boolean,
            actionType:String,
            formObj:Object,
            parentSelectTrees:Array
        },
        data(){
            var paramsRules ={
                name:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.obl.articleCategory.name')])}
                ],
                iconName:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.obl.articleCategory.iconName')])}
                ],
                pid:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseSelect',[this.$t('langMap.table.fields.common.superiorName')])}
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
                    name:["name",{rules:paramsRules.name}],
                    iconName:["iconName",{rules:paramsRules.iconName}],
                    pid:["pid",{rules:paramsRules.pid}],
                    weights:["weights",{rules:paramsRules.weights}],
                    description:["description",{rules:paramsRules.description}],
                    remark:["remark",{rules:paramsRules.remark}]
                },
                createForm:{},
                formValObj:{},
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
                        iconName: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.iconName,
                        }),
                        pid: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.pid,
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
            handleParentTreeOfSearchChange(value){  //[上级文章类别] SelectTree cchange事件
                console.log("handleParentTreeOfSearchChange",value);
            },
            handleCreateActionInit(){   //弹窗展示为[创建-操作]的初始化
                var _this = this ;
                _this.treeSelectConf.pid.selftTreeData = _this.parentSelectTrees ;
            },
            handleUpdateActionInit(){   //弹窗展示为[更新-操作]的初始化
                var _this = this ;
                OblArticleCategoryCreateFormCompApi.getTreeFilterChildrens(_this.formObj.fid).then((res) => { //更新 上级文章类别 树
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
                    return {
                        name: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.name
                        }),
                        iconName: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.iconName
                        }),
                        pid: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.pid
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
