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
                    <span slot="tagNamesRender" slot-scope="record">
                        <template v-for="tagNameItem in record.tagNames">
                            <a-tag color="blue" :key="tagNameItem">
                                {{tagNameItem}}
                            </a-tag>
                        </template>
                    </span>
                    <obl-table-action slot="action" slot-scope="text,record">
                        <template slot="operates">
                            <table-operate-btn
                                icon="read"
                                :content="$t('langMap.button.actions.lookOver')"
                                @click="handleAnnouncementViewItemClick($event,record)"
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
                <row-detail-drawer-comp
                    :drawerConf="drawerConf.detail.announcement.conf"
                    :dataObj="drawerConf.detail.announcement.dataObj"
                    :visible="drawerConf.detail.announcement.visible"
                    :drawerFieldConf="drawerConf.detail.announcement.drawerFieldConf"
                    @execClose="handleDetailDrawerClose"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import {routerConst} from '~Config/BaseDataConst.js'
    import {AnnouncementAllListApi} from './announcementAllListApi'
    import {DrawerFieldTypeEnum} from '~Components/regular/common/drawer/drawer_define.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";
    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import TableHeadInfo from '~Components/regular/common/table/TableHeadInfo'
    import OblTableAction from '~Components/regular/common/table/OblTableAction'
    import TableOperateBtn from '~Components/regular/common/table/operate/TableOperateBtn'
    import TableDeleteOperateBtn from '~Components/regular/common/table/operate/TableDeleteOperateBtn'
    import TableRowDetailOperateBtn from '~Components/regular/common/table/operate/TableRowDetailOperateBtn'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    export default {
        name: "AnnouncementAllListView",
        components:{QueryFormComp,RowDetailDrawerComp,
            TableHeadInfo,OblTableAction,TableOperateBtn,TableRowDetailOperateBtn,TableDeleteOperateBtn
        },
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                title: {
                    key:'title',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.em.announcement.title'),
                    decorator:["title", {rules: []}],
                },
                keyWord: {
                    key:'keyWord',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.em.announcement.keyWord'),
                    decorator:["keyWord", {rules: []}],
                },
                tagIds: {
                    key:'tagIds',
                    formType:FormItemTypeEnum.Select,
                    label:this.$t('langMap.table.fields.em.announcement.tagNameOfStr'),
                    decorator:["tagIds", {rules: []}],
                    options:[],
                    drawerAble:false
                },
                tagNameOfStr:{
                    label:this.$t('langMap.table.fields.em.announcement.tagNameOfStr'),
                    key:'tagNameOfStr',searchAble:false,
                },
                content:{
                    key:'content',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.em.announcement.content'),
                    decorator:["content", {rules: []}],
                    fieldType:DrawerFieldTypeEnum.HtmlDom
                },
                remark:{
                    label:this.$t('langMap.table.fields.common.remark'),
                    key:'remark'
                }
            };
            return {
                ConstantObj,
                binding:{
                    announcementTagList:[]
                },
                searchConf:{
                    loadingFlag:false,
                    formItemConf:fieldBaseConf
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.em.announcement.title'),
                        align:textAlignDefault,
                        dataIndex: 'title',
                        width:100,
                        key: 'title'
                    }, {
                        title: this.$t('langMap.table.fields.em.announcement.keyWord'),
                        align:textAlignDefault,
                        dataIndex: 'keyWord',
                        width:100,
                        key: 'keyWord',
                    },  {
                        title: this.$t('langMap.table.fields.em.announcement.tagNameOfStr'),
                        align:textAlignDefault,
                        key: 'tagNames',
                        width:150,
                        scopedSlots: { customRender: 'tagNamesRender' },
                    }, {
                        title: this.$t('langMap.table.fields.em.announcement.content'),
                        align:textAlignDefault,
                        dataIndex: 'shortContent',
                        width:300,
                        key: 'shortContent',
                    }, {
                        title: this.$t('langMap.table.fields.em.department.publishDepartment'),
                        align:textAlignDefault,
                        dataIndex: 'publishDepartment',
                        width:100,
                        key: 'publishDepartment',
                    },{
                        title:this.$t('langMap.table.header.operation'),
                        align:textAlignDefault,
                        dataIndex:"operation",
                        key:'operation',
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
                dialogFormObj: {
                    title: '',
                    keyWord: '',
                    tagIds: ''
                },
                drawerConf:{
                    detail:{
                        announcement:{
                            conf:{
                                title:this.$t('langMap.drawer.em.title.detailForAnnouncement'),
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
            dealQueryAllAnnouncementTag(){    //取得所有的 公告标签
                var _this = this ;
                AnnouncementAllListApi.getAllAnnouncementTagEnums().then((res) =>{
                    if(res.success){
                        _this.binding.announcementTagList = res.gridList ;
                    }
                })
            },
            dealBatchDel() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                AnnouncementAllListApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                AnnouncementAllListApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            handleSearchFormQuery(e,values) {    //带查询条件 检索公告列表
                const _this = this;
                _this.changeQueryLoading(true);
                AnnouncementAllListApi.getPageQuery(values,_this.tableConf).then((res) => {
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
            handleDetailDrawerShow(e,record){   //Drawer-公告 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.announcement.dataObj = record ;
                    this.drawerConf.detail.announcement.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-公告 详情关闭
                this.drawerConf.detail.announcement.visible = false ;
            },
            handleAnnouncementViewItemClick(e,item){    //查看公告
                let params = item ;
                this.mixin_jump(routerConst.announcement.display,params);
            }
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.tagIds.options = this.binding.announcementTagList ;
                },
                deep: true,
                immediate:true
            }
        },
        created(){
            this.dealQueryAllAnnouncementTag();
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("所有公告-页面销毁 ...")
        }
    }
</script>
<style>

</style>
