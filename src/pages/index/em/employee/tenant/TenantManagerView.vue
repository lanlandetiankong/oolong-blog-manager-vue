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
                        <a-button type="primary" icon="edit"
                                  @click="handleTenantSetupManagerBtnClick">
                            {{$t('langMap.button.actions.setAdminManager')}}
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
                    @change="handleTableChange"
                >
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
            <define-tenant-create-form-comp
                ref="defineTenantCreateFormRef"
                :visible="dialog.form.conf.visible"
                :formObj="dialog.form.obj"
                :actionType="dialog.form.conf.actionType"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            >
            </define-tenant-create-form-comp>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.defineTenant.conf"
                :dataObj="drawerConf.detail.defineTenant.dataObj"
                :visible="drawerConf.detail.defineTenant.visible"
                :drawerFieldConf="drawerConf.detail.defineTenant.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
            <tenant-setup-manager-comp
                :visible="dialog.setupManager.conf.visible"
                :tenantId="dialog.setupManager.conf.tenantId"
                @setupManagerCancel="handleSetupManagerCancel"
                @setupManagerSubmit="handleSetupManagerSubmit"
            />
        </div>
    </div>
</template>
<script>
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ACol from "ant-design-vue/es/grid/Col";

    import {QueryMatchType} from '~Components/regular/common/drawer/drawer_define.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {TenantManagerApi} from './tenantManagerApi.js'
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import DefineTenantCreateFormComp from '~Components/index/em/user/employee/tenant/DefineTenantCreateFormComp'
    import TenantSetupManagerComp from '~Components/index/em/user/employee/tenant/TenantSetupManagerComp'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';

    export default {
        name: "TenantManagerView",
        components: { QueryFormComp,ACol, AFormItem,DefineTenantCreateFormComp,TenantSetupManagerComp,RowDetailDrawerComp},
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldInfoConfObj = {
                name:{
                    fieldLabel:this.$t('langMap.table.fields.em.tenant.tenantName'),
                    fieldName:'name', matching:QueryMatchType.like,
                },
                code:{
                    fieldLabel:this.$t('langMap.table.fields.common.code'),
                    fieldName:'code', matching:QueryMatchType.like,
                },
                remark:{
                    fieldLabel:this.$t('langMap.table.fields.common.remark'),
                    fieldName:'remark', matching:QueryMatchType.like,
                }
            };
            return {
                ConstantObj,
                fieldInfoConf:fieldInfoConfObj,
                searchConf:{
                    showAble:false,
                    loadingFlag:false,
                    formItemConf:{
                        name: {
                            key:'name',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.em.tenant.tenantName'),
                            decorator:["name", {rules: []}],
                        },
                        code: {
                            key:'code',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.common.code'),
                            decorator:["code", {rules: []}],
                        },
                        remark: {
                            key:'remark',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.common.remark'),
                            decorator:["remark", {rules: []}],
                        },
                    }
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.em.tenant.tenantName'),
                        align:textAlignDefault,
                        dataIndex: 'name',
                        key: 'name'
                    }, {
                        title: this.$t('langMap.table.fields.common.code'),
                        align:textAlignDefault,
                        dataIndex: 'code',
                        key: 'code',
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
                    sorter:{}
                },
                tableCheckIdList: [],
                dialogFormConf: {
                    visible: false,
                    actionType: "create"
                },
                dialog:{
                    form:{
                        conf:{
                            visible: false,
                            actionType: "create"
                        },
                        obj:{
                            name: '',
                            code: '',
                        }
                    },
                    setupManager:{
                        conf:{
                            visible: false,
                            tenantId:''
                        }
                    }
                },
                drawerConf:{
                    detail:{
                        defineTenant:{
                            conf:{
                                title:this.$t('langMap.drawer.em.title.detailForDefineTenant'),
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
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.defineTenantCreateFormRef.createForm;
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
                TenantManagerApi.batchDeleteByIds(delIds).then((res) => {
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
                TenantManagerApi.deleteById(delId).then((res) => {
                    if (res) {
                        if (res.success) {  //已经有对错误进行预处理
                            _this.$message.success(res.msg);
                            _this.mixin_invokeQuery(_this); //表格重新搜索
                        }
                    }
                })
            },
            handleSearchFormQuery(e,values) {   //带查询条件 检索租户列表
                var _this = this ;
                //取得 bean 形式 的查询条件数组
                var searchFieldArr = _this.mixin_dealGetSearchFormQueryConf(_this.fieldInfoConf,values);
                _this.changeQueryLoading(true);
                TenantManagerApi.getPageQuery(searchFieldArr,_this.tableConf.pagination,_this.tableConf.sorter).then((res) => {
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
            handleCreateByForm() {     //新增租户按钮-点击
                var _this = this;
                _this.dialog.form.conf.visible = true;   //显示弹窗
                _this.dialog.form.conf.actionType = "create";
                _this.dialog.form.obj = {};
            },
            handleUpdateByForm() {  //更新租户按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        TenantManagerApi.getItemById(selectRowId).then((res) => {
                            var selectBean = res.bean;
                            if (selectBean) {
                                _this.dialog.form.conf.visible = true;   //显示弹窗
                                _this.dialog.form.conf.actionType = "update";
                                _this.dialog.form.obj = selectBean;
                                //console.log(_this.dialog.form.obj);
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
                            _this.$message.info(_this.$t('langMap.message.account.actionOfCancelDelete'));
                        }
                    })
                }
            },
            handleCreateFormCancel(e) {  // 创建/更新 租户定义表单->取消
                var _this = this;
                _this.dialog.form.conf.visible = false;
            },
            handleCreateFormSubmit(e) {   // 创建/更新 租户表单->提交
                var _this = this;
                const dialogRefFormObj = _this.dealGetDialogRefFormObj();
                dialogRefFormObj.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    var closeDialogFlag = true;
                    if (_this.dialog.form.conf.actionType == "create") {        //新建-提交
                        TenantManagerApi.createByForm(values).then((res) => {
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
                        })
                    } else if (_this.dialog.form.conf.actionType == "update") {   //更新-提交
                        values['fid'] = _this.dialog.form.obj.fid;   //提交时，回填fid值
                        TenantManagerApi.updateByForm(values).then((res) => {
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
                        })
                    }
                    if (closeDialogFlag == true) {    //关闭弹窗
                        dialogRefFormObj.resetFields();
                        _this.dialog.form.conf.visible = false;
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
            handleDetailDrawerShow(e,record){   //Drawer-租户定义 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.defineTenant.dataObj = record ;
                    this.drawerConf.detail.defineTenant.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-租户定义 详情关闭
                this.drawerConf.detail.defineTenant.visible = false ;
            },
            handleTenantSetupManagerBtnClick() {  //更新租户按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        _this.dialog.setupManager.conf.visible = true;   //显示弹窗
                        _this.dialog.setupManager.conf.tenantId = selectRowId;
                    } else {
                        this.$message.warning(this.$t('langMap.message.error.failedDueToNotGettingId'));
                    }
                }
            },
            handleSetupManagerCancel(e){ //[设置管理员]-取消
                var _this = this;
                _this.dialog.setupManager.conf.visible = false;
            },
            handleSetupManagerSubmit(){ //[设置管理员]-提交
                var _this = this;
                _this.dialog.setupManager.conf.visible = false;
            }
        },
        created(){
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("租户管理-页面销毁 ...")
        }
    }
</script>

<style scoped>

</style>
