//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const PermissionCommonApis = {
    getAllPermissionTypes() {
        return axios.post('/oblCtl/commonApi/permission/getAllPermissionTypeEnumList').then((res) => res.data) ;
    },
    getAllRoleTypes() {
        return axios.post('/oblCtl/commonApi/permission/getAllRoleTypeEnumList').then((res) => res.data) ;
    },
    getAllPermissionCodePrefixs() {
        return axios.post('/oblCtl/commonApi/permission/getAllPermissionCodePrefixEnumList').then((res) => res.data) ;
    },
}
