import axios from '~Config/axios/httpConfig'
import {HttpUtil} from "~Config/axios/httpUtil";

export const OblRecentAnnouncementListCompApi = {
    queryRecentPage(listConf) {
        let obj = HttpUtil.formatQueryPage({},listConf);
        return axios.post('/oblCtl/announcement/queryRecentPage', obj).then(res => res.data);
    }
};
