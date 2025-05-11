<template>
  <BaseLayout>
    <!-- Loading spinner -->
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
      style="height: 60vh;"
    >
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading…</span>
      </div>
    </div>

    <!-- Game details -->
    <div v-else-if="game" class="text-light mt-5">
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
            <span class="badge bg-primary me-2">
              {{ $t('game.released', { date: game.released }) }}
            </span>
            <span class="badge bg-success me-2">
              {{ $t('game.rating', { rating: game.rating, top: game.rating_top }) }}
            </span>
            <span class="badge bg-info">
              {{ $t('game.metacritic', { score: game.metacritic }) }}
            </span>
          </div>

          <div class="game-description mb-4" v-html="game.description"></div>

          <h5 class="mb-2">{{ $t('game.platforms') }}</h5>
          <ul class="list-group list-group-flush mb-4">
            <li
              v-for="plat in game.platforms"
              :key="plat.platform.id"
              class="list-group-item bg-dark text-light border-secondary"
            >
              {{ plat.platform.name }}
              <small class="text-secondary">
                ({{ plat.released_at || $t('game.platforms.na') }})
              </small>
            </li>
          </ul>

          <!-- Additional image -->
          <div v-if="game.background_image_additional" class="mt-3">
            <h5 class="mb-2">{{ $t('game.additionalImage') }}</h5>
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
      <p>{{ $t('game.notFound') }}</p>
    </div>

    <!-- Reviews section -->
    <ReviewList :gameId="Number(id)" />
  </BaseLayout>
</template>


<script>
import BaseLayout from './BaseLayout.vue';
import ReviewList from './ReviewList.vue';
import api from '@/api';
import { useI18n } from 'vue-i18n';

export default {
  name: 'GameDetails',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  components: { BaseLayout, ReviewList },
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const setLocale = (lang) => {
      locale.value = lang
    }
    return {
      currentLocale: locale,
      setLocale
    }
  },
  data() {
    return {
      game:    null,
      loading: true
    };
  },
  async mounted() {
    try {
      // folosim api (are prefixul /api)
      const { data } = await api.get(`/games/${this.id}/detail`);
      this.game = data;
    } catch (e) {
      console.error('Failed to load game details:', e);
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
