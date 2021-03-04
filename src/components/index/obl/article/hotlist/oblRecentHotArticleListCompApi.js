import axios from '~Config/axios/httpConfig'
import {HttpUtil} from "~Config/axios/httpUtil";

export const OblRecentHotArticleListCompApi = {
    queryRecentHotPage(listConf) {
        let obj = HttpUtil.formatQueryPage({},listConf);
        return axios.post('/oblCtl/oblArticle/queryRecentHotPage', obj).then(res => res.data);
    }
};
