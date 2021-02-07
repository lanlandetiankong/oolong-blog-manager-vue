//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const OblArticleDisplayApi = {
    getItemById(fid){  //根据 文章id 取得文章信息
        var params = {
            fid:fid
        }
        return axios.post("/oblCtl/oblArticle/queryOneById",params).then(res => res.data);
    }

}
