<!-- src/components/pages/BaseLayout.vue -->
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
          <!-- Games Nav -->
          <router-link
            to="/"
            class="nav-link"
            :class="{ active: isGamesActive }"
          >
            Games
          </router-link>
        </li>
        <li class="nav-item px-2">
          <!-- Creators Nav -->
          <router-link
            to="/creators"
            class="nav-link"
            :class="{ active: isCreatorsActive }"
          >
            Creators
          </router-link>
        </li>
        <li class="nav-item px-2">
          <router-link to="/ai-assistant" class="nav-link" active-class="active">
            AI Assistant
          </router-link>
        </li>
        <li class="nav-item px-2">
          <router-link to="/charts" class="nav-link" active-class="active">
            Statistics
          </router-link>
        </li>
      </ul>

      <!-- Auth / Profile -->
      <div class="d-flex align-items-center ms-auto">
        <router-link
          v-if="!loggedIn"
          to="/register"
          class="btn btn-signup btn-sm me-2"
        >
          Sign Up
        </router-link>
        <router-link
          v-if="!loggedIn"
          to="/login"
          class="btn btn-login btn-sm me-2"
        >
          Login
        </router-link>
        <router-link
          v-else
          to="/profile"
          class="profile-link"
          title="Profile"
          active-class="active"
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
import { isLoggedIn } from '@/auth'
import GoUpButton     from './GoUpButton.vue'

export default {
  name: 'BaseLayout',
  components: { GoUpButton },
  computed: {
    loggedIn() {
      return isLoggedIn()
    },
    // highlight "Games" on list or any game-details page
    isGamesActive() {
      const { path, name } = this.$route
      return path === '/' || name === 'game-details'
    },
    // highlight "Creators" on list or any creator-details page
    isCreatorsActive() {
      const { path, name } = this.$route
      return path.startsWith('/creators') || name === 'creator-details'
    }
  },
  methods: {
    goHome() {
      this.scrollToTop()
    },
    scrollToTop() {
      window.scrollTo({ top:0, behavior:'smooth' })
    }
  }
}
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
  border-radius: 0.5rem;
  transition: color 0.2s, background 0.2s;
}
/* hover and “active” both get gradient + black text */
.nav-pills .nav-link:hover,
.nav-pills .nav-link.active {
  color: #000 !important;
  background: linear-gradient(45deg, #e53935, #ffd700) !important;
}

/* Modern Login/Sign-Up buttons */
.btn-login,
.btn-signup {
  border: none;
  border-radius: 2rem;
  padding: 0.4rem 1rem;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-login {
  background-color: #28a745;
  color: #fff;
}
.btn-login:hover {
  background-color: #218838;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}
.btn-signup {
  background-color: #2196F3;
  color: #fff;
}
.btn-signup:hover {
  background-color: #1976D2;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
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
  transition: transform 0.2s, background 0.2s;
}
.profile-link:hover .profile-icon,
.profile-link.active .profile-icon {
  transform: scale(1.1);
  background: linear-gradient(45deg, #e53935, #ffd700);
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
