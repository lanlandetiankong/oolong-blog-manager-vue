import axios from '~Config/axios/httpConfig';
import {HttpUtil} from '~Config/axios/httpUtil';

export const ArticleCommentListApi = {
    getPageQuery(queryArr,tableConf) {
        let obj = HttpUtil.formatQueryPage(queryArr,tableConf);
        //查询所有评论
        return axios.post('/oblCtl/oblArticleComment/queryPage',obj).then(res => res.data);
    }
};

