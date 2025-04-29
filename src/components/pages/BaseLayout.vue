<template>
  <div class="d-flex flex-column min-vh-100 bg-dark text-light">
    <!-- Navbar centrat -->
    <nav class="navbar navbar-dark bg-dark justify-content-between px-4 py-2">
      <router-link
        to="/"
        class="navbar-brand d-flex align-items-center"
        @click.prevent="goHome"
      >
        <img :src="logo" alt="Pixel Archive" class="brand-logo"/>
        <span class="brand-text ms-2">Pixel Archive</span>
        <img :src="marioLogo" alt="Mario Logo" class="mario-logo ms-2"/>
      </router-link>

      <div>
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
          class="btn btn-outline-light btn-sm"
        >
          Profile
        </router-link>
      </div>
    </nav>

    <!-- Search Bar global, vizibilă pe toate paginile -->
    <div class="search-container px-4 py-2 bg-dark">
      <input
        :value="searchTerm"
        @input="$emit('update:searchTerm', $event.target.value)"
        type="text"
        class="form-control form-control-lg bg-secondary text-light border-0 mx-auto"
        placeholder="Search the archive…"
        style="max-width:600px;"
      />
    </div>

    <!-- Conținutul paginii -->
    <main class="flex-grow-1 px-4">
      <slot />
    </main>

    <!-- Buton Go Up -->
    <GoUpButton @go-up="scrollToTop" />
  </div>
</template>

<script>
import { isLoggedIn } from '@/auth';
import GoUpButton from './GoUpButton.vue';
import logo        from '@/assets/carLogo.png';
import marioLogo   from '@/assets/marioLogo.png';

export default {
  name: 'BaseLayout',
  components: { GoUpButton },
  props: {
    searchTerm: { type: String, default: '' }
  },
  emits: ['update:searchTerm','reset-global'],
  computed: {
    loggedIn() {
      return isLoggedIn();
    }
  },
  methods: {
    goHome() {
      // resetăm searchTerm global și notificăm slot-urile
      this.$emit('update:searchTerm', '');
      this.$emit('reset-global');
      // scroll sus
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  data() {
    return { logo, marioLogo };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.brand-logo { height:40px; width:auto; }
.brand-text {
  font-family:'Press Start 2P', cursive;
  font-size:1.75rem;
  color:#eee;
  user-select:none;
  white-space:nowrap;
}
.mario-logo { height:40px; width:auto; cursor:pointer; }

/* wrapper pentru search */
.search-container {
  border-bottom: 1px solid #333;
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
  transition: background-color 0.2s;
  z-index: 1000;
}
.go-up:hover { background-color: #666; }
</style>
