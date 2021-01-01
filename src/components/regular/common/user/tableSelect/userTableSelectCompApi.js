//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs';

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const UserTableSelectCompApi = {
    getPageQuery(queryArr, pagination, sorter) {
        var sortObj = {}
        if (sorter) {
            sorter.field = sorter.order ;
        }
        var obj = {
            queryObj: JSON.stringify(queryArr),
            paginationObj: JSON.stringify(pagination),
            sortObj: JSON.stringify(sortObj),
        }
        //查询所有用户信息
        return axios.post('/oblCtl/commmon/component/user/userAccount/queryDtoPage', qs.stringify(obj)).then(res => res.data);
    },
    getAllDefineRoles() {     //取得所有定义的角色
        var obj = {
            queryObj: [],
            paginationObj: {}
        }
        return axios.post('/oblCtl/define/defineRole/queryPage', qs.stringify(obj)).then(res => res.data);
    },
    getAllDefineJobs() {     //取得所有定义的职务
        var obj = {
            queryObj: [],
            paginationObj: {}
        }
        return axios.post('/oblCtl/define/defineJob/queryPage', qs.stringify(obj)).then(res => res.data);
    },
    getAllDefineTenantEnums() {  //取得 租户 列表
        var sortObj = {}
        var obj = {
            queryObj: JSON.stringify([]),
            //paginationObj:JSON.stringify({}),
            //sortObj:JSON.stringify(sortObj),
        }
        //查询所有[租户定义]信息
        return axios.post('/oblCtl/organization/defineTenant/gainEnumSelect', qs.stringify(obj)).then(res => res.data);
    },
    getAllDefineDepartmentTrees() {  //取得 租户 列表
        var sortObj = {}
        var obj = {
            queryObj: JSON.stringify([]),
        }
        //查询所有[租户定义]信息
        return axios.post('/oblCtl/define/defineDepartment/queryTreeSelect', qs.stringify(obj)).then(res => res.data);
    }
}
