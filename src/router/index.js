import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { Toast } from 'vant'

Vue.use(Toast)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  let name = to.name
  let tags = localStorage.getItem('user_phone')
  let path = sessionStorage.getItem('callback')
  if (!path) {
    if (!tags) {
      sessionStorage.setItem('callback', name)
      router.push({ name: 'login' })
    }
  }

  if (to.name === 'detail') {
    const permission = localStorage.getItem('user_permission')
    if (
      permission.indexOf('销售总监') === -1 &&
      permission.indexOf('销秘') === -1 &&
      permission.indexOf('权证') === -1
    ) {
      Toast('抱歉你没有权限~')
      router.push({ name: 'buy' })
    }
  }
  next()
})

export default router
