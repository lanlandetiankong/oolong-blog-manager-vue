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
                    :bordered="tableConf.bordered"
                    :columns="tableConf.columns"
                    :dataSource="tableConf.data"
                    :loading="searchConf.loadingFlag"
                    :scroll="tableConf.scroll"
                    :rowSelection="rowSelection"
                    @change="handleTableChange"
                >
                    <span slot="iconRender" slot-scope="text,record">
                            <span :key="record.fid"
                                  v-show="typeof record.iconName != 'undefined' && record.iconName != null && record.iconName.length > 0">
                                 <a-icon :type="record.iconName"/>
                            </span>
                    </span>
                    <template slot="action" slot-scope="text,record">
                        <span>
                            <a @click="handleDetailDrawerShow($event,record)">
                                {{$t('langMap.drawer.actions.detail')}}
                            </a>
                            <a-divider type="vertical"/>
                            <a-button type="danger" size="small" @click="handleDeleteOneById(record.fid)">{{$t('langMap.button.actions.delById')}}</a-button>
                        </span>
                    </template>
                </a-table>
            </div>
        </div>
        <!-- 弹窗dom-区域 -->
        <div>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.articleCategory.conf"
                :dataObj="drawerConf.detail.articleCategory.dataObj"
                :visible="drawerConf.detail.articleCategory.visible"
                :drawerFieldConf="drawerConf.detail.articleCategory.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
            <obl-article-category-create-form-comp
                v-if="dialogFormConf.initFlag"
                ref="oblArticleCategoryCreateFormRef"
                :visible="dialogFormConf.visible"
                :formObj="dialogFormObj"
                :actionType="dialogFormConf.actionType"
                :parentSelectTrees="binding.pidList"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            />
        </div>
    </div>
