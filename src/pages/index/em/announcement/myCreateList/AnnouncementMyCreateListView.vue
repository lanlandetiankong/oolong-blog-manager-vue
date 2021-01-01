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
                >
                    <a-col>
                        <a-button type="danger" icon="delete"
                                  @click="handleBatchDeleteByIds">
                            {{$t('langMap.button.actions.batchDelByIds')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-switch
                            :checkedChildren="$t('langMap.table.config.showQuery')"
                            :unCheckedChildren="$t('langMap.table.config.hiddenQuery')"
                            size="large"
                            :style="{height:'30px'}"
                            v-model="searchConf.showAble"
                        />
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
                    <span slot="tagNamesRender" slot-scope="record">
                        <template v-for="tagNameItem in record.tagNames">
                            <a-tag color="blue" :key="tagNameItem">
                                {{tagNameItem}}
                            </a-tag>
                        </template>
                    </span>
                    <template slot="action" slot-scope="text,record">
                        <a @click="handleDetailDrawerShow($event,record)">
                                {{$t('langMap.drawer.actions.detail')}}
                            </a>
                            <a-divider type="vertical" />
                        <a-button type="danger" size="small" @click="handleDeleteOneById(record.fid)">{{$t('langMap.button.actions.delById')}}</a-button>
                    </template>
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
    import {AnnouncementMyCreateListApi} from './announcementMyCreateListApi'
    import {DrawerFieldTypeEnum,QueryMatchType} from '~Components/regular/common/drawer/drawer_define.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";
    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';

    export default {
        name: "AnnouncementAllListView",
        components:{QueryFormComp,RowDetailDrawerComp},
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldInfoConfObj = {
                title:{
                    fieldLabel:this.$t('langMap.table.fields.em.announcement.title'),
                    fieldName:'title', matching:QueryMatchType.like,
                },
                keyWord:{
                    fieldLabel:this.$t('langMap.table.fields.em.announcement.keyWord'),
                    fieldName:'keyWord', matching:QueryMatchType.like,
                },
                tagIds:{
                    fieldName:'tagIds', matching:QueryMatchType.like,drawerAble:false,
                },
                tagNameOfStr:{
                    fieldLabel:this.$t('langMap.table.fields.em.announcement.tagNameOfStr'),
                    fieldName:'tagNameOfStr',searchAble:false,
                },
                content:{
                    fieldLabel:this.$t('langMap.table.fields.em.announcement.content'),
                    fieldName:'content', matching:QueryMatchType.like,type:DrawerFieldTypeEnum.HtmlDom
                },
                remark:{
                    fieldLabel:this.$t('langMap.table.fields.common.remark'),
                    fieldName:'remark', matching:QueryMatchType.like,
                }
            };
            return {
                ConstantObj,
                fieldInfoConf:fieldInfoConfObj,
                binding:{
                    announcementTagList:[]
                },
                searchConf:{
                    showAble:false,
                    loadingFlag:false,
                    formItemConf:{
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
                            options:[]
                        },
                        content:{
                            key:'content',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.em.announcement.content'),
                            decorator:["content", {rules: []}],
                        }
                    }
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.em.announcement.title'),
                        align:textAlignDefault,
                        dataIndex: 'title',
                        key: 'title',
                        width:100,
                    }, {
                        title: this.$t('langMap.table.fields.em.announcement.keyWord'),
                        align:textAlignDefault,
                        dataIndex: 'keyWord',
                        key: 'keyWord',
                        width:100,
                    },{
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
                    },  {
                        title: this.$t('langMap.table.fields.em.department.publishDepartment'),
                        align:textAlignDefault,
                        dataIndex: 'publishDepartment',
                        width:100,
                        key: 'publishDepartment',
                    }, {
                        title:this.$t('langMap.table.header.operation'),
                        key:'operation',
                        width: 220,
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
            dealGetAllAnnouncementTagList(){    //取得所有的 公告标签
                var _this = this ;
                AnnouncementMyCreateListApi.getAllAnnouncementTagEnums().then((res) =>{
                    if(res.success){
                        _this.binding.announcementTagList = res.enumData.list ;
                    }
                })
            },
            dealBatchDeleteByIds() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                AnnouncementMyCreateListApi.batchDeleteByIds(delIds).then((res) => {
                    if (res) {
                        if (res.success) {  //已经有对错误进行预处理
                            this.$message.success(res.msg);
                            _this.mixin_invokeQuery(_this); //表格重新搜索
                        }
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                AnnouncementMyCreateListApi.deleteById(delId).then((res) => {
                    if (res) {
                        if (res.success) {  //已经有对错误进行预处理
                            _this.$message.success(res.msg);
                            _this.mixin_invokeQuery(_this); //表格重新搜索
                        }
                    }
                })
            },
            handleSearchFormQuery(e,values) {
                var _this = this ;
                //取得 bean 形式 的查询条件数组
                var searchFieldArr = _this.mixin_dealGetSearchFormQueryConf(_this.fieldInfoConf,values);
                _this.changeQueryLoading(true);
                AnnouncementMyCreateListApi.getPageQueryOfMyCreate(searchFieldArr,_this.tableConf.pagination,_this.tableConf.sorter).then((res) => {
                    if (res) {
                        this.tableConf.data = res.gridList;
                        if(res.vpage){ //总个数
                            this.tableConf.pagination.total = res.vpage.total ;
                        }
                        //清空 已勾选
                        _this.tableCheckIdList = [] ;
                    }
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
                            _this.dealBatchDeleteByIds();
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
            this.dealGetAllAnnouncementTagList();
            var currentRoute = this.$route ;
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("我创建的公告列表-页面销毁 ...")
        }
    }
</script>
<style>

</style>
