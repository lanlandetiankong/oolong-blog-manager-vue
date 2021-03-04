export const axiosForExcelUtil = {
    exportExcelDownload(response) {
        if(!response){
            return ;
        }
        const filename = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1]) || '导出列表.xlsx'
        //将response 新建成文件流
        var blob = new Blob([response.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
        //创建下载地址以及a标签,并且模拟a标签的点击事件进行下载文件。
        let url = window.URL.createObjectURL(blob);
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.download = filename;
        aLink.href = url;
        document.body.appendChild(aLink)
        aLink.click();
        window.URL.revokeObjectURL(aLink.href);
    }
}
