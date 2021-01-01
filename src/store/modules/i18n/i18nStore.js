const i18nLocaleStore = {
    state:{
        i18nLocale:'',
    },
    actions:{
        doSetI18nLocale({commit},localeVal){
            commit('SET_I18N_LOCALE',localeVal);
        },
    },
    mutations:{
        SET_I18N_LOCALE:(state,localeVal) => {
            if(typeof localeVal == "undefined"){
                localeVal = 'zh-CN' ;
            }
            state.i18nLocale = localeVal;
        },
    },
    getters: {
        i18nStore_locale(state, getters, rootState) {
            return state.i18nLocale ;
        }
    }
}


export default i18nLocaleStore ;
