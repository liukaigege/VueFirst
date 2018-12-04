// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false

// 不要去掉，这是 ESLint 的语法，表示：不使用 no-new 规则校验下一行代码
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App></App>',
  router
})
