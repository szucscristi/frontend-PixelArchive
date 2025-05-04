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

      <!-- Centered nav -->
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

      <!-- Auth / Profile -->
      <div class="d-flex align-items-center ms-auto">
        <router-link
          v-if="!loggedIn"
          to="/register"
          class="btn btn-outline-light btn-sm me-2"
        >
          Sign Up
        </router-link>
        <router-link
          v-if="!loggedIn"
          to="/login"
          class="btn btn-outline-light btn-sm me-2"
        >
          Login
        </router-link>
        <router-link
          v-else
          to="/profile"
          class="profile-link"
          title="Profile"
        >
          <i class="bi bi-person-circle profile-icon"></i>
        </router-link>
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
/* Bootstrap Icons */
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');

/* Pixelated gradient brand */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
.brand-text {
  font-family: 'Press Start 2P', cursive;
  font-size: 1.75rem;
  background: linear-gradient(45deg, #e53935, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  user-select: none;
  white-space: nowrap;
}

/* Centered nav menu */
.nav-menu {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
}

/* Nav-pills styling */
.nav-pills .nav-link {
  color: #bbb;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: 
    color 0.2s ease, 
    background 0.2s ease;
}
/* Hover cu gradient rosu → galben */
.nav-pills .nav-link:hover {
  color: #fff;
  background: linear-gradient(
    45deg,
    #e53935 0%,
    #ffd700 100%
  ) !important;
}
/* Tab activ: acelasi gradient, fără underline */
.nav-pills .nav-link.active {
  color: #fff;
  background: linear-gradient(
    45deg,
    #e53935 0%,
    #ffd700 100%
  ) !important;
}

/* Profile icon link */
.profile-link {
  padding: 0;
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
}
.profile-icon {
  font-size: 2.5rem;
  color: #fff;
  transition: transform 0.2s ease, background 0.2s ease, -webkit-background-clip 0s;
}
/* Gradient hover pe iconiță */
.profile-link:hover .profile-icon {
  /* transform puțin pentru feedback */
  transform: scale(1.1);
  /* gradient text */
  background: linear-gradient(
    45deg,
    #e53935 0%,
    #ffd700 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
.go-up:hover {
  background-color: #666;
}
</style>
