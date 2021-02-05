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
            <!-- 操作区域 -->
            <div>
                <a-row
                    :gutter="6"
                    justify="start"
                    type="flex"
                    align="middle"
                >
                    <a-col>
                        <a-button type="primary" icon="user-add"
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
                        <a-button type="danger" icon="user-delete"
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
        </div>
        <a-divider/>
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
                        <a-dropdown>
                              <a-menu slot="overlay" @click="handleTableActionGroupClick($event,record)">
                                    <a-menu-item key="recordDel">{{$t('langMap.button.actions.delById')}}</a-menu-item>
                              </a-menu>
                              <a-button> {{$t('langMap.button.actions.operate')}} <a-icon type="down" /> </a-button>
                        </a-dropdown>
                    </span>
                </template>
            </a-table>
        </div>
        <!-- 挂载弹窗、抽屉 等组件的dom -->
        <div>
            <employee-job-create-form-comp
                ref="employeeJobCreateFormRef"
                :visible="dialogFormConf.visible"
                :formObj="dialogFormObj"
                :actionType="dialogFormConf.actionType"
                :typeEnumArr="binding.types"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            />
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.employeeJob.conf"
                :dataObj="drawerConf.detail.employeeJob.dataObj"
                :visible="drawerConf.detail.employeeJob.visible"
                :drawerFieldConf="drawerConf.detail.employeeJob.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>

