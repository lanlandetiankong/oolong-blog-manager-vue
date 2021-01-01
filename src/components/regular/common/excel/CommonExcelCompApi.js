//ajax远程调用
import axios from '~Config/axios/httpConfig'
//包装param参数
import qs from 'qs'

/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */

export const CommonExcelCompApi = {
    uploadExcelModels(formData) {
        return axios.post("/oblCtl/commonApi/file/excelUpload/excelModelUpload",formData,
            {
                headers: {'Content-Type': 'multipart/form-data'}
            }
        ).then(res => res.data) ;
    }
}
