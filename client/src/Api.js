import axios from 'axios'
import router from './router.js'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api/v1'
})
Api.interceptors.response.use(undefined, (error) => {
  if (error.response && error.response.status === 500) {
    router.push({ path: '/500' })
  } else {
    return Promise.reject(error)
  }
})

export default Api
