<template>
  <div>
    <b-jumbotron header="DIT342 Frontend" lead="Welcome to your DIT342 Frontend Vue.js App">
      <b-button class="btn_message" variant="primary" v-on:click="getMessage()" >Get Message from Server</b-button>
      <p>Message from the server:<br/>
      {{ message }}</p>

      <!-- Button to go to the dashboard (simulate login) -->
      <router-link to="/dashboard" class="btn btn-success">Go to Dashboard</router-link>
    </b-jumbotron>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
</style>
