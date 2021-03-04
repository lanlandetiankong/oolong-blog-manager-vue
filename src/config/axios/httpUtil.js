import {StringUtils} from '~Assets/js/util/bee/BeeUtil.js' ;
/**
 * 格式化参数-分页查询
 * @param queryObj
 * @param tableConf
 * @returns {*}
 */
function formatQueryPage(queryObj,tableConf) {
    queryObj = (!queryObj) ? {} : queryObj ;
    if(!tableConf || (JSON.stringify(tableConf) === "{}")){
        return queryObj ;
    }
    let pagination = tableConf.pagination;
    let sorter = tableConf.sorter;
    if(typeof pagination == "object"){
        queryObj["current"] = pagination["current"];
        queryObj["pageSize"] = pagination["pageSize"];
    }
    if(typeof sorter == "object" && (typeof sorter.columnKey == "string") && (typeof sorter.order == "string")){
        //sort + 两个 _
        queryObj["sort__"+sorter.columnKey] = (sorter.sorter == "ascend") ? true : false;
    }
    return queryObj ;
}
function addSortField(obj,sortField) {
    obj = (typeof obj == "object") ? obj : {} ;
    if(!sortField){
        return obj;
    }
    if(typeof sortField == "object"){
        let sortKeys = Object.keys(sortField);
        if (!sortKeys || sortKeys.length === 0) {
            return obj;
        }
        for (let idx in keys) {
            let key = keys[idx] ;
            let item = sortField[key];
            obj["sort__"+key] = item ;
        }
    }
    return obj ;
}

function strToList(obj) {
    if(typeof obj != "string"){
        return obj ;
    }
    if(StringUtils.isBlank(obj)){
        return [] ;
    }
    return obj.split(",") ;
}
export const HttpUtil = {
    formatQueryPage,
    addSortField,
    strToList
};
