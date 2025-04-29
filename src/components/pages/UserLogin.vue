<template>
    <BaseLayout>
      <div class="d-flex justify-content-center align-items-center" style="height:70vh;">
        <form @submit.prevent="submit" class="p-4 bg-secondary rounded" style="min-width:320px;">
          <h3 class="text-light mb-3">Login</h3>
          <div class="mb-3">
            <label class="form-label text-light">Username</label>
            <input v-model="username" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-light">Password</label>
            <input v-model="password" type="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Log in</button>
          <div v-if="error" class="text-danger mt-2">{{ error }}</div>
        </form>
      </div>
    </BaseLayout>
  </template>
  
  <script>
  import { login } from '@/auth';
  import BaseLayout from './BaseLayout.vue';
  
  export default {
    name: 'LoginPage',
    components: { BaseLayout },
    data() {
      return {
        username: '',
        password: '',
        error: ''
      };
    },
    methods: {
      submit() {
        this.error = '';
        login(this.username, this.password)
          .then(() => {
            this.$router.push('/profile');
          })
          .catch(() => {
            this.error = 'Invalid credentials';
          });
      }
    }
  };
  </script>
  
  <style scoped>
  form { box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  </style>
  