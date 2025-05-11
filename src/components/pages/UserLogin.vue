<!-- src/components/pages/LoginPage.vue -->
<template>
  <BaseLayout>
    <div class="d-flex justify-content-center align-items-center" style="height:70vh;">
      <form @submit.prevent="submit"
            class="p-4 rounded shadow form-custom"
            style="min-width:320px;">
        <h3 class="text-light mb-4 text-center">{{ $t('login.title') }}</h3>

        <div class="mb-3">
          <label class="form-label text-light">{{ $t('login.username') }}</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            :placeholder="$t('login.username.placeholder')"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label text-light">{{ $t('login.password') }}</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            :placeholder="$t('login.password.placeholder')"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 mb-2"
          :disabled="loading"
        >
          {{ loading ? $t('login.submit.loading') : $t('login.submit') }}
        </button>

        <p class="mt-2 text-center signup-text">
          <span class="text-light">{{ $t('login.signupPrompt') }}</span>
          <router-link to="/register" class="text-info">
            {{ $t('login.signupLink') }}
          </router-link>
        </p>

        <div v-if="error" class="text-danger mt-2 text-center">
          {{ error }}
        </div>
      </form>
    </div>
  </BaseLayout>
</template>


<script>
import { login } from '@/auth';
import BaseLayout from './BaseLayout.vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'LoginPage',
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
/* Base form styling */
.form-custom {
  background-color: #2a2a2a;    /* darker than bg-secondary */
  border: 1px solid #fff;     /* green accent matching BaseLayout (AICI AM MODIFICAT PENTRU BORDER COLOR)*/
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
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* Override pentru butonul Log in */
.btn-primary {
  background-color: #28a745 !important;
  border-color:   #28a745 !important;
  color: #FFFFFF;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover,
.btn-primary:focus {
  background-color: #218838 !important;
  border-color:   #218838 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* Sign-up prompt under the button */
.signup-text {
  font-size: 0.9rem;
}
.signup-text .text-info {
  font-weight: 600;
  text-decoration: underline;
}
</style>
