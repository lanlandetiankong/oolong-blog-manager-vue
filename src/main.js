// ie polyfill
import '@babel/polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store/index'
import VueI18n from 'vue-i18n'
import DataFilter from './filter/DataFilter'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueDraggableResizable from 'vue-draggable-resizable';
Vue.component('vue-draggable-resizable', VueDraggableResizable);

import VueCookies from 'vue-cookies'

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

//markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'


//---------------------------------------------------------------------------->>>>>>css
import '~Assets/styles/reset.css'
import '~Assets/styles/border.css'

Vue.config.productionTip = (process.env.NODE_ENV === 'development');


//use
Vue.use(Antd)
Vue.use(VueQuillEditor)
Vue.use(VueI18n)
Vue.use(VueCookies)
Vue.use(mavonEditor);

const i18n = new VueI18n({
    locale: 'zh-CN',    // 语言标识
    messages: {
        'zh-CN': require('~Config/i18n/lang/zh-CN'),
        'en-US': require('~Config/i18n/lang/en-US')
    }
})

window.vuei18n = i18n ;




//router每次跳转都刷新页面的处理
//Vue.prototype.router = router;
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  DataFilter,
  components: { App },
  template: '<App/>'
})
