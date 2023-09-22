import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue' // Import Home page
import Dashboard from './views/Dashboard.vue' // Import Dashboard page

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard', // Define the path for the dashboard
      name: 'dashboard', // Name for the route
      component: Dashboard // Use the dashboard component
    }
  ]
})
