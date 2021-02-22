import axios from '~Config/axios/httpConfig'

export const AnnouncementDisplayApi = {
    getItemById(fid){  //根据公告id查询公告信息
        let params = {
            fid:fid
        };
        return axios.post("/oblCtl/announcement/queryOneById",params).then(res => res.data);
    }

};
