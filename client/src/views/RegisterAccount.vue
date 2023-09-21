<template>
  <div class="fullPage">
    <img class="logo" src="../assets/logo.png" />
    <div class="fullForm">
        <h2>Register Account</h2>
        <form action="#">
          <div class="input-box">
            <font-awesome-icon id ="userIcon" icon="fa-user"/>
            <input type="text" v-model="username" placeholder="Enter username" required/>
          </div>
          <div class="input-box">
            <font-awesome-icon id ="lockIcon" icon="fa-lock"/>
            <input type="password" v-model="password" placeholder="Enter password" required/>
          </div>
          <div class="input-box button">
            <input type="submit" v-on:click="createAccount" value="Create Account"/>
          </div>
          <div class="text">
            <h3>Already have an account? <a href="login">Login</a></h3>
          </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateAccount',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async createAccount() {
      const result = await axios.post('http://localhost:3000/users', {
        username: this.username,
        password: this.password
      })
      if (result.status === 200) {
        alert('Account created!')
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
  padding-left: 30px;
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
#userIcon {
  position: absolute;
  left: 45px;
  top: 32%;
  transform: translateY(-50%);
  z-index: 1;
}
#lockIcon {
  position: absolute;
  left: 45px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}
</style>
