<template>
    <div class="fullPage">
        <Navbar />
      <div class="container d-flex align-items-center justify-content-center min-vh-100">
        <div class="row">
          <div class="col-md-6 order-2 order-md-1">
            <div class="fullForm card p-4">
              <h2 class="mb-4">Change Password</h2>
        <form @submit.prevent="changePassword">
        <div class="input-box mb-3 position-relative">
          <input class="form-control ps-5" type="password" v-model="password" placeholder="Enter New Password" required />
          <i class="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-2"></i>
        </div>
        <div class="input-box mb-3 position-relative">
          <input class="form-control ps-5" type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
          <i class="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-2"></i>
        </div>
          <div class="input-box mb-3">
            <input class="btn btn-primary w-100" type="submit" value="Confirm" @click="changePassword" />
          </div>
          <div class="input-box mb-3" >
            <input class="btn btn-primary w-100" id="deleteButton" @click="deleteUser" type="button" value="Delete Account" />
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
import Navbar from '@/components/Navbar'

export default {
  name: 'ManageAccount',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: ''
    }
  },
  components: {
    Toast,
    Navbar
  },
  methods: {
    async changePassword() {
      if (this.password !== this.confirmPassword) {
        this.$refs.toast.showToast('Password Error', 'The password does not match')
        return
      }

      try {
        const response = await axios.patch(
      `http://localhost:3000/api/v1/users/${this.$route.params.username}`,
      { password: this.password },
      { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
        )
        if (response.status === 200) {
          this.$refs.toast.showToast('Account Update', 'Password updated')
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$refs.toast.showToast('Account Update', 'Invalid Password')
        }
      }
    },
    async deleteUser() {
      const isConfirmed = window.confirm('Are you sure you want to delete your account?')
      if (!isConfirmed) return
      try {
        const response = await axios.delete(
      `http://localhost:3000/api/v1/users/${this.$route.params.username}`,
      { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
        )
        if (response.status === 200) {
          this.$refs.toast.showToast('Account Deletion', 'Account deleted successfully')
          this.$router.push({ name: 'login' })
        }
      } catch (error) {
        if (error.response) {
          this.$refs.toast.showToast('Error', 'An error occurred while deleting the account')
        }
      }
    },
    async handleLogout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped>
#deleteButton {
    background-color: rgb(218, 0, 0); 
    color: white;
}

#deleteButton:hover {
    background-color: rgb(94, 0, 0); 
    cursor: pointer; 
}
.form-control {
  padding-left: 20px;
}
</style>
