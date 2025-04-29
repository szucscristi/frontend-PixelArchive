<template>
    <BaseLayout>
      <div class="d-flex justify-content-center align-items-center" style="height:70vh;">
        <form @submit.prevent="submit"
              class="p-4 bg-secondary rounded"
              style="min-width:320px;">
          <h3 class="text-light mb-3">Sign Up</h3>
  
          <div class="mb-3">
            <label class="form-label text-light">Username</label>
            <input v-model="username" type="text" class="form-control" required />
          </div>
  
          <div class="mb-3">
            <label class="form-label text-light">Password</label>
            <input v-model="password" type="password" class="form-control" required />
          </div>
  
          <div class="mb-3">
            <label class="form-label text-light">Confirm Password</label>
            <input v-model="confirmPassword" type="password" class="form-control" required />
          </div>
  
          <button type="submit"
                  class="btn btn-primary w-100"
                  :disabled="loading">
            {{ loading ? 'Creating...' : 'Sign Up' }}
          </button>
  
          <div v-if="error" class="text-danger mt-2">{{ error }}</div>
        </form>
      </div>
    </BaseLayout>
  </template>
  
  <script>
  import { register } from '@/auth';
  import BaseLayout from './BaseLayout.vue';
  
  export default {
    name: 'UserRegister',
    components: { BaseLayout },
    data() {
      return {
        username: '',
        password: '',
        confirmPassword: '',
        loading: false,
        error: ''
      };
    },
    methods: {
      async submit() {
        this.error = '';
        if (this.password !== this.confirmPassword) {
          this.error = 'Passwords do not match';
          return;
        }
        this.loading = true;
        try {
          await register(this.username, this.password);
          // după succes, ducem utilizatorul la login
          this.$router.push('/login');
        } catch (e) {
          this.error = e.response?.data || 'Registration failed';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  form {
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  </style>
  