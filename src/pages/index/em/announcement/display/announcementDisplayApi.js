import axios from '~Config/axios/httpConfig'

export const AnnouncementDisplayApi = {
    getItemById(fid){  //根据 公告草稿id 取得公告草稿
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/announcement/queryOneById",params).then(res => res.data);
    }

};
