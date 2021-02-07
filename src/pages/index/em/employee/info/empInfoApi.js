//ajax远程调用
import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'
//包装param参数
import qs from 'qs';
import {pageUtil,axiosForExcelUtil} from '~Utils/axios/axiosUtils'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const EmpInfoApi = {
    getPageQuery(queryArr, tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有用户信息
        return axios.post('/oblCtl/user/userAccount/queryPage', obj).then(res => res.data);
    },
    getItemById(fid) {  //根据用户id查询用户信息
        var params = {
            fid: fid
        };
        return axios.post("/oblCtl/user/userAccount/queryOneById",params).then(res => res.data);
    },
    createByForm(formObj, avatarUrl) {     //新增用户
        formObj['avatarUrl'] = avatarUrl;
        return axios.post("/oblCtl/user/userAccount/createByForm", qs.stringify(formObj)).then(res => res.data);;
    },
    updateByForm(formObj, avatarUrl) {  //更新用户
        formObj['avatarUrl'] = avatarUrl;
        return axios.post("/oblCtl/user/userAccount/updateByForm",formObj).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds: ids
        }
        return axios.post("/oblCtl/user/userAccount/batchDeleteByIds", obj).then(res => res.data);
    },
    deleteById(delId) {  //删除
        var obj = {
            delId: delId
        }
        return axios.post("/oblCtl/user/userAccount/deleteById", obj).then(res => res.data);
    },
    batchLockByIds(ids, lockFlag) {  //批量锁定
        var obj = {
            lockIds: ids,
            lockFlag: lockFlag
        }
        return axios.post("/oblCtl/user/userAccount/batchUpdateLockByIds", qs.stringify(obj, {indices: false})).then(res => res.data);
    },
    lockById(lockId, lockFlag) {  //锁定
        var obj = {
            lockId: lockId,
            lockFlag: lockFlag
        }
        return axios.post("/oblCtl/user/userAccount/updateLockById", qs.stringify(obj, {indices: false})).then(res => res.data);
    },
    grantRoleToUser(userAccountId, checkIds) {     //用户分配角色-提交
        var obj = {
            userAccountId: userAccountId,
            checkIds: checkIds
        }
        return axios.post("/oblCtl/user/userAccount/grantRoleToUser", qs.stringify(obj, {indices: false})).then(res => res.data);
    },
    getAllRoleByUserAccountId(userAccountId) {  //根据用户id查询用户所拥有的角色列表
        var params = {
            userAccountId: userAccountId
        }
        return axios.post("/oblCtl/user/userAccount/gainGrantedRole", qs.stringify(params)).then(res => res.data);
    },
    getAllDefineRoles() {     //取得所有定义的角色
        let obj = HttpUtil.formatQueryPage({},{});
        return axios.post('/oblCtl/define/defineRole/queryPage', obj).then(res => res.data);
    },
    getAllJobByUserAccountId(userAccountId) {  //根据用户id查询用户所拥有的职务列表
        var params = {
            userAccountId: userAccountId
        }
        return axios.post("/oblCtl/user/userAccount/gainGrantedJob", qs.stringify(params)).then(res => res.data);
    },
    getAllDefineJobs() {     //取得所有定义的职务
        let obj = HttpUtil.formatQueryPage({},{});
        return axios.post('/oblCtl/define/defineJob/queryPage', qs.stringify(obj)).then(res => res.data);
    },
    grantJobToUser(userAccountId, checkIds) {     //用户设置职务-提交
        var obj = {
            userAccountId: userAccountId,
            checkIds: checkIds
        }
        return axios.post("/oblCtl/user/userAccount/grantJobToUser", qs.stringify(obj, {indices: false})).then(res => res.data);
    },
    getAllDefineDepartmentTrees() {  //取得 部门 列表
        var sortObj = {}
        var obj = {
            queryObj: JSON.stringify({}),
        }
        //查询所有[部门]信息
        return axios.post('/oblCtl/define/defineDepartment/queryTreeSelect', qs.stringify(obj)).then(res => res.data);
    },
    exportCheckToExcel(menuId, checkIds) {    //导出已勾选为Excel
        var _this = this ;
        var obj = {
            menuId: menuId,
            checkIds: checkIds,
        }
        return axios.post("/oblCtl/excel/userAccount/exportCheckList",
            qs.stringify(obj, {indices: false}),{
                responseType: "blob"
            }
        ).then((response) => {
            if(!response){
                return;
            }
            axiosForExcelUtil.exportExcelDownload(response);
        });
    },
    exportAllToExcel(menuId) {     //导出所有为Excel
        var obj = {
            menuId: menuId,
        };
        return axios.post("/oblCtl/excel/userAccount/exportAllList",
            qs.stringify(obj, {indices: false}),
            {
                responseType: "blob"
            }
        ).then(response => {
            if(!response){
                return;
            }
            axiosForExcelUtil.exportExcelDownload(response);
        });
    },
    importDataFromExcel(formData){    //[导入数据]
        return axios.post("/oblCtl/excel/userAccount/importData",formData,
            {
                headers: {'Content-Type': 'multipart/form-data'}
            }
        ).then(res => res.data) ;
    }
}
