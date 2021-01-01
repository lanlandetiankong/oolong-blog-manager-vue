const routingStore = {
    state:{
        grantedMenuList:[],
        grantedMenuUrlMap: new Map()
    },
    actions:{
        doSetGrantedMenuList({commit},menuList){
            commit('SET_GRANT_MENU_LIST',menuList);
        },
        doSetGrantedMenuUrlMap({commit},menuUrlMap){
            commit('SET_GRANT_MENU_URL_MAP',menuUrlMap);
        }
    },
    mutations:{
        SET_GRANT_MENU_LIST:(state,menuList) => {
            if(typeof menuList == "undefined"){
                menuList = [] ;
            }
            state.grantedMenuList = menuList;
        },
        SET_GRANT_MENU_URL_MAP:(state,menuUrlMap) => {
            //console.log("SET_GRANT_MENU_URL_MAP",menuUrlMap) ;
            if(typeof menuUrlMap == "undefined"){
                menuUrlMap = new Map() ;
            }
            state.grantedMenuUrlMap = menuUrlMap;
        }
    },
    getters: {
        routingStore_grantedMenuList(state, getters, rootState) {
            return state.grantedMenuList ;
        },
        routingStore_grantedMenuUrlMap(state, getters, rootState) {
            return state.grantedMenuUrlMap ;
        },
    }
}


export default routingStore ;
