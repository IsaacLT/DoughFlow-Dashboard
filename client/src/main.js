import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import './assets/globalstyles.css'
import VueApexCharts from 'vue-apexcharts'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)
Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
