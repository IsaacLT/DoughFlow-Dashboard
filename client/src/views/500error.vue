<template>
  <div>
    <Navbar />
    <b-container fluid class="vh-100 d-flex justify-content-center align-items-center bg-blue">
      <b-row>
        <b-col>
          <b-card class="bg-transparent border-0">
            <b-card-text>
              <h1>Server Error</h1>
              <p class="lead">Sorry, we're experiencing some issues. Please try again later.</p>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
  </template>

<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'Error500',
  components: {
    Navbar
  }
}
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}
h1 {
  color: #1f8cdb;
  font-weight: bold;
 }
p {
 color: #1f8cdb;
 font-weight: normal;
}
.bg-blue {
  background-color: #E5E4E2;
}
</style>
