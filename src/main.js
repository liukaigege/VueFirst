// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
import axios from 'axios'
import ElTreeGrid from 'element-tree-grid'
Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  // 所有请求之前都要执行的操作
  // console.log('1 请求发送出去之前')
  // console.log(config)
  // 在此处，统一处理 请求头，处理后，就不需要在每个请求中，单独的处理了
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, (error) => {
  // Promise 内部处理失败，就会执行这个回调函数，在此处，应该进行 错误 处理
  // Promise.reject() 直接得到一个失败的Promise对象
  return Promise.reject(error)
})
Vue.use(ElementUI)
Vue.config.productionTip = false

// 不要去掉，这是 ESLint 的语法，表示：不使用 no-new 规则校验下一行代码
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App></App>',
  router
})
