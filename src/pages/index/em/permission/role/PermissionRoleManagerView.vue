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
                    <a-col>
                        <a-button type="primary" icon="book"
                                  @click="handleGrantPermissionsById">
                            {{$t('langMap.button.actions.assigningPermissions')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button type="primary" icon="book"
                                  @click="handleGrantMenusById">
                            {{$t('langMap.button.actions.authorizationMenu')}}
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <a-divider/>
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
                    <span slot="typeStr" slot-scope="record">
                        <a-tag color="blue" :key="record.typeStr">
                            {{record.typeStr}}
                        </a-tag>
                    </span>
                    <obl-table-action slot="action" slot-scope="text,record">
                        <template slot="operates">
                            <table-operate-btn icon="book"
                                :content="$t('langMap.button.actions.authorize')"
                                @click="dealDefineRoleGrantPermissionsById(record.fid)"
                            >
                            </table-operate-btn>
                            <table-delete-operate-btn @click="handleDeleteOneById(record.fid)" />
                            <table-row-detail-operate-btn @click="handleDetailDrawerShow($event,record)" />
                        </template>
                    </obl-table-action>
                </a-table>
            </div>
        </div>
        <!-- 弹窗dom-区域 -->
        <div>
            <define-role-create-form-comp
                ref="defineRoleCreateFormRef"
                :visible="dialogFormConf.visible"
                :formObj="dialogFormObj"
                :actionType="dialogFormConf.actionType"
                :roleTypes="binding.roleTypes"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            >
            </define-role-create-form-comp>
            <role-grant-permission-form-comp
                v-if="dialogGrantPermissionConf.initFlag == true"
                :visible="dialogGrantPermissionConf.visible"
                :roleId="dialogGrantPermissionObj.roleId"
                :allItemArr="dialogGrantPermissionObj.allDataSource"
                :checkArr="dialogGrantPermissionObj.checkedIds"
                @grantPermissionFormCancel="handleRoleGrantPermissionFormCancel"
                @grantPermissionFormSubmit="handleRoleGrantPermissionFormSubmit"
            >
            </role-grant-permission-form-comp>
            <role-grant-menus-form-comp
                v-if="dialogGrantMenusConf.initFlag == true"
                :visible="dialogGrantMenusConf.visible"
                :roleId="dialogGrantMenusObj.roleId"
                :treeData="dialogGrantMenusObj.treeData"
                :checkArr="dialogGrantMenusObj.checkedIds"
                @grantMenusFormCancel="handleRoleGrantMenusFormCancel"
                @grantMenusFormSubmit="handleRoleGrantMenusFormSubmit"
            >
            </role-grant-menus-form-comp>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.defineRole.conf"
                :dataObj="drawerConf.detail.defineRole.dataObj"
                :visible="drawerConf.detail.defineRole.visible"
                :drawerFieldConf="drawerConf.detail.defineRole.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>

<script>
    import jquery from 'jquery' ;
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {PermissionRoleManagerApi} from './permissionRoleManagerApi.js'
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";
    import {AllEnum,EnumUtils} from '~Config/selectData.js';
    import {StringUtils} from "~Utils/basic/BeeUtil";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import TableHeadInfo from '~Components/regular/common/table/TableHeadInfo'
    import OblTableAction from '~Components/regular/common/table/OblTableAction'
    import TableOperateBtn from '~Components/regular/common/table/operate/TableOperateBtn'
    import TableDeleteOperateBtn from '~Components/regular/common/table/operate/TableDeleteOperateBtn'
    import TableRowDetailOperateBtn from '~Components/regular/common/table/operate/TableRowDetailOperateBtn'
    import DefineRoleCreateFormComp from '~Components/index/em/define/permission/role/DefineRoleCreateFormComp';
    import RoleGrantPermissionFormComp from '~Components/index/em/define/permission/role/RoleGrantPermissionFormComp';
    import RoleGrantMenusFormComp from '~Components/index/em/define/permission/role/RoleGrantMenusFormComp';
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    export default {
        name: "PermissionRoleManagerView",
        components: {
            QueryFormComp,RoleGrantPermissionFormComp, DefineRoleCreateFormComp,RowDetailDrawerComp,RoleGrantMenusFormComp,
            TableHeadInfo,OblTableAction,TableOperateBtn,TableRowDetailOperateBtn,TableDeleteOperateBtn
        },
        mixins:[OblCommonMixin],
        data(){
            const textAlignDefault = 'left';
            const fieldBaseConf = {
                name:{
                    key:'name',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.em.permission.permissionName'),
                    decorator:["name", {rules: []}],
                },
                code:{
                    key:'code',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.common.code'),
                    decorator:["code", {rules: []}],
                },
                type:{
                    key:'type',
                    formType:FormItemTypeEnum.Select,
                    label:this.$t('langMap.table.fields.common.type'),
                    decorator:["type", {rules: []}],
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
                    roleTypes:EnumUtils.toSelectData(AllEnum.RoleTypeEnum)
                },
                searchConf:{
                    loadingFlag:false,
                    formItemConf:fieldBaseConf
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.em.permission.permissionName'),
                        align:textAlignDefault,
                        dataIndex: 'name',
                        key: 'name'
                    }, {
                        title: this.$t('langMap.table.fields.common.code'),
                        align:textAlignDefault,
                        dataIndex: 'code',
                        key: 'code',
                    }, {
                        title: this.$t('langMap.table.fields.common.type'),
                        align:textAlignDefault,
                        key: 'typeStr',
                        scopedSlots: { customRender: 'typeStr' },
                    }, {
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
                    sorter:{}
                },
                tableCheckIdList: [],
                dialogFormConf: {
                    visible: false,
                    actionType: "create"
                },
                dialogFormObj: {
                    name: '',
                    code: '',
                    type: ''
                },
                dialogGrantPermissionConf:{
                    visible:false,
                    initFlag:false
                },
                dialogGrantPermissionObj: {
                    roleId:'',
                    all:[],
                    allDataSource:[],
                    checked:[],
                    checkedIds:[],
                },
                dialogGrantMenusConf:{
                    visible:false,
                    initFlag:false
                },
                dialogGrantMenusObj: {
                    roleId:'',
                    treeData:[],
                    checked:[],
                    checkedIds:[],
                },
                drawerConf:{
                    detail:{
                        defineRole:{
                            conf:{
                                title:this.$t('langMap.drawer.em.title.detailForDefineRole'),
                            },
                            visible:false,
                            dataObj:{},
                            drawerFieldConf:fieldBaseConf
                        },
                    },
                },
            }
        },
        methods:{
            changeQueryLoading(loadingFlag){   //修改[表格搜索]是否在 加载状态中
                if(typeof loadingFlag == "undefined" || loadingFlag == null){
                    loadingFlag = false ;
                }
                this.searchConf.loadingFlag = loadingFlag;
            },
            dealGetAllPermissionList(){  //取得 所有的权限定义
                var _this = this ;
                return PermissionRoleManagerApi.getAllDefinePermissions().then((res) => {
                    if(res.success){
                        _this.dialogGrantPermissionObj.all = res.gridList ;
                        _this.dealAllItemToTransferDataSource(res.gridList);
                    }
                })
            },
            dealGetAllMenuTreeList(){  //取得 所有的[菜单定义]Tree
                var _this = this ;
                return PermissionRoleManagerApi.getAllDefineMenuTree().then((res) => {
                    if(res.success){
                        _this.dialogGrantMenusObj.treeData = res.gridList ;
                    }
                })
            },
            dealAllItemToTransferDataSource(allItemArr){    //转化为 transfer可用的 数组对象
                var _this = this ;
                var dataSourceArrTemp = [] ;
                if(allItemArr && allItemArr.length > 0 ){
                    jquery.each(allItemArr,function (idx,val) {
                        if(val){
                            dataSourceArrTemp.push({
                                key:StringUtils.emptyIfNull(val.fid),
                                title:StringUtils.emptyIfNull(val.name),
                                description:StringUtils.emptyIfNull(val.remark),
                                disabled:false
                            })
                        }
                    })
                }
                _this.dialogGrantPermissionObj.allDataSource = dataSourceArrTemp ;
            },
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.defineRoleCreateFormRef.createForm;
            },
            dealBatchDeleteByIds() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                PermissionRoleManagerApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                PermissionRoleManagerApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDefineRoleGrantPermissionsById(selectRowId){        //授权页面弹窗-封装方法
                var _this = this ;
                if(_this.dialogGrantPermissionConf.initFlag == false){  //第一次进行分配权限时进行 所有权限 的数据加载
                    _this.dealGetAllPermissionList().then(()=>{
                        _this.dialogGrantPermissionConf.initFlag = true ;
                    }) ;
                }
                _this.dialogGrantPermissionObj.roleId = selectRowId ;
                if (selectRowId) {
                    PermissionRoleManagerApi.getAllPermissionByRoleId(selectRowId).then((res) => {
                        if(res){
                            _this.dialogGrantPermissionObj.checked = res.gridList;
                            var checkIdListTemp = [] ;
                            if(res.gridList && res.gridList.length > 0){
                                jquery.each(res.gridList,function (idx,val) {
                                    checkIdListTemp.push(val.fid);
                                })
                            }
                            _this.dialogGrantPermissionObj.checkedIds = checkIdListTemp;
                            _this.dialogGrantPermissionConf.visible = true;   //显示弹窗
                        }
                    })
                }   else {
                    this.$message.warning(this.$t('langMap.message.error.failedDueToNotGettingId'));
                }
            },
            dealDefineRoleGrantMenusById(selectRowId){        //[授权菜单]页面弹窗-封装方法
                var _this = this ;
                if(_this.dialogGrantMenusConf.initFlag == false){  //第一次进行[菜单授权]时进行 所有[菜单定义] 的数据加载
                    this.dealGetAllMenuTreeList().then(() => {
                        _this.dialogGrantMenusConf.initFlag = true ;
                    })
                }
                _this.dialogGrantMenusObj.roleId = selectRowId ;
                if (selectRowId) {
                    PermissionRoleManagerApi.getAllMenuByRoleId(selectRowId).then((res) => {
                        if(res){
                            _this.dialogGrantMenusObj.checked = res.gridList;
                            var checkIdListTemp = [] ;
                            if(res.gridList && res.gridList.length > 0){
                                jquery.each(res.gridList,function (idx,val) {
                                    checkIdListTemp.push(val.fid);
                                })
                            }
                            _this.dialogGrantMenusObj.checkedIds = checkIdListTemp;
                            _this.dialogGrantMenusConf.visible = true;   //显示弹窗
                        }
                    })
                }   else {
                    this.$message.warning(this.$t('langMap.message.error.failedDueToNotGettingId'));
                }
            },
            handleTransformData(){//数据转化
                const data = this.tableConf.data;
                if(!data){
                    return ;
                }
                //Map-角色类型
                let roleTypeMap = EnumUtils.toValMap(AllEnum.RoleTypeEnum);
                for (let idx in data){
                    let item = data[idx] ;
                    item['typeStr'] = roleTypeMap[item.type];
                }
            },
            handleSearchFormQuery(e,values) {   //带查询条件 检索角色列表
                var _this = this ;
                _this.changeQueryLoading(true);
                PermissionRoleManagerApi.getPageQuery(values,_this.tableConf).then((res) => {
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
            handleCreateByForm() {     //新增权限按钮-点击
                var _this = this;
                _this.dialogFormConf.visible = true;   //显示弹窗
                _this.dialogFormConf.actionType = "create";
                _this.dialogFormObj = {};
            },
            handleUpdateByForm() {  //更新权限按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        PermissionRoleManagerApi.getItemById(selectRowId).then((res) => {
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
                        content: _this.$t('langMap.message.confirm.isConfirmDeleteWhatSelectedRow',[selectDelIds.length]),
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
            handleGrantPermissionsById(e) {     // 分配权限
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForAssigningPermissions'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForAssigningPermissions'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    //封装方法 处理
                    _this.dealDefineRoleGrantPermissionsById(selectRowId);
                }
            },
            handleGrantMenusById(e) {     // [授权菜单]
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForAuthorizationMenu'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForAuthorizationMenu'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    //封装方法 处理
                    _this.dealDefineRoleGrantMenusById(selectRowId);
                }
            },
            handleCreateFormCancel(e) {  // 创建/更新 权限定义表单->取消
                var _this = this;
                _this.dialogFormConf.visible = false;
            },
            handleCreateFormSubmit(e) {   // 创建/更新 权限表单->提交
                var _this = this;
                const dialogFormObj = _this.dealGetDialogRefFormObj();
                dialogFormObj.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    var closeDialogFlag = true;
                    if (_this.dialogFormConf.actionType == "create") {        //新建-提交
                        PermissionRoleManagerApi.createByForm(values).then((res) => {
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
                        PermissionRoleManagerApi.updateByForm(values).then((res) => {
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
            handleRoleGrantPermissionFormCancel(e) {  // 角色授权表单->取消
                var _this = this;
                _this.dialogGrantPermissionConf.visible = false;
            },
            handleRoleGrantPermissionFormSubmit(e,roleId,targetIdList) {   // 角色授权->提交
                var _this = this;
                PermissionRoleManagerApi.grantPermissionToRole(roleId,targetIdList).then((res) =>{
                    var closeDialogFlag = true ;
                    if (res.success) {  //异常已经有预处理了
                        _this.$message.success(res.msg);
                    } else {
                        closeDialogFlag = false;
                    }
                    if (closeDialogFlag == true) {    //关闭弹窗
                        _this.dialogGrantPermissionConf.visible = false;
                    }
                });
            },
            handleRoleGrantMenusFormCancel(e) {  // [授权菜单]表单->取消
                var _this = this;
                _this.dialogGrantMenusConf.visible = false;
            },
            handleRoleGrantMenusFormSubmit(e,roleId,checkIds,halfCheckIds) {   // [授权菜单]表单->提交
                var _this = this;
                PermissionRoleManagerApi.grantMenusToRole(roleId,checkIds,halfCheckIds).then((res) =>{
                    var closeDialogFlag = true ;
                    if (res.success) {  //异常已经有预处理了
                        _this.$message.success(res.msg);
                    } else {
                        closeDialogFlag = false;
                    }
                    if (closeDialogFlag == true) {    //关闭弹窗
                        _this.dialogGrantMenusConf.visible = false;
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
                this.tableConf.pagination = pagination ;
                this.tableConf.filters = filters ;
                this.tableConf.sorter = sorter ;
                this.mixin_invokeQuery(this);
            },
            handleDetailDrawerShow(e,record){   //Drawer-角色定义 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.defineRole.dataObj = record ;
                    this.drawerConf.detail.defineRole.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-角色定义 详情关闭
                this.drawerConf.detail.defineRole.visible = false ;
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
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.type.options = this.binding.roleTypes ;
                },
                deep: true,
                immediate:true
            }
        },
        created(){},
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("权限角色-页面销毁 ...")
        }
    }
</script>
<style scoped>

</style>
