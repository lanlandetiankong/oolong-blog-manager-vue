//ajax远程调用
import axios from '~Config/axios/httpConfig'
import {HttpUtil} from '~Config/axios/httpUtil'

export const OblArticleRecommendDelayRecordApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //分页查询
        return axios.post('/oblCtl/oblArticleRecommendDelayRecord/queryPage', obj).then(res => res.data);
    }
};
