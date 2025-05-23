<!-- src/components/pages/CreatorDetails.vue -->
<template>
  <BaseLayout>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-light" role="status"></div>
    </div>

    <!-- Not found -->
    <div v-else-if="!creator" class="text-center text-secondary py-5">
      {{ t('creator.notFound') }}
    </div>

    <!-- Detail header -->
    <div v-else class="position-relative mb-5">
      <!-- Banner -->
      <div
        v-if="creator.imageBackground"
        class="detail-banner"
        :style="{ backgroundImage: `url(${creator.imageBackground})` }"
      />
      <!-- Overlay cu avatar și text -->
      <div class="banner-overlay d-flex align-items-end p-4">
        <img
          v-if="creator.image"
          :src="creator.image"
          class="detail-avatar me-3"
          alt=""
        />
        <div>
          <h1 class="mb-1 text-light">{{ creator.name }}</h1>
          <small class="text-light">
            {{ t('creator.gamesCount', { count: creator.gamesCount }) }}
          </small>
        </div>
      </div>
    </div>

    <!-- Description (tradusă dacă e RO) -->
    <div
      v-if="creator && creator.description"
      class="container text-light mb-5"
    >
      <p v-if="translatedDesc !== null" v-html="translatedDesc"></p>
      <p v-else v-html="creator.description"></p>
    </div>

    <!-- Games by this creator -->
    <div v-if="creator" class="container mb-5">
      <h3 class="text-light mb-3">
        {{ t('creator.gamesBy', { name: creator.name }) }}
      </h3>

      <!-- Spinner pentru jocuri -->
      <div v-if="gamesLoading" class="text-center my-4">
        <div class="spinner-border text-light" role="status"></div>
      </div>

      <!-- Grid de jocuri -->
      <div v-else class="row g-3">
        <div
          v-for="game in creatorGames"
          :key="game.id"
          class="col-6 col-md-4 col-lg-3"
        >
          <div class="creator-game-card">
            <img
              :src="game.backgroundImage"
              :alt="t('game.coverAlt')"
              class="cover"
            />
            <div class="game-info">
              <h3 class="title">{{ game.name }}</h3>
            </div>
          </div>
        </div>
        <p
          v-if="!gamesLoading && !creatorGames.length"
          class="text-center text-secondary"
        >
          {{ t('creator.emptyGames') }}
        </p>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from './BaseLayout.vue'
import api from '@/api'
import { useI18n } from 'vue-i18n'
import { translateText } from '@/utils/translate'

export default {
  name: 'CreatorDetails',
  components: { BaseLayout },
  props: { id: [String, Number] },
  setup() {
    const { locale, t } = useI18n({ useScope: 'global' })
    return {
      currentLocale: locale,
      t
    }
  },
  data() {
    return {
      creator: null,
      loading: true,
      creatorGames: [],
      gamesLoading: false,
      translatedDesc: null
    }
  },
  methods: {
    async updateDescription() {
      if (!this.creator) return
      if (this.currentLocale === 'ro') {
        this.translatedDesc = '…translating…'
        this.translatedDesc = await translateText(
          this.creator.description,
          'RO'
        )
      } else {
        this.translatedDesc = null
      }
    }
  },
  watch: {
    currentLocale() {
      this.updateDescription()
    }
  },
  async mounted() {
    // 1) Încarcă detaliile creatorului
    try {
      const { data } = await api.get(`/creators/${this.id}`)
      this.creator = data
    } catch (e) {
      console.error('Failed to load creator details:', e)
    } finally {
      this.loading = false
    }

    // 2) Tradu descrierea dacă e cazul
    await this.updateDescription()

    // 3) Încarcă jocurile creatorului
    if (this.creator) {
      this.gamesLoading = true
      try {
        const res = await api.get(`/creators/${this.id}/games`, {
          params: { page: 1, size: 24 }
        })
        this.creatorGames = res.data
      } catch (e) {
        console.error('Failed to load creator games:', e)
      } finally {
        this.gamesLoading = false
      }
    }
  }
}
</script>

<style scoped>
.detail-banner {
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  filter: brightness(0.5);
}
.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 1.5rem;
}
.detail-avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #222;
  background: #333;
}
.text-secondary {
  color: #bbb !important;
}
.mb-5 {
  margin-bottom: 3rem !important;
}

/* simplified game card inside CreatorDetails */
.creator-game-card {
  background-color: #1e1e2f;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}
.creator-game-card:hover {
  transform: scale(1.03);
}
.creator-game-card .cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.creator-game-card .game-info {
  padding: 0.75rem;
  text-align: center;
}
.creator-game-card .title {
  margin: 0;
  font-size: 1rem;
  color: #fff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>
