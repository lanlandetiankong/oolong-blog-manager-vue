import Vue from 'vue'
import Vuex from 'vuex'
import getters  from  './getters.js'
import tagsView from './modules/tags/tagsView.js'
import routingStore from './modules/routing/routingStore.js'
import userInfoStore from './modules/user/userInfoStore.js'
import i18nLocaleStore from './modules/i18n/i18nStore.js'
import globalStore from './modules/global/globalStore.js'
import styleStore from './modules/global/styleStore.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules:{
        tagsView,
        routingStore,
        userInfoStore,
        i18nLocaleStore,
        globalStore,
        styleStore
    },
    getters
})
export default store;
