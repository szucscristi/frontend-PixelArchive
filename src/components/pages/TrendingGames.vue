<template>
  <BaseLayout
    v-model:searchTerm="searchTerm"
    @reset-global="goHome"
  >
    <div class="trending-section py-3">
      <!-- Sort dropdown -->
      <div class="d-flex align-items-center mb-5">
        <div class="flex-grow-1"></div>
        <div style="width:20%" class="d-flex justify-content-end">
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

      <!-- Grid de jocuri cu link către detalii -->
      <div class="row g-3">
        <router-link
          v-for="game in games"
          :key="game.id"
          :to="{ name: 'game-details', params: { id: game.id } }"
          class="col-6 col-md-4 col-lg-3 text-decoration-none"
        >
          <GameCard :game="game" />
        </router-link>
      </div>

      <!-- Loading more… -->
      <div v-if="loading" class="text-center text-secondary my-4">
        Loading more…
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import axios from 'axios';
import BaseLayout from './BaseLayout.vue';
import GameCard from './GameCard.vue';

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
  components: { BaseLayout, GameCard },
  data() {
    return {
      games: [], page:1, pageSize:12,
      ordering:'', searchTerm:'',
      loading:false, endReached:false,
      debouncedFetch:null
    };
  },
  mounted() {
    // preluăm inițial search/order din URL
    const p = new URLSearchParams(window.location.search);
    this.searchTerm = p.get('search')   || '';
    this.ordering   = p.get('ordering') || '';

    this.debouncedFetch = debounce(() => this.fetchGames(), 300);
    this.resetAndFetch(false);

    window.addEventListener('popstate', () => {
      const q = new URLSearchParams(window.location.search);
      this.searchTerm = q.get('search')   || '';
      this.ordering   = q.get('ordering') || '';
      this.resetAndFetch(false);
    });
    window.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener('popstate', this.onPopState);
    window.removeEventListener('scroll', this.onScroll);
  },
  watch: {
    // când searchTerm vine din BaseLayout
    searchTerm() {
      this.onInput();
    }
  },
  methods: {
    goHome() {
      // reset local
      this.searchTerm = '';
      this.ordering   = '';
      this.resetAndFetch();
    },
    onInput() {
      this.games = []; this.page = 1; this.endReached = false;
      // actualizăm URL
      const params = new URLSearchParams();
      if (this.searchTerm) params.set('search', this.searchTerm);
      if (this.ordering)   params.set('ordering', this.ordering);
      history.pushState(null,'', params.toString() ? `?${params}` : window.location.pathname);

      this.debouncedFetch();
    },
    resetAndFetch(clear = true) {
      if (clear) { this.games = []; this.page = 1; this.endReached = false; }
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
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        this.fetchGames();
      }
    }
  }
};
</script>

<style scoped>
.trending-section {
  padding-top: 1rem;
  padding-bottom: 2rem;
}
</style>
