<template>
  <div class="fullPage">
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      <div class="row">
        <div class="col-md-6 order-2 order-md-1">
          <div class="fullForm card p-4">
            <h2 class="mb-4">Login</h2>
      <form @submit.prevent="login">
        <div class="input-box mb-3 position-relative">
          <input class="form-control ps-5" type="text" v-model="username" placeholder="Enter username" required />
          <i class="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-2"></i>
        </div>
        <div class="input-box mb-3 position-relative">
          <input class="form-control ps-5" type="password" v-model="password" placeholder="Enter password" required />
          <i class="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-2"></i>
        </div>
        <div class="input-box mb-3">
          <input class="btn btn-primary w-100" type="submit" value="Login" />
        </div>
        <div class="text-center">
          <h3>Don't have an account? <a href="register">Register</a></h3>
        </div>
        <Toast ref="toast" />
      </form>
          </div>
        </div>
        <div class="col-md-6 order-1 order-md-2 mb-3 mb-md-0">
          <img class="logo img-fluid mx-auto d-block" src="../assets/logo.png" alt="Logo" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Toast from '@/components/Toast'

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  components: {
    Toast
  },
  methods: {
    async login() {
      await axios.post('http://localhost:3000/api/v1/login', {
        username: this.username,
        password: this.password
      })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem('token', response.data.token)
            if (this.$route.path !== '/') this.$router.push({ name: 'my-account', params: { username: this.username } })
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              this.$refs.toast.showToast('Login Error', 'User does not exist')
            } else if (error.response.status === 401) {
              this.$refs.toast.showToast('Login Error', 'Incorrect Password')
            }
          }
        })
    }
  }
}
</script>
<style scoped>
.form-control {
  padding-left: 20px;
}
</style>
