import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import App from './App'
import router from './router'
import store from './store'
import service from './service'
import './assets/css/main.css'
import './assets/css/font-awesome.min.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$service = service

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(mavonEditor)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
