import axios from '~Config/axios/httpConfig'

export const OblArticleEditRecommendCompApi = {
    editRecommended(values,idList) {  //更新文章推荐
        let obj = values ;
        let rangeTimeArr = values['rangeTime'];
        obj['startTime'] = rangeTimeArr[0];
        obj['endTime'] = rangeTimeArr[1];
        obj['recommendIdList'] = idList ;
        obj['rangeTime'] = undefined ;
        return axios.post('/oblCtl/oblArticleRecommend/batchUpdateByForm',obj).then(res => res.data);
    },
};
