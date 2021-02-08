<template>
    <div>
        <div>
            <!-- 搜索区域 -->
            <query-form-comp
                :ref="ConstantObj.queryFormCompRef"
                :showAble="searchConf.showAble"
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
                    <a-col>
                        <a-switch
                            size="large"
                            v-model="searchConf.showAble"
                        >
                            <a-icon slot="checkedChildren" type="filter"/>
                            <a-icon slot="unCheckedChildren" type="eye-invisible"/>
                        </a-switch>
                    </a-col>
                </a-row>
            </div>
            <a-divider/>
            <!-- 表格-区域 -->
            <div>
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
                    <span slot="typeStr" slot-scope="record">
                        <a-tag color="blue" :key="record.typeStr">
                            {{record.typeStr}}
                        </a-tag>
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
            <announcement-tag-create-form-comp
                ref="announcementTagCreateFormRef"
                :visible="dialogFormConf.visible"
                :formObj="dialogFormObj"
                :actionType="dialogFormConf.actionType"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            >
            </announcement-tag-create-form-comp>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.announcementTag.conf"
                :dataObj="drawerConf.detail.announcementTag.dataObj"
                :visible="drawerConf.detail.announcementTag.visible"
                :drawerFieldConf="drawerConf.detail.announcementTag.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>
<script>
    import {AnnouncementTagApi} from './announcementTagApi.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum, ConstantObj} from "~Components/constant_define";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import AnnouncementTagCreateFormComp from "~Components/index/em/announcement/tag/AnnouncementTagCreateFormComp";
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';

    export default {
        name: "AnnouncementTagView",
        components: {QueryFormComp, AnnouncementTagCreateFormComp, RowDetailDrawerComp},
        mixins: [OblCommonMixin],
        data() {
            const textAlignDefault = 'left';
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                name: {
                    key: 'name',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.common.tagName'),
                    decorator: ["name", {rules: []}],
                },
                description: {
                    key: 'description',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.common.description'),
                    decorator: ["description", {rules: []}],
                },
                weights: {
                    label: this.$t('langMap.table.fields.common.weights'),
                    key: 'weights',searchAble:false
                },
                remark: {
                    key: 'remark',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.common.remark'),
                    decorator: ["title", {rules: []}],
                }
            };
            return {
                ConstantObj,
                binding: {},
                searchConf: {
                    showAble: false,
                    loadingFlag: false,
                    formItemConf: fieldBaseConf
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.em.announcementTag.tagName'),
                        align: textAlignDefault,
                        dataIndex: 'name',
                        key: 'name'
                    }, {
                        title: this.$t('langMap.table.fields.em.announcementTag.description'),
                        align: textAlignDefault,
                        dataIndex: 'description',
                        key: 'description',
                    }, {
                        title: this.$t('langMap.table.fields.common.weights'),
                        align: textAlignDefault,
                        dataIndex: 'weights',
                        key: 'weights'
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
                    description: '',
                    weights: 0
                },
                drawerConf: {
                    detail: {
                        announcementTag: {
                            conf: {
                                title: this.$t('langMap.drawer.em.title.detailForAnnouncementTag'),
                            },
                            visible: false,
                            dataObj: {},
                            drawerFieldConf: fieldBaseConf
                        },
                    },
                },
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
                return this.$refs.announcementTagCreateFormRef.createForm;
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
                AnnouncementTagApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                AnnouncementTagApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            handleSearchFormQuery(e, values) {   //带查询条件 检索公告标签列表
                var _this = this;
                _this.changeQueryLoading(true);
                AnnouncementTagApi.getPageQuery(values, _this.tableConf).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total;
                    //清空 已勾选
                    _this.tableCheckIdList = [];
                    _this.changeQueryLoading(false);
                }).catch((e) => {
                    _this.changeQueryLoading(false);
                })
            },
            handleCreateByForm() {     //新增公告标签按钮-点击
                var _this = this;
                _this.dialogFormConf.visible = true;   //显示弹窗
                _this.dialogFormConf.actionType = "create";
                _this.dialogFormObj = {};
            },
            handleUpdateByForm() {  //更新公告标签按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        AnnouncementTagApi.getItemById(selectRowId).then((res) => {
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
                            _this.$message.info(_this.$t('langMap.message.account.actionOfCancelDelete'));
                        }
                    })
                }
            },
            handleCreateFormCancel(e) {  // 创建/更新 公告标签定义表单->取消
                var _this = this;
                _this.dialogFormConf.visible = false;
            },
            handleCreateFormSubmit(e) {   // 创建/更新 公告标签表单->提交
                var _this = this;
                const dialogFormObj = _this.dealGetDialogRefFormObj();
                dialogFormObj.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    var closeDialogFlag = true;
                    if (_this.dialogFormConf.actionType == "create") {        //新建-提交
                        AnnouncementTagApi.createByForm(values).then((res) => {
                            if (res.success) {  //异常已经有预处理了
                                this.$message.success(res.msg);
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
                        AnnouncementTagApi.updateByForm(values).then((res) => {
                            if (res.success) {  //异常已经有预处理了
                                this.$message.success(res.msg);
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
                            _this.$message.info(_this.$t('langMap.message.account.actionOfCancelDelete'));
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
            handleDetailDrawerShow(e, record) {   //Drawer-公告标签 详情展示
                if (typeof record != "undefined") {
                    this.drawerConf.detail.announcementTag.dataObj = record;
                    this.drawerConf.detail.announcementTag.visible = true;
                } else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e) { //Drawer-公告标签 详情关闭
                this.drawerConf.detail.announcementTag.visible = false;
            }
        },
        watch: {},
        created() {
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed() {
            console.log("公告标签-页面销毁 ...")
        }
    }
</script>
<style>

</style>
