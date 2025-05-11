<!-- src/components/pages/GameDetails.vue -->
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

          <!-- Translated description -->
          <div class="game-description mb-4">
            <p v-if="translatedDesc !== null" v-html="translatedDesc"></p>
            <p v-else v-html="game.description"></p>
          </div>

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
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { translateText } from '@/utils/translate'
import api from '@/api'
import BaseLayout from './BaseLayout.vue'
import ReviewList from './ReviewList.vue'

export default {
  name: 'GameDetails',
  components: { BaseLayout, ReviewList },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const { locale } = useI18n({ useScope: 'global' })
    const game = ref(null)
    const translatedDesc = ref(null)
    const loading = ref(true)

    async function fetchGame() {
      try {
        const { data } = await api.get(`/games/${props.id}/detail`)
        game.value = data
      } catch (e) {
        console.error('Failed to load game details:', e)
      } finally {
        loading.value = false
      }
    }

    async function updateDescription() {
      if (!game.value) return
      if (locale.value === 'ro') {
        translatedDesc.value = '…translating…'
        translatedDesc.value = await translateText(game.value.description, 'RO')
      } else {
        translatedDesc.value = null
      }
    }

    onMounted(async () => {
      await fetchGame()
      await updateDescription()
    })

    watch(locale, () => {
      updateDescription()
    })

    return {
      game,
      translatedDesc,
      loading
    }
  }
}
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
