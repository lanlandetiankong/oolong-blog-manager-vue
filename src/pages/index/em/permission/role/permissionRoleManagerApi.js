import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const PermissionRoleManagerApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有角色信息
        return axios.post('/oblCtl/define/defineRole/queryPage',obj).then(res => res.data);
    },
    getItemById(fid){  //根据角色id查询角色信息
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/define/defineRole/queryOneById",params).then(res => res.data) ;
    },
    getAllPermissionByRoleId(defineRoleId){  //根据角色id查询角色所拥有的[权限定义]列表
        var params = {
            defineRoleId:defineRoleId
        };
        return axios.post("/oblCtl/define/defineRole/gainAllPermissionByRoleId",params).then(res => res.data) ;
    },
    getAllDefinePermissions() {     //取得所有定义的权限
        let obj = HttpUtil.formatQueryPage({},{});
        //查询所有权限信息
        return axios.post('/oblCtl/define/definePermission/queryPage',obj).then(res => res.data);
    },
    getAllDefineMenuTree() {
        var obj = {
            withRoot:false  ,   //是否包含根节点
        };
        //查询所有菜单信息(树结构)
        return axios.post('/oblCtl/define/defineMenu/queryTreeSelect',obj).then(res => res.data);
    },
    getAllMenuByRoleId(defineRoleId){  //根据角色id查询角色所拥有的[菜单定义]列表
        var params = {
            defineRoleId:defineRoleId,
            filterParentNode:true,  //是否过滤掉 有子节点的 [菜单节点]
        };
        return axios.post("/oblCtl/define/defineRole/gainAllMenuByRoleId",params).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增角色
        return axios.post("/oblCtl/define/defineRole/createByForm",formObj).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新角色
        return axios.post("/oblCtl/define/defineRole/updateByForm",formObj).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        };
        return axios.post("/oblCtl/define/defineRole/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        };
        return axios.post("/oblCtl/define/defineRole/deleteById",obj).then(res => res.data) ;
    },
    grantPermissionToRole(roleId,checkIds){     //角色授权提交
        var obj = {
            roleId:roleId,
            checkIds:checkIds
        };
        return axios.post("/oblCtl/define/defineRole/grantPermissionToRole",obj).then(res => res.data) ;
    },
    grantMenusToRole(roleId,checkIds,halfCheckIds){     //[菜单授权]提交
        var obj = {
            roleId:roleId,
            checkIds:checkIds,
            halfCheckIds:halfCheckIds
        };
        return axios.post("/oblCtl/define/defineRole/grantMenusToRole",obj).then(res => res.data) ;
    }
};
