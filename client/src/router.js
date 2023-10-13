import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue' // Import Dashboard page
import BudgetManagement from './views/BudgetManagement.vue'

import RegisterAccount from './views/RegisterAccount.vue'
import Login from './views/Login.vue'
import ManageAccount from './views/ManageAccount.vue'
import Error500 from './views/500error.vue'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/dashboard', // Define the path for the dashboard
      name: 'dashboard', // Name for the route
      component: Dashboard, // Use the dashboard component
      meta: { requiresAuth: true }
    },
    {
      path: '/budgetmanagement',
      name: 'budgetManagement',
      component: BudgetManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterAccount
    },
    {
      path: '/my-account',
      name: 'my-account',
      component: ManageAccount,
      meta: { requiresAuth: true }
    },
    {
      path: '/500',
      name: 'Error500',
      component: Error500
    },
    {
      path: '*',
      redirect: '/'
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
