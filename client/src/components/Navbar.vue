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
  height: 40px;
  background-color: #477899;
  /*padding: 10px 20px;*/
}
.navbtn {
  height: 20px;
  max-width: 150px;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: none;
  background-color: white;
  color: inherit;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 4px;
}
</style>
