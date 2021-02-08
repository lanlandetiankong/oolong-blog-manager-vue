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
            <define-department-create-form-comp
                v-if="dialogFormConf.initFlag"
                ref="defineDepartmentCreateFormRef"
                :visible="dialogFormConf.visible"
                :formObj="dialogFormObj"
                :actionType="dialogFormConf.actionType"
                :parentSelectTrees="binding.pidList"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            >
            </define-department-create-form-comp>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.defineDepartment.conf"
                :dataObj="drawerConf.detail.defineDepartment.dataObj"
                :visible="drawerConf.detail.defineDepartment.visible"
                :drawerFieldConf="drawerConf.detail.defineDepartment.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>
<script>
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import ACol from "ant-design-vue/es/grid/Col";

    import {DepartmentManagerApi} from './departmentManagerApi.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";
    import TableHeadInfo from '~Components/regular/common/table/TableHeadInfo'
    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import DefineDepartmentCreateFormComp from '~Components/index/em/user/employee/department/DefineDepartmentCreateFormComp';
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    export default {
        name: "DepartmentManagerView",
        components: {QueryFormComp,TableHeadInfo,DefineDepartmentCreateFormComp,RowDetailDrawerComp,ACol, AFormItem},
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldBaseConf = {
                pid: {
                    key:'pid',
                    formType:FormItemTypeEnum.TreeSelect,
                    label:this.$t('langMap.table.fields.common.superiorName'),
                    decorator:["pid", {rules: []}],
                    treeDefaultExpandAll:false,
                    treeNodeFilterProp:"title",
                    treeData:[],
                    drawerAble:false
                },
                name: {
                    key:'name',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.common.name'),
                    decorator:["name", {rules: []}],
                },
                parentDepartmentName:{
                    label:this.$t('langMap.table.fields.em.department.parentDepartmentName'),
                    key:'parentDepartmentName',searchAble:false
                },
                code: {
                    key:'code',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.common.code'),
                    decorator:["code", {rules: []}],
                },
                level: {
                    key:'level',
                    formType:FormItemTypeEnum.InputNumber,
                    label:this.$t('langMap.table.fields.common.level'),
                    decorator:["level", {rules: []}],
                },
                description: {
                    key:'description',
                    formType:FormItemTypeEnum.Input,
                    label:this.$t('langMap.table.fields.common.description'),
                    decorator:["description", {rules: []}],
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
                        title: this.$t('langMap.table.fields.em.department.departmentName'),
                        align:textAlignDefault,
                        dataIndex: 'name',
                        key: 'name',
                    }, {
                        title: this.$t('langMap.table.fields.em.department.parentDepartmentName'),
                        align:textAlignDefault,
                        dataIndex: 'parentName',
                        key: 'parentName',
                        width:100,
                    },{
                        title: this.$t('langMap.table.fields.common.code'),
                        align:textAlignDefault,
                        dataIndex: 'code',
                        key: 'code',
                    },{
                        title: this.$t('langMap.table.fields.common.level'),
                        align:textAlignDefault,
                        dataIndex: 'level',
                        key: 'level',
                    },{
                        title: this.$t('langMap.table.fields.common.weights'),
                        align:textAlignDefault,
                        dataIndex: 'weights',
                        key: 'weights',
                    },{
                        title: this.$t('langMap.table.fields.common.description'),
                        align:textAlignDefault,
                        dataIndex: 'description',
                        key: 'description',
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
                    sorter:{}
                },
                tableCheckIdList: [],
                dialogFormConf: {
                    initFlag:false,
                    visible: false,
                    actionType: "create"
                },
                dialogFormObj: {
                    name: '',
                    code: '',
                    level:0,
                    weights:0,
                    description:'',
                    pid:'',
                    type: ''
                },
                drawerConf:{
                    detail:{
                        defineDepartment:{
                            conf:{
                                title:this.$t('langMap.drawer.em.title.detailForDefineDepartment'),
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
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.defineDepartmentCreateFormRef.createForm;
            },
            dealGetPidTreeData(){  //取得 部门定义-树形数据
                var _this = this ;
                DepartmentManagerApi.getAllDefineDepartmentTree().then((res) => {
                    if(res.success){
                        _this.binding.pidList = res.gridList ;
                    }
                })
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
                DepartmentManagerApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                DepartmentManagerApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            handleSearchFormQuery(e,values) {  //带查询条件 检索部门列表
                var _this = this ;
                _this.changeQueryLoading(true);
                DepartmentManagerApi.getPageQuery(values,_this.tableConf).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total ;
                    //清空 已勾选
                    _this.tableCheckIdList = [] ;
                    _this.changeQueryLoading(false);
                }).catch((e) =>{
                    _this.changeQueryLoading(false);
                })
            },
            handleCreateByForm() {     //新增部门按钮-点击
                var _this = this;
                _this.dialogFormConf.initFlag = true ;  //弹窗初始化
                _this.dialogFormConf.visible = true;   //显示弹窗
                _this.dialogFormConf.actionType = "create";
                _this.dialogFormObj = {
                    level:0,
                    weights:0,
                };
            },
            handleUpdateByForm() {  //更新部门按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        DepartmentManagerApi.getItemById(selectRowId).then((res) => {
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
            handleCreateFormCancel(e) {  // 创建/更新 部门定义表单->取消
                var _this = this;
                _this.dialogFormConf.visible = false;
            },
            handleCreateFormSubmit(e) {   // 创建/更新 部门表单->提交
                var _this = this;
                const dialogFormObj = _this.dealGetDialogRefFormObj();
                dialogFormObj.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    var closeDialogFlag = true;
                    if (_this.dialogFormConf.actionType == "create") {        //新建-提交
                        DepartmentManagerApi.createByForm(values).then((res) => {
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
                        DepartmentManagerApi.updateByForm(values).then((res) => {
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
            handleParentTreeOfSearchChange(value){  //[上级部门] SelectTree cchange事件
                console.log("handleParentTreeOfSearchChange",value);
            },
            handleDetailDrawerShow(e,record){   //Drawer-部门定义 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.defineDepartment.dataObj = record ;
                    this.drawerConf.detail.defineDepartment.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-部门定义 详情关闭
                this.drawerConf.detail.defineDepartment.visible = false ;
            }
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.pid.treeData = this.binding.pidList ;
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
            console.log("部门管理-页面销毁 ...")
        }
    }
</script>

<style scoped>

</style>
