<template>
    <b-container fluid class="vh-100 d-flex justify-content-center align-items-center bg-blue">
      <b-row>
        <b-col>
          <b-card text-variant="white" class="bg-transparent border-0">
            <b-card-text>
              <h1 class="display-3">Internal Server Error</h1>
              <p class="lead">Sorry, we're experiencing some issues. Please try again later.</p>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </template>

<script>
export default {
  name: 'Error500'
}
</script>

  <style scoped>
  .vh-100 {
    height: 100vh;
  }

  .bg-blue {
    background-color: #7fc9ff;
  }
  </style>
