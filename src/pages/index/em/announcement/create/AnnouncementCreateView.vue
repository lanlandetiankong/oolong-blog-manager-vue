<template>
    <div >
        <div>
            <a-row>
                <a-col :span="3">
                    <a-button size="large" icon="inbox"
                              @click="handleCreateDraftByForm"
                    >{{$t('langMap.button.actions.saveAsDraft')}}</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button size="large" type="primary" icon="check"
                              @click="handleCreateByForm"
                    >{{$t('langMap.button.actions.publish')}}</a-button>
                </a-col>
            </a-row>
            <br/>
            <a-row>
                <a-col :span="22">
                    <a-input  allowClear size="large"
                              :addonBefore="$t('langMap.table.fields.common.title')"
                              v-model="formObj.title"
                    />
                </a-col>
            </a-row>

            <a-form
                layout="inline"
                :form="createForm"
            >
                <a-row :type="formLayout.row.type">
                    <a-col :span="formLayout.defaultColSpan">
                        <a-form-item :label="$t('langMap.table.fields.common.keyword')">
                            <a-input v-decorator="formFieldConf.keyWord"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="formLayout.defaultColSpan">
                        <a-form-item :label="$t('langMap.table.fields.em.department.publishDepartment')">
                            <a-select showSearch allowClear
                                      :placeholder="$t('langMap.commons.forms.pleaseChoose')"
                                      style="width: 180px"
                                      optionFilterProp="children"
                                      :options="[]"
                                      :filterOption="mixin_getFilterOption"
                                      v-decorator="formFieldConf.publishDepartment"
                            >
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :type="formLayout.row.type">
                    <a-col :span="formLayout.dblColSpan">
                        <a-form-item :label="$t('langMap.table.fields.common.tag')">
                            <a-select showSearch allowClear
                                      mode="multiple"
                                      :placeholder="$t('langMap.commons.forms.pleaseChoose')"
                                      style="width: 360px"
                                      optionFilterProp="children"
                                      :options="bindData.announcementTagList"
                                      :filterOption="mixin_getFilterOption"
                                      v-decorator="formFieldConf.tagIdList"
                            >
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <a-divider />
            <base-quill-editor
                :content="formObj.content"
                @textChange="handleContentChange"
            />
        </div>
    </div>
