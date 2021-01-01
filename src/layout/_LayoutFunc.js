/* 不要使用 // 进行注释！！！！！！！！！！！！！！！！！！！！！！！！   */
import $ from 'jquery' ;

export const LayoutFunc = {
    //判断菜单是否已经打开
    handleCheckMenuIsOpen(_this,tempTagsArr,key) {
        var tempTagsOpendFlag = false ;
        if(tempTagsArr.length == 0){
            tempTagsOpendFlag = false ;
        }   else {
            $.each(tempTagsArr,function (idx,val) {
                if(key == val.id) {
                    tempTagsOpendFlag = true ;
                    return false ;
                }
            })
        }
        return tempTagsOpendFlag ;
    },
    //判断菜单是否已经打开
    handleGetMenuToTagObj(_this,tempMenuList,key) {
        var tempAddMenuObj = null ;
        if(tempMenuList.length > 0){
            var tempMenuMap = PrivateFunc.doMenuListToMap(tempMenuList);
            if(tempMenuMap && tempMenuMap.size > 0) {
                tempAddMenuObj = tempMenuMap.get(key)
            }
        }
        if(typeof tempAddMenuObj != "undefined" && tempAddMenuObj != null) {
            return {
                id:tempAddMenuObj.id,
                iconName:tempAddMenuObj.iconName,
                path:tempAddMenuObj.path,
                name:tempAddMenuObj.name,
            }
        }   else {
            return null ;
        }
    },




}

/**
 * 内部使用的方法,别导出
 * @type {{doMenuListToMap(*=): *}}
 */
const PrivateFunc = {
    doMenuListToMap(tempList) {
        var tempMap = new Map() ;
        if(typeof tempList == "undefined" || tempList.length  == 0){
            return tempMap ;
        }   else {
            $.each(tempList,function (idx,val) {
                tempMap.set(val.id,val);
                if(val.children && val.children.length > 0){
                    var childrenList = val.children ;
                    $.each(childrenList,function (i,v) {
                        tempMap.set(v.id,v);
                    })
                }
            })
        }
        //console.log(tempMap) ;
        return tempMap ;
    }
}
