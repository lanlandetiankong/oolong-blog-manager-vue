function dealCheckMenuItemPutAble(routerItem){ //返回是否可添加到routerUrlMap
    return routerItem.path ;
};
function dealSetMenuConfToRouter(toRouter,menuConf) {    //将值设置到VueRouter的相关配置
    if(menuConf){
        var menuIconName = menuConf.iconName;
        if(menuIconName){
            toRouter.meta.icon = menuIconName ;
        }
        var menuName = menuConf.name;
        if(menuName){
            toRouter.meta.title = menuName ;
        }
        toRouter.meta.menuConf = {
            fid:menuConf.id
        } ;
        toRouter.meta.visitLimit = false ;
    }
};
function dealRecursiveMenuChildrenToMap(_this,routerUrlMap,routerItem,parentUrl){
    parentUrl = (parentUrl) ? parentUrl+"/" : "/" ;
    if(dealCheckMenuItemPutAble(routerItem)){
        var realUrl = (parentUrl+routerItem.path).replace("//","/");
        if(realUrl.indexOf("/") != 0){
            realUrl = "/" + realUrl ;
        }
        routerUrlMap.set(realUrl,routerItem) ;
    }
    var itemChildrens = routerItem.children ;
    if(itemChildrens && itemChildrens.length > 0){
        var nextParentUrl = parentUrl+routerItem.path ;
        for(var childIdx in itemChildrens){
            dealRecursiveMenuChildrenToMap(_this,routerUrlMap,itemChildrens[childIdx],nextParentUrl);
        }
    }
}

/**
 * 匹配环境值
 * @param envVal
 * @returns {boolean}
 */
function verifyProcessEnvIsProd() {
    return process.env.NODE_ENV === "production" ;
}
function verifyProcessEnvIsTest() {
    return process.env.NODE_ENV === "testing" ;
}
function verifyProcessEnvIsDev() {
    return process.env.NODE_ENV === "development" ;
}


export const AsyncRouterUtil = {
    dealMenuListToRouters (urlMap,_this) {  //将后台的[菜单配置]更新到 VueRouter配置中
        if(_this.$router){
            var routersArrTemp = _this.$router.options.routes;
            var routerUrlMap = new Map();   //将VueRouter根据url为key,对应Router为Value映射为map
            if (routersArrTemp && routersArrTemp.length > 0) {
                for (var idx in routersArrTemp) {
                    var routerItem = routersArrTemp[idx];
                    dealRecursiveMenuChildrenToMap(_this,routerUrlMap, routerItem);
                }
            }
            for (var urlKey in urlMap) {  //遍历[可访问url]Map
                var grantMenuUrlFlag = routerUrlMap.has(urlKey);
                if (grantMenuUrlFlag == true) {   //如果定义的路由有对应的后台相关配置
                    var urlConf = urlMap[urlKey];
                    var routerItem = routerUrlMap.get(urlKey);
                    dealSetMenuConfToRouter(routerItem, urlConf); //根据后台配置修改路由的相关配置
                }
            }
            //console.log(routerUrlMap);
        }
    },
    verifyProcessEnvIsProd:verifyProcessEnvIsProd,
    verifyProcessEnvIsTest:verifyProcessEnvIsTest,
    verifyProcessEnvIsDev:verifyProcessEnvIsDev

}