</template>
<script>
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {OblArticleCategoryApi} from './OblArticleCategoryApi.js'
    import {ConstantObj, FormItemTypeEnum} from "~Components/constant_define";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import TableHeadInfo from '~Components/regular/common/table/TableHeadInfo'
    import OblArticleCategoryCreateFormComp from "~Components/index/obl/article/category/OblArticleCategoryCreateFormComp";
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';

    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ACol from "ant-design-vue/es/grid/Col";

    export default {
        name: "OblArticleCategoryView",
        components: {QueryFormComp, OblArticleCategoryCreateFormComp,TableHeadInfo, RowDetailDrawerComp, ACol, AFormItem},
        mixins: [OblCommonMixin],
        data() {
            const textAlignDefault = 'left';
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                name: {
                    key: 'name',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.obl.articleCategory.name'),
                    decorator: ["name", {rules: []}],
                },
                pid: {
                    key: 'pid',
                    formType: FormItemTypeEnum.TreeSelect,
                    label: this.$t('langMap.table.fields.obl.articleCategory.parentName'),
                    decorator: ["pid", {rules: []}],
                    treeDefaultExpandAll: false,
                    treeNodeFilterProp: "title",
                    treeData: [],
                    drawerAble:false
                },
                description: {
                    key: 'description',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.common.description'),
                    decorator: ["description", {rules: []}],
                },
                remark: {
                    key: 'remark',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.common.remark'),
                    decorator: ["remark", {rules: []}],
                }
            };
            return {
                ConstantObj,
                binding: {
                    pidList: []
                },
                searchConf: {
                    loadingFlag: false,
                    formItemConf: fieldBaseConf
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.obl.articleCategory.name'),
                        align: textAlignDefault,
                        dataIndex: 'name',
                        key: 'name',
                        width: 110,
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleCategory.parentName'),
                        align: textAlignDefault,
                        dataIndex: 'parentName',
                        key: 'parentName',
                        width: 110,
                    }, {
                        title: this.$t('langMap.table.fields.common.description'),
                        align: textAlignDefault,
                        dataIndex: 'description',
                        key: 'description',
                        width: 160,
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleCategory.iconName'),
                        align: textAlignDefault,
                        dataIndex: 'iconName',
                        key: 'iconName',
                        scopedSlots: {
                            customRender: 'iconRender'
                        },
                        width: 40
                    }, {
                        title: this.$t('langMap.table.fields.common.level'),
                        align: textAlignDefault,
                        dataIndex: 'level',
                        key: 'level',
                        width: 40
                    }, {
                        title: this.$t('langMap.table.fields.common.weights'),
                        align: textAlignDefault,
                        dataIndex: 'weights',
                        key: 'weights',
                        width: 60
                    }, {
                        title: this.$t('langMap.table.header.operation'),
                        align: textAlignDefault,
                        dataIndex: "operation",
                        fixed: 'right',
                        key: 'operation',
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
                    sorter: {},
                    scroll: {
                        x: 1400
                    },
                    bordered: true
                },
                tableCheckIdList: [],
                tableCheckRowList: [],
                dialogFormConf: {
                    initFlag: false,
                    visible: false,
                    actionType: "create"
                },
                dialogFormObj: {
                    name: '',
                    pid: '',
                    weights: 0,
                    iconName: '',
                    style: '',
                },
                drawerConf: {
                    detail: {
                        articleCategory: {
                            conf: {
                                title: this.$t('langMap.drawer.obl.title.detailForOblArticleCategory'),
                            },
                            visible: false,
                            dataObj: {},
                            drawerFieldConf: fieldBaseConf
                        },
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
                        this.tableCheckRowList = selectedRows;
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
            dealGetPidTreeData() {  //取得-树形数据
                var _this = this;
                OblArticleCategoryApi.getTreeDataAll().then((res) => {
                    if (res.success) {
                        _this.binding.pidList = res.gridList;
                    }
                })
            },
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.oblArticleCategoryCreateFormRef.createForm;
            },
            changeQueryLoading(loadingFlag) {   //修改[表格搜索]是否在 加载状态中
                if (typeof loadingFlag == "undefined" || loadingFlag == null) {
                    loadingFlag = false;
                }
                this.searchConf.loadingFlag = loadingFlag;
            },
            dealBatchDeleteByIds() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                OblArticleCategoryApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                OblArticleCategoryApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            handleSearchFormQuery(e, values) {   //带查询条件 检索列表
                var _this = this;
                _this.changeQueryLoading(true);
                OblArticleCategoryApi.getPageQuery(values, _this.tableConf).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total;
                    //清空 已勾选
                    _this.tableCheckIdList = [];
                    _this.tableCheckRowList = [];
                    _this.changeQueryLoading(false);
                }).catch((e) => {
                    _this.changeQueryLoading(false);
                })
            },
            handleCreateByForm() {     //新增按钮-点击
                var _this = this;
                _this.dialogFormConf.initFlag = true;  //弹窗初始化
                _this.dialogFormConf.visible = true;   //显示弹窗
                _this.dialogFormConf.actionType = "create";
                _this.dialogFormObj = {
                    weights: 0
                };
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
                        OblArticleCategoryApi.getItemById(selectRowId).then((res) => {
                            var selectUserBean = res.bean;
                            if (selectUserBean) {
                                _this.dialogFormConf.initFlag = true;  //弹窗初始化
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
            handleCreateFormCancel(e) {  // 创建/更新->取消
                var _this = this;
                _this.dialogFormConf.visible = false;
            },
            handleCreateFormSubmit(e) {   // 创建/更新->提交
                var _this = this;
                const dialogFormObj = _this.dealGetDialogRefFormObj();
                dialogFormObj.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    var closeDialogFlag = true;
                    if (_this.dialogFormConf.actionType == "create") {        //新建-提交
                        OblArticleCategoryApi.createByForm(values).then((res) => {
                            if (res.success) {  //异常已经有预处理了
                                _this.$message.success(res.msg);
                                _this.mixin_invokeQuery(_this); //表格重新搜索
                            } else {
                                closeDialogFlag = false;
                            }

                            if (closeDialogFlag == true) {    //关闭弹窗
                                dialogFormObj.resetFields();
                                _this.dialogFormConf.visible = false;
                            }
                        })
                    } else if (_this.dialogFormConf.actionType == "update") {   //更新-提交
                        values['fid'] = _this.dialogFormObj.fid;   //提交时，回填fid值
                        OblArticleCategoryApi.updateByForm(values).then((res) => {
                            if (res.success) {  //异常已经有预处理了
                                _this.$message.success(res.msg);
                                _this.mixin_invokeQuery(_this); //表格重新搜索
                            } else {
                                closeDialogFlag = false;
                            }
                            if (closeDialogFlag == true) {    //关闭弹窗
                                dialogFormObj.resetFields();
                                _this.dialogFormConf.visible = false;
                            }
                        })
                    }
                });
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
            handleParentTreeOfSearchChange(value) {  //[上级] SelectTree cchange事件
                console.log("handleParentTreeOfSearchChange", value);
            },
            handleDetailDrawerShow(e, record) {   //Drawer-详情展示
                if (typeof record != "undefined") {
                    this.drawerConf.detail.articleCategory.dataObj = record;
                    this.drawerConf.detail.articleCategory.visible = true;
                } else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e) { //Drawer-详情关闭
                this.drawerConf.detail.articleCategory.visible = false;
            }
        },
        watch: {
            binding: {
                handler(val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.pid.treeData = this.binding.pidList;
                    console.log(this.searchConf.formItemConf.pid.treeData);
                },
                deep: true,
                immediate: true
            }
        },
        created() {
            this.dealGetPidTreeData();
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed() {
            console.log("文章类别管理-页面销毁 ...");
        }
    }
</script>

<style scoped>

</style>
