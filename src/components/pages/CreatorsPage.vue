<template>
  <BaseLayout>
    <div class="creators-section py-3">

      <!-- Search Bar live -->
      <div class="search-container px-4 py-2 mb-4">
        <input
          v-model="searchTerm"
          @input="onSearchChange"
          type="text"
          class="form-control form-control-lg modern-search mx-auto"
          placeholder="Search creators..."
          style="max-width: 400px;"
        />
      </div>

      <!-- Grid de creatori -->
      <div class="row g-3 px-4">
        <router-link
          v-for="creator in creators"
          :key="creator.id"
          :to="{ name: 'creator-details', params: { id: creator.id } }"
          class="col-6 col-md-4 col-lg-3 text-decoration-none"
        >
          <div class="card h-100 bg-dark text-light shadow-sm">
            <div
              v-if="creator.imageBackground"
              class="card-header p-0"
              :style="{
                backgroundImage: `url(${creator.imageBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '120px'
              }"
            />
            <div class="card-body d-flex flex-column align-items-center text-center">
              <img
                v-if="creator.image"
                :src="creator.image"
                class="rounded-circle mb-2"
                style="width: 72px; height: 72px; object-fit: cover; border: 2px solid #333;"
                alt="avatar"
              />
              <h6 class="text-truncate w-100">{{ creator.name }}</h6>
              <p class="text-secondary mb-0">{{ creator.gamesCount }} games</p>
            </div>
          </div>
        </router-link>

        <p v-if="!loading && !creators.length" class="text-center text-secondary mt-4">
          No creators found.
        </p>
      </div>

      <!-- Spinner la încărcare -->
      <div v-if="loading" class="text-center text-secondary my-4">
        <div class="spinner-border" role="status"></div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from './BaseLayout.vue';
import api        from '@/api';

export default {
  name: 'CreatorsPage',
  components: { BaseLayout },
  data() {
    return {
      creators:   [],
      page:       1,
      pageSize:   14,
      searchTerm: '',
      loading:    false,
      endReached: false
    };
  },
  methods: {
    async fetchCreators() {
      if (this.loading || this.endReached) return;
      this.loading = true;
      try {
        const { data } = await api.get('/creators', {
          params: {
            page:    this.page,
            size:    this.pageSize,
            search:  this.searchTerm || null
          }
        });
        // data is PagedResult<CreatorDTO>
        this.creators.push(...data.results);
        if (!data.next) {
          this.endReached = true;
        } else {
          this.page++;
        }
      } catch (e) {
        console.error('Failed to load creators:', e);
      } finally {
        this.loading = false;
      }
    },
    onSearchChange() {
      this.creators   = [];
      this.page       = 1;
      this.endReached = false;
      this.fetchCreators();
    },
    onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        this.fetchCreators();
      }
    }
  },
  mounted() {
    this.fetchCreators();
    window.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
};
</script>

<style scoped>
.modern-search {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.04)!important;
  backdrop-filter: blur(8px);
  border: 2px solid transparent;
  border-radius: .5rem;
  color: #fff!important;
  transition: background .2s, box-shadow .2s;
}
.modern-search::placeholder { color: rgba(255,255,255,0.6); }
.modern-search:hover,
.modern-search:focus {
  background: rgba(255,255,255,0.08)!important;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
}
</style>
