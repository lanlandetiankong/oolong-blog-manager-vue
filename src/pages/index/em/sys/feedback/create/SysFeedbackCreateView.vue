<template>
    <div>
        <div v-show="rstConf.current == rstConf.status.theDefault">
            <a-row type="flex">
                <a-col span="auto">
                    <a-button-group>
                        <a-button v-if="stepConf.current > 0"
                                  @click="goPreviousStep"
                        > {{$t('langMap.button.actions.goPreviousStep')}}
                            <a-icon type="left"/>
                        </a-button>
                        <a-button type="primary"
                                  v-if="stepConf.current < Object.keys(stepConf.steps).length - 1"
                                  @click="goNextStep"
                        >
                            <a-icon type="right"/>
                            {{$t('langMap.button.actions.goNextStep')}}
                        </a-button>
                    </a-button-group>
                </a-col>
            </a-row>
            <a-row>
                <a-steps :current="stepConf.current" type="navigation" size="small" :style="stepConf.stepStyle">
                    <a-step v-for="(item,index) in stepConf.steps" :key="index" :title="item.title"
                            :description="item.description" :subTitle="item.subTitle"/>
                </a-steps>
            </a-row>
            <!-- Step-基本/写 -->
            <a-row v-show="currentStepKey == stepConf.steps.basic.key">
                <a-col :span="22">
                    <a-input allowClear size="large"
                             :addonBefore="$t('langMap.table.fields.common.title')"
                             v-model="formObj.title"
                    />
                </a-col>
            </a-row>
            <!-- Step-更多 -->
            <a-form
                layout="vertical"
                :form="createForm"
                v-show="currentStepKey == stepConf.steps.more.key"
            >
                <a-row :gutter="16"
                       :type="formLayout.row.type">
                    <a-col :span="18">
                        <a-form-item :label="$t('langMap.table.fields.common.category')">
                            <a-tree-select
                                :placeholder="$t('langMap.commons.forms.pleaseChoose')"
                                showSearch allowClear
                                v-decorator="formFieldConf.typeIdList"
                                :treeNodeFilterProp="treeSelectConf.categoryId.treeNodeFilterProp"
                                :treeDefaultExpandAll="treeSelectConf.categoryId.treeDefaultExpandAll"
                                :treeData="bindData.typeIdList"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <div v-show="currentStepKey == stepConf.steps.basic.key">
                <mavon-editor
                    v-bind="editorConf"
                    v-model="formObj.originContent"
                    @change="handleContentChange"
                    @save="handleCreateByForm"
                />
            </div>
            <a-row type="flex" justify="center" align="middle">
                <a-col span="auto">
                    <a-button-group v-show="currentStepKey == stepConf.steps.done.key">
                        <a-button size="large" icon="inbox"
                                  @click="handleCreateDraftByForm"
                        >{{$t('langMap.button.actions.saveAsDraft')}}
                        </a-button>
                        <a-button size="large" type="primary" icon="check"
                                  @click="handleCreateByForm"
                        >{{$t('langMap.button.actions.publish')}}
                        </a-button>
                    </a-button-group>
                </a-col>
            </a-row>
        </div>
        <!-- Result Dom Write Here -->
        <div class="result">
            <!-- Dom-操作成功 -->
            <div v-show="rstConf.current == rstConf.status.success">
                <a-result
                    status="success"
                    :title="$t('langMap.results.universal.success.title')"
                >
                    <template #extra>
                        <a-button key="console" type="primary" @click="goToViewDetail">
                            {{$t('langMap.results.feedback.create.success.extra.viewDetail')}}
                        </a-button>
                    </template>
                </a-result>
            </div>
            <!-- Dom-操作失败 -->
            <div v-show="rstConf.current == rstConf.status.failure">
                <a-result status="500"
                          :title="$t('langMap.results.universal.failure.title')"
                          :sub-title="$t('langMap.results.universal.failure.extra.serverError')">
                    <template #extra>
                        <a-button type="primary" @click="changeRstStatusToDefault">
                            {{$t('langMap.results.feedback.create.failure.extra.retry')}}
                        </a-button>
                    </template>
                </a-result>
            </div>
        </div>
    </div>
</template>

