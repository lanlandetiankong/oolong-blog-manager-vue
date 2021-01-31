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
                            <a-icon slot="checkedChildren" type="filter" />
                            <a-icon slot="unCheckedChildren" type="eye-invisible" />
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
                    <span slot="auditStateRender" slot-scope="text,record,index">
                        <span>
                            <a-tag color="blue"
                                   v-if="record.auditState == 2">
                                {{$t('langMap.commons.enums.auditStatus.approved')}}
                            </a-tag>
                            <a-tag color="orange"
                                   v-else-if="record.auditState == 1">
                                {{$t('langMap.commons.enums.auditStatus.approval')}}
                            </a-tag>
                        </span>
                    </span>
                    <span slot="editorTypeRender" slot-scope="text,record,index">
                        <a-tag color="blue"
                               v-if="record.editorType == 1">
                            Markdown
                        </a-tag>
                    </span>
                    <template slot="action" slot-scope="text,record">
                        <span>
                            <a @click="handleDetailDrawerShow($event,record)">
                                {{$t('langMap.drawer.actions.detail')}}
                            </a>
                            <a-divider type="vertical" />
                            <a @click="goToViewDetail($event,record)">
                                {{$t('langMap.results.article.create.success.extra.viewDetail')}}
                            </a>
                            <a-divider type="vertical" />
                            <a-button type="danger" size="small" @click="handleDeleteOneById(record.fid)">{{$t('langMap.button.actions.delById')}}</a-button>
                        </span>
                    </template>
                </a-table>
            </div>
            <!-- 弹窗dom-区域 -->
            <div>
                <row-detail-drawer-comp
                    :drawerConf="drawerConf.detail.article.conf"
                    :dataObj="drawerConf.detail.article.dataObj"
                    :visible="drawerConf.detail.article.visible"
                    :drawerFieldConf="drawerConf.detail.article.drawerFieldConf"
                    @execClose="handleDetailDrawerClose"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import BeeUtil from '~Assets/js/util/bee/BeeUtil.js' ;
    import {ArticleAllListApi} from './OblArticleAllListApi'
    import {DrawerFieldTypeEnum} from '~Components/regular/common/drawer/drawer_define.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";
    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    export default {
        name: "OblArticleAllListView",
        components:{QueryFormComp,RowDetailDrawerComp},
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldInfoConfObj = {
                title:{
                    fieldLabel:this.$t('langMap.table.fields.obl.article.title')
                },
                keyWord:{
                    fieldLabel:this.$t('langMap.table.fields.obl.article.content'),
                },
                summary:{
                    fieldLabel:this.$t('langMap.table.fields.obl.article.summary'),
                },
                tagIds:{
                    fieldName:'tagIds',drawerAble:false,
                },
                content:{
                    fieldLabel:this.$t('langMap.table.fields.obl.article.content'),
                    type:DrawerFieldTypeEnum.HtmlDom
                }
            };
            return {
                ConstantObj,
                binding:{
                    articleTagList:[]
                },
                searchConf:{
                    showAble:false,
                    loadingFlag:false,
                    formItemConf:{
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
                        content:{
                            key:'content',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.obl.article.content'),
                            decorator:["content", {rules: []}],
                        }
                    },

                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.obl.article.title'),
                        align:textAlignDefault,
                        dataIndex: 'title',
                        width:180,
                        key: 'title'
                    },  {
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
                        dataIndex: 'auditState',
                        width:90,
                        key: 'auditState',
                        scopedSlots: { customRender: 'auditStateRender' }
                    },  {
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
                        key: 'editorType',
                        width:110,
                        scopedSlots: { customRender: 'editorTypeRender' }
                    },  {
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
                tableCheckIdList: [],
                dialogFormConf: {
                    visible: false,
                    actionType: "create"
                },
                drawerConf:{
                    detail:{
                        article:{
                            conf:{
                                title:this.$t('langMap.drawer.obl.title.detailForArticle'),
                            },
                            visible:false,
                            dataObj:{},
                            drawerFieldConf:fieldInfoConfObj
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
            dealQueryAllArticleTag(){    //取得所有的 文章标签
                var _this = this ;
                ArticleAllListApi.getAllArticleTagEnums().then((res) =>{
                    if(res.success){
                        _this.binding.articleTagList = res.enumData.list ;
                    }
                })
            },
            dealBatchDel() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                ArticleAllListApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        this.$message.success(res.msg);
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
            handleSearchFormQuery(e,values) {    //带查询条件 检索文章列表
                const _this = this;
                //取得 bean 形式 的查询条件数组
                const searchFieldArr = _this.mixin_dealGetSearchFormQueryConf(null,values);
                _this.changeQueryLoading(true);
                ArticleAllListApi.getPageQuery(searchFieldArr,_this.tableConf.pagination,_this.tableConf.sorter).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total ;
                    //清空 已勾选
                    _this.tableCheckIdList = [] ;
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
                            _this.$message.info(_this.$t('langMap.message.account.actionOfCancelDelete'));
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
                            _this.$message.info(_this.$t('langMap.message.account.actionOfCancelDelete'));
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
                if(!record){
                    return ;
                }
                var params = record ;
                var url = BeeUtil.UrlUtils.objToUrl(this.mixinData.routerConst.article.display,params);
                this.mixin_jump(url);
            },
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.tagIds.options = this.binding.articleTagList ;
                },
                deep: true,
                immediate:true
            }
        },
        created(){
            this.dealQueryAllArticleTag();
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
