<template>
    <div class="container-fluid p-0 bg-dark text-light">
      <!-- Navbar cu logo centrat -->
      <nav class="navbar navbar-dark bg-dark justify-content-center">
        <a href="#" class="navbar-brand" @click.prevent="goHome">
          <img :src="logo" alt="Pixel Archive" class="brand-logo"/>
        </a>
      </nav>
  
      <!-- Conținutul paginii -->
      <div class="trending-section px-4 py-3">
        <!-- Header: Search centrat + sort la dreapta -->
        <div class="d-flex align-items-center mb-5">
          <div class="flex-shrink-1" style="width:15%"></div>
  
          <!-- Search -->
          <div class="flex-grow-1 d-flex justify-content-center">
            <input
              v-model="searchTerm"
              @input="onInput"
              type="text"
              class="form-control form-control-lg bg-secondary text-light border-0"
              placeholder="Search the archive..."
              style="max-width:600px; width:100%;"
            />
          </div>
  
          <!-- Sort -->
          <div class="flex-shrink-1 d-flex justify-content-end" style="width:15%">
            <select
              v-model="ordering"
              @change="onInput"
              class="form-select form-select-sm bg-secondary text-light border-0"
              style="width:120px;"
            >
              <option value="">Default</option>
              <option value="name">Name ↑</option>
              <option value="-name">Name ↓</option>
              <option value="released">Release Date</option>
              <option value="-rating">Rating ↓</option>
              <option value="rating">Rating ↑</option>
            </select>
          </div>
        </div>
  
        <!-- Grid de jocuri -->
        <div class="row g-3">
          <div
            v-for="game in games"
            :key="game.id"
            class="col-6 col-md-4 col-lg-3"
          >
            <GameCard :game="game" />
          </div>
        </div>
  
        <!-- Loading more… -->
        <div v-if="loading" class="text-center text-secondary my-4">
          Loading more…
        </div>
      </div>
  
      <!-- Buton Go Up fixat în colț -->
      <button class="go-up" @click="scrollToTop" aria-label="Go Up">▲</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import GameCard from './GameCard.vue';
  import logo from '@/assets/pixelarchiveLogo.png';
  
  const api = axios.create({ baseURL: 'http://localhost:8081/api' });
  
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  
  export default {
    name: 'TrendingGames',
    components: { GameCard },
    data() {
      return {
        games: [],
        page: 1,
        pageSize: 12,
        ordering: '',
        searchTerm: '',
        loading: false,
        endReached: false,
        debouncedFetch: null,
        logo
      };
    },
    mounted() {
      const params = new URLSearchParams(window.location.search);
      this.searchTerm = params.get('search') || '';
      this.ordering   = params.get('ordering') || '';
  
      this.debouncedFetch = debounce(() => this.fetchGames(), 300);
      this.resetAndFetch(false);
  
      window.addEventListener('popstate', () => {
        const p = new URLSearchParams(window.location.search);
        this.searchTerm = p.get('search') || '';
        this.ordering   = p.get('ordering') || '';
        this.resetAndFetch(false);
      });
  
      window.addEventListener('scroll', this.onScroll);
    },
    beforeUnmount() {
      window.removeEventListener('popstate', this.onPopState);
      window.removeEventListener('scroll', this.onScroll);
    },
    methods: {
      goHome() {
        this.searchTerm = '';
        this.ordering   = '';
        this.updateUrl();
        this.resetAndFetch();
      },
      onInput() {
        this.games = [];
        this.page = 1;
        this.endReached = false;
        this.updateUrl();
        this.debouncedFetch();
      },
      updateUrl() {
        const p = new URLSearchParams();
        if (this.searchTerm) p.set('search', this.searchTerm);
        if (this.ordering)   p.set('ordering', this.ordering);
        const qs = p.toString();
        history.pushState(null, '', qs ? `?${qs}` : window.location.pathname);
      },
      resetAndFetch(clear = true) {
        if (clear) {
          this.games = [];
          this.page = 1;
          this.endReached = false;
        }
        this.fetchGames();
      },
      async fetchGames() {
        if (this.loading || this.endReached) return;
        this.loading = true;
        try {
          const { data } = await api.get('/games/trending', {
            params: {
              size: this.pageSize,
              page: this.page,
              ordering: this.ordering,
              search: this.searchTerm
            }
          });
          const valid = data.filter(g => g.backgroundImage);
          if (valid.length < this.pageSize) this.endReached = true;
          this.games.push(...valid);
          this.page++;
        } catch (e) {
          console.error('Error fetching games:', e);
        } finally {
          this.loading = false;
        }
      },
      onScroll() {
        if (
          window.innerHeight + window.scrollY
          >= document.body.offsetHeight - 300
        ) {
          this.fetchGames();
        }
      },
      scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  </script>
  
  <style scoped>
  .navbar.navbar-dark.bg-dark.justify-content-center {
    justify-content: center !important;
  }
  .brand-logo {
    height: 300px;
    width: auto;
  }
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
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: background-color 0.2s;
  }
  .go-up:hover {
    background-color: #666;
  }
  </style>
  