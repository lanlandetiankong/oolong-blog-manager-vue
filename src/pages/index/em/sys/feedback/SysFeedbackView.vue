<template>
    <div>
        <div>
            <!-- 搜索区域 -->
            <query-form-comp
                :ref="ConstantObj.queryFormCompRef"
                :loadingFlag="searchConf.loadingFlag"
                :formItemConf="searchConf.formItemConf"
                @execQuery="handleSearchFormQuery"
            />
            <!-- 操作按钮-区域-->
            <div>
                <a-row
                    :gutter="6"
                    justify="start"
                    type="flex"
                    align="middle"
                >
                    <a-col>
                        <a-button type="primary" icon="plus"
                                  @click="handleCreateByForm">
                            {{$t('langMap.button.actions.addByForm')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button type="primary" icon="edit"
                                  @click="handleUpdateByForm">
                            {{$t('langMap.button.actions.updateByForm')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button type="danger" icon="delete"
                                  @click="handleBatchDeleteByIds">
                            {{$t('langMap.button.actions.batchDelByIds')}}
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <a-divider/>
            <!-- 表格-区域 -->
            <div>
                <table-head-info :checked-size="tableCheckIdList.length"/>
                <a-table
                    :locale="{emptyText:$t('langMap.table.config.emptyData')}"
                    :pagination="tableConf.pagination"
                    :rowKey="item => item.fid"
                    :columns="tableConf.columns"
                    :dataSource="tableConf.data"
                    :loading="searchConf.loadingFlag"
                    :rowSelection="rowSelection"
                    @change="handleTableChange"
                >
                    <span slot="operateTimeRender" slot-scope="text,record,index">
                        {{record.operateTime | formatBaseDateTime}}
                    </span>
                    <obl-table-action slot="action" slot-scope="text,record">
                        <template slot="operates">
                            <table-operate-btn :content="$t('langMap.button.actions.viewOperateRecord')"
                                               icon="unordered-list"
                                               @click="handleViewOperateRecords($event,record)"
                            >
                            </table-operate-btn>
                            <table-operate-btn :content="$t('langMap.results.article.create.success.extra.viewDetail')"
                                               icon="read"
                                               @click="goToViewDetail($event,record)"
                            />
                            <table-delete-operate-btn @click="handleDeleteOneById(record.fid)" />
                            <table-row-detail-operate-btn @click="handleDetailDrawerShow($event,record)" />
                        </template>
                    </obl-table-action>
                </a-table>
            </div>
        </div>
        <!-- 弹窗dom-区域 -->
        <div>
            <sys-feedback-operate-records-comp
                v-if="dialog.viewOperateRecords.visible"
                v-bind="dialog.viewOperateRecords"
                @cancel="()=> this.dialog.viewOperateRecords.visible = false"
                @submit="()=> this.dialog.viewOperateRecords.visible = false"
            />
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.sysFeedback.conf"
                :dataObj="drawerConf.detail.sysFeedback.dataObj"
                :visible="drawerConf.detail.sysFeedback.visible"
                :drawerFieldConf="drawerConf.detail.sysFeedback.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>
<script>
    import {SysFeedbackApi} from './SysFeedbackApi.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum, ConstantObj} from "~Components/constant_define";
    import SysFeedbackOperateRecordsComp from '~Components/index/em/sys/feedback/SysFeedbackOperateRecordsComp';
    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import TableHeadInfo from '~Components/regular/common/table/TableHeadInfo'
    import OblTableAction from '~Components/regular/common/table/OblTableAction'
    import TableOperateBtn from '~Components/regular/common/table/operate/TableOperateBtn'
    import TableDeleteOperateBtn from '~Components/regular/common/table/operate/TableDeleteOperateBtn'
    import TableRowDetailOperateBtn from '~Components/regular/common/table/operate/TableRowDetailOperateBtn'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    import {AllEnum, EnumUtils} from "~Config/selectData";
    import {routerConst} from "~Config/BaseDataConst";
    export default {
        name: "SysFeedbackView",
        components: {
            SysFeedbackOperateRecordsComp,
            QueryFormComp, RowDetailDrawerComp,
            TableHeadInfo,OblTableAction,TableRowDetailOperateBtn,TableOperateBtn,TableDeleteOperateBtn
        },
        mixins: [OblCommonMixin],
        data() {
            const textAlignDefault = 'left';
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                title: {
                    key: 'title',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.em.sysFeedback.title'),
                    decorator: ["title", {rules: []}],
                },
                isFinish: {
                    key: 'isFinish',
                    formType: FormItemTypeEnum.Select,
                    label: this.$t('langMap.table.fields.em.sysFeedback.isFinish'),
                    decorator: ["isFinish", {rules: []}],
                    options:[]
                },
                content: {
                    key: 'content',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.em.sysFeedback.content'),
                    decorator: ["content", {rules: []}],
                },
                typeId: {
                    key: 'typeId',
                    formType: FormItemTypeEnum.TreeSelect,
                    label: this.$t('langMap.table.fields.em.sysFeedback.type'),
                    decorator: ["typeId", {rules: []}],
                    treeDefaultExpandAll:false,
                    treeNodeFilterProp:"title",
                    treeData:[],
                    drawerAble:false
                }
            };
            return {
                ConstantObj,
                binding: {
                    switchEnums:EnumUtils.toSelectData(AllEnum.FlagSwitchEnum),
                    typeIdList:[]
                },
                searchConf: {
                    loadingFlag: false,
                    formItemConf: fieldBaseConf,
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.em.sysFeedback.isFinish'),
                        align: textAlignDefault,
                        dataIndex: 'isFinishStr',
                        key: 'isFinishStr'
                    },{
                        title: this.$t('langMap.table.fields.em.sysFeedback.title'),
                        align: textAlignDefault,
                        dataIndex: 'title',
                        key: 'title'
                    }, {
                        title: this.$t('langMap.table.fields.em.sysFeedback.authorName'),
                        align: textAlignDefault,
                        dataIndex: 'authorName',
                        key: 'authorName'
                    }, {
                        title: this.$t('langMap.table.fields.em.sysFeedback.content'),
                        align: textAlignDefault,
                        dataIndex: 'shortContent',
                        key: 'shortContent'
                    }, {
                        title: this.$t('langMap.table.fields.em.sysFeedback.type'),
                        align: textAlignDefault,
                        dataIndex: 'typeName',
                        key: 'typeName'
                    },  {
                        title: this.$t('langMap.table.fields.em.sysFeedback.operateUserName'),
                        align: textAlignDefault,
                        dataIndex: 'operateUserName',
                        key: 'operateUserName'
                    },   {
                        title: this.$t('langMap.table.fields.em.sysFeedback.operateProgress'),
                        align: textAlignDefault,
                        dataIndex: 'operateProgress',
                        key: 'operateProgress'
                    }, {
                        title: this.$t('langMap.table.fields.em.sysFeedback.operateTime'),
                        align: textAlignDefault,
                        dataIndex: 'operateTime',
                        key: 'operateTime',
                        scopedSlots: { customRender: 'operateTimeRender' }
                    },  {
                        title: this.$t('langMap.table.fields.em.sysFeedback.editorType'),
                        align: textAlignDefault,
                        dataIndex: 'editorTypeStr',
                        key: 'editorTypeStr'
                    }, {
                        title: this.$t('langMap.table.fields.common.weights'),
                        align: textAlignDefault,
                        dataIndex: 'weights',
                        key: 'weights',
                        sorter:true
                    }, {
                        title: this.$t('langMap.table.fields.common.remark'),
                        align: textAlignDefault,
                        dataIndex: 'remark',
                        key: 'remark'
                    }, {
                        title: this.$t('langMap.table.header.operation'),
                        align: textAlignDefault,
                        dataIndex: "operation",
                        key: 'operation',
                        fixed: 'right',
                        width: 220,
                        scopedSlots: {customRender: 'action'}
                    }],
                    pagination: {
                        current: 1,
                        pageSize: 10,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showQuickJumper: false,
                        showSizeChanger: true,
                        total: 0,
                        showTotal(total, range) {
                            return `${range[0]}-${range[1]} of ${total} items`;
                        }
                    },
                    filters: {},
                    sorter: {}
                },
                tableCheckIdList: [],
                dialogFormConf: {
                    visible: false,
                    actionType: "create"
                },
                dialogFormObj: {
                    name: '',
                    key:'',
                    value:'',
                    weights: 0
                },
                drawerConf: {
                    detail: {
                        sysFeedback: {
                            conf: {
                                title: this.$t('langMap.drawer.em.title.detailForSysFeedback'),
                            },
                            visible: false,
                            dataObj: {},
                            drawerFieldConf: fieldBaseConf
                        },
                    },
                },
                dialog:{
                    viewOperateRecords:{
                        visible: false,
                        formObj:{}
                    },
                }
            }
        },
        computed: {
            rowSelection() {    //行选择
                return {
                    selectedRowKeys: this.tableCheckIdList,
                    onChange: (selectedRowKeys, selectedRows) => {  //勾选 修改事件
                        this.tableCheckIdList = selectedRowKeys;
                    },
                    getCheckboxProps: record => ({  //选择框的默认属性配置
                        props: {
                            name: record.fid
                        }
                    }),
                };
            }
        },
        methods: {
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.sysFeedbackCreateFormRef.createForm;
            },
            changeQueryLoading(loadingFlag) {   //修改[表格搜索]是否在 加载状态中
                if (typeof loadingFlag == "undefined" || loadingFlag == null) {
                    loadingFlag = false;
                }
                this.searchConf.loadingFlag = loadingFlag;
            },
            dealGetAllTypeTree() {    //取得所有的 类型-树
                var _this = this;
                SysFeedbackApi.queryTypeTree().then((res) => {
                    if (res.success) {
                        _this.binding.typeIdList = res.gridList;
                    }
                })
            },
            dealBatchDeleteByIds() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                SysFeedbackApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                SysFeedbackApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            handleTransformData(){//数据转化
                let _this = this ;
                const data = this.tableConf.data;
                if(!data){
                    return ;
                }
                //Map-模块类型
                let feedbackEditorTypeValMap = EnumUtils.toValMap(AllEnum.FeedBackEditorTypeEnum);
                let flagSwitchValMap = EnumUtils.toValMap(AllEnum.FlagSwitchEnum);
                for (let idx in data){
                    let item = data[idx] ;
                    //枚举值
                    item['editorTypeStr'] = feedbackEditorTypeValMap[item.editorType] ;
                    item['isFinishStr'] = flagSwitchValMap[item.isFinish] ;
                }
            },
            handleSearchFormQuery(e, values) {   //带查询条件 检索【系统反馈】列表
                var _this = this;
                _this.changeQueryLoading(true);
                SysFeedbackApi.getPageQuery(values, _this.tableConf).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total;
                    //清空 已勾选
                    _this.tableCheckIdList = [];
                    _this.handleTransformData();
                    _this.changeQueryLoading(false);
                }).catch((e) => {
                    _this.changeQueryLoading(false);
                })
            },
            handleCreateByForm() {     //新增按钮-点击
                var _this = this;
                _this.dialogFormConf.visible = true;   //显示弹窗
                _this.dialogFormConf.actionType = "create";
                _this.dialogFormObj = {};
            },
            handleUpdateByForm() {  //更新按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        SysFeedbackApi.getItemById(selectRowId).then((res) => {
                            var selectUserBean = res.bean;
                            if (selectUserBean) {
                                _this.dialogFormConf.visible = true;   //显示弹窗
                                _this.dialogFormConf.actionType = "update";
                                _this.dialogFormObj = selectUserBean;
                                //console.log(_this.dialogFormObj);
                            }
                        })
                    } else {
                        this.$message.warning(this.$t('langMap.message.error.failedDueToNotGettingId'));
                    }
                }
            },
            handleBatchDeleteByIds(e) {     // 批量删除
                var _this = this;
                var selectDelIds = _this.tableCheckIdList;
                if (selectDelIds.length < 1) {
                    _this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForDelete'));
                } else {
                    _this.$confirm({
                        content: _this.$t('langMap.message.confirm.isConfirmDeleteWhatSelectedRow', [selectDelIds.length]),
                        okText: _this.$t('langMap.button.actions.confirm'),
                        cancelText: _this.$t('langMap.button.actions.cancel'),
                        onOk() {
                            _this.dealBatchDeleteByIds();
                        },
                        onCancel() {
                            _this.$message.info(_this.$t('langMap.message.info.actionOfCancelDelete'));
                        }
                    })
                }
            },
            handleDeleteOneById(delId) {     //删除指定行
                var _this = this;
                if (delId) {
                    _this.$confirm({
                        content: this.$t('langMap.message.confirm.isConfirmDeleteSelectedRow'),
                        okText: _this.$t('langMap.button.actions.confirm'),
                        cancelText: _this.$t('langMap.button.actions.cancel'),
                        onOk() {
                            _this.dealDelOneRowById(delId);
                        },
                        onCancel() {
                            _this.$message.info(_this.$t('langMap.message.info.actionOfCancelDelete'));
                        }
                    })
                } else {
                    _this.$message.warning(_this.$t('langMap.message.warning.invalidDeleteOperation'));
                }
            },
            handleTableChange(pagination, filters, sorter) {    //表格变动-页码跳转/排序/筛选
                this.tableConf.pagination = pagination;
                this.tableConf.filters = filters;
                this.tableConf.sorter = sorter;
                this.mixin_invokeQuery(this);
            },
            handleDetailDrawerShow(e, record) {   //Drawer-详情展示
                if (typeof record != "undefined") {
                    this.drawerConf.detail.sysFeedback.dataObj = record;
                    this.drawerConf.detail.sysFeedback.visible = true;
                } else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e) { //Drawer-详情关闭
                this.drawerConf.detail.sysFeedback.visible = false;
            },
            goToViewDetail(e,record) {
                let params = {
                    fid:record.fid
                } ;
                this.mixin_jump(routerConst.feedback.display,params);
            },
            handleViewOperateRecords(e,record){   //查看操作记录
                this.dialog.viewOperateRecords.formObj = record;
                this.dialog.viewOperateRecords.visible = true ;
            },
        },
        watch: {
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.isFinish.options = this.binding.switchEnums ;
                    this.searchConf.formItemConf.typeId.treeData = this.binding.typeIdList ;
                },
                deep: true,
                immediate:true
            }
        },
        created() {
            this.dealGetAllTypeTree();
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed() {
            console.log("系统反馈-页面销毁 ...")
        }
    }
</script>
<style>

</style>
