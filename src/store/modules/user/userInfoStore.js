const userInfoStore = {
    state:{
        userToken:{},
        authorization:'',
        visibleRouterUrls:[],   //可访问的菜单路径-集合
        grantedPermissions:[]  //可使用的权限-集合
    },
    actions:{
        doSetUserToken({commit},userTokenObj){
            //console.log("doSetUserToken",userTokenObj) ;
            commit('SET_USER_TOKEN',userTokenObj);
        },
        doSetAuthorization({commit},authorization){
            //console.log("doSetAuthorization",authorization) ;
            commit('SET_Authorization',authorization);
        },
        doSetVisibleRouterUrls({commit},routerUrls){
            commit('SET_VisibleRouterUrls',routerUrls);
        },
        doSetGrantedPermissions({commit},grantedPermissions){
            commit('SET_GrantedPermissions',grantedPermissions);
        }
    },
    mutations:{
        SET_USER_TOKEN:(state,userTokenObj) => {
            console.log("SET_USER_TOKEN",userTokenObj) ;
            if(typeof userTokenObj == "undefined"){
                userTokenObj = {} ;
            }
            state.userToken = userTokenObj;
        },
        SET_Authorization:(state,authorization) => {
            if(typeof authorization == "undefined"){
                authorization = '' ;
            }
            state.authorization = authorization;
        },
        SET_VisibleRouterUrls:(state,routerUrls) => {
            if(typeof routerUrls == "undefined" || routerUrls == null){
                routerUrls = [] ;
            }
            state.visibleRouterUrls = routerUrls;
        },
        SET_GrantedPermissions:(state,grantedPermissions) => {
            if(typeof grantedPermissions == "undefined" || grantedPermissions == null){
                grantedPermissions = [] ;
            }
            state.grantedPermissions = grantedPermissions;
        }
    },
    getters: {
        userInfoStore_userToken(state, getters, rootState) {
            return state.userToken ;
        },
        userInfoStore_authorization(state, getters, rootState) {
            return state.authorization ;
        },
        userInfoStore_visibleRouterUrls(state, getters, rootState) {
            return state.visibleRouterUrls ;
        },
        userInfoStore_grantedPermissions(state, getters, rootState) {
            if(state.grantedPermissions){
                return state.grantedPermissions ;
            }   else {
                return new Array() ;
            }
        },
    }
}


export default userInfoStore ;