<script>
    import {EmpJobApi} from './empJobApi'
    import {JobTypeEnum,EnumUtils} from '~Config/selectData.js';
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";

    import QueryFormComp from '~Components/regular/query/QueryFormComp'
    import EmployeeJobCreateFormComp from '~Components/index/em/user/employee/job/EmployeeJobCreateFormComp'
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';

    import ACol from "ant-design-vue/es/grid/Col";
    import AFormItem from "ant-design-vue/es/form/FormItem";
    export default {
        name: "EmpJobManagerView",
        components: {QueryFormComp, AFormItem, ACol, EmployeeJobCreateFormComp,RowDetailDrawerComp},
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldInfoConfObj = {
                name:{
                    fieldLabel:this.$t('langMap.table.fields.em.job.jobName'),
                    fieldName:'name'
                },
                type:{
                    fieldLabel:this.$t('langMap.table.fields.common.type'),
                    fieldName:'type'
                },
                description:{
                    fieldLabel:this.$t('langMap.table.fields.common.description'),
                    fieldName:'description'
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
                    types:EnumUtils.toSelectData(JobTypeEnum)
                },
                searchConf: {
                    showAble:false,
                    loadingFlag: false,
                    formItemConf:{
                        name: {
                            key:'name',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.common.name'),
                            decorator:["name", {rules: []}],
                        },
                        type: {
                            key:'type',
                            formType:FormItemTypeEnum.Select,
                            label:this.$t('langMap.table.fields.common.type'),
                            decorator:["type", {rules: []}],
                            options:[]
                        },
                        description: {
                            key:'description',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.common.description'),
                            decorator:["description", {rules: []}],
                        },
                        remark: {
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
                        title: this.$t('langMap.table.fields.em.job.jobName'),
                        align:textAlignDefault,
                        dataIndex: 'name',
                        key: 'name',
                    }, {
                        title: this.$t('langMap.table.fields.common.type'),
                        align:textAlignDefault,
                        key: 'typeStr',
                        scopedSlots: { customRender: 'typeStr' },
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
                    visible: false,
                    actionType: "create"
                },
                dialogFormObj: {
                    name: '',
                    type: 0,
                    description: '',
                    remark: ''
                },
                drawerConf:{
                    detail:{
                        employeeJob:{
                            conf:{
                                title:this.$t('langMap.drawer.em.title.detailForDefineJob'),
                            },
                            visible:false,
                            dataObj:{},
                            drawerFieldConf:fieldInfoConfObj
                        },
                    },
                },
            }
        },
        methods: {
            changeQueryLoading(loadingFlag){   //修改[表格搜索]是否在 加载状态中
                if(typeof loadingFlag == "undefined" || loadingFlag == null){
                    loadingFlag = false ;
                }
                this.searchConf.loadingFlag = loadingFlag;
            },
            dealBatchDeleteByIds() {  //批量删除
                var _this = this;
                var delIds = _this.tableCheckIdList;
                EmpJobApi.batchDeleteByIds(delIds).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            dealDelOneRowById(delId) {   //根据id 删除
                var _this = this;
                EmpJobApi.deleteById(delId).then((res) => {
                    if (res.success) {  //已经有对错误进行预处理
                        _this.$message.success(res.msg);
                        _this.mixin_invokeQuery(_this); //表格重新搜索
                    }
                })
            },
            handleSearchFormQuery(e,values) {   //带查询条件 检索职务列表
                var _this = this ;
                //取得 bean 形式 的查询条件数组
                var searchFieldArr = _this.mixin_dealGetSearchFormQueryConf(_this.fieldInfoConf,values);
                _this.changeQueryLoading(true);
                EmpJobApi.getPageQuery(searchFieldArr,_this.tableConf.pagination,_this.tableConf.sorter).then((res) => {
                    this.tableConf.data = res.gridList;
                    this.tableConf.pagination.total = res.vpage.total ;
                    //清空 已勾选
                    _this.tableCheckIdList = [] ;
                    _this.changeQueryLoading(false);
                }).catch((e) =>{
                    _this.changeQueryLoading(false);
                })
            },
            handleTableActionGroupClick(e,record){  //表格-更多操作：按key区分操作类型
                var _this = this ;
                if(e.key == "recordDel"){   //行删除
                    _this.handleDeleteOneById(record.fid);
                }
            },
            handleTableChange(pagination, filters, sorter) {    //表格变动-页码跳转/排序/筛选
                this.tableConf.pagination = pagination ;
                this.tableConf.filters = filters ;
                this.tableConf.sorter = sorter ;
                this.mixin_invokeQuery(this);
            },
            handleCreateByForm() {     //新增职务按钮-点击
                var _this = this;
                _this.dialogFormConf.visible = true;   //显示弹窗
                _this.dialogFormConf.actionType = "create";
                _this.dialogFormObj = {};
            },
            handleUpdateByForm() {  //更新职务按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        EmpJobApi.getItemById(selectRowId).then((res) => {
                            var selectDefineRoleBean = res.bean;
                            if (selectDefineRoleBean) {
                                _this.dialogFormConf.visible = true;   //显示弹窗
                                _this.dialogFormConf.actionType = "update";
                                _this.dialogFormObj = selectDefineRoleBean;
                                //console.log(_this.dialogFormObj);
                            }
                        })
                    } else {
                        this.$message.warning(this.$t('langMap.message.error.failedDueToNotGettingId'));
                    }
                }
            },
            handleCreateFormCancel(e) {  // 创建/更新 职务表单->取消
                var _this = this;
                _this.dialogFormConf.visible = false;
            },
            handleCreateFormSubmit(e) {   // 创建/更新 职务表单->提交
                var _this = this;
                const dialogFormObj = _this.dealGetDialogRefFormObj();
                dialogFormObj.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    var closeDialogFlag = true;
                    if (_this.dialogFormConf.actionType == "create") {        //新建-提交
                        EmpJobApi.createByForm(values).then((res) => {
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
                        EmpJobApi.updateByForm(values).then((res) => {
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
            handleBatchDeleteByIds(e) {  // 批量删除
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
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.employeeJobCreateFormRef.createForm;
            },
            handleDetailDrawerShow(e,record){   //Drawer-职务定义 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.employeeJob.dataObj = record ;
                    this.drawerConf.detail.employeeJob.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-职务定义 详情关闭
                this.drawerConf.detail.employeeJob.visible = false ;
            }

        },
        computed: {
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
            },
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.type.options = this.binding.types ;
                },
                deep: true,
                immediate:true
            }
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        destroyed(){
            console.log("职务管理-页面销毁 ...")
        }
    }
</script>

<style scoped>

</style>
