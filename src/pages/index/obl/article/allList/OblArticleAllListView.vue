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
                        <a-button type="primary" icon="audit"
                                  @click="handleBatchAudit">
                            {{$t('langMap.button.actions.audit')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button type="primary" icon="audit"
                                  @click="handleBatchAntiAudit">
                            {{$t('langMap.button.actions.antiAudit')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button type="primary" icon="check-square"
                                  @click="handleBatchSetAsRecommended">
                            {{$t('langMap.button.actions.setAsRecommended')}}
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
                    :scroll="tableConf.scroll"
                    @change="handleTableChange"
                >

                    <span slot="categoryNamesRender" slot-scope="text,record,index">
                        <a-tag color="blue" :key="idx" v-for="(categoryItem,idx) in record.categoryNameList">
                            {{categoryItem}}
                        </a-tag>
                    </span>
                    <span slot="tagNamesRender" slot-scope="text,record,index">
                        <a-tag color="blue" :key="idx" v-for="(tagItem,idx) of record.tagNameList">
                            {{tagItem}}
                        </a-tag>
                    </span>
                    <span slot="isPublishedRender" slot-scope="text,record,index">
                        <span>
                            <a-tag color="blue"
                                   v-if="record.isPublished == 1">
                                {{$t('langMap.commons.enums.publishStatus.published')}}
                            </a-tag>
                            <a-tag color="orange"
                                   v-else>
                                {{$t('langMap.commons.enums.publishStatus.unpublished')}}
                            </a-tag>
                        </span>
                    </span>
                    <span slot="publishTimeRender" slot-scope="text,record,index">
                        {{record.publishTime | formatBaseDateTime}}
                    </span>
                    <span slot="auditTimeRender" slot-scope="text,record,index">
                        {{record.auditTime | formatBaseDateTime}}
                    </span>
                    <span slot="sourceUrlRender" slot-scope="text,record,index">
                        <a target="_blank"
                           v-show="record.sourceType == 2"
                           :href="record.sourceUrl">{{record.sourceUrl}}</a>
                    </span>
                    <obl-table-action slot="action" slot-scope="text,record">
                        <template slot="operates">
                            <table-operate-btn v-show="record.antiAuditAbleFlag == true"
                                               :content="$t('langMap.button.actions.antiAudit')"
                                               icon="audit"
                                               @click="handleAntiAudit($event,record)"
                            >
                            </table-operate-btn>
                            <table-operate-btn v-show="record.setRecommendAbleFlag == true"
                                               :content="$t('langMap.button.actions.setAsRecommended')"
                                               icon="check-square"
                                               @click="handleSetAsRecommended($event,record)"
                            >
                            </table-operate-btn>
                            <table-operate-btn :content="$t('langMap.button.actions.viewAuditRecord')"
                                               icon="unordered-list"
                                               @click="handleViewAuditRecords($event,record)"
                            >
                            </table-operate-btn>
                            <table-operate-btn :content="$t('langMap.button.actions.viewRecommendRecord')"
                                               icon="ordered-list"
                                               @click="handleViewRecommendRecords($event,record)"
                            >
                            </table-operate-btn>
                            <table-operate-btn :content="$t('langMap.results.article.create.success.extra.viewDetail')"
                                               icon="read"
                                               @click="goToViewDetail($event,record)"
                            >
                            </table-operate-btn>
                            <table-delete-operate-btn @click="handleDeleteOneById(record.fid)" />
                            <table-row-detail-operate-btn @click="handleDetailDrawerShow($event,record)" />
                        </template>
                    </obl-table-action>
                </a-table>
            </div>
            <!-- 弹窗dom-区域 -->
            <div>
                <obl-article-set-recommend-comp
                    v-if="dialog.setRecommend.visible"
                    v-bind="dialog.setRecommend"
                    @cancel="handleCloseSetRecommend"
                    @submit="handleSubmitSetRecommend"
                />
                <obl-article-audit-comp
                    v-if="dialog.audit.visible"
                    v-bind="dialog.audit"
                    @cancel="handleCloseAudit"
                    @submit="handleSubmitAudit"
                />
                <obl-article-anti-audit-comp
                    v-if="dialog.antiAudit.visible"
                    v-bind="dialog.antiAudit"
                    @cancel="handleCloseAntiAudit"
                    @submit="handleSubmitAntiAudit"
                />
                <obl-article-audit-records-comp
                    v-if="dialog.viewAuditRecords.visible"
                    v-bind="dialog.viewAuditRecords"
                    @cancel="()=> this.dialog.viewAuditRecords.visible = false"
                    @submit="()=> this.dialog.viewAuditRecords.visible = false"
                />
                <obl-article-recommend-records-comp
                    v-if="dialog.viewRecommendRecords.visible"
                    v-bind="dialog.viewRecommendRecords"
                    @cancel="()=> this.dialog.viewRecommendRecords.visible = false"
                    @submit="()=> this.dialog.viewRecommendRecords.visible = false"
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
    import {ArticleAllListApi} from './OblArticleAllListApi'
    import {DrawerFieldTypeEnum} from '~Components/regular/common/drawer/drawer_define.js'
    import {AllEnum,EnumUtils} from '~Config/selectData.js';
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {ConstantObj, FormItemTypeEnum} from "~Components/constant_define";
    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import TableHeadInfo from '~Components/regular/common/table/TableHeadInfo'
    import OblTableAction from '~Components/regular/common/table/OblTableAction'
    import TableOperateBtn from '~Components/regular/common/table/operate/TableOperateBtn'
    import TableRowDetailOperateBtn from '~Components/regular/common/table/operate/TableRowDetailOperateBtn'
    import TableDeleteOperateBtn from '~Components/regular/common/table/operate/TableDeleteOperateBtn'
    import OblArticleSetRecommendComp from '~Components/index/obl/article/recommend/OblArticleSetRecommendComp'
    import OblArticleAuditComp from '~Components/index/obl/article/audit/OblArticleAuditComp'
    import OblArticleAntiAuditComp from '~Components/index/obl/article/audit/OblArticleAntiAuditComp'
    import OblArticleAuditRecordsComp from '~Components/index/obl/article/audit/OblArticleAuditRecordsComp'
    import OblArticleRecommendRecordsComp from '~Components/index/obl/article/audit/OblArticleRecommendRecordsComp'

    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';

    export default {
        name: "OblArticleAllListView",
        components:{QueryFormComp,OblArticleSetRecommendComp,OblArticleAuditComp,
            TableHeadInfo,OblTableAction,TableOperateBtn,TableRowDetailOperateBtn,TableDeleteOperateBtn,
            OblArticleAntiAuditComp,OblArticleAuditRecordsComp,OblArticleRecommendRecordsComp,RowDetailDrawerComp
        },
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                    title: {
                        key:'title',
                        formType:FormItemTypeEnum.Input,
                        label:this.$t('langMap.table.fields.obl.article.title'),
                        decorator:["title", {rules: []}],
                    },
                    content: {
                        key:'content',
                        formType:FormItemTypeEnum.Input,
                        label:this.$t('langMap.table.fields.obl.article.content'),
                        decorator:["content", {rules: []}],
                        type:DrawerFieldTypeEnum.HtmlDom
                    },
                    summary: {
                        key:'summary',
                        formType:FormItemTypeEnum.Input,
                        label:this.$t('langMap.table.fields.obl.article.summary'),
                        decorator:["summary", {rules: []}],
                    },
                    tagIds: {
                        key:'tagIds',
                        formType:FormItemTypeEnum.Select,
                        label:this.$t('langMap.table.fields.obl.article.tagName'),
                        decorator:["tagIds", {rules: []}],
                        options:[]
                    },
                    categoryIdList: {
                        key:'categoryIdList',
                        formType:FormItemTypeEnum.TreeSelect,
                        label:this.$t('langMap.table.fields.obl.article.categoryNames'),
                        decorator:["categoryIdList", {rules: []}],
                        treeDefaultExpandAll:false,
                        treeNodeFilterProp:"title",
                        treeData:[],
                        drawerAble:false
                    }
                };
            //审批-只能选择非[审批通过、审批不通过、退回修改]的数据
            let auditDisableStateArr = [] ;
            auditDisableStateArr.push(AllEnum.ArticleAuditStateEnum.ApprovalFailed.value);
            auditDisableStateArr.push(AllEnum.ArticleAuditStateEnum.Approved.value);
            auditDisableStateArr.push(AllEnum.ArticleAuditStateEnum.ReturnToModify.value);
            //反审批-只能选择[审批通过、审批不通过、退回修改]的数据
            let antiAuditAbleStateArr = [] ;
            antiAuditAbleStateArr.push(AllEnum.ArticleAuditStateEnum.ApprovalFailed.value);
            antiAuditAbleStateArr.push(AllEnum.ArticleAuditStateEnum.Approved.value);
            antiAuditAbleStateArr.push(AllEnum.ArticleAuditStateEnum.ReturnToModify.value);
            //设为推荐-只能选择[审批通过]的数据
            let setRecommendAbleStateArr = [] ;
            setRecommendAbleStateArr.push(AllEnum.ArticleAuditStateEnum.Approved.value);
            return {
                ConstantObj,
                AllEnum,
                auditDisableStateArr,
                setRecommendAbleStateArr,
                antiAuditAbleStateArr,
                binding:{
                    articleTagList:[],
                    categoryIdList:[]
                },
                searchConf:{
                    loadingFlag:false,
                    formItemConf:fieldBaseConf
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.obl.article.title'),
                        align:textAlignDefault,
                        dataIndex: 'title',
                        width:180,
                        key: 'title'
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.authorName'),
                        align:textAlignDefault,
                        dataIndex: 'authorName',
                        width:180,
                        key: 'authorName'
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.sourceType'),
                        align:textAlignDefault,
                        dataIndex: 'sourceTypeStr',
                        width:100,
                        key: 'sourceType'
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.categoryNames'),
                        align:textAlignDefault,
                        dataIndex: 'categoryNames',
                        width:70,
                        key: 'categoryNames',
                        scopedSlots: { customRender: 'categoryNamesRender' }
                    },  {
                        title: this.$t('langMap.table.fields.obl.article.tagNames'),
                        align:textAlignDefault,
                        dataIndex: 'tagNames',
                        width:70,
                        key: 'tagNames',
                        scopedSlots: { customRender: 'tagNamesRender' }
                    },  {
                        title: this.$t('langMap.table.fields.obl.article.auditState'),
                        align:textAlignDefault,
                        dataIndex: 'auditStateStr',
                        width:90,
                        key: 'auditState'
                    },  {
                        title: this.$t('langMap.table.fields.obl.article.auditComments'),
                        align:textAlignDefault,
                        dataIndex: 'auditComments',
                        width:90,
                        key: 'auditComments'
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.auditUserName'),
                        align:textAlignDefault,
                        dataIndex: 'auditUserName',
                        width:90,
                        key: 'auditUserName'
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.auditTime'),
                        align:textAlignDefault,
                        dataIndex: 'auditTime',
                        width:180,
                        key: 'auditTime',
                        scopedSlots: { customRender: 'auditTimeRender' }
                    },   {
                        title: this.$t('langMap.table.fields.obl.article.isPublished'),
                        align:textAlignDefault,
                        dataIndex: 'isPublished',
                        width:90,
                        key: 'isPublished',
                        scopedSlots: { customRender: 'isPublishedRender' }
                    },  {
                        title: this.$t('langMap.table.fields.obl.article.publishTime'),
                        align:textAlignDefault,
                        dataIndex: 'publishTime',
                        width:180,
                        key: 'publishTime',
                        scopedSlots: { customRender: 'publishTimeRender' }
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.sourceUrl'),
                        align:textAlignDefault,
                        dataIndex: 'sourceUrl',
                        width:220,
                        ellipsis:true,
                        key: 'sourceUrl',
                        scopedSlots: { customRender: 'sourceUrlRender' }
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.summary'),
                        align:textAlignDefault,
                        dataIndex: 'summary',
                        width:100,
                        key: 'summary',
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.content'),
                        align:textAlignDefault,
                        dataIndex: 'shortContent',
                        width:200,
                        key: 'shortContent',
                    },  {
                        title: this.$t('langMap.table.fields.obl.article.viewCount'),
                        align:textAlignDefault,
                        dataIndex: 'viewCount',
                        width:90,
                        key: 'viewCount',
                    },  {
                        title: this.$t('langMap.table.fields.obl.article.commentCount'),
                        align:textAlignDefault,
                        dataIndex: 'commentCount',
                        width:90,
                        key: 'commentCount',
                    },  {
                        title: this.$t('langMap.table.fields.obl.article.likeCount'),
                        align:textAlignDefault,
                        dataIndex: 'likeCount',
                        width:90,
                        key: 'likeCount',
                    },  {
                        title: this.$t('langMap.table.fields.obl.article.collectCount'),
                        align:textAlignDefault,
                        dataIndex: 'collectCount',
                        width:90,
                        key: 'collectCount',
                    }, {
                        title: this.$t('langMap.table.fields.obl.article.editorType'),
                        align:textAlignDefault,
                        dataIndex: 'editorTypeStr',
                        key: 'editorTypeStr',
                        width:110
                    },  {
                        title:this.$t('langMap.table.header.operation'),
                        align:textAlignDefault,
                        dataIndex:"operation",
                        key:'operation',
                        fixed:'right',
                        width:260,
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
                tableCheckIdList: [],
                tableCheckList: [],
                dialog:{
                    setRecommend:{
                        visible: false,
                        articleList:[]
                    },
                    audit:{
                        visible: false,
                        articleList:[]
                    },
                    antiAudit:{
                        visible: false,
                        articleList:[]
                    },
                    viewAuditRecords:{
                        visible: false,
                        formObj:{}
                    },
                    viewRecommendRecords:{
                        visible: false,
                        formObj:{}
                    }
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
            dealGetAllTagList(){    //取得所有的 文章标签
                var _this = this ;
                ArticleAllListApi.getAllArticleTagEnums().then((res) =>{
                    if(res.success){
                        _this.binding.articleTagList = res.gridList ;
                    }
                })
            },
            dealGetAllCategoryTree() {    //取得所有的 文章分类
                var _this = this;
                ArticleAllListApi.getAllArticleCategoryTree().then((res) => {
                    if (res.success) {
                        _this.binding.categoryIdList = res.gridList;
                    }
                })
            },
            dealBatchDel() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                ArticleAllListApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                ArticleAllListApi.deleteById(delId).then((res) => {
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
                let articleAuditStateValMap = EnumUtils.toValMap(AllEnum.ArticleAuditStateEnum);
                let articleEditorTypeValMap = EnumUtils.toValMap(AllEnum.ArticleEditorTypeEnum);
                let articleSourceTypeValMap = EnumUtils.toValMap(AllEnum.ArticleSourceTypeEnum);
                for (let idx in data){
                    let item = data[idx] ;
                    //枚举值
                    item['auditStateStr'] = articleAuditStateValMap[item.auditState];
                    item['editorTypeStr'] = articleEditorTypeValMap[item.editorType];
                    item['sourceTypeStr'] = articleSourceTypeValMap[item.sourceType] ;
                    //是否可审批
                    item['auditAbleFlag'] = _this.auditDisableStateArr.indexOf(item.auditState) < 0 ;
                    //是否可反审批
                    item['antiAuditAbleFlag'] = _this.antiAuditAbleStateArr.indexOf(item.auditState) >= 0 ;
                    //是否可设置推荐
                    item['setRecommendAbleFlag'] = _this.setRecommendAbleStateArr.indexOf(item.auditState) >= 0 ;
                }
            },
            handleSearchFormQuery(e,values) {    //带查询条件 检索文章列表
                const _this = this;
                _this.changeQueryLoading(true);
                ArticleAllListApi.getPageQuery(values,_this.tableConf).then((res) => {
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
            handleBatchDeleteByIds(e) {     // 批量删除
                var _this = this;
                var selectDelIds = _this.tableCheckIdList;
                if (selectDelIds.length < 1) {
                    _this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForDelete'));
                } else {
                    _this.$confirm({
                        content: _this.$t('langMap.message.confirm.isConfirmDeleteWhatSelectedRow',[selectDelIds.length]),
                        okText: _this.$t('langMap.button.actions.confirm'),
                        cancelText: _this.$t('langMap.button.actions.cancel'),
                        onOk() {
                            _this.dealBatchDel();
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
                this.tableConf.pagination = pagination ;
                this.tableConf.filters = filters ;
                this.tableConf.sorter = sorter ;
                this.mixin_invokeQuery(this);
            },
            handleDetailDrawerShow(e,record){   //Drawer-文章 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.article.dataObj = record ;
                    this.drawerConf.detail.article.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-文章 详情关闭
                this.drawerConf.detail.article.visible = false ;
            },
            goToViewDetail(e,record) {
                let params = {
                    fid:record.fid
                } ;
                this.mixin_jump(routerConst.article.display,params);
            },
            handleSetAsRecommended(e,record){
                this.dialog.setRecommend.articleList = [record];
                this.dialog.setRecommend.visible = true ;
            },
            handleBatchSetAsRecommended(e){ //批量设为推荐
                var _this = this;
                var selectList = _this.tableCheckList;
                if (selectList.length < 1) {
                    _this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheLeastRowOfDataForOperate'));
                } else {
                    //只能选择[审批通过]的数据
                    let editAbleList = selectList.filter(item => item.auditState == AllEnum.ArticleAuditStateEnum.Approved.value) ;
                    if(editAbleList.length < selectList.length){
                        _this.$message.warning(this.$t('langMap.message.warning.doNotAllowSelectionOfNotApproved'));
                        return false;
                    }
                    this.dialog.setRecommend.articleList = editAbleList;
                    this.dialog.setRecommend.visible = true ;
                }
            },
            handleCloseSetRecommend(e){
                this.dialog.setRecommend.articleList = [];
                this.dialog.setRecommend.visible = false ;
            },
            handleSubmitSetRecommend(e){
                this.dialog.setRecommend.articleList = [];
                this.dialog.setRecommend.visible = false ;
                this.mixin_invokeQuery(this); //表格重新搜索
            },
            handleAudit(e,record){
                this.dialog.audit.articleList = [record];
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
                    this.dialog.audit.articleList = ableList;
                    this.dialog.audit.visible = true ;
                }
            },
            handleCloseAudit(e){
                this.dialog.audit.articleList = [];
                this.dialog.audit.visible = false ;
            },
            handleSubmitAudit(e){
                this.dialog.audit.articleList = [];
                this.dialog.audit.visible = false ;
                this.mixin_invokeQuery(this); //表格重新搜索
            },
            handleAntiAudit(e,record){  //反审批
                this.dialog.antiAudit.articleList = [record];
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
                    this.dialog.antiAudit.articleList = ableList;
                    this.dialog.antiAudit.visible = true ;
                }
            },
            handleCloseAntiAudit(e){
                this.dialog.antiAudit.articleList = [];
                this.dialog.antiAudit.visible = false ;
            },
            handleSubmitAntiAudit(e){
                this.dialog.antiAudit.articleList = [];
                this.dialog.antiAudit.visible = false ;
                this.mixin_invokeQuery(this); //表格重新搜索
            },
            handleViewAuditRecords(e,record){   //查看文章的审批记录
                this.dialog.viewAuditRecords.formObj = record;
                this.dialog.viewAuditRecords.visible = true ;
            },
            handleViewRecommendRecords(e,record){   //查看文章的推荐记录
                this.dialog.viewRecommendRecords.formObj = record;
                this.dialog.viewRecommendRecords.visible = true ;
            },
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.tagIds.options = this.binding.articleTagList ;
                    this.searchConf.formItemConf.categoryIdList.treeData = this.binding.categoryIdList ;
                },
                deep: true,
                immediate:true
            }
        },
        created(){
            this.dealGetAllTagList();
            this.dealGetAllCategoryTree();
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("所有文章-页面销毁 ...")
        }
    }
</script>
<style>

</style>
