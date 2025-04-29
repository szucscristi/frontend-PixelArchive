<template>
    <BaseLayout>
      <div class="container py-5 text-light">
        <h2>Welcome, {{ username }}!</h2>
        <p>You are logged in.</p>
        <button class="btn btn-outline-light" @click="doLogout">Logout</button>
      </div>
    </BaseLayout>
  </template>
  
  <script>
  import BaseLayout from './BaseLayout.vue';
  import { getUsername, logout } from '@/auth';
  
  export default {
    name: 'UserProfile',
    components: { BaseLayout },
    data() {
      return {
        username: getUsername()
      };
    },
    methods: {
      doLogout() {
        logout();
        this.$router.push('/login');
      }
    },
    beforeRouteEnter(to, from, next) {
      // dacă nu e logat, redirecționează la login
      if (!getUsername()) return next('/login');
      next();
    }
  };
  </script>
  