import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 1.1导入vue-table-with-tree-grid组件
import TreeTable from 'vue-table-with-tree-grid'

// 2.1导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 2.2导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 3.1导入nprogress的js
import NProgress from 'nprogress'
// 3.2导入nprogress对应的样式
import 'nprogress/nprogress.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // console.log(config)
  // 3.3 在request拦截器中，显示进度条，NProgress.start()
  NProgress.start()
  // 为请求头对象，添加Token 验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须retuen config
  return config
})
// 3.4在response拦截器中，隐藏进度条,NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 1.2全局注册vue-table-with-tree-grid组件
Vue.component('tree-table', TreeTable)

// 2.3 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

// 定义全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart('2', 0)

  const hh = (dt.getHours() + '').padStart('2', 0)
  const mm = (dt.getMinutes() + '').padStart('2', 0)
  const ss = (dt.getSeconds() + '').padStart('2', 0)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
