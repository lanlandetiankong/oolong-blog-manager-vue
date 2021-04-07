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
                        <a-col>
                            <a-button type="primary" icon="audit"
                                      @click="handleBatchAudit">
                                {{$t('langMap.button.actions.audit')}}
                            </a-button>
                            <a-button type="primary" icon="audit"
                                      @click="handleBatchAntiAudit">
                                {{$t('langMap.button.actions.antiAudit')}}
                            </a-button>
                        </a-col>
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
                    :scroll="tableConf.scroll"
                    @change="handleTableChange"
                >
                    <span slot="auditTimeRender" slot-scope="text,record,index">
                        {{record.auditTime | formatBaseDateTime}}
                    </span>
                    <obl-table-action slot="action" slot-scope="text,record">
                        <template slot="operates">
                            <table-operate-btn v-show="record.antiAuditAbleFlag == true"
                                               :content="$t('langMap.button.actions.antiAudit')"
                                               icon="audit"
                                               @click="handleAntiAudit($event,record)"
                            >
                            </table-operate-btn>
                            <table-operate-btn :content="$t('langMap.results.article.create.success.extra.viewDetail')"
                                               icon="read"
                                               @click="goToViewDetail($event,record)"
                            >
                            </table-operate-btn>
                            <table-operate-btn :content="$t('langMap.button.actions.viewAuditRecord')"
                                               icon="unordered-list"
                                               @click="handleViewAuditRecords($event,record)"
                            >
                            </table-operate-btn>
                            <table-row-detail-operate-btn @click="handleDetailDrawerShow($event,record)" />
                        </template>
                    </obl-table-action>
                </a-table>
            </div>
            <!-- 弹窗dom-区域 -->
            <div>
                <obl-article-comment-audit-records-comp
                    v-if="dialog.viewAuditRecords.visible"
                    v-bind="dialog.viewAuditRecords"
                    @cancel="()=> this.dialog.viewAuditRecords.visible = false"
                    @submit="()=> this.dialog.viewAuditRecords.visible = false"
                />
                <obl-article-comment-audit-comp
                    v-if="dialog.audit.visible"
                    v-bind="dialog.audit"
                    @cancel="handleCloseAudit"
                    @submit="handleSubmitAudit"
                />
                <obl-article-comment-anti-audit-comp
                    v-if="dialog.antiAudit.visible"
                    v-bind="dialog.antiAudit"
                    @cancel="handleCloseAntiAudit"
                    @submit="handleSubmitAntiAudit"
                />
                <row-detail-drawer-comp
                    :drawerConf="drawerConf.detail.article.conf"
                    :dataObj="drawerConf.detail.article.dataObj"
                    :visible="drawerConf.detail.article.visible"
                    :drawerFieldConf="searchConf.formItemConf"
                    @execClose="handleDetailDrawerClose"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import {routerConst} from '~Config/BaseDataConst.js'
    import {AllEnum, ArticleCommentAuditStateEnum, EnumUtils} from "~Config/selectData";
    import {ArticleCommentListApi} from './OblArticleCommentListApi'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {ConstantObj, FormItemTypeEnum} from "~Components/constant_define";
    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import TableHeadInfo from '~Components/regular/common/table/TableHeadInfo'
    import OblTableAction from '~Components/regular/common/table/OblTableAction'
    import TableOperateBtn from '~Components/regular/common/table/operate/TableOperateBtn'
    import TableRowDetailOperateBtn from '~Components/regular/common/table/operate/TableRowDetailOperateBtn'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    import OblArticleCommentAuditRecordsComp from '~Components/index/obl/article/commentAudit/OblArticleCommentAuditRecordsComp'
    import OblArticleCommentAntiAuditComp from '~Components/index/obl/article/commentAudit/OblArticleCommentAntiAuditComp'
    import OblArticleCommentAuditComp from '~Components/index/obl/article/commentAudit/OblArticleCommentAuditComp'

    export default {
        name: "OblArticleCommentListView",
        components:{QueryFormComp,RowDetailDrawerComp,TableHeadInfo,OblTableAction,TableOperateBtn,TableRowDetailOperateBtn
            ,OblArticleCommentAuditRecordsComp,OblArticleCommentAntiAuditComp,OblArticleCommentAuditComp
        },
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                content: {
                    key:'content',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.obl.articleComment.content'),
                    decorator:["content", {rules: []}],
                },
                auditState:{
                    key:'auditState',
                    formType:FormItemTypeEnum.Select,
                    label:this.$t('langMap.table.fields.obl.articleComment.auditState'),
                    decorator:["auditState", {rules: []}],
                    options:[],
                    drawerAble:false
                },
                articleTitle: {
                    key:'articleTitle',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.obl.articleComment.articleTitle'),
                    decorator:["articleTitle", {rules: []}],
                },
            };

            //审批-只能选择非[审批通过、审批不通过、退回修改]的数据
            let auditDisableStateArr = [] ;
            auditDisableStateArr.push(AllEnum.ArticleCommentAuditStateEnum.ApprovalFailed.value);
            auditDisableStateArr.push(AllEnum.ArticleCommentAuditStateEnum.Approved.value);
            //反审批-只能选择[审批通过、审批不通过、退回修改]的数据
            let antiAuditAbleStateArr = [] ;
            antiAuditAbleStateArr.push(AllEnum.ArticleCommentAuditStateEnum.ApprovalFailed.value);
            antiAuditAbleStateArr.push(AllEnum.ArticleCommentAuditStateEnum.Approved.value);
            //设为推荐-只能选择[审批通过]的数据
            let setRecommendAbleStateArr = [] ;
            setRecommendAbleStateArr.push(AllEnum.ArticleCommentAuditStateEnum.Approved.value);
            return {
                ConstantObj,
                auditDisableStateArr,
                setRecommendAbleStateArr,
                antiAuditAbleStateArr,
                binding:{
                    commentAuditStateArr:EnumUtils.toSelectData(AllEnum.ArticleCommentAuditStateEnum)
                },
                searchConf:{
                    loadingFlag:false,
                    formItemConf:fieldBaseConf
                },
                tableConf: {
                    data: [],
                    columns: [ {
                        title: this.$t('langMap.table.fields.obl.articleComment.articleTitle'),
                        align:textAlignDefault,
                        dataIndex: 'articleTitle',
                        width:180,
                        key: 'articleTitle'
                    },{
                        title: this.$t('langMap.table.fields.obl.articleComment.content'),
                        align:textAlignDefault,
                        dataIndex: 'content',
                        width:300,
                        key: 'content',
                    },  {
                        title: this.$t('langMap.table.fields.obl.articleComment.articleAuthorName'),
                        align:textAlignDefault,
                        dataIndex: 'articleAuthorName',
                        width:150,
                        key: 'articleAuthorName'
                    },  {
                        title: this.$t('langMap.table.fields.obl.articleComment.replyFromUserName'),
                        align:textAlignDefault,
                        width:150,
                        dataIndex: 'replyFromUserName',
                        key: 'replyFromUserName',
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleComment.replyToUserName'),
                        align:textAlignDefault,
                        width:150,
                        dataIndex: 'replyToUserName',
                        key: 'replyToUserName',
                    },{
                        title: this.$t('langMap.table.fields.obl.articleComment.auditState'),
                        align:textAlignDefault,
                        dataIndex: 'auditStateStr',
                        width:90,
                        key: 'auditState'
                    }, {
                        title: this.$t('langMap.table.fields.obl.articleComment.auditComments'),
                        align:textAlignDefault,
                        dataIndex: 'auditComments',
                        width:90,
                        key: 'auditComments'
                    },  {
                        title: this.$t('langMap.table.fields.obl.articleComment.auditUserName'),
                        align:textAlignDefault,
                        dataIndex: 'auditUserName',
                        width:90,
                        key: 'auditUserName'
                    },  {
                        title: this.$t('langMap.table.fields.obl.articleComment.auditTime'),
                        align:textAlignDefault,
                        dataIndex: 'auditTime',
                        width:180,
                        key: 'auditTime',
                        scopedSlots: { customRender: 'auditTimeRender' }
                    },{
                        title:this.$t('langMap.table.header.operation'),
                        align:textAlignDefault,
                        dataIndex:"operation",
                        key:'operation',
                        fixed:'right',
                        width:220,
                        scopedSlots: { customRender: 'action' }
                    }],
                    pagination: {
                        current:1,
                        pageSize:10,
                        pageSizeOptions:['10','20','50','100'],
                        showQuickJumper:false,
                        showSizeChanger:true,
                        total:0,
                        showTotal(total,range){
                            return `${range[0]}-${range[1]} of ${total} items` ;
                        }
                    },
                    filters:{},
                    sorter:{},
                    scroll:{
                        x: 750
                    }
                },
                tableCheckList: [],
                tableCheckIdList: [],
                dialog:{
                    audit:{
                        visible: false,
                        commentList:[]
                    },
                    antiAudit:{
                        visible: false,
                        commentList:[]
                    },
                    viewAuditRecords:{
                        visible: false,
                        formObj:{}
                    },
                },
                drawerConf:{
                    detail:{
                        article:{
                            conf:{
                                title:this.$t('langMap.drawer.obl.title.detailForArticle'),
                            },
                            visible:false,
                            dataObj:{},
                            drawerFieldConf:fieldBaseConf
                        },
                    },
                },
            }
        },
        computed:{
            rowSelection() {    //行选择
                return {
                    selectedRowKeys: this.tableCheckIdList,
                    onChange: (selectedRowKeys, selectedRows) => {  //勾选 修改事件
                        this.tableCheckIdList = selectedRowKeys;
                        this.tableCheckList = selectedRows;
                    },
                    getCheckboxProps: record => ({  //选择框的默认属性配置
                        props: {
                            name:record.fid
                        }
                    }),
                };
            }
        },
        methods: {
            changeQueryLoading(loadingFlag){   //修改[表格搜索]是否在 加载状态中
                if(typeof loadingFlag == "undefined" || loadingFlag == null){
                    loadingFlag = false ;
                }
                this.searchConf.loadingFlag = loadingFlag;
            },
            handleTransformData(){//数据转化
                let _this = this ;
                const data = this.tableConf.data;
                if(!data){
                    return ;
                }
                //Map-模块类型
                let articleAuditStateValMap = EnumUtils.toValMap(AllEnum.ArticleAuditStateEnum);
                for (let idx in data){
                    let item = data[idx] ;
                    item['auditStateStr'] = articleAuditStateValMap[item.auditState]
                    debugger;
                    item['antiAuditAbleFlag'] = _this.antiAuditAbleStateArr.indexOf(item.auditState) >= 0 ;
                }
            },
            handleSearchFormQuery(e,values) {    //带查询条件 检索评论列表
                const _this = this;
                _this.changeQueryLoading(true);
                ArticleCommentListApi.getPageQuery(values,_this.tableConf).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total ;
                    //清空 已勾选
                    _this.tableCheckIdList = [] ;
                    _this.handleTransformData();
                    _this.changeQueryLoading(false);
                }).catch((e) =>{
                    _this.changeQueryLoading(false);
                })
            },
            handleTableChange(pagination, filters, sorter) {    //表格变动-页码跳转/排序/筛选
                this.tableConf.pagination = pagination ;
                this.tableConf.filters = filters ;
                this.tableConf.sorter = sorter ;
                this.mixin_invokeQuery(this);
            },
            handleDetailDrawerShow(e,record){   //Drawer-评论 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.article.dataObj = record ;
                    this.drawerConf.detail.article.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-评论 详情关闭
                this.drawerConf.detail.article.visible = false ;
            },
            goToViewDetail(e,record) {
                let params = {
                    fid:record.fid
                } ;
                this.mixin_jump(routerConst.article.display,params);
            },
            handleViewAuditRecords(e,record){   //查看评论的审批记录
                this.dialog.viewAuditRecords.formObj = record;
                this.dialog.viewAuditRecords.visible = true ;
            },
            handleAudit(e,record){
                this.dialog.audit.commentList = [record];
                this.dialog.audit.visible = true ;
            },
            handleBatchAudit(e){ //批量审批
                var _this = this;
                var selectList = _this.tableCheckList;
                if (selectList.length < 1) {
                    _this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheLeastRowOfDataForOperate'));
                } else {
                    let ableList = selectList.filter(item => {
                        return _this.auditDisableStateArr.indexOf(item.auditState) < 0 ;
                    }) ;
                    if(ableList.length < selectList.length){
                        _this.$message.warning(this.$t('langMap.message.warning.doNotAllowSelectionOfAudited'));
                        return false;
                    }
                    this.dialog.audit.commentList = ableList;
                    this.dialog.audit.visible = true ;
                }
            },
            handleCloseAudit(e){
                this.dialog.audit.commentList = [];
                this.dialog.audit.visible = false ;
            },
            handleSubmitAudit(e){
                this.dialog.audit.commentList = [];
                this.dialog.audit.visible = false ;
                this.mixin_invokeQuery(this); //表格重新搜索
            },
            handleAntiAudit(e,record){  //反审批
                this.dialog.antiAudit.commentList = [record];
                this.dialog.antiAudit.visible = true ;
            },
            handleBatchAntiAudit(e){ //批量-反审批
                var _this = this;
                var selectList = _this.tableCheckList;
                if (selectList.length < 1) {
                    _this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheLeastRowOfDataForOperate'));
                } else {
                    let ableList = selectList.filter(item => {
                        return _this.antiAuditAbleStateArr.indexOf(item.auditState) >= 0 ;
                    }) ;
                    if(ableList.length < selectList.length){
                        _this.$message.warning(this.$t('langMap.message.warning.doNotAllowSelectionOfAudited'));
                        return false;
                    }
                    this.dialog.antiAudit.commentList = ableList;
                    this.dialog.antiAudit.visible = true ;
                }
            },
            handleCloseAntiAudit(e){
                this.dialog.antiAudit.commentList = [];
                this.dialog.antiAudit.visible = false ;
            },
            handleSubmitAntiAudit(e){
                this.dialog.antiAudit.commentList = [];
                this.dialog.antiAudit.visible = false ;
                this.mixin_invokeQuery(this); //表格重新搜索
            },
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.auditState.options = this.binding.commentAuditStateArr ;
                },
                deep: true,
                immediate:true
            }
        },
        created(){
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("评论-页面销毁 ...")
        }
    }
</script>
<style>

</style>
