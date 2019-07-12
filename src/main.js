import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式
import './assets/css/global.css'
// 导入组件vue-table-with-tree-grid
import Treetable from 'vue-table-with-tree-grid'

import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
    // 将组件进行全局注册
Vue.component('tree-table', Treetable)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')