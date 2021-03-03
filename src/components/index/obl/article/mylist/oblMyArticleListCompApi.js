import axios from '~Config/axios/httpConfig'

export const OblMyArticleListCompApi = {
    querySelfDtoPage() {
        var obj = {};
        return axios.post('/oblCtl/oblArticle/querySelfDtoPage', obj).then(res => res.data);
    }
};
