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
                        <a-button icon="upload"
                                  @click="handleUploadExcelModeltnClick"
                        >
                            {{$t('langMap.button.actions.uploadExportExcelTemplate')}}
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
                                 <a-icon :type="record.iconName" />
                            </span>
                    </span>
                    <span slot="urlJumpTypeStrRender" slot-scope="text,record">
                        <a-tag color="blue" :key="record.urlJumpTypeStr">
                            {{record.urlJumpTypeStr}}
                        </a-tag>
                    </span>
                    <template slot="action" slot-scope="text,record">
                        <span>
                            <a @click="handleDetailDrawerShow($event,record)">
                                {{$t('langMap.drawer.actions.detail')}}
                            </a>
                            <a-divider type="vertical" />
                            <a-button type="danger" size="small" @click="handleDeleteOneById(record.fid)">{{$t('langMap.button.actions.delById')}}</a-button>
                        </span>
                    </template>
                </a-table>
            </div>
        </div>
        <!-- 弹窗dom-区域 -->
        <div>
            <define-menu-create-form-comp
                v-if="dialogFormConf.initFlag"
                ref="defineMenuCreateFormRef"
                :visible="dialogFormConf.visible"
                :formObj="dialogFormObj"
                :actionType="dialogFormConf.actionType"
                :menuUrlJumpTypes="binding.urlJumpTypes"
                :parentSelectTrees="binding.pidList"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            >
            </define-menu-create-form-comp>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.defineMenu.conf"
                :dataObj="drawerConf.detail.defineMenu.dataObj"
                :visible="drawerConf.detail.defineMenu.visible"
                :drawerFieldConf="drawerConf.detail.defineMenu.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
            <excel-templet-upload-comp
                v-if="uploadExcelModelconf.visible"
                :visible="uploadExcelModelconf.visible"
                :modalCompTitle="uploadExcelModelconf.title"
                :limitSize="uploadExcelModelconf.limitSize"
                :moreData="uploadExcelModelconf.moreData"
                :uploadedBeanList="uploadExcelModelconf.uploadedBeanList"
                @modalCancel="handleUploadExcelModelModalCancel"
                @modalSubmit="handleUploadExcelModelModalSubmit"
            />
        </div>
    </div>
