const styleStore = {
    state:{
        appMain:{},
    },
    actions:{
        doSetStyleOfAppMain({commit},obj){
            commit('SET_STYLE_OF_APP_MAIN',obj);
        },
    },
    mutations:{
        SET_STYLE_OF_APP_MAIN:(state,obj) => {
            if(typeof obj == "undefined" || typeof obj != "object"){
                return ;
            }
            const allObj = Object.assign(state.appMain, obj);
            state.appMain = allObj;
        },
    },
    getters: {
        styleStore_appMain(state, getters, rootState) {
            if(typeof state.appMain == "undefined" || state.appMain == null){
                return {} ;
            }
            return state.appMain ;
        }
    }
}


export default styleStore ;
