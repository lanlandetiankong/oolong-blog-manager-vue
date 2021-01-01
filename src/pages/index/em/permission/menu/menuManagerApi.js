//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const MenuManagerApi = {
    getTreeDataAll() {
        var obj = {
            withRoot:true  ,   //是否包含根节点
        }
        //查询所有菜单信息(树结构)
        return axios.post('/oblCtl/define/defineMenu/queryTreeSelect',qs.stringify(obj)).then(res => res.data);
    },
    getPageQuery(queryArr,pagination,sorter) {
        var sortObj = {}
        if(sorter){
            sorter.field = sorter.order ;
        }
        var obj = {
            queryObj:JSON.stringify(queryArr),
            paginationObj:JSON.stringify(pagination),
            sortObj:JSON.stringify(sortObj),
        }
        //查询所有菜单信息
        return axios.post('/oblCtl/define/defineMenu/queryDtoPage',qs.stringify(obj)).then(res => res.data);
    },
    getItemById(defineMenuId){  //根据菜单id查询菜单信息
        var params = {
            defineMenuId:defineMenuId
        }
        return axios.post("/oblCtl/define/defineMenu/queryOneById",qs.stringify(params)).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增菜单
        return axios.post("/oblCtl/define/defineMenu/createByForm",qs.stringify(formObj)).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新菜单
        return axios.post("/oblCtl/define/defineMenu/updateByForm",qs.stringify(formObj)).then(res => res.data) ;
    },
    updateExcelModel(menuId,fileItem) {  //更新菜单的excel模板
        fileItem = (fileItem) ? fileItem : {} ;
        fileItem['menuId'] = menuId ;
        return axios.post("/oblCtl/define/defineMenu/updateExcelModel",qs.stringify(fileItem)).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/define/defineMenu/batchDeleteByIds",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/define/defineMenu/deleteById",qs.stringify(obj,{indices: false})).then(res => res.data) ;
    }
}
