<template>
  <BaseLayout>
    <div class="trending-section py-3">

      <!-- Search Bar (numai aici) -->
      <div class="search-container px-4 py-2 bg-dark mb-4">
        <input
          v-model="searchTerm"
          @input="onSearchChange"
          type="text"
          class="form-control form-control-lg bg-secondary text-light border-0 mx-auto"
          placeholder="Search the archive…"
          style="max-width:600px;"
        />
      </div>

      <!-- Header: Sort dropdown -->
      <div class="d-flex align-items-center mb-5">
        <div class="flex-grow-1"></div>
        <div class="flex-shrink-1 d-flex justify-content-end" style="width:20%">
          <select
            v-model="ordering"
            @change="onSortChange"
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
        <router-link
          v-for="game in games"
          :key="game.id"
          :to="{ name: 'game-details', params: { id: game.id } }"
          class="col-6 col-md-4 col-lg-3 text-decoration-none"
        >
          <GameCard
            :game="game"
            :is-wishlisted="wishlistIds.includes(game.id)"
            :is-completed="completedIds.includes(game.id)"
            @toggle-wishlist="toggleWishlist"
            @toggle-completed="toggleCompleted"
          />
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
import BaseLayout          from './BaseLayout.vue';
import GameCard             from './GameCard.vue';
import api                  from '@/api';
import { isLoggedIn, getUsername } from '@/auth';

export default {
  name: 'TrendingGames',
  components: { BaseLayout, GameCard },
  data() {
    return {
      games:        [],
      page:         1,
      pageSize:     12,
      ordering:     '',
      searchTerm:   '',
      loading:      false,
      endReached:   false,
      wishlistIds:  [],
      completedIds: []
    };
  },
  methods: {
    async fetchGames() {
      if (this.loading || this.endReached) return;
      this.loading = true;
      try {
        const { data } = await api.get('/games/trending', {
          params: {
            size:     this.pageSize,
            page:     this.page,
            ordering: this.ordering,
            search:   this.searchTerm || null
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

    onSortChange() {
      this.resetList();
    },
    onSearchChange() {
      this.resetList();
    },
    resetList() {
      this.games      = [];
      this.page       = 1;
      this.endReached = false;
      // actualizează URL (optional)
      history.replaceState(null,'',this._buildUrl());
      this.fetchGames();
    },
    _buildUrl() {
      const p = new URLSearchParams();
      if (this.searchTerm) p.set('search', this.searchTerm);
      if (this.ordering)   p.set('ordering', this.ordering);
      return p.toString() ? `?${p.toString()}` : window.location.pathname;
    },

    async fetchUserLists() {
      if (!isLoggedIn()) return;
      const user = getUsername();
      try {
        const [ws, cs] = await Promise.all([
          api.get(`/users/${user}/games`, { params:{ status: 'WISHLIST' } }),
          api.get(`/users/${user}/games`, { params:{ status: 'COMPLETED' } })
        ]);
        this.wishlistIds  = ws.data.map(g=>g.id);
        this.completedIds = cs.data.map(g=>g.id);
      } catch (e) {
        console.error(e);
      }
    },

    async toggleWishlist(game) {
      if (!isLoggedIn()) return;
      const user   = getUsername();
      const inList = this.wishlistIds.includes(game.id);
      try {
        if (inList) {
          await api.delete(`/users/${user}/games/${game.id}`, { params:{ status:'WISHLIST' }});
        } else {
          await api.post(`/users/${user}/games`, { username:user, gameId:game.id, status:'WISHLIST' });
        }
        await this.fetchUserLists();
      } catch(e){ console.error(e); }
    },

    async toggleCompleted(game) {
      if (!isLoggedIn()) return;
      const user   = getUsername();
      const inList = this.completedIds.includes(game.id);
      try {
        if (inList) {
          await api.delete(`/users/${user}/games/${game.id}`, { params:{ status:'COMPLETED' }});
        } else {
          await api.post(`/users/${user}/games`, { username:user, gameId:game.id, status:'COMPLETED' });
        }
        await this.fetchUserLists();
      } catch(e){ console.error(e); }
    },

    onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        this.fetchGames();
      }
    }
  },

  mounted() {
    // init din URL
    const p = new URLSearchParams(window.location.search);
    this.searchTerm = p.get('search')   || '';
    this.ordering   = p.get('ordering') || '';

    this.fetchGames();
    this.fetchUserLists();
    window.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
};
</script>

<style scoped>
.trending-section {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

/* Bara de căutare locală */
.search-container {
  border-bottom: 1px solid #333;
}
</style>
