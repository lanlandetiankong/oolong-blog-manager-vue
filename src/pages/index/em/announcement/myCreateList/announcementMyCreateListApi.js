import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const AnnouncementMyCreateListApi = {
    getAllAnnouncementTagEnums() {  //取得 公告标签 列表
        let obj = HttpUtil.formatQueryPage({},{});
        //查询所有公告标签信息
        return axios.post('/oblCtl/announcementTag/gainEnumSelect',obj).then(res => res.data);
    },
    getPageQueryOfMyCreate(queryArr,tableConf) {   //取得 所有公告
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        obj['onlySelf'] = true;
        //查询所有公告信息
        return axios.post('/oblCtl/announcement/queryPage',obj).then(res => res.data);
    },
    batchDeleteByIds(ids) {  //批量删除
        var obj = {
            delIds:ids
        };
        return axios.post("/oblCtl/announcement/batchDeleteByIds",obj).then(res => res.data) ;
    },
    deleteById(delId) {  //删除
        var obj = {
            delId:delId
        };
        return axios.post("/oblCtl/announcement/deleteById",obj).then(res => res.data) ;
    },

};

