import axios from '~Config/axios/httpConfig'
import {HttpUtil} from "~Config/axios/httpUtil";

export const OblMyAnnouncementListCompApi = {
    querySelfDtoPage(listConf) {
        let obj = HttpUtil.formatQueryPage({},listConf);
        return axios.post('/oblCtl/announcement/querySelfPage', obj).then(res => res.data);
    }
};
