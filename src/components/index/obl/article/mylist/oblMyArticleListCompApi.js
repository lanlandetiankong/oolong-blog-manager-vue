import axios from '~Config/axios/httpConfig'
import {HttpUtil} from "~Config/axios/httpUtil";

export const OblMyArticleListCompApi = {
    querySelfDtoPage(listConf) {
        let obj = HttpUtil.formatQueryPage({},listConf);
        return axios.post('/oblCtl/oblArticle/querySelfDtoPage', obj).then(res => res.data);
    }
};