</template>
<script>
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ACol from "ant-design-vue/es/grid/Col";
    import {MenuUrlJumpTypeEnum,EnumUtils} from '~Config/selectData.js';

    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {MenuManagerApi} from './menuManagerApi.js'
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import DefineMenuCreateFormComp from "~Components/index/em/define/permission/menu/DefineMenuCreateFormComp";
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    import ExcelTempletUploadComp from '~Components/regular/common/excel/ExcelTempletUploadComp';
    export default {
        name: "MenuManagerView",
        components: {QueryFormComp,DefineMenuCreateFormComp,RowDetailDrawerComp,ExcelTempletUploadComp, ACol, AFormItem},
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left';
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                menuName:{
                    key:'menuName',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.em.menu.menuName'),
                    decorator:["menuName", {rules: []}],
                },
                pid:{
                    key:'pid',
                    formType:FormItemTypeEnum.TreeSelect,
                    label:this.$t('langMap.table.fields.em.menu.parentMenuName'),
                    decorator:["pid", {rules: []}],
                    treeDefaultExpandAll:false,
                    treeNodeFilterProp:"title",
                    treeData:[],
                    drawerAble:false
                },
                parentMenuName:{
                    label:this.$t('langMap.table.fields.em.menu.parentMenuName'),
                    key:'parentMenuName',searchAble:false
                },
                label:{
                    key:'label',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.common.label'),
                    decorator:["label", {rules: []}],
                },
                routerUrl:{
                    key:'routerUrl',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.em.menu.routerUrl'),
                    decorator:["routerUrl", {rules: []}],
                },
                hrefUrl:{
                    key:'hrefUrl',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.em.menu.hrefUrl'),
                    decorator:["hrefUrl", {rules: []}],
                },
                urlJumpType:{
                    key:'urlJumpType',
                    formType:FormItemTypeEnum.Select,
                    label:this.$t('langMap.table.fields.em.menu.urlJumpType'),
                    decorator:["urlJumpType", {rules: []}],
                    options:[]
                },
                remark:{
                    key:'remark',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.common.remark'),
                    decorator:["remark", {rules: []}],
                }
            };
            return {
                ConstantObj,
                binding:{
                    urlJumpTypes:EnumUtils.toSelectData(MenuUrlJumpTypeEnum),
                    pidList:[]
                },
                searchConf:{
                    showAble:false,
                    loadingFlag:false,
                    formItemConf:fieldBaseConf
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.em.menu.menuName'),
                        align:textAlignDefault,
                        dataIndex: 'menuName',
                        key: 'menuName',
                        width:100,
                    },{
                        title: this.$t('langMap.table.fields.em.menu.parentMenuName'),
                        align:textAlignDefault,
                        dataIndex: 'parentName',
                        key: 'parentName',
                        width:100,
                    },{
                        title: this.$t('langMap.table.fields.em.menu.iconName'),
                        align:textAlignDefault,
                        dataIndex: 'iconName',
                        key: 'iconName',
                        scopedSlots:{
                            customRender:'iconRender'
                        },
                        width:60
                    },{
                        title: this.$t('langMap.table.fields.common.label'),
                        align:textAlignDefault,
                        dataIndex: 'label',
                        key: 'label',
                        width:70
                    },{
                        title: this.$t('langMap.table.fields.common.level'),
                        align:textAlignDefault,
                        dataIndex: 'level',
                        key: 'level',
                        width:70
                    },{
                        title:this.$t('langMap.table.fields.em.menu.urlJumpType'),
                        align:textAlignDefault,
                        dataIndex: 'urlJumpTypeStr',
                        key: 'urlJumpTypeStr',
                        width:120,
                        scopedSlots:{
                            customRender:'urlJumpTypeStrRender'
                        }
                    },{
                        title: this.$t('langMap.table.fields.em.menu.routerUrl'),
                        align:textAlignDefault,
                        dataIndex: 'routerUrl',
                        key: 'routerUrl',
                        width:140
                    },{
                        title: this.$t('langMap.table.fields.em.menu.hrefUrl'),
                        align:textAlignDefault,
                        dataIndex: 'hrefUrl',
                        key: 'hrefUrl',
                        width:140
                    },{
                        title: this.$t('langMap.table.fields.common.weights'),
                        align:textAlignDefault,
                        dataIndex: 'weights',
                        key: 'weights',
                        width:70
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
                        x: 1400
                    },
                    bordered:true
                },
                tableCheckIdList: [],
                tableCheckRowList: [],
                dialogFormConf: {
                    initFlag:false,
                    visible: false,
                    actionType: "create"
                },
                dialogFormObj: {
                    menuName: '',
                    pid:'',
                    label: '',
                    weights:0,
                    iconName:'',
                    styleVal:'',
                    typeVal: '',
                },
                drawerConf:{
                    detail:{
                        defineMenu:{
                            conf:{
                                title:this.$t('langMap.drawer.em.title.detailForDefineMenu'),
                            },
                            visible:false,
                            dataObj:{},
                            drawerFieldConf:fieldBaseConf
                        },
                    },
                },
                uploadExcelModelconf:{
                    visible:false,
                    title:"Excel模板上传",
                    limitSize:1,
                    moreData:{
                        prefixFolder:"/menuManager",
                        fid:''
                    },
                    uploadedBeanList:[] //当前菜单已经设置的已上传的文件列表
                }
            }
        },
        computed:{
            rowSelection() {    //行选择
                return {
                    selectedRowKeys: this.tableCheckIdList,
                    onChange: (selectedRowKeys, selectedRows) => {  //勾选 修改事件
                        this.tableCheckIdList = selectedRowKeys;
                        this.tableCheckRowList = selectedRows;
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
            dealGetPidTreeData(){  //取得 菜单定义-树形数据
                var _this = this ;
                MenuManagerApi.getTreeDataAll().then((res) => {
                    if(res.success){
                        _this.binding.pidList = res.gridList ;
                    }
                })
            },
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.defineMenuCreateFormRef.createForm;
            },
            changeQueryLoading(loadingFlag){   //修改[表格搜索]是否在 加载状态中
                if(typeof loadingFlag == "undefined" || loadingFlag == null){
                    loadingFlag = false ;
                }
                this.searchConf.loadingFlag = loadingFlag;
            },
            dealBatchDeleteByIds() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                MenuManagerApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                MenuManagerApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            handleSearchFormQuery(e,values) {   //带查询条件 检索菜单列表
                var _this = this ;
                _this.changeQueryLoading(true);
                MenuManagerApi.getPageQuery(values,_this.tableConf).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total ;
                    //清空 已勾选
                    _this.tableCheckIdList = [] ;
                    _this.tableCheckRowList = [] ;
                    _this.changeQueryLoading(false);
                }).catch((e) =>{
                    _this.changeQueryLoading(false);
                })
            },
            handleCreateByForm() {     //新增菜单按钮-点击
                var _this = this;
                _this.dialogFormConf.initFlag = true ;  //弹窗初始化
                _this.dialogFormConf.visible = true;   //显示弹窗
                _this.dialogFormConf.actionType = "create";
                _this.dialogFormObj = {
                    weights:0
                };
            },
            handleUpdateByForm() {  //更新菜单按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        MenuManagerApi.getItemById(selectRowId).then((res) => {
                            var selectUserBean = res.bean;
                            if (selectUserBean) {
                                _this.dialogFormConf.initFlag = true ;  //弹窗初始化
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
            handleUploadExcelModeltnClick() {  //[上传导出Excel模板]-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUploadExcelTemplate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUploadExcelTemplate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    var selectRowItem = _this.tableCheckRowList[0] ;
                    if (selectRowId) {
                        _this.uploadExcelModelconf.title = "["+selectRowItem.menuName + "]Excel模板上传" ;
                        _this.uploadExcelModelconf.visible = true ;
                        _this.uploadExcelModelconf.moreData['fid'] = selectRowId ;
                        _this.uploadExcelModelconf.uploadedBeanList = selectRowItem.uploadExcelBeanList ;
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
            handleCreateFormCancel(e) {  // 创建/更新 菜单定义表单->取消
                var _this = this;
                _this.dialogFormConf.visible = false;
            },
            handleCreateFormSubmit(e) {   // 创建/更新 菜单表单->提交
                var _this = this;
                const dialogFormObj = _this.dealGetDialogRefFormObj();
                dialogFormObj.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    var closeDialogFlag = true;
                    if (_this.dialogFormConf.actionType == "create") {        //新建-提交
                        MenuManagerApi.createByForm(values).then((res) => {
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
                        MenuManagerApi.updateByForm(values).then((res) => {
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
            handleUploadExcelModelModalCancel(e) {  // [上传Excel导出模板]->取消
                var _this = this;
                _this.uploadExcelModelconf.visible = false;
            },
            handleUploadExcelModelModalSubmit(e,uploadedFileList,processData) {   // [上传Excel导出模板]->提交
                var _this = this;
                var closeDialogFlag = true;
                var fid = _this.uploadExcelModelconf.moreData.fid ;
                var fileItem ;
                if(uploadedFileList){
                    fileItem = uploadedFileList[0] ;    //只取第一个
                }
                MenuManagerApi.updateExcelModel(fid,fileItem).then((res) => {
                    if (res.success) {
                        this.$message.success(res.msg);
                    } else {
                        closeDialogFlag = false;
                    }
                    if (closeDialogFlag == true) {    //关闭弹窗
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                        _this.uploadExcelModelconf.visible = false;
                    }
                })


                _this.uploadExcelModelconf.visible = false;
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
            handleParentTreeOfSearchChange(value){  //[上级菜单] SelectTree cchange事件
                console.log("handleParentTreeOfSearchChange",value);
            },
            handleDetailDrawerShow(e,record){   //Drawer-菜单定义 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.defineMenu.dataObj = record ;
                    this.drawerConf.detail.defineMenu.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-菜单定义 详情关闭
                this.drawerConf.detail.defineMenu.visible = false ;
            }
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.pid.treeData = this.binding.pidList ;
                    this.searchConf.formItemConf.urlJumpType.options = this.binding.urlJumpTypes ;
                },
                deep: true,
                immediate:true
            }
        },
        created(){
            this.dealGetPidTreeData();
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("菜单管理-页面销毁 ...")
        }
    }
</script>

<style scoped>

</style>
