import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import BudgetManagement from './views/BudgetManagement.vue'

import RegisterAccount from './views/RegisterAccount.vue'
import Login from './views/Login.vue'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/budgetmanagement',
      name: 'budgetManagement',
      component: BudgetManagement,
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterAccount
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const token = localStorage.getItem('token')
  if (requiresAuth && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
