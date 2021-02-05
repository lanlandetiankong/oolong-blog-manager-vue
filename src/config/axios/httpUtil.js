function formatQueryPage(queryObj,tableConf) {
    queryObj = (!queryObj) ? {} : queryObj ;
    if(!tableConf){
        return queryObj ;
    }
    debugger;
    let pagination = tableConf.pagination;
    let sorter = tableConf.sorter;
    if(typeof pagination == "object"){
        queryObj["current"] = pagination["current"];
        queryObj["pageSize"] = pagination["pageSize"];
    }
    if(typeof sorter == "object" && (typeof sorter.columnKey == "string") && (typeof sorter.order == "string")){
        queryObj["sort@"+sorter.columnKey] = (sorter.sorter == "ascend") ? true : false;
    }
    return queryObj ;
}
export const HttpUtil = {
    formatQueryPage
};
