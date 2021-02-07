//ajax远程调用
import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const MenuManagerApi = {
    getTreeDataAll() {
        var obj = {
            withRoot:true  ,   //是否包含根节点
        };
        //查询所有菜单信息(树结构)
        return axios.post('/oblCtl/define/defineMenu/queryTreeSelect',obj).then(res => res.data);
    },
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有菜单信息
        return axios.post('/oblCtl/define/defineMenu/queryPage',obj).then(res => res.data);
    },
    getItemById(fid){  //根据菜单id查询菜单信息
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/define/defineMenu/queryOneById",params).then(res => res.data) ;
    },
    createByForm(formObj) {     //新增菜单
        return axios.post("/oblCtl/define/defineMenu/createByForm",formObj).then(res => res.data);;
    },
    updateByForm(formObj) {  //更新菜单
        return axios.post("/oblCtl/define/defineMenu/updateByForm",formObj).then(res => res.data) ;
    },
    updateExcelModel(menuId,fileItem) {  //更新菜单的excel模板
        fileItem = (fileItem) ? fileItem : {} ;
        fileItem['menuId'] = menuId ;
        return axios.post("/oblCtl/define/defineMenu/updateExcelModel",fileItem).then(res => res.data) ;
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        }
        return axios.post("/oblCtl/define/defineMenu/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        }
        return axios.post("/oblCtl/define/defineMenu/deleteById",obj).then(res => res.data) ;
    }
}
