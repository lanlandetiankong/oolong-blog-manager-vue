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
                    v-show="false"
                    :gutter="6"
                    justify="start"
                    type="flex"
                    align="middle"
                >
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
                    <span slot="beforeTimeRangeRender" slot-scope="record">
                        {{record.beforeStartTime | formatBaseDateTime}} -> {{record.beforeEndTime | formatBaseDateTime}}
                    </span>
                    <span slot="afterTimeRangeRender" slot-scope="record">
                        {{record.afterStartTime | formatBaseDateTime}} -> {{record.afterEndTime | formatBaseDateTime}}
                    </span>
                    <obl-table-action slot="action" slot-scope="text,record">
                        <template slot="operates">
                            <table-row-detail-operate-btn @click="handleDetailDrawerShow($event,record)" />
                        </template>
                    </obl-table-action>
                    <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                        <a-descriptions>
                            <a-descriptions-item :label="$t('langMap.table.fields.obl.articleRecommendDelayRecord.recommendId')">
                                {{ record.recommendId }}
                            </a-descriptions-item>
                            <a-descriptions-item :label="$t('langMap.table.fields.common.remark')">
                                {{ record.remark }}
                            </a-descriptions-item>
                            <a-descriptions-item :label="$t('langMap.table.fields.common.createTime')">
                                {{ record.createTime | formatBaseDateTime }}
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>
                </a-table>
            </div>
        </div>
        <!-- 弹窗dom-区域 -->
        <div>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.articleRecommendDelayRecord.conf"
                :dataObj="drawerConf.detail.articleRecommendDelayRecord.dataObj"
                :visible="drawerConf.detail.articleRecommendDelayRecord.visible"
                :drawerFieldConf="drawerConf.detail.articleRecommendDelayRecord.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>
<script>
    import {OblArticleRecommendDelayRecordApi} from './OblArticleRecommendDelayRecordApi.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum, ConstantObj} from "~Components/constant_define";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import TableHeadInfo from '~Components/regular/common/table/TableHeadInfo'
    import OblTableAction from '~Components/regular/common/table/OblTableAction'
    import TableRowDetailOperateBtn from '~Components/regular/common/table/operate/TableRowDetailOperateBtn'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';

    export default {
        name: "OblArticleRecommendDelayRecordView",
        components: {QueryFormComp,TableHeadInfo,RowDetailDrawerComp,
            OblTableAction,TableRowDetailOperateBtn
        },
        mixins: [OblCommonMixin],
        data() {
            const textAlignDefault = 'left';
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                articleTitle: {
                    key: 'articleTitle',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.articleTitle'),
                    decorator: ["articleTitle", {rules: []}],
                },
                recommendUserName: {
                    key: 'recommendUserName',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.recommendUserName'),
                    decorator: ["recommendUserName", {rules: []}],
                },
                recommendReason: {
                    key: 'recommendReason',
                    formType: FormItemTypeEnum.Input,
                    label: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.recommendReason'),
                    decorator: ["recommendReason", {rules: []}],
                },
                beforeStartTime: {
                    key: 'beforeStartTimeRange',
                    formType: FormItemTypeEnum.DateTimeRange,
                    label: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.beforeStartTime'),
                    decorator: ["beforeStartTimeRange", {rules: []}],
                },
                beforeEndTime: {
                    key: 'beforeEndTimeRange',
                    formType: FormItemTypeEnum.DateTimeRange,
                    label: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.beforeEndTime'),
                    decorator: ["beforeEndTimeRange", {rules: []}],
                },
                afterStartTime: {
                    key: 'afterStartTimeRange',
                    formType: FormItemTypeEnum.DateTimeRange,
                    label: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.afterStartTime'),
                    decorator: ["afterStartTimeRange", {rules: []}],
                },
                afterEndTime: {
                    key: 'afterEndTimeRange',
                    formType: FormItemTypeEnum.DateTimeRange,
                    label: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.afterEndTime'),
                    decorator: ["afterEndTimeRange", {rules: []}],
                },

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
                        title: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.articleTitle'),
                        align: textAlignDefault,
                        dataIndex: 'articleTitle',
                        key: 'articleTitle'
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.recommendUserName'),
                        align: textAlignDefault,
                        dataIndex: 'recommendUserName',
                        key: 'recommendUserName',
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.recommendReason'),
                        align: textAlignDefault,
                        dataIndex: 'recommendReason',
                        key: 'recommendReason',
                    },{
                        title: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.beforeTimeRange'),
                        align: textAlignDefault,
                        scopedSlots: { customRender: 'beforeTimeRangeRender' }
                    },{
                        title: this.$t('langMap.table.fields.obl.articleRecommendDelayRecord.afterTimeRange'),
                        align: textAlignDefault,
                        scopedSlots: { customRender: 'afterTimeRangeRender' }
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
                drawerConf: {
                    detail: {
                        articleRecommendDelayRecord: {
                            conf: {
                                title: this.$t('langMap.drawer.obl.title.detailForOblArticleRecommendDelayRecord'),
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
            changeQueryLoading(loadingFlag) {   //修改[表格搜索]是否在 加载状态中
                if (typeof loadingFlag == "undefined" || loadingFlag == null) {
                    loadingFlag = false;
                }
                this.searchConf.loadingFlag = loadingFlag;
            },
            handleSearchFormQuery(e, values) {   //带查询条件 检索列表
                var _this = this;
                _this.changeQueryLoading(true);
                OblArticleRecommendDelayRecordApi.getPageQuery(values, _this.tableConf).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total;
                    //清空 已勾选
                    _this.tableCheckIdList = [];
                    _this.changeQueryLoading(false);
                }).catch((e) => {
                    _this.changeQueryLoading(false);
                })
            },
            handleTableChange(pagination, filters, sorter) {    //表格变动-页码跳转/排序/筛选
                this.tableConf.pagination = pagination;
                this.tableConf.filters = filters;
                this.tableConf.sorter = sorter;
                this.mixin_invokeQuery(this);
            },
            handleDetailDrawerShow(e, record) {   //Drawer 详情展示
                if (typeof record != "undefined") {
                    this.drawerConf.detail.articleRecommendDelayRecord.dataObj = record;
                    this.drawerConf.detail.articleRecommendDelayRecord.visible = true;
                } else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e) { //Drawer 详情关闭
                this.drawerConf.detail.articleRecommendDelayRecord.visible = false;
            }
        },
        watch: {},
        created() {
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed() {
            console.log("文章类别-页面销毁 ...")
        }
    }
</script>
<style>

</style>
