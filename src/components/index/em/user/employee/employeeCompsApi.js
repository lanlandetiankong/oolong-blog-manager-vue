import axios from '~Config/axios/httpConfig'

export const EmployeeDepartmentCompsApi = {
    getDefineDepartmentTreeFilterChildrens(filterId) {
        var obj = {
            filterId:filterId
        };
        //查询过滤的菜单信息(树结构) ->过滤当前id及子节点
        return axios.post('/oblCtl/define/defineDepartment/queryFilteredTreeSelect',obj).then(res => res.data);
    }
};
