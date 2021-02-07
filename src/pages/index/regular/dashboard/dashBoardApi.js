//ajax远程调用
import axios from '~Config/axios/httpConfig'

export const DashBoardApi = {
    getSomeAnnouncementList(limitSize,onlySelf) {       //取得部分-公告列表
        var obj = {
            limitSize:limitSize,
            onlySelf:onlySelf
        };
        return axios.post('/oblCtl/announcement/queryFilteredPage',obj).then(res => res.data);
    }
};
