import axios from '~Config/axios/httpConfig'

export const OblArticleSetRecommendCompApi = {
    setAsRecommended(values,idList) {  //设置文章为 推荐
        let obj = values ;
        let rangeTimeArr = values['rangeTime'];
        obj['startTime'] = rangeTimeArr[0];
        obj['endTime'] = rangeTimeArr[1];
        obj['articleIdList'] = idList ;
        obj['rangeTime'] = undefined ;
        return axios.post('/oblCtl/oblArticleRecommend/createByForm',obj).then(res => res.data);
    },
};
