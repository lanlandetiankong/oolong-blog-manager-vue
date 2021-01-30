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
                                  v-show="mixin_handlePermissionDomShow('PermCtrl:Permission_Add')"
                                  @click="handleUpdateByForm"
                        >
                            {{$t('langMap.button.actions.updateByForm')}}
                        </a-button>
                    </a-col>
                    <a-col >
                        <a-button type="danger" icon="delete"
                                  @click="handleBatchDeleteByIds">
                            {{$t('langMap.button.actions.batchDelByIds')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button type="primary" icon="check"
                                  @click="handleBatchEnusreByIds">
                            {{$t('langMap.button.actions.startUsing')}}
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
                    @change="handleTableChange"
                >
                    <span slot="ensureStr" slot-scope="record">
                        <a-tag :color="record.ensure ? 'blue' : 'red'" :key="record.ensure">
                            {{record.ensureStr}}
                        </a-tag>
                    </span>
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
                            <a-divider type="vertical" />
                            <a-button type="danger" size="small" @click="handleDeleteOneById(record.fid)" v-show="record.ensure != 1">
                                {{$t('langMap.button.actions.delById')}}
                            </a-button>
                        </span>
                    </template>
                </a-table>
            </div>
        </div>
        <!-- 弹窗dom-区域 -->
        <div>
            <define-permission-create-form-comp
                ref="definePermissionCreateFormRef"
                :visible="dialogFormConf.visible"
                :formObj="dialogFormObj"
                :actionType="dialogFormConf.actionType"
                :permissionTypes="binding.permissionTypes"
                :permissonCodePrefixs="binding.codePrefixList"
                :permissonCodePrefixDefaultChecks="binding.codePrefixDefaultChecks"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            >
            </define-permission-create-form-comp>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.definePermission.conf"
                :dataObj="drawerConf.detail.definePermission.dataObj"
                :visible="drawerConf.detail.definePermission.visible"
                :drawerFieldConf="drawerConf.detail.definePermission.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';

    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ACol from "ant-design-vue/es/grid/Col";

    import {PermissionManagerApi} from './permissionManagerApi.js'
    import {PermissionCommonApis} from '~Apis/permission/PermissionCommonApis.js'
    import {BindingCommonApis} from '~Apis/common/CommonApis.js'
    import {DrawerFieldTypeEnum} from '~Components/regular/common/drawer/drawer_define.js'
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import DefinePermissionCreateFormComp from "~Components/index/em/define/permission/manager/DefinePermissionCreateFormComp";
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    export default {
        name: "PermissionManagerView",
        components: {QueryFormComp,DefinePermissionCreateFormComp,RowDetailDrawerComp, ACol, AFormItem},
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left';
            //字段配置(Query/Drawer)
            const fieldInfoConfObj = {
                name:{
                    fieldLabel:this.$t('langMap.table.fields.em.permission.permissionName'),
                    fieldName:'name'
                },
                code:{
                    fieldLabel:this.$t('langMap.table.fields.common.code'),
                    fieldName:'code'},
                type:{
                    fieldLabel:this.$t('langMap.table.fields.common.type'),
                    fieldName:'type'
                },
                ensure:{
                    fieldLabel:this.$t('langMap.table.fields.common.startUsingStatus'),
                    fieldName:'ensure'
                },
                remark:{
                    fieldLabel:this.$t('langMap.table.fields.common.remark'),
                    fieldName:'remark'
                }
            };
            return {
                ConstantObj,
                fieldInfoConf:fieldInfoConfObj,
                binding:{
                    permissionTypes:[],
                    codePrefixList:[],
                    codePrefixDefaultChecks:[],
                    switchEnums:[]
                },
                searchConf:{
                    showAble:false,
                    loadingFlag:false,
                    formItemConf:{
                        name:{
                            key:'name',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.em.permission.permissionName'),
                            decorator:["name", {rules: []}],
                        },
                        code: {
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
                        ensure:{
                            key:'ensure',
                            formType:FormItemTypeEnum.Select,
                            label:this.$t('langMap.table.fields.common.startUsingStatus'),
                            decorator:["ensure", {rules: []}],
                            options:[]
                        },
                        remark:{
                            key:'remark',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.common.remark'),
                            decorator:["remark", {rules: []}],
                        }
                    },
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.common.title'),
                        align:textAlignDefault,
                        dataIndex: 'name',
                        key: 'name'
                    }, {
                        title: this.$t('langMap.table.fields.common.code'),
                        align:textAlignDefault,
                        dataIndex: 'code',
                        key: 'code',
                    }, {
                        title: this.$t('langMap.table.fields.common.startUsingStatus'),
                        align:textAlignDefault,
                        key: 'ensureStr',
                        scopedSlots: { customRender: 'ensureStr' },
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
                tableCheckRowList: [],
                dialogFormConf: {
                    visible: false,
                    actionType: "create"
                },
                dialogFormObj: {
                    name: '',
                    code: '',
                    type: ''
                },
                drawerConf:{
                    detail:{
                        definePermission:{
                            conf:{
                                title:this.$t('langMap.drawer.em.title.detailForDefinePermission'),
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
                        this.tableCheckRowList = selectedRows;
                    },
                    getCheckboxProps: record => ({  //选择框的默认属性配置
                        props: {
                            name:record.fid
                        }
                    }),
                };
            },
            ...mapGetters([
                'userInfoStore_grantedPermissions',
            ])
        },
        methods: {
            dealGetPermissionTypeEnumList(){  //取得 用户类型-枚举列表
                var _this = this ;
                PermissionCommonApis.getAllPermissionTypes().then((res) => {
                    if(res && res.success){
                        _this.binding.permissionTypes = res.enumData.list ;
                    }
                })
            },
            dealGetPermissionCodePrefixEnumList(){  //取得 权限定义Code前缀-枚举列表
                var _this = this ;
                PermissionCommonApis.getAllPermissionCodePrefixs().then((res) => {
                    if(res && res.success){
                        _this.binding.codePrefixList = res.enumData.list ;
                        _this.binding.codePrefixDefaultChecks = res.enumData.checkeds ;
                    }
                })
            },
            dealGetBindingSwitchEnumList(){  //取得 开关式取值-枚举列表
                var _this = this ;
                BindingCommonApis.getSwitchEnumList().then((res) => {
                    if(res && res.success){
                        _this.binding.switchEnums = res.enumData.list ;
                    }
                })
            },
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.definePermissionCreateFormRef.createForm;
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
                PermissionManagerApi.batchDeleteByIds(delIds).then((res) => {
                    if (res) {
                        if (res.success) {  //已经有对错误进行预处理
                            this.$message.success(res.msg);
                            _this.mixin_invokeQuery(_this); //表格重新搜索
                        }
                    }
                })
            },
            dealBatchEnusreDefinePermission() {  //批量启用
                var _this = this;
                var delIds = _this.tableCheckIdList;
                PermissionManagerApi.batchEnsureByIds(delIds).then((res) => {
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
                PermissionManagerApi.deleteById(delId).then((res) => {
                    if (res) {
                        if (res.success) {  //已经有对错误进行预处理
                            _this.$message.success(res.msg);
                            _this.mixin_invokeQuery(_this); //表格重新搜索
                        }
                    }
                })
            },
            handleSearchFormQuery(e,values) {   //带查询条件 检索权限列表
                var _this = this ;
                //取得 bean 形式 的查询条件数组
                var searchFieldArr = _this.mixin_dealGetSearchFormQueryConf(_this.fieldInfoConf,values);
                _this.changeQueryLoading(true);
                PermissionManagerApi.getPageQuery(searchFieldArr,_this.tableConf.pagination,_this.tableConf.sorter).then((res) => {
                    if (res) {
                        this.tableConf.data = res.gridList;
                        if(res.vpage){ //总个数
                            this.tableConf.pagination.total = res.vpage.total ;
                        }
                        //清空 已勾选
                        _this.tableCheckIdList = [] ;
                        _this.tableCheckRowList = [] ;
                    }
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
                        PermissionManagerApi.getItemById(selectRowId).then((res) => {
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
            handleBatchDeleteByIds(e) {     // 批量删除-确认框
                var _this = this;
                var selectDelIds = _this.tableCheckIdList;
                if (selectDelIds.length < 1) {
                    _this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForDelete'));
                } else {
                    var selectDelRows = _this.tableCheckRowList ;
                    var delAbleFlag = true ;    //是否可删除
                    for (var i in selectDelRows){
                        if(selectDelRows[i].ensure == 1){
                            delAbleFlag = false;
                            break;
                        }
                    }
                    if(delAbleFlag === true){
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
                    }   else {
                        _this.$message.warning(_this.$t('langMap.message.warning.doNotAllowSelectionOfStartUsing'));
                    }
                }
            },
            handleBatchEnusreByIds(e) {     // 批量启用-确认框
                var _this = this;
                var selectDelIds = _this.tableCheckIdList;
                if (selectDelIds.length < 1) {
                    _this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForStartUsing'));
                } else {
                    _this.$confirm({
                        content: _this.$t('langMap.message.confirm.isConfirmStartUsingWhatSelectedRow',[selectDelIds.length]),
                        okText: _this.$t('langMap.button.actions.confirm'),
                        cancelText: _this.$t('langMap.button.actions.cancel'),
                        onOk() {
                            _this.dealBatchEnusreDefinePermission();
                        },
                        onCancel() {
                            _this.$message.info(_this.$t('langMap.message.account.actionOfCancelStartUsing'));
                        }
                    })
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
                        PermissionManagerApi.createByForm(values).then((res) => {
                            if (res) {
                                if (res.success) {  //异常已经有预处理了
                                    this.$message.success(res.msg);
                                    _this.mixin_invokeQuery(_this); //表格重新搜索
                                } else {
                                    closeDialogFlag = false;
                                }
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
                        PermissionManagerApi.updateByForm(values).then((res) => {
                            if (res) {
                                if (res.success) {  //异常已经有预处理了
                                    this.$message.success(res.msg);
                                    _this.mixin_invokeQuery(_this); //表格重新搜索
                                } else {
                                    closeDialogFlag = false;
                                }
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
                this.tableConf.pagination = pagination ;
                this.tableConf.filters = filters ;
                this.tableConf.sorter = sorter ;
                this.mixin_invokeQuery(this);
            },
            handleDetailDrawerShow(e,record){   //Drawer-详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.definePermission.dataObj = record ;
                    this.drawerConf.detail.definePermission.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-详情关闭
                this.drawerConf.detail.definePermission.visible = false ;
            }
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.type.options = this.binding.permissionTypes ;
                    this.searchConf.formItemConf.ensure.options = this.binding.switchEnums ;
                },
                deep: true,
                immediate:true
            }
        },
        created(){
            this.dealGetPermissionTypeEnumList();
            this.dealGetPermissionCodePrefixEnumList();
            this.dealGetBindingSwitchEnumList();
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("权限管理-页面销毁 ...")
        }
    }
</script>

<style scoped>

</style>
