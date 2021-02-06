//ajax远程调用
import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'
//包装param参数
import qs from 'qs';

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const UserTableSelectCompApi = {
    getPageQuery(queryArr, tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有用户信息
        return axios.post('/oblCtl/commmon/component/user/userAccount/queryPage', obj).then(res => res.data);
    },
    getAllDefineRoles() {     //取得所有定义的角色
        let obj = HttpUtil.formatQueryPage({},{});
        return axios.post('/oblCtl/define/defineRole/queryPage', obj).then(res => res.data);
    },
    getAllDefineJobs() {     //取得所有定义的职务
        let obj = HttpUtil.formatQueryPage({},{});
        return axios.post('/oblCtl/define/defineJob/queryPage', obj).then(res => res.data);
    },
    getAllDefineDepartmentTrees() {  //取得 部门 列表
        var sortObj = {}
        var obj = {
            queryObj: JSON.stringify({}),
        }
        //查询所有[部门]信息
        return axios.post('/oblCtl/define/defineDepartment/queryTreeSelect', qs.stringify(obj)).then(res => res.data);
    }
}
