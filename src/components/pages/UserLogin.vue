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
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Logging in…' : 'Log in' }}
        </button>
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
      loading: false,
      error: ''
    };
  },
  methods: {
    async submit() {
      this.error = '';
      this.loading = true;
      try {
        await login(this.username, this.password);
        this.$router.push('/');
      } catch (e) {
        const respData = e.response?.data;
        // if backend sent a plain string, show it; otherwise try common fields
        if (typeof respData === 'string') {
          this.error = respData;
        } else {
          this.error = respData?.error || respData?.message || 'Login failed';
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
form { box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
</style>
