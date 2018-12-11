import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'
import Roles from '@/components/roles/Roles'
import Rights from '@/components/rights/Rights'
import Categories from '@/components/categories/Categories'
import Goods from '@/components/goods/Goods'
import GoodsAdd from '@/components/goods_add/Goods_add'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/home',
      component: Home,
      children: [
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/categories', component: Categories },
        // /goods/:page 表示使用了路由参数，用来动态匹配哈希值
        //   :page 就是路由参数，我们使用这个参数，来匹配分页数值
        // :page? 表示这路由参数是可选的，可以有，也可以没有，这样就可以匹配：
        // 1 /goods
        // 2 /goods/6
        { path: '/goods/:page?', component: Goods },
        { path: '/goods_add', component: GoodsAdd }
      ]
    }
  ]
})

// 添加导航守卫，用来实现登录访问限制
// 说明：每次切换路由（访问页面），都会先执行导航守卫，那么，是否登录的逻辑判断就可以放在
//      导航守卫中判断了
router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  /*
    登录访问的思路：
    1 判断是不是登录页面
    2 如果是登录页面，直接展示登录页面内容

    3 如果不是登录页面，就判断是否登录
    4 如果登录了，就直接显示要访问的页面
    5 如果没有登录，就跳转到登录页面，让用户登录
  */
  // 1.判断（先在登录页面把token值存储起来）
  if (to.path === '/login') {
    return next()
  }
  const token = localStorage.getItem('token')
  // 判断本地是否存储token值，有的话说明登陆过，就跳转
  if (token) {
    next()
  } else {
    // 如果没有登录过，就跳到登录页去跳转
    next('/login')
  }
})
// 导入路由实例
export default router
