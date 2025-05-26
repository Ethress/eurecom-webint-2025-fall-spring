<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/contact">Contact</router-link> |
      <router-link to="/map">Map</router-link> |
      <router-link to="/browse">Browse</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<style>
nav {
  padding: 1rem;
  background: #f0f0f0;
}
nav a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #42b983;
}
main {
  padding: 1rem;
}
</style>
