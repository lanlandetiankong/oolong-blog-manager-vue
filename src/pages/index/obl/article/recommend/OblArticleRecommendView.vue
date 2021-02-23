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
                <a-table
                    :locale="{emptyText:$t('langMap.table.config.emptyData')}"
                    :pagination="tableConf.pagination"
                    :rowKey="item => item.fid"
                    :columns="tableConf.columns"
                    :dataSource="tableConf.data"
                    :loading="searchConf.loadingFlag"
                    :rowSelection="rowSelection"
                    :scroll="tableConf.scroll"
                    @change="handleTableChange"
                >
                    <span slot="startTimeRender" slot-scope="text,record">
                        {{record.startTime | formatBaseDateTime}}
                    </span>
                    <span slot="endTimeRender" slot-scope="text,record">
                        {{record.endTime | formatBaseDateTime}}
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
                    <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                        <a-descriptions>
                            <a-descriptions-item :label="$t('langMap.table.fields.common.remark')">
                                {{ record.remark }}
                            </a-descriptions-item>
                            <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommend.summary')">
                                {{ record.summary }}
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>
                </a-table>
            </div>
        </div>
        <!-- 弹窗dom-区域 -->
        <div>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.articleRecommend.conf"
                :dataObj="drawerConf.detail.articleRecommend.dataObj"
                :visible="drawerConf.detail.articleRecommend.visible"
                :drawerFieldConf="drawerConf.detail.articleRecommend.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>
<script>
    import {OblArticleRecommendApi} from './OblArticleRecommendApi.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum, ConstantObj} from "~Components/constant_define";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';

    export default {
        name: "OblArticleRecommendView",
        components: {QueryFormComp, RowDetailDrawerComp},
        mixins: [OblCommonMixin],
        data() {
            const textAlignDefault = 'left';
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                articleTitle: {
                    key: 'articleTitle',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.obl.articleRecommend.articleTitle'),
                    decorator: ["articleTitle", {rules: []}],
                },
                summary: {
                    key: 'summary',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.obl.articleRecommend.summary'),
                    decorator: ["summary", {rules: []}],
                    ellipsis: true
                },
                reason: {
                    key: 'reason',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.obl.articleRecommend.reason'),
                    decorator: ["reason", {rules: []}],
                    ellipsis: true
                },
                rangeTime: {
                    key: 'rangeTime',
                    formType: FormItemTypeEnum.DateTimeRange,
                    label: this.$t('langMap.table.fields.obl.articleRecommend.rangeTime'),
                    decorator: ["rangeTime", {rules: []}],
                },
                remark: {
                    key: 'remark',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.common.remark'),
                    decorator: ["remark", {rules: []}],
                    ellipsis: true
                }
            };
            return {
                ConstantObj,
                binding: {},
                searchConf: {
                    loadingFlag: false,
                    formItemConf: fieldBaseConf
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.obl.articleRecommend.articleTitle'),
                        align: textAlignDefault,
                        dataIndex: 'articleTitle',
                        key: 'articleTitle'
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleRecommend.authorName'),
                        align: textAlignDefault,
                        dataIndex: 'authorName',
                        key: 'authorName',
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleRecommend.reason'),
                        align: textAlignDefault,
                        dataIndex: 'reason',
                        key: 'reason',
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleRecommend.recommendUserName'),
                        align: textAlignDefault,
                        dataIndex: 'recommendUserName',
                        key: 'recommendUserName',
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleRecommend.startTime'),
                        align: textAlignDefault,
                        dataIndex: 'startTime',
                        key: 'startTime',
                        scopedSlots: {customRender: 'startTimeRender'}
                    },  {
                        title: this.$t('langMap.table.fields.obl.articleRecommend.endTime'),
                        align: textAlignDefault,
                        dataIndex: 'endTime',
                        key: 'endTime',
                        scopedSlots: {customRender: 'endTimeRender'}
                    }, {
                        title: this.$t('langMap.table.fields.common.weights'),
                        align: textAlignDefault,
                        dataIndex: 'weights',
                        key: 'weights'
                    },{
                        title: this.$t('langMap.table.header.operation'),
                        align: textAlignDefault,
                        dataIndex: "operation",
                        key: 'operation',
                        fixed: 'right',
                        width: 180,
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
                    scroll:{
                        x: 850
                    }
                },
                tableCheckIdList: [],
                drawerConf: {
                    detail: {
                        articleRecommend: {
                            conf: {
                                title: this.$t('langMap.drawer.obl.title.detailForArticleRecommend'),
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
                return this.$refs.createFormRef.createForm;
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
                OblArticleRecommendApi.batchDeleteByIds(delIds).then((res) => {

                    if (res.success) {  //已经有对错误进行预处理
                        this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                OblArticleRecommendApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            handleSearchFormQuery(e, values) {   //带查询条件 检索列表
                var _this = this;
                _this.changeQueryLoading(true);
                OblArticleRecommendApi.getPageQuery(values, _this.tableConf).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total;
                    //清空 已勾选
                    _this.tableCheckIdList = [];
                    _this.changeQueryLoading(false);
                }).catch((e) => {
                    _this.changeQueryLoading(false);
                })
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
            handleDetailDrawerShow(e, record) {   //Drawer 详情展示
                if (typeof record != "undefined") {
                    this.drawerConf.detail.articleRecommend.dataObj = record;
                    this.drawerConf.detail.articleRecommend.visible = true;
                } else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e) { //Drawer 详情关闭
                this.drawerConf.detail.articleRecommend.visible = false;
            }
        },
        watch: {},
        created() {
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed() {
            console.log("文章推荐-页面销毁 ...")
        }
    }
</script>
<style>

</style>