<script>
    import {routerConst} from '~Config/BaseDataConst.js'
    import {toolbars} from '~Config/editor/mavon_editor/mavon.conf'
    import {SysFeedbackCreateApi} from './SysFeedbackCreateApi.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';

    export default {
        name: "SysFeedbackCreateView",
        mixins: [OblCommonMixin],
        data() {
            //form验证规则
            const paramsRules = {
                typeIdList: [
                    {
                        required: true,
                        message: this.$t('langMap.commons.forms.pleaseSelect', [this.$t('langMap.table.fields.common.category')])
                    }
                ]
            };
            //A-Result(
            const rstStatus = {
                theDefault: 'theDefault',
                success: 'success',
                failure: 'failure'
            };
            //A-Steps(为了保证可以通过key作为判断条件，且避免由于Object不能保证keys的插入顺序而带来的异常，先定义在Map，再转Object到data)
            const stepConstMap = new Map();
            stepConstMap.set("basic", this.$t('langMap.steps.feedback.create.basic'));
            stepConstMap.set("more", this.$t('langMap.steps.feedback.create.more'));
            stepConstMap.set("done", this.$t('langMap.steps.feedback.create.done'));
            let stepConst = Object.fromEntries(stepConstMap);
            return {
                rstConf: {
                    current: rstStatus.theDefault,
                    status: rstStatus,
                    bean: {}
                },
                stepConf: {
                    current: 0,
                    steps: stepConst,
                    stepsMap: stepConstMap,
                    stepStyle: {
                        marginBottom: '20px',
                        boxShadow: '0px -1px 0 0 #e8e8e8 inset',
                    }
                },
                createForm: {},
                updateForm: {
                    flag: false,
                    fid: '',
                    initFlag: false
                },
                formLayout: {
                    row: {
                        type: "flex"
                    },
                    defaultColSpan: 8,
                    dblColSpan: 12,
                },
                bindData: {
                    typeIdList: [],
                },
                formFieldConf: {
                    typeIdList: ["typeIdList", {rules: paramsRules.typeIdList}],
                },
                editorConf: {
                    toolbars
                },
                formObj: {
                    title: '',
                    content: '',
                    originContent: '',
                    typeIdList: undefined,
                },
                treeSelectConf: {
                    categoryId: {
                        treeDefaultExpandAll: true,
                        treeNodeFilterProp: "title",
                    }
                }
            }
        },
        computed: {
            currentStepKey() {
                const arr = this.currentStepArr;
                return arr[this.stepConf.current];
            },
            currentStepArr() {
                if (!this.stepConf.stepsMap) {
                    return [];
                }
                return Array.from(this.stepConf.stepsMap.keys());
            }
        },
        methods: {
            goPreviousStep() {
                //上一步
                this.stepConf.current--;
            },
            goNextStep() {
                //下一步
                var _this = this;
                let currentKey = this.currentStepKey;
                //验证
                if (currentKey == _this.stepConf.steps.basic.key) {
                    let flag = (_this.formObj.title && _this.formObj.content && _this.formObj.originContent) ? true : false;
                    if (!flag) {
                        _this.$message.warning(_this.$t('langMap.commons.forms.pleaseFillOutTwo', [_this.$t('langMap.table.fields.em.sysFeedback.title'), _this.$t('langMap.table.fields.em.sysFeedback.content')]));
                        return;
                    }
                }
                if (currentKey == this.stepConf.steps.more.key) {
                    let flag = true;
                    _this.createForm.validateFields((err, values) => {
                        if (err) {
                            flag = false;
                        }
                    });
                    if (!flag) {
                        _this.$message.warning(_this.$t('langMap.commons.forms.pleaseFillOut', [_this.$t('langMap.table.fields.common.tag')]));
                        return;
                    }
                }
                if (currentKey == this.stepConf.steps.done.key) {
                    //最终步骤，next不会到这里，不拦截
                }
                this.stepConf.current++;
            },
            changeRstStatusToDefault(){
                this.rstConf.current = this.rstConf.status.theDefault;
            },
            changeRstStatus(val) {
                //修改结果状态
                if (typeof val == "undefined" || val == null) {
                    this.rstConf.current = this.rstConf.status.theDefault;
                } else {
                    if (typeof val == "string") {
                        this.rstConf.current = val;
                    } else if (typeof val == "boolean") {
                        this.rstConf.current = (val == true) ? this.rstConf.status.success : this.rstConf.status.failure;
                    }
                }
            },
            dealUpdateFormValue(formObj) {   //form表单更新
                var _this = this;
                if (typeof _this.createForm.updateFields != "undefined") { //避免未初始化form的时候就调用了updatefield
                    _this.createForm.updateFields({
                        typeIdList: _this.$form.createFormField({
                            ...formObj,
                            value: formObj.typeIdList,
                        })
                    });
                }
            },
            dealGetAllCategoryTree() {    //取得所有的 文章分类
                var _this = this;
                SysFeedbackCreateApi.queryTypeTree().then((res) => {
                    if (res.success) {
                        _this.bindData.typeIdList = res.gridList;
                    }
                })
            },
            handleContentChange(value, render) {
                //render: value 经过markdown解析后的结果
                this.formObj.content = render;
            },
            dealCheckSubmitAble() {  //判断是否可以 创建
                var _this = this;
                let tempTitle = _this.formObj.title;
                let tempContent = _this.formObj.content;
                let tempOriginContent = _this.formObj.originContent;
                if (tempTitle.length == 0 || tempContent.length == 0 || tempOriginContent.length == 0) {
                    return false;
                }
                return true;
            },
            dealFormValuesMapToObj(values) {
                var formObjTemp = this.formObj;
                if (values) {
                    formObjTemp['typeIdList'] = values.typeIdList;
                }
                return formObjTemp;
            },
            //确认发表博文
            handleCreateByForm(e) {
                var _this = this;
                //验证是否未编辑
                let submitAble = this.dealCheckSubmitAble();
                if (submitAble == false) {
                    _this.$message.warning(_this.$t('langMap.commons.forms.pleaseFillOutTwo', [_this.$t('langMap.table.fields.em.sysFeedback.title'), _this.$t('langMap.table.fields.em.sysFeedback.content')]));
                    return false;
                } else {
                    //取得请求的参数：标题&内容、用户信息
                    _this.createForm.validateFields((err, values) => {
                        if (!err) {
                            _this.formObj = _this.dealFormValuesMapToObj(values);
                            if (_this.updateForm.flag == true) {  //发布 更新后的 文章草稿
                                SysFeedbackCreateApi.createFromDraft(_this.formObj).then((res) => {
                                    if (res.success) {
                                        _this.$message.success(res.msg);
                                        _this.rstConf.bean = res.bean;
                                    } else {
                                        _this.rstConf.bean = {};
                                    }
                                    _this.changeRstStatus(res.success);
                                })
                            } else {   //直接发布
                                SysFeedbackCreateApi.createByForm(_this.formObj).then((res) => {
                                    if (res.success) {
                                        _this.$message.success(res.msg);
                                        _this.rstConf.bean = res.bean;
                                    } else {
                                        _this.rstConf.bean = {};
                                    }
                                    _this.changeRstStatus(res.success);
                                })
                            }
                        }
                    });
                }
            },
            handleCreateDraftByForm() {    //存储为草稿
                var _this = this;
                //验证是否未编辑
                let isCreateAble = this.dealCheckSubmitAble();
                if (isCreateAble == false) {
                    _this.$message.warning(_this.$t('langMap.commons.forms.pleaseFillOutTwo', [_this.$t('langMap.table.fields.em.sysFeedback.title'), _this.$t('langMap.table.fields.em.sysFeedback.content')]));
                    return false;
                } else {
                    //取得请求的参数：标题&内容、用户信息
                    this.createForm.validateFields((err, values) => {
                        if (!err) {
                            _this.formObj = _this.dealFormValuesMapToObj(values);
                            if (_this.updateForm.flag == true) {  //更新文章草稿
                                SysFeedbackCreateApi.updateDraftByForm(_this.formObj).then((res) => {
                                    if (res.success) {
                                        _this.$message.success(res.msg);
                                        _this.rstConf.bean = res.bean;
                                    } else {
                                        _this.rstConf.bean = {};
                                    }
                                    _this.changeRstStatus(res.success);
                                })
                            } else {  //添加到 草稿
                                SysFeedbackCreateApi.createDraftByForm(_this.formObj).then((res) => {
                                    if (res.success) {
                                        _this.$message.success(res.msg);
                                        _this.rstConf.bean = res.bean;
                                    } else {
                                        _this.rstConf.bean = {};
                                    }
                                    _this.rstConf.bean = res.bean;
                                    _this.changeRstStatus(res.success);
                                })
                            }
                        }
                    });
                }
            },
            dealRenderDraftToForm(fid) {
                var _this = this;
                if (!fid) {
                    return;
                }
                SysFeedbackCreateApi.getIDraftItemById(fid).then((res) => {
                    if (res.success) {
                        _this.formObj = res.bean;
                    }
                })
            },
            goToViewDetail() {
                if (typeof this.rstConf.bean == 'undefined' || this.rstConf.bean == null) {
                    return;
                }
                if (!this.rstConf.bean.fid) {
                    return;
                }
                var params = {
                    fid: this.rstConf.bean.fid
                };
                this.mixin_closeTagAndJump(routerConst.feedback.display,params);
            },
        },
        created() {
            var _this = this;
            _this.createForm = this.$form.createForm(_this, {
                name: 'createForm',
                onFieldsChange: (theProps, values) => {
                    this.$emit('change', values);
                },
                mapPropsToFields: () => {
                    //console.log(_this.formObj);
                    return {
                        typeIdList: this.$form.createFormField({
                            ..._this.formObj,
                            value: _this.formObj.typeIdList
                        }),
                    }
                }
            });
        },
        mounted() {
            var _this = this;
            var routeQuery = this.$route.query;
            if (routeQuery) {
                _this.updateForm.fid = routeQuery.fid;
                var action = routeQuery.action;
                if (action == "update") { //表示 该页面处理的是 文章草稿 更新
                    _this.updateForm.flag = true;
                    _this.dealRenderDraftToForm(_this.updateForm.fid);
                }
            }
            this.dealGetAllCategoryTree();
        },
        watch: {
            formObj: {
                handler(val, oval) {
                    var _this = this;
                    if (_this.updateForm.flag == true && _this.updateForm.initFlag == false) {
                        _this.dealUpdateFormValue(val);
                        _this.updateForm.initFlag = true;
                    }
                },
                deep: true,
                immediate: true
            }
        },
    }
</script>

<style scoped>

</style>
