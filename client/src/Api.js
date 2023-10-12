import axios from 'axios'
import router from './router.js'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api/v1',
  timeout: 5000
})

Api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 500) {
      router.push({ path: '/500' })
    } else if (!error.response || error.code === 'ECONNABORTED') {
      if (router.currentRoute.path !== '/500') {
        router.push({ path: '/500' })
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default Api
