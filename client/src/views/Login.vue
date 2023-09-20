<template>
  <div class="fullPage">
    <img class="logo" src="../assets/logo.png" />
    <div class="fullForm">
      <h2>Login</h2>
      <form action="#">
        <div class="input-box">
          <input type="text" v-model="username" placeholder="Enter username" required/>
        </div>
        <div class="input-box">
          <input type="password" v-model="password" placeholder="Enter password" required/>
        </div>
        <div class="input-box button">
          <input type="submit" v-on:click="login" value="Login"/>
        </div>
        <div class="text">
            <h3>Don't have an account? <a href="register">Register</a></h3>
          </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      const result = await axios.post('http://localhost:3000/login', {
        username: this.username,
        password: this.password
      })
      if (result.status === 200) {
        alert('Login Succesful!')
      } else if (result.status === 404) {
        alert('User not found')
      } else if (result.status === 401) {
        alert('Invalid password')
      }
    }
  }
}
</script>

<style scoped>
.fullPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #7fc9ff;
}
.logo {
  max-width: 600px;
  width: 100%;
  max-height: 600px;
  height: 100%;
  padding: 50px;
}
.fullForm {
  position: relative;
  max-width: 430px;
  width: 100%;
  height: 380px;
  background: #fff;
  padding: 35px;
  box-shadow: 5px 5px 8px;
  border-radius: 6px;
}
.fullForm h2 {
  position: relative;
  font-size: 30px;
  font-weight: 600;
  color: #333;
}

.fullForm h3 {
  position: relative;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
.fullForm form {
  margin-top: 25px;
}
.fullForm form .input-box {
  height: 52px;
  margin: 18px 0;
}
form .input-box input {
  height: 100%;
  width:100%;
  outline: none;
  padding: 0 15px;
  font-size: 17px;
  font-weight: 400;
  color: #333;
  border: 1.5px solid #ada3a3;
  border-bottom-width: 2.5px;
  border-radius: 10px;
  transition: all 0.3s ease;
}
.input-box input:focus,
.input-box input:valid {
  border-color: #0082d3;
}
.input-box.button input {
  color: #fff;
  letter-spacing: 1px;
  border: none;
  background: #0082d3;
  cursor: pointer;
}
.input-box.button input:hover {
  background: #003557;
}
</style>
