const globalStore = {
    state:{
        ajaxLoading:false,
    },
    actions:{
        doSetAjaxLoading({commit},flag){
            commit('SET_AJAX_LOADING',flag);
        },
    },
    mutations:{
        SET_AJAX_LOADING:(state,flag) => {
            if(typeof flag == "undefined"){
                flag = false ;
            }
            state.ajaxLoading = flag;
        },
    },
    getters: {
        globalStore_ajaxLoading(state, getters, rootState) {
            return state.ajaxLoading ;
        }
    }
}


export default globalStore ;
