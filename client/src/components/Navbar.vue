<template>
  <div class="out">
    <nav class="navbar">
      <router-link to="/dashboard">
      <img id="logo" src="../assets/logonotext.png" alt="Logo" />
    </router-link>
    <h2 class="header">DoughFlow</h2>
    <router-link to="/login" @click="handleLogout">
      <h3 class="header">Logout</h3>
    </router-link>
    </nav>
  </div>
  </template>

<script>
export default {
  methods: {
    handleLogout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    handleDashboard() {
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #7fc9ff;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.4);
}
#logo {
  margin-bottom: 0px;
  width: 60px;
  height: auto;
}
.header {
  margin-top: 10px;
  font-family: 'Roboto Slab', sans-serif;
  font-weight: bold;
  color: white;
  font-size: 20px;
}
</style>
