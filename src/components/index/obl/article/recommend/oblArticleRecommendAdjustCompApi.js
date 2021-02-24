import axios from '~Config/axios/httpConfig'

export const OblArticleRecommendAdjustCompApi = {
    adjustTime(values,idList) {  //调整推荐时间
        let obj = values;
        obj['recommendIds'] = idList;
        return axios.post('/oblCtl/oblArticleRecommend/adjustTime',obj).then(res => res.data);
    },
};
