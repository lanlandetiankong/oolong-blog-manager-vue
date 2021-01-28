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
                        <a-button type="primary" icon="book"
                                  @click="handleUserGrantRoleById">
                            {{$t('langMap.button.actions.assigningRoles')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button type="primary" icon="book"
                                  @click="handleUserGrantJobById">
                            {{$t('langMap.button.actions.setPosition')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button icon="lock"
                            @click="handleBatchLockByIds(this,true)" >
                            {{$t('langMap.button.actions.lockUser')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-button icon="unlock"
                            @click="handleBatchLockByIds(this,false)">
                            {{$t('langMap.button.actions.unlockUser')}}
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-dropdown>
                            <a-menu slot="overlay" @click="handleExportListToExcel">
                                <a-menu-item key="checkToExcel"><a-icon type="check-square" />{{$t('langMap.button.actions.exportSelectedAsExcel')}}</a-menu-item>
                                <a-menu-item key="allToExcel"><a-icon type="arrow-down" />{{$t('langMap.button.actions.exportAllAsExcel')}}</a-menu-item>
                            </a-menu>
                            <a-button style="margin-left: 8px"><a-icon type="down-circle" />{{$t('langMap.button.actions.exportData')}} </a-button>
                        </a-dropdown>
                    </a-col>
                    <a-col>
                        <a-button icon="upload"
                                  @click="() =>{uploadExcelModelconf.visible = true}">
                            {{$t('langMap.button.actions.importData')}}
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
                <span slot="userTypeStr" slot-scope="record">
                    <a-tag color="blue" :key="record.userTypeStr">
                        {{record.userTypeStr}}
                    </a-tag>
                </span>
                <span slot="locked" slot-scope="record">
                    <a-tag v-if="record.locked == 1" color="red" :key="record.fid">
                        {{$t('langMap.commons.enums.lockStatus.locked')}}
                    </a-tag>
                    <a-tag v-else-if="record.locked == 0" color="blue" :key="record.fid">
                        {{$t('langMap.commons.enums.lockStatus.unlock')}}
                    </a-tag>
                </span>
                <span slot="sexRender" slot-scope="text,record,index">
                        {{record.sex | formatConstOfSex}}
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
                                    <a-menu-item v-if="record.locked == 0" key="recordLock">{{$t('langMap.button.actions.lockUser')}}</a-menu-item>
                                    <a-menu-item v-else-if="record.locked == 1" key="recordUnlock">{{$t('langMap.button.actions.unlockUser')}}</a-menu-item>
                                    <a-menu-item key="grantRole">{{$t('langMap.button.actions.assigningRoles')}}</a-menu-item>
                                    <a-menu-item key="grantJob">{{$t('langMap.button.actions.setPosition')}}</a-menu-item>
                              </a-menu>
                              <a-button> {{$t('langMap.button.actions.operate')}} <a-icon type="down" /> </a-button>
                        </a-dropdown>
                    </span>
                </template>
            </a-table>
        </div>
        <!-- 挂载弹窗、抽屉 等组件的dom -->
        <div>
            <employee-info-create-form-comp
                ref="employeeInfoCreateFormRef"
                :visible="dialogFormConf.visible"
                :formObj="dialogFormObj"
                :actionType="dialogFormConf.actionType"
                :belongDepartmentTrees="binding.belongDepartments"
                @createFormCancel="handleCreateFormCancel"
                @createFormSubmit="handleCreateFormSubmit"
            />
            <user-grant-role-form-comp
                v-if="dialogGrantRoleConf.initFlag == true"
                :visible="dialogGrantRoleConf.visible"
                :userAccountId="dialogGrantRoleObj.userAccountId"
                :allItemArr="dialogGrantRoleObj.allDataSource"
                :checkArr="dialogGrantRoleObj.checkedIds"
                @grantRoleFormCancel="handleUserGrantRoleFormCancel"
                @grantRoleFormSubmit="handleUserGrantRoleFormSubmit"
            >
            </user-grant-role-form-comp>
            <user-grant-job-form-comp
                v-if="dialogGrantJobConf.initFlag == true"
                :visible="dialogGrantJobConf.visible"
                :userAccountId="dialogGrantJobObj.userAccountId"
                :allItemArr="dialogGrantJobObj.allDataSource"
                :checkArr="dialogGrantJobObj.checkedIds"
                @grantJobFormCancel="handleUserGrantJobFormCancel"
                @grantJobFormSubmit="handleUserGrantJobFormSubmit"
            >
            </user-grant-job-form-comp>
            <excel-import-data-comp
                v-if="uploadExcelModelconf.visible"
                :visible="uploadExcelModelconf.visible"
                :modalCompTitle="uploadExcelModelconf.title"
                :limitSize="uploadExcelModelconf.limitSize"
                :limitMinSize="uploadExcelModelconf.limitMinSize"
                :moreData="uploadExcelModelconf.moreData"
                :uploadedBeanList="uploadExcelModelconf.uploadedBeanList"
                @modalCancel="handleImportDataModalCancel"
                @modalSubmit="handleImportDataModalSubmit"
            >
            </excel-import-data-comp>
            <row-detail-drawer-comp
                :drawerConf="drawerConf.detail.employeeInfo.conf"
                :dataObj="drawerConf.detail.employeeInfo.dataObj"
                :visible="drawerConf.detail.employeeInfo.visible"
                :drawerFieldConf="drawerConf.detail.employeeInfo.drawerFieldConf"
                @execClose="handleDetailDrawerClose"
            />
        </div>
    </div>
</template>
<script>
    import jquery from 'jquery';

    import {EmpInfoApi} from './empInfoApi'
    import {FormItemTypeEnum,ConstantObj} from "~Components/constant_define";
    import {UserCommonApis} from '~Apis/user/UserCommonApis.js'
    import {OblCommonMixin} from '~Layout/mixin/OblCommonMixin';

    import QueryFormComp from '~Components/regular/query/QueryFormComp'

    import EmployeeInfoCreateFormComp from '~Components/index/em/user/employee/info/EmployeeInfoCreateFormComp'
    import UserGrantRoleFormComp from '~Components/index/em/user/employee/info/UserGrantRoleFormComp';
    import UserGrantJobFormComp from '~Components/index/em/user/employee/info/UserGrantJobFormComp';
    import RowDetailDrawerComp from '~Components/regular/common/drawer/RowDetailDrawerComp';
    import ExcelImportDataComp from '~Components/regular/common/excel/ExcelImportDataComp';

    import ACol from "ant-design-vue/es/grid/Col";
    import AFormItem from "ant-design-vue/es/form/FormItem";


    export default {
        name: "EmpInfoView",
        components: {QueryFormComp,
            RowDetailDrawerComp,ExcelImportDataComp,
            UserGrantJobFormComp, UserGrantRoleFormComp, AFormItem, ACol, EmployeeInfoCreateFormComp},
        mixins:[OblCommonMixin],
        data() {
            const textAlignDefault = 'left' ;
            //字段配置(Query/Drawer)
            const fieldInfoConfObj = {
                account:{
                    fieldLabel:this.$t('langMap.table.fields.em.user.userAccount'),
                },
                userName:{
                    fieldLabel:this.$t('langMap.table.fields.em.user.userName'),
                },
                belongDepartmentName:{
                    fieldLabel:this.$t('langMap.table.fields.em.department.belongDepartment'),
                    isNeedSplit:true,fieldKeySplitArr:['belongDepartment','name'],
                },
                email:{
                    fieldLabel:this.$t('langMap.table.fields.em.user.email'),
                },
                userType:{
                    fieldLabel:this.$t('langMap.table.fields.em.user.userType'),drawerAble:false
                },
                userTypeStr:{
                    fieldLabel:this.$t('langMap.table.fields.em.user.userType'),
                    searchAble:false
                },
                belongDepartmentId:{
                    fieldName:'defineDepartmentId',drawerAble:false,
                },
                locked:{
                    fieldLabel:this.$t('langMap.table.fields.common.lockedStatus'),
                    enumValMap:{"1":"已锁定", "0":"未锁定"}
                },
                remark:{
                    fieldLabel:this.$t('langMap.table.fields.common.remark'),
                }
            };
            return {
                ConstantObj,
                fieldInfoConf:fieldInfoConfObj,
                searchConf: {
                    showAble:false,
                    loadingFlag: false,
                    formItemConf:{
                        belongDepartmentId:{
                            key:'belongDepartmentId',
                            formType:FormItemTypeEnum.TreeSelect,
                            label:this.$t('langMap.table.fields.em.department.belongDepartment'),
                            decorator:["belongDepartmentId", {rules: []}],
                            treeDefaultExpandAll:false,
                            treeNodeFilterProp:"title",
                            treeData:[]
                        },
                        account:{
                            key:'account',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.em.user.userAccount'),
                            decorator:["account", {rules: []}],
                        },
                        userName:{
                            key:'userName',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.em.user.userName'),
                            decorator:["userName", {rules: []}],
                        },
                        email:{
                            key:'email',
                            formType:FormItemTypeEnum.Input,
                            label:this.$t('langMap.table.fields.em.user.email'),
                            decorator:["email", {rules: []}],
                        },
                        userType:{
                            key:'userType',
                            formType:FormItemTypeEnum.Select,
                            label:this.$t('langMap.table.fields.common.type'),
                            decorator:["userType", {rules: []}],
                            options:[]
                        },
                        locked:{
                            key:'locked',
                            formType:FormItemTypeEnum.Select,
                            label:this.$t('langMap.table.fields.common.lockedStatus'),
                            decorator:["locked", {rules: []}],
                            options:[]
                        }
                    }
                },
                binding:{
                    belongDepartments:[],
                    userTypes:[],
                    lockStates:[]
                },
                tableConf: {
                    data: [],
                    columns: [{
                        title: this.$t('langMap.table.fields.em.user.userAccount'),
                        align:textAlignDefault,
                        dataIndex: 'account',
                        key: 'account',
                        sorter:true,
                        scopedSlots: { customRender: 'account' },
                    },  {
                        title: this.$t('langMap.table.fields.em.user.userName'),
                        align:textAlignDefault,
                        dataIndex: 'userName',
                        sorter:true,
                        key: 'userName',
                    },{
                        title: this.$t('langMap.table.fields.em.department.belongDepartment'),
                        align:textAlignDefault,
                        dataIndex: 'belongDepartment.name',
                        sorter:true,
                        key: 'belongDepartment.name',
                    },  {
                        title: this.$t('langMap.table.fields.em.user.phone'),
                        align:textAlignDefault,
                        dataIndex: 'phone',
                        sorter:true,
                        key: 'phone',
                    }, {
                        title: this.$t('langMap.table.fields.em.user.email'),
                        align:textAlignDefault,
                        dataIndex: 'email',
                        key: 'email',
                    },{
                        title: this.$t('langMap.table.fields.em.user.sex'),
                        align:textAlignDefault,
                        key: 'sex',
                        scopedSlots: { customRender: 'sexRender' },
                    }, {
                        title: this.$t('langMap.table.fields.em.user.userType'),
                        align:textAlignDefault,
                        key: 'userTypeStr',
                        scopedSlots: { customRender: 'userTypeStr' },
                    }, {
                        title: this.$t('langMap.table.fields.common.lockedStatus'),
                        align:textAlignDefault,
                        key: 'locked',
                        scopedSlots: { customRender: 'locked' },
                    }, {
                        title: this.$t('langMap.table.fields.em.user.address'),
                        align:textAlignDefault,
                        dataIndex: 'address',
                        width:170,
                        key: 'address',
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
                    userName: '',
                    account: '',
                    email: '',
                    userType: '',
                    belongDepartmentId: '',
                    locked:'0'
                },
                dialogFormDefaultObj:{  //新建时的默认值设置
                    userName: '',
                    account: '',
                    email: '',
                    userType: '',
                    belongDepartmentId: '',
                    locked:'0'
                },
                dialogGrantRoleConf:{
                    visible:false,
                    initFlag:false
                },
                dialogGrantRoleObj: {
                    userAccountId:'',
                    all:[],
                    allDataSource:[],
                    checked:[],
                    checkedIds:[],
                },
                dialogGrantJobConf:{
                    visible:false,
                    initFlag:false
                },
                dialogGrantJobObj: {
                    userAccountId:'',
                    all:[],
                    allDataSource:[],
                    checked:[],
                    checkedIds:[],
                },
                uploadExcelModelconf:{
                    visible:false,
                    title:this.$t('langMap.button.actions.uploadDataExcel'),
                    limitSize:1,
                    limitMinSize:1,
                    moreData:{
                        prefixFolder:"/menuManager",
                        fid:''
                    },
                    uploadedBeanList:[] //当前菜单已经设置的已上传的文件列表
                },
                drawerConf:{
                    detail:{
                       employeeInfo:{
                           conf:{
                               title:this.$t('langMap.drawer.title.detailForEmployeeInfo'),
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
                EmpInfoApi.batchDeleteByIds(delIds).then((res) => {
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
                EmpInfoApi.deleteById(delId).then((res) => {
                    if (res) {
                        if (res.success) {  //已经有对错误进行预处理
                            _this.$message.success(res.msg);
                            _this.mixin_invokeQuery(_this); //表格重新搜索
                        }
                    }
                })
            },
            dealBatchLockByIds(lockFlag) {  //批量锁定
                var _this = this;
                var delIds = _this.tableCheckIdList;
                EmpInfoApi.batchLockByIds(delIds,lockFlag).then((res) => {
                    if (res) {
                        if (res.success) {  //已经有对错误进行预处理
                            this.$message.success(res.msg);
                            _this.mixin_invokeQuery(_this); //表格重新搜索
                        }
                    }
                })
            },
            dealChangeLockOneRowById(delId,lockFlag) {   //根据id 锁定/解锁
                var _this = this;
                EmpInfoApi.lockById(delId,lockFlag).then((res) => {
                    if (res) {
                        if (res.success) {  //已经有对错误进行预处理
                            _this.$message.success(res.msg);
                            var tableDatas = _this.tableConf.data ;
                            var tableDatasTemp = [] ;
                            var lockedVal = lockFlag ? 1 : 0;
                            if(tableDatas && tableDatas.length > 0){
                                jquery.each(tableDatas,function (idx,val) {
                                    if(val.fid == delId){   //修改锁定状态,
                                        val.locked = lockedVal
                                    }
                                    tableDatasTemp.push(val);
                                })
                            }
                            _this.tableConf.data = tableDatasTemp ;
                            //_this.mixin_invokeQuery(_this); //表格重新搜索
                        }
                    }
                })
            },
            dealGetUserTypeEnumList(){  //取得 用户类型-枚举列表
                var _this = this ;
                UserCommonApis.getAllUserType().then((res) => {
                    if(res && res.success){
                        _this.binding.userTypes = res.enumData.list ;
                    }
                })
            },
            dealGetDefineDepartmentTreeData(){  //取得 所属部门-枚举列表
                var _this = this ;
                EmpInfoApi.getAllDefineDepartmentTrees().then((res) => {
                    if(res && res.success){
                        if(res.gridList){
                            _this.binding.belongDepartments = res.gridList ;
                        }
                    }
                })
            },
            dealGetLockStateEnumList(){  //取得 用户锁定状态-枚举列表
                var _this = this ;
                UserCommonApis.getAllUserLockStateType().then((res) => {
                    if(res && res.success){
                        _this.binding.lockStates = res.enumData.list ;
                    }
                })
            },
            dealGetAllRoleList(){  //取得 所有的角色定义
                var _this = this ;
                return EmpInfoApi.getAllDefineRoles().then((res) => {
                    if(res && res.success){
                        if(res.gridList){
                            _this.dialogGrantRoleObj.all = res.gridList ;
                            _this.dealAllRoleItemToTransferDataSource(res.gridList);
                        }
                    }
                })
            },
            dealGetAllJobList(){  //取得 所有的职务定义
                var _this = this ;
                return EmpInfoApi.getAllDefineJobs().then((res) => {
                    if(res && res.success){
                        if(res.gridList){
                            _this.dialogGrantJobObj.all = res.gridList ;
                            _this.dealAllJobItemToTransferDataSource(res.gridList);
                        }
                    }
                })
            },
            dealAllRoleItemToTransferDataSource(allItemArr){    //role转化为 transfer可用的 数组对象
                var _this = this ;
                var dataSourceArrTemp = [] ;
                if(allItemArr && allItemArr.length > 0 ){
                    jquery.each(allItemArr,function (idx,val) {
                        if(val){
                            dataSourceArrTemp.push({
                                key:_this.mixin_dealNullStrToEmpty(val.fid),
                                title:_this.mixin_dealNullStrToEmpty(val.name),
                                description:_this.mixin_dealNullStrToEmpty(val.remark),
                                disabled:false
                            })
                        }
                    })
                }
                _this.dialogGrantRoleObj.allDataSource = dataSourceArrTemp ;
            },
            dealAllJobItemToTransferDataSource(allItemArr){    //job转化为 transfer可用的 数组对象
                var _this = this ;
                var dataSourceArrTemp = [] ;
                if(allItemArr && allItemArr.length > 0 ){
                    jquery.each(allItemArr,function (idx,val) {
                        if(val){
                            dataSourceArrTemp.push({
                                key:_this.mixin_dealNullStrToEmpty(val.fid),
                                title:_this.mixin_dealNullStrToEmpty(val.name),
                                description:_this.mixin_dealNullStrToEmpty(val.remark),
                                disabled:false
                            })
                        }
                    })
                }
                _this.dialogGrantJobObj.allDataSource = dataSourceArrTemp ;
            },

            dealUserGrantRolesById(selectRowId){        //授权页面弹窗-封装方法
                var _this = this ;
                if(_this.dialogGrantRoleConf.initFlag == false){  //第一次进行分配角色时进行 所有角色 的数据加载
                    _this.dealGetAllRoleList().then(()=>{
                        _this.dialogGrantRoleConf.initFlag = true ;
                    }) ;
                }
                _this.dialogGrantRoleObj.userAccountId = selectRowId ;
                if (selectRowId) {
                    EmpInfoApi.getAllRoleByUserAccountId(selectRowId).then((res) => {
                        if(res){
                            _this.dialogGrantRoleObj.checked = res.gridList;
                            var checkIdListTemp = [] ;
                            if(res.gridList && res.gridList.length > 0){
                                jquery.each(res.gridList,function (idx,val) {
                                    checkIdListTemp.push(val.fid);
                                })
                            }
                            _this.dialogGrantRoleObj.checkedIds = checkIdListTemp;
                            _this.dialogGrantRoleConf.visible = true;   //显示弹窗
                        }
                    })
                } else {
                    this.$message.warning(this.$t('langMap.message.error.failedDueToNotGettingId'));
                }
            },
            dealUserGrantJobsById(selectRowId){        //设置职务页面弹窗-封装方法
                var _this = this ;
                if(_this.dialogGrantJobConf.initFlag == false){  //第一次进行设置职务时进行 所有职务 的数据加载
                    _this.dealGetAllJobList().then(()=>{
                        _this.dialogGrantJobConf.initFlag = true ;
                    }) ;
                }
                _this.dialogGrantJobObj.userAccountId = selectRowId ;
                if (selectRowId) {
                    EmpInfoApi.getAllJobByUserAccountId(selectRowId).then((res) => {
                        if(res){
                            _this.dialogGrantJobObj.checked = res.gridList;
                            var checkIdListTemp = [] ;
                            if(res.gridList && res.gridList.length > 0){
                                jquery.each(res.gridList,function (idx,val) {
                                    checkIdListTemp.push(val.fid);
                                })
                            }
                            _this.dialogGrantJobObj.checkedIds = checkIdListTemp;
                            _this.dialogGrantJobConf.visible = true;   //显示弹窗
                        }
                    })
                } else {
                    this.$message.warning(this.$t('langMap.message.error.failedDueToNotGettingId'));
                }
            },
            handleSearchFormQuery(e,values) {   //带查询条件 检索用户列表
                const _this = this;
                //取得 bean 形式 的查询条件数组
                const searchFieldArr = _this.mixin_dealGetSearchFormQueryConf(_this.fieldInfoConf,values);
                _this.changeQueryLoading(true);
                EmpInfoApi.getPageQuery(searchFieldArr,_this.tableConf.pagination,_this.tableConf.sorter).then((res) => {
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
            handleTableActionGroupClick(e,record){  //表格-更多操作：按key区分操作类型
                var _this = this ;
                if(e.key == "recordDel"){   //行删除
                    _this.handleDeleteOneById(record.fid);
                }   else if(e.key == "recordLock"){ //行锁定
                    _this.handleChangeLockOneById(record.fid,true);
                }   else if(e.key == "recordUnlock"){   //行解锁
                    _this.handleChangeLockOneById(record.fid,false);
                }   else if(e.key == "grantRole"){  //分配角色
                    _this.dealUserGrantRolesById(record.fid);
                }   else if(e.key == "grantJob"){  //设置职务
                    _this.dealUserGrantJobsById(record.fid);
                }
            },
            handleTableChange(pagination, filters, sorter) {    //表格变动-页码跳转/排序/筛选
                this.tableConf.pagination = pagination ;
                this.tableConf.filters = filters ;
                this.tableConf.sorter = sorter ;
                this.mixin_invokeQuery(this);
            },
            handleCreateByForm() {     //新增用户按钮-点击
                var _this = this;
                _this.dialogFormConf.visible = true;   //显示弹窗
                _this.dialogFormConf.actionType = "create";
                _this.dialogFormObj = _this.dialogFormDefaultObj;
            },
            handleUpdateByForm() {  //更新用户按钮-点击
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    if (selectRowId) {
                        EmpInfoApi.getItemById(selectRowId).then((res) => {
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
            handleCreateFormCancel(e) {  // 创建/更新 用户表单->取消
                var _this = this;
                _this.dialogFormConf.visible = false;
            },
            handleCreateFormSubmit(e,avatarUrl) {   // 创建/更新 用户表单->提交
                var _this = this;
                const dialogFormObj = _this.dealGetDialogRefFormObj();
                dialogFormObj.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    var closeDialogFlag = true;
                    if (_this.dialogFormConf.actionType == "create") {        //新建-提交
                        EmpInfoApi.createByForm(values,avatarUrl).then((res) => {
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
                        EmpInfoApi.updateByForm(values,avatarUrl).then((res) => {
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
            handleBatchLockByIds(e,lockFlag) {  // 批量锁定
                var _this = this;
                var selectDelIds = _this.tableCheckIdList;
                if (selectDelIds.length < 1) {
                    _this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForLock'));
                } else {
                    _this.$confirm({
                        content: _this.$t('langMap.message.confirm.isConfirmLockWhatSelectedRow',[selectDelIds.length]),
                        okText: _this.$t('langMap.button.actions.confirm'),
                        cancelText: _this.$t('langMap.button.actions.cancel'),
                        onOk() {
                            _this.dealBatchLockByIds(lockFlag);
                        },
                        onCancel() {
                            _this.$message.info(_this.$t('langMap.message.info.actionOfCancelLock'));
                        }
                    })
                }
            },
            handleChangeLockOneById(delId,lockFlag) {     //删除指定行
                var _this = this;
                if (delId) {
                    _this.$confirm({
                        content: _this.$t('langMap.message.confirm.isConfirmLockWhatSelectedRow',[1]),
                        okText: _this.$t('langMap.button.actions.confirm'),
                        cancelText: _this.$t('langMap.button.actions.cancel'),
                        onOk() {
                            _this.dealChangeLockOneRowById(delId,lockFlag);
                        },
                        onCancel() {
                            _this.$message.info(_this.$t('langMap.message.info.actionOfCancelLock'));
                        }
                    })
                } else {
                    _this.$message.warning(_this.$t('langMap.message.warning.invalidLockOperation'));
                }
            },
            dealGetDialogRefFormObj() {    //返回 弹窗表单 的form对象
                return this.$refs.employeeInfoCreateFormRef.createForm;
            },
            handleUserGrantRoleById(e) {     // 用户分配角色
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForUpdate'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    //封装方法 处理
                    _this.dealUserGrantRolesById(selectRowId);
                }
            },
            handleUserGrantRoleFormCancel(e) {  // 用户分配角色表单->取消
                var _this = this;
                _this.dialogGrantRoleConf.visible = false;
            },
            handleUserGrantRoleFormSubmit(e,userAccountId,targetIdList) {   // 用户分配角色->提交
                var _this = this;
                EmpInfoApi.grantRoleToUser(userAccountId,targetIdList).then((res) =>{
                    var closeDialogFlag = true ;
                    if (res) {
                        if (res.success) {  //异常已经有预处理了
                            this.$message.success(res.msg);
                        } else {
                            closeDialogFlag = false;
                        }
                    } else {
                        closeDialogFlag = false;
                    }
                    if (closeDialogFlag == true) {    //关闭弹窗
                        _this.dialogGrantRoleConf.visible = false;
                    }
                });
            },
            handleUserGrantJobById(e) {     // 用户设置职务
                var _this = this;
                if (_this.tableCheckIdList.length < 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForSetPosition'));
                } else if (_this.tableCheckIdList.length > 1) {
                    this.$message.warning(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForSetPosition'));
                } else {
                    var selectRowId = _this.tableCheckIdList[0];
                    //封装方法 处理
                    _this.dealUserGrantJobsById(selectRowId);
                }
            },
            handleUserGrantJobFormCancel(e) {  // 用户设置职务表单->取消
                var _this = this;
                _this.dialogGrantJobConf.visible = false;
            },
            handleUserGrantJobFormSubmit(e,userAccountId,targetIdList) {   // 用户设置职务->提交
                var _this = this;
                EmpInfoApi.grantJobToUser(userAccountId,targetIdList).then((res) =>{
                    var closeDialogFlag = true ;
                    if (res) {
                        if (res.success) {  //异常已经有预处理了
                            this.$message.success(res.msg);
                        } else {
                            closeDialogFlag = false;
                        }
                    } else {
                        closeDialogFlag = false;
                    }
                    if (closeDialogFlag == true) {    //关闭弹窗
                        _this.dialogGrantJobConf.visible = false;
                    }
                });
            },
            handleExportListToExcel(e){
                var _this = this ;
                const curMenuId = _this.mixin_handleGetCurMenuId() ;
                if(curMenuId){
                    if(e.key == "checkToExcel"){    //导出已勾选项
                        var checkIds = _this.tableCheckIdList ;
                        if(!checkIds || checkIds.length == 0){
                            this.$message.error(this.$t('langMap.message.warning.pleaseSelectTheOnlyRowOfDataForExport'));
                        }   else {
                            EmpInfoApi.exportCheckToExcel(curMenuId,checkIds);
                        }
                    }   else if(e.key == "allToExcel"){ //导出所有
                        EmpInfoApi.exportAllToExcel(curMenuId);
                    }   else {
                        this.$message.error(this.$t('langMap.message.error.unknownExportCommand'));
                    }
                }   else {
                    this.$message.error(this.$t('langMap.message.error.currentPageDoesNotSupportExportOperations'));
                }
            },
            handleImportDataModalCancel(){  //[数据导入] 弹窗取消
                this.uploadExcelModelconf.visible = false ;
            },
            handleImportDataModalSubmit(formData,processData){  //[数据导入] 弹窗提交
                EmpInfoApi.importDataFromExcel(formData).then((res) => {
                    if(res.success){
                        //console.log(res);
                        this.uploadExcelModelconf.visible = false ;
                    }

                })
            },
            handleDetailDrawerShow(e,record){   //Drawer-用户定义 详情展示
                if(typeof record != "undefined"){
                    this.drawerConf.detail.employeeInfo.dataObj = record ;
                    this.drawerConf.detail.employeeInfo.visible = true ;
                }   else {
                    this.$message.error(this.$t('langMap.message.warning.openInvalidRowDetails'));
                }
            },
            handleDetailDrawerClose(e){ //Drawer-用户定义 详情关闭
                this.drawerConf.detail.employeeInfo.visible = false ;
            },
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
        created(){
            this.dealGetUserTypeEnumList();
            this.dealGetDefineDepartmentTreeData();
            this.dealGetLockStateEnumList();
        },
        mounted() {
            this.mixin_invokeQuery(this);
        },
        watch:{
            binding:{
                handler (val, oval) {
                    //绑定枚举值变化监听并处理
                    this.searchConf.formItemConf.belongDepartmentId.treeData = this.binding.belongDepartments ;
                    this.searchConf.formItemConf.userType.options = this.binding.userTypes ;
                    this.searchConf.formItemConf.locked.options = this.binding.lockStates ;
                },
                deep: true,
                immediate:true
            }
        },
        destroyed(){
            console.log("员工信息??-页面销毁 ...");
        }

    }
</script>

<style scoped>

</style>
