<template>
  <BaseLayout>
    <!-- Loading spinner -->
    <div v-if="loading"
         class="d-flex justify-content-center align-items-center"
         style="height: 60vh;">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading…</span>
      </div>
    </div>

    <!-- Game details -->
    <div v-else-if="game" class="text-light">
      <router-link to="/" class="btn btn-outline-light mb-4">
        ← Back to Trending
      </router-link>

      <div class="row gx-4">
        <!-- Main cover column -->
        <div class="col-12 col-md-4 mb-4 mb-md-0">
          <img
            :src="game.background_image"
            alt="Cover"
            class="img-fluid rounded shadow-sm w-100"
            style="max-height:400px; object-fit:cover;"
          />
        </div>

        <!-- Info & platforms column -->
        <div class="col-12 col-md-8">
          <h1 class="mb-3">{{ game.name }}</h1>

          <div class="mb-3">
            <span class="badge bg-primary me-2">Released: {{ game.released }}</span>
            <span class="badge bg-success me-2">
              Rating: {{ game.rating }} / {{ game.rating_top }}
            </span>
            <span class="badge bg-info">Metacritic: {{ game.metacritic }}</span>
          </div>

          <div class="game-description mb-4" v-html="game.description"></div>

          <h5 class="mb-2">Platforms</h5>
          <ul class="list-group list-group-flush mb-4">
            <li
              v-for="plat in game.platforms"
              :key="plat.platform.id"
              class="list-group-item bg-dark text-light border-secondary"
            >
              {{ plat.platform.name }}
              <small class="text-secondary">
                ({{ plat.released_at || 'N/A' }})
              </small>
            </li>
          </ul>

          <!-- Additional image, afișată sub platforms -->
          <div v-if="game.background_image_additional" class="mt-3">
            <h5 class="mb-2">Additional Image</h5>
            <img
              :src="game.background_image_additional"
              alt="Additional cover"
              class="img-fluid rounded shadow-sm w-100"
              style="max-height:400px; object-fit:cover;"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback -->
    <div v-else class="text-center text-light py-5">
      <p>Game not found.</p>
    </div>
  </BaseLayout>
</template>

<script>
import axios      from 'axios';
import BaseLayout from './BaseLayout.vue';

export default {
  name: 'GameDetails',
  props: ['id'],
  components: { BaseLayout },
  data() {
    return {
      game: null,
      loading: true
    };
  },
  async mounted() {
    try {
      const { data } = await axios.get(
        `http://localhost:8081/api/games/${this.id}/detail`
      );
      this.game = data;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.game-description {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 1rem;
  line-height: 1.5;
  text-align: justify;
}
.btn-outline-light {
  border-color: #888;
}
.btn-outline-light:hover {
  background-color: #666;
  color: white;
}
</style>