</template>
<script>
    import {AnnouncementCreateApi} from './announcementCreateApi'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';

    import BaseQuillEditor from '~Components/regular/common/quill/BaseQuillEditor';
    import ATextarea from "ant-design-vue/es/input/TextArea";
    export default {
        name: "AnnouncementCreateView",
        components: {ATextarea,BaseQuillEditor},
        mixins:[OblCommonMixin],
        data(){
            const paramsRules ={
                keyWord:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseFillOut',[this.$t('langMap.table.fields.common.keyword')])}
                ],
                publishDepartment:[
                    {required:false,message:this.$t('langMap.commons.forms.pleaseSelect',[this.$t('langMap.table.fields.em.department.publishDepartment')])},
                ],
                tagIdList:[
                    {required:true,message:this.$t('langMap.commons.forms.pleaseSelect',[this.$t('langMap.table.fields.common.tag')])},
                    {type:'array'}
                ]
            };
            return {
                updateForm:{
                    flag:false,
                    fid:'',
                    initFlag:false
                },
                formLayout:{
                    row:{
                        type:"flex"
                    },
                    defaultColSpan: 8,
                    dblColSpan:12,
                },
                createForm:{},
                formFieldConf:{
                    keyWord:["keyWord",{rules:paramsRules.keyWord}],
                    publishDepartment:["publishDepartment",{rules:paramsRules.publishDepartment}],
                    tagIdList:["tagIdList",{rules:paramsRules.tagIdList}]
                },
                formObj:{
                    title:'',
                    content:'',
                    keyWord:'',
                    publishDepartment:'',
                    tagIdList:[]
                },
                bindData:{
                    announcementTagList:[]
                },
                toolbarConfig:{
                    loadings:{
                        isSubmitLoading:false,
                        isCancelLoading:false
                    }
                }
            }
        },
        methods:{
            dealUpdateFormValue(formObj){   //form表单更新
                var _this = this ;
                //console.log("dealUpdateFormValue",formObj);
                if(typeof _this.createForm.updateFields != "undefined"){ //避免未初始化form的时候就调用了updatefield
                    _this.createForm.updateFields({
                        keyWord: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.keyWord,
                        }),
                        publishDepartment: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.publishDepartment,
                        }),
                        tagIdList: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.tagIdList,
                        })
                    });
                }
            },
            dealGetAllAnnouncementTagList(){    //取得所有的 公告标签
                var _this = this ;
                AnnouncementCreateApi.getAllAnnouncementTagEnums().then((res) =>{
                    if(res.success){
                        _this.bindData.announcementTagList = res.gridList ;
                    }
                })
            },
            handleContentChange(text) {//同步富文本框的内容
                this.formObj.content = text ;
            },
            dealQuillImgExtendChange(xhr, formData){
                //console.log(xhr,formData);
            },
            dealCheckCreateAble(){  //判断是否可以 创建
                var _this = this ;
                let tempTitle = _this.formObj.title;
                let tempContent  = _this.formObj.content;
                if(tempTitle.length == 0 || tempContent.length == 0){
                    return false ;
                }
                return true ;
            },
            dealFormValuesMapToObj(values){
                var formObjTemp = this.formObj ;
                if(values){
                    formObjTemp['keyWord'] = values.keyWord;
                    formObjTemp['publishDepartment'] = values.publishDepartment;
                    formObjTemp['tagIdList'] = values.tagIdList;
                }
                return formObjTemp ;
            },
            //确认发表博文
            handleCreateByForm(e){
                var _this = this ;
                //验证是否未编辑
                let isCreateAble = this.dealCheckCreateAble() ;
                if(isCreateAble == false){
                    _this.$message.warning(_this.$t('langMap.commons.forms.pleaseFillOutTwo',[_this.$t('langMap.table.fields.em.announcement.title'),_this.$t('langMap.table.fields.em.announcement.content')]));
                    return false ;
                }   else {
                    //取得请求的参数：标题&内容、用户信息
                    this.createForm.validateFields((err, values) => {
                        if (!err) {
                            _this.formObj = _this.dealFormValuesMapToObj(values) ;
                            if(_this.updateForm.flag == true){  //发布 更新后的 公告草稿
                                AnnouncementCreateApi.createFromDraft(_this.formObj).then((res) =>{
                                    if(res.success){
                                        _this.$message.success(res.msg) ;
                                        //关闭当前页面
                                        _this.mixin_closeTagAndJump();
                                    }
                                })
                            }   else{   //直接发布
                                AnnouncementCreateApi.createByForm(_this.formObj).then((res) =>{
                                    if(res.success){
                                        _this.$message.success(res.msg) ;
                                        //关闭当前页面
                                        _this.mixin_closeTagAndJump();
                                    }
                                })
                            }
                        }
                    });
                }
            },
            handleCreateDraftByForm(){    //存储为草稿
                var _this = this ;
                //验证是否未编辑
                let isCreateAble = this.dealCheckCreateAble() ;
                if(isCreateAble == false){
                    _this.$message.warning(_this.$t('langMap.commons.forms.pleaseFillOutTwo',[_this.$t('langMap.table.fields.em.announcement.title'),_this.$t('langMap.table.fields.em.announcement.content')]));
                    return false ;
                }   else {
                    //取得请求的参数：标题&内容、用户信息
                    var formObjTemp = _this.formObj ;
                    this.createForm.validateFields((err, values) => {
                        if (!err) {
                            _this.formObj = _this.dealFormValuesMapToObj(values) ;
                            if(_this.updateForm.flag == true) {  //更新公告草稿
                                AnnouncementCreateApi.updateDraftByForm(_this.formObj).then((res) =>{
                                    if(res.success){
                                        _this.$message.success(res.msg) ;
                                        //关闭当前页面
                                        _this.mixin_closeTagAndJump();
                                    }
                                })
                            }   else {  //添加到 草稿
                                AnnouncementCreateApi.createDraftByForm(_this.formObj).then((res) =>{
                                    if(res.success){
                                        _this.$message.success(res.msg) ;
                                        //关闭当前页面
                                        _this.mixin_closeTagAndJump();
                                    }
                                })
                            }
                        }
                    });
                }
            },
            dealRenderDraftToForm(fid){
                var _this = this ;
                if(!fid){
                    return ;
                }
                AnnouncementCreateApi.getIDraftItemById(fid).then((res) =>{
                    if(res.success){
                        var resBean = res.bean ;
                        if(resBean){
                            _this.formObj = resBean ;
                        }
                    }
                })
            }
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
                        keyWord: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.keyWord
                        }),
                        publishDepartment: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.publishDepartment
                        }),
                        tagIdList: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.tagIdList
                        }),
                    }
                }
            });
        },
        mounted(){
            var _this = this ;
            var routeQuery = this.$route.query ;
            if(routeQuery){
                _this.updateForm.fid = routeQuery.fid ;
                var action = routeQuery.action ;
                if(action == "update"){ //表示 该页面处理的是 公告草稿 更新
                    _this.updateForm.flag = true ;
                    _this.dealRenderDraftToForm(_this.updateForm.fid);
                }
            }
            this.dealGetAllAnnouncementTagList() ;
        },
        watch:{
            formObj: {
                handler (val, oval) {
                    var _this = this ;
                    if(_this.updateForm.flag == true && _this.updateForm.initFlag == false){
                        _this.dealUpdateFormValue(val);
                        _this.updateForm.initFlag = true ;
                    }
                },
                deep: true,
                immediate:true
            }
        },
        destroyed(){
            console.log("创建公告-页面销毁 ...")
        }
    }
</script>
<style scoped>

</style>
