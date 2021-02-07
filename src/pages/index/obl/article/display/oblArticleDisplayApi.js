import axios from '~Config/axios/httpConfig'

export const OblArticleDisplayApi = {
    getItemById(fid){  //根据 文章id 取得文章信息
        var params = {
            fid:fid
        };
        return axios.post("/oblCtl/oblArticle/queryOneById",params).then(res => res.data);
    }

};
