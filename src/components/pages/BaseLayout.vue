<template>
  <div class="d-flex flex-column min-vh-100 bg-dark text-light">
    <nav class="navbar navbar-dark bg-dark px-4 py-2 position-relative d-flex align-items-center">
      <!-- Brand -->
      <router-link
        to="/"
        class="navbar-brand d-flex align-items-center"
        @click.prevent="goHome"
      >
        <span class="brand-text">Pixel Archive</span>
      </router-link>

      <!-- Navigație centrată -->
      <ul class="nav nav-pills nav-menu">
        <li class="nav-item px-2">
          <router-link to="/" class="nav-link" active-class="active" exact>Games</router-link>
        </li>
        <li class="nav-item px-2">
          <router-link to="/creators" class="nav-link" active-class="active">Creators</router-link>
        </li>
        <li class="nav-item px-2">
          <router-link to="/developers" class="nav-link" active-class="active">Developers</router-link>
        </li>
        <li class="nav-item px-2">
          <router-link to="/stores" class="nav-link" active-class="active">Stores</router-link>
        </li>
      </ul>

      <!-- Butoane auth -->
      <div class="d-flex align-items-center ms-auto">
        <router-link
          v-if="!loggedIn"
          to="/register"
          class="btn btn-outline-light btn-sm me-2"
        >Sign Up</router-link>
        <router-link
          v-if="!loggedIn"
          to="/login"
          class="btn btn-outline-light btn-sm me-2"
        >Login</router-link>
        <router-link
          v-else
          to="/profile"
          class="btn btn-outline-light btn-sm"
        >Profile</router-link>
      </div>
    </nav>

    <main class="flex-grow-1 px-4">
      <slot/>
    </main>

    <GoUpButton @go-up="scrollToTop"/>
  </div>
</template>

<script>
import { isLoggedIn } from '@/auth';
import GoUpButton     from './GoUpButton.vue';

export default {
  name: 'BaseLayout',
  components: { GoUpButton },
  computed: {
    loggedIn() { return isLoggedIn(); }
  },
  methods: {
    goHome() {
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo({ top:0, behavior:'smooth' });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* Brand cu gradient roșu→auriu */
.brand-text {
  font-family: 'Press Start 2P', cursive;
  font-size: 1.75rem;
  background: linear-gradient(45deg,#e53935,#ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  user-select: none;
  white-space: nowrap;
}

/* Meniul centrat absolut */
.nav-menu {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
}

/* Stil nav-pills */
.nav-pills .nav-link {
  color: #bbb;
  font-weight: 500;
  transition: color .2s;
}
.nav-pills .nav-link:hover {
  color: #fff;
}
.nav-pills .nav-link.active {
  color: #fff;
  position: relative;
}
.nav-pills .nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ffd700;
  border-radius: 2px;
}

/* Go Up button */
.go-up {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  transition: background-color .2s;
  z-index: 1000;
}
.go-up:hover { background-color: #666; }
</style>
