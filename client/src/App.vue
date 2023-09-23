<template>
  <div id="app">
    <!-- Colored row across the top of the page-->
    <div id="top-section">
      <div id="nav">
        <router-link to="/" style="color: black;">DoughFlow Dashboard</router-link>
      </div>
    </div>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #E5E4E2;
}
#top-section {
  background-color: #7fc9ff;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto Slab';
  font-size: larger;
  font-weight: bold;
}
</style>
