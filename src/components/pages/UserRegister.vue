<!-- src/components/pages/UserRegister.vue -->
<template>
  <BaseLayout>
    <div class="d-flex justify-content-center align-items-center" style="height:70vh;">
      <form @submit.prevent="submit"
            class="p-4 rounded shadow form-custom"
            style="min-width:320px;">
        <h3 class="text-light mb-4 text-center">{{ $t('register.title') }}</h3>

        <!-- Display Name first -->
        <div class="mb-3">
          <label class="form-label text-light">{{ $t('register.displayName') }}</label>
          <input
            v-model="displayName"
            type="text"
            class="form-control"
            :placeholder="$t('register.displayName.placeholder')"
            required
          />
          <div class="form-text">{{ $t('register.displayName.help') }}</div>
        </div>

        <!-- Username second -->
        <div class="mb-3">
          <label class="form-label text-light">{{ $t('register.username') }}</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            :placeholder="$t('register.username.placeholder')"
            required
          />
          <div class="form-text">{{ $t('register.username.help') }}</div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label text-light">{{ $t('register.password') }}</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            :placeholder="$t('register.password.placeholder')"
            required
          />
          <div class="form-text">{{ $t('register.password.help') }}</div>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
          <label class="form-label text-light">{{ $t('register.confirmPassword') }}</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            :placeholder="$t('register.confirmPassword.placeholder')"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 mb-2"
          :disabled="loading"
        >
          {{ loading ? $t('register.submit.loading') : $t('register.submit') }}
        </button>

        <div v-if="error" class="text-danger mt-2 text-center">
          {{ error }}
        </div>
      </form>
    </div>
  </BaseLayout>
</template>


<script>
import BaseLayout from './BaseLayout.vue';
import { register } from '@/api';
import { useI18n } from 'vue-i18n';


export default {
  name: 'UserRegister',
  components: { BaseLayout },
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const setLocale = (lang) => {
      locale.value = lang
    }
    return {
      currentLocale: locale,
      setLocale
    }
  },
  data() {
    return {
      username: '',
      displayName: '',
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
        await register(this.username, this.password, this.displayName);
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
/* Base form styling */
.form-custom {
  background-color: #2a2a2a;    /* darker than bg-secondary */
  border: 1px solid #fff;     /* blue accent (AICI AM MODIFICAT) */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Inputs */
.form-control {
  background-color: #343A40;
  color: #fff;
  border: 1px solid #555;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-control::placeholder {
  color: #bbb;
}
.form-control:focus {
  background-color: #343A40;
  color: #fff;
  border-color: #2196F3;
  box-shadow: 0 0 0 0.2rem rgba(33, 150, 243, 0.25);
}

/* Helper text */
.form-text {
  font-size: 0.875rem;
  color: #ccc;
}

/* Override pentru butonul Sign Up */
.btn-primary {
  background-color: #2196F3 !important;
  border-color:   #2196F3 !important;
  color: #FFFFFF;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover,
.btn-primary:focus {
  background-color: #1976D2 !important;
  border-color:   #1976D2 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
</style>
