const tagsView = {
    state: {
        contextMenuBaseConf: {},
        visitedViews:[],
        cachedViews:[]
    },
    mutations: {
        SET_CONTEXT_MENU_POSITION: (state,contextMenuPositionObj) => {
            //不能直接通过修改属性，需求修改对象的引用地址才能触发视图的更新
            let data = Object.assign({},state.contextMenuBaseConf,contextMenuPositionObj) ;
            state.contextMenuBaseConf = data ;
        },
        SET_HIDDEN_CONTEXT_MENU_POSITION: (state) => {
            let data = JSON.parse(JSON.stringify(state.contextMenuBaseConf)) ;
            data.visible = false;
            state.contextMenuBaseConf = data ;
        },
        ADD_VISITED_VIEWS:(state,view) => {
            if(state.visitedViews.some(v => v.path === view.path)) {
                return ;
            }   else {
                var viewMetaTemp = view.meta ;
                if(viewMetaTemp.visitedCacheAble == false){ //明确指明不允许添加到[已访问列表]
                    return ;
                }
                state.visitedViews.push({
                    name:view.name,
                    path:view.path,
                    title:viewMetaTemp.title || 'UnknowName',
                    meta:viewMetaTemp
                })
                if(viewMetaTemp.keepAliveFlag == true){
                    var selfCompName = viewMetaTemp.selfCompName ;
                    if(selfCompName){
                        var selfCompIdx = state.cachedViews.indexOf(selfCompName);
                        if(selfCompIdx < 0){   //不存在key
                            let cachedViewsArr = state.cachedViews;
                            cachedViewsArr = (cachedViewsArr) ? cachedViewsArr : [] ;
                            cachedViewsArr.push(selfCompName);
                            state.cachedViews = cachedViewsArr;
                        }
                    }
                }
            }
        },
        DEL_VISITED_VIEWS:(state,view) => {
            var _this = this ;
            //从访问列表移除
            for (const[i,v] of state.visitedViews.entries()) {
                if(v.path === view.path) {
                    state.visitedViews.splice(i,1) ;
                    break ;
                }
            }
            //缓存移除 指定view
            var cachedViewArr = state.cachedViews;
            var viewMetaTemp = view.meta ;
            if(viewMetaTemp){   //有设置meta
                //所选view的组件名
                const selfCompNameTemp = viewMetaTemp.selfCompName ;
                if(selfCompNameTemp){
                    if(typeof cachedViewArr != "undefined" && cachedViewArr != null ){
                        if(cachedViewArr.length > 0 ){
                            var selfCompIndex = cachedViewArr.indexOf(selfCompNameTemp);
                            if (selfCompIndex > -1) {
                                cachedViewArr.splice(selfCompIndex, 1);
                            }
                            //重置值，触发更新通知
                            state.cachedViews = cachedViewArr;
                        }   else {
                            //当前父页面 下被缓存的记录为0
                        }
                    }   else {
                        //当前父页面没有被缓存的记录
                    }
                }
            }

        },
        DEL_OTHERS_VIEWS: (state,view) => {
            //从访问列表移除
            for (const[i,v] of state.visitedViews.entries()) {
                if(v.path === view.path) {
                    state.visitedViews = state.visitedViews.slice(i,i+1) ;
                    break ;
                }
            }
            //缓存移除 其他view
            var viewMetaTemp = view.meta ;
            viewMetaTemp = typeof viewMetaTemp != "undefined" ? viewMetaTemp : view.meta ;
            if(viewMetaTemp){   //有设置meta
                if(viewMetaTemp.keepAliveFlag == true){ //如果唯一没关闭的页面是有缓存的
                    let resultCacheArr = [];
                    resultCacheArr.push(viewMetaTemp.selfCompName);
                    state.cachedViews = resultCacheArr ;
                }   else {
                    state.cachedViews = [] ;
                }
            }   else {
                state.cachedViews = [] ;
            }

        },
        DEL_ALL_VIEWS:(state) => {
            state.visitedViews = [] ;
            state.cachedViews = [] ;
        }
    },
    actions: {
        doSetContextMenuPosition({commit},contextMenuPositionObj){
            commit('SET_CONTEXT_MENU_POSITION',contextMenuPositionObj);
        },
        doSetHiddenContextMenuPosition({commit}){
            commit('SET_HIDDEN_CONTEXT_MENU_POSITION');
        },
        doAddVisitedViews({ commit }, view) {
            commit('ADD_VISITED_VIEWS', view)
        },
        doDelVisitedViews({ commit, state }, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view) ;
                resolve([...state.visitedViews])
            })
        },
        doDelOthersViews({ commit, state }, view) {
            return new Promise((resolve) => {
                commit('DEL_OTHERS_VIEWS', view) ;
                resolve([...state.visitedViews])
            })
        },
        doDelAllViews({ commit, state }) {
            return new Promise((resolve) => {
                commit('DEL_ALL_VIEWS') ;
                resolve([...state.visitedViews])
            })
        }

    }


}


export default tagsView
