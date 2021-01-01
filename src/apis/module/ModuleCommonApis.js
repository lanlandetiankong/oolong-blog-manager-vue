//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const ModuleCommonApis = {
    getAllModuleTypes() {   //取得 所有 菜单类型 枚举
        return axios.post('/oblCtl/commonApi/module/getAllModuleTypeEnumList').then((res) => res.data) ;
    },
    getAllMenuUrlJumpTypes() {     //取得 所有 菜单 url跳转类型 枚举
        return axios.post('/oblCtl/commonApi/module/getAllMenuUrlJumpTypeEnumList').then((res) => res.data) ;
    }


}
