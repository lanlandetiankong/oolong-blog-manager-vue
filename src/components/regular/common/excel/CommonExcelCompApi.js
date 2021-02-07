import axios from '~Config/axios/httpConfig'


export const CommonExcelCompApi = {
    uploadExcelModels(formData) {
        return axios.post("/oblCtl/commonApi/file/excelUpload/excelModelUpload",formData,
            {
                headers: {'Content-Type': 'multipart/form-data'}
            }
        ).then(res => res.data) ;
    }
};
