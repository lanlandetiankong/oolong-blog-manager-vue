//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const UserCommonApis = {
    getAllUserType() {  //所有用户类型
        return axios.post('/oblCtl/commonApi/user/getAllUserTypeEnumList').then((res) => res.data) ;
    },
    getAllUserLockStateType() { //用户锁的状态
        return axios.post('/oblCtl/commonApi/user/getAllUserLockStateEnumList').then((res) => res.data) ;
    },
    getAllDefineJobType() { //所有职务类型
        return axios.post('/oblCtl/commonApi/user/getAllDefineJobTypeEnumList').then((res) => res.data) ;
    }
}
