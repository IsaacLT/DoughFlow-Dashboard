<template>
    <nav class="navbar">
      <button class="navbtn" @click="handleDashboard">Dashboard</button>
      <button class="navbtn" @click="handleLogout">Logout</button>
    </nav>
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
  background-color: #477899;
  padding: 10px 20px;
}
</style>
