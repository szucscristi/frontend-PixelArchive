<template>
  <BaseLayout>
    <div class="py-5">
      <!-- Header + Search -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-light">Creators</h2>
        <div class="input-wrapper">
          <i class="bi bi-search text-light me-2"></i>
          <input
            v-model="searchTerm"
            @input="fetchCreators"
            type="text"
            class="form-control search-input"
            placeholder="Search creators..."
          />
        </div>
      </div>

      <!-- Grid -->
      <div class="row g-3">
        <div
          v-for="creator in creators"
          :key="creator.id"
          class="col-6 col-md-4 col-lg-3"
        >
          <router-link
            :to="{ name: 'creator-details', params: { id: creator.id } }"
            class="text-decoration-none"
          >
            <div class="creator-card">
              <div
                v-if="creator.imageBackground"
                class="banner"
                :style="{ backgroundImage: `url(${creator.imageBackground})` }"
              />
              <img
                v-if="creator.image"
                :src="creator.image"
                class="avatar"
                alt="avatar"
              />
              <div class="card-footer">
                <h5 class="mb-1 text-truncate">{{ creator.name }}</h5>
                <small class="text-secondary">{{ creator.gamesCount }} games</small>
              </div>
            </div>
          </router-link>
        </div>

        <p v-if="!loading && !creators.length" class="text-center text-secondary">
          No creators found.
        </p>
      </div>

      <!-- Spinner -->
      <div v-if="loading" class="text-center my-4">
        <div class="spinner-border text-light" role="status"></div>
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
      searchTerm: '',
      loading:    false
    };
  },
  methods: {
    async fetchCreators() {
      this.loading = true;
      try {
        const { data } = await api.get('/creators', {
          params: { search: this.searchTerm || null }
        });
        this.creators = data;
      } catch (e) {
        console.error('Failed to load creators:', e);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchCreators();
  }
};
</script>

<style scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border-radius: 999px;
  padding: 0.25rem 1rem;
  width: 300px;
}
.search-input {
  flex: 1;
  border: none;
  background: transparent !important;
  color: white;
}
.search-input::placeholder {
  color: rgba(255,255,255,0.6);
}
.creator-card {
  position: relative;
  background: #222;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 260px;
}
.banner {
  height: 120px;
  background-size: cover;
  background-position: center;
  filter: brightness(0.6);
}
.avatar {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 72px;
  height: 72px;
  border: 3px solid #222;
  border-radius: 50%;
  object-fit: cover;
  background: #333;
}
.card-footer {
  margin-top: auto;
  padding: 1rem 0.75rem;
  text-align: center;
}
.card-footer h5 {
  margin-bottom: 0.25rem;
}
</style>
