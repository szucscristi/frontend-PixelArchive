<template>
    <BaseLayout>
  
      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-light" role="status"></div>
      </div>
  
      <!-- Not found -->
      <div v-else-if="!creator" class="text-center text-secondary py-5">
        Creator not found.
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
            alt="avatar"
          />
          <div>
            <h1 class="mb-1 text-light">{{ creator.name }}</h1>
            <small class="text-light">{{ creator.gamesCount }} games</small>
          </div>
        </div>
      </div>
  
      <!-- Description -->
      <div v-if="creator && creator.description" class="container text-light mb-5">
        <p>{{ creator.description }}</p>
      </div>
  
      <!-- Games by this creator -->
      <div v-if="creator" class="container mb-5">
        <h3 class="text-light mb-3">Games by {{ creator.name }}</h3>
  
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
            <GameCard :game="game" />
          </div>
          <p
            v-if="!gamesLoading && !creatorGames.length"
            class="text-center text-secondary"
          >
            No games found for this creator.
          </p>
        </div>
      </div>
  
    </BaseLayout>
  </template>
  
  <script>
  import BaseLayout from './BaseLayout.vue';
  import GameCard    from './GameCard.vue';
  import api         from '@/api';
  
  export default {
    name: 'CreatorDetails',
    components: { BaseLayout, GameCard },
    props: { id: [String, Number] },
    data() {
      return {
        creator:      null,
        loading:      true,
        creatorGames: [],
        gamesLoading: false
      };
    },
    async mounted() {
      // 1) Încarcă detaliile creatorului
      try {
        const { data } = await api.get(`/creators/${this.id}`);
        this.creator = data;
      } catch (e) {
        console.error('Failed to load creator details:', e);
      } finally {
        this.loading = false;
      }
  
      // 2) Dacă avem creator, încarcă și jocurile lui
      if (this.creator) {
        this.gamesLoading = true;
        try {
          const res = await api.get(`/creators/${this.id}/games`, {
            params: { page: 1, size: 24 }
          });
          this.creatorGames = res.data;
        } catch (e) {
          console.error('Failed to load creator games:', e);
        } finally {
          this.gamesLoading = false;
        }
      }
    }
  };
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
  .mb-5 { margin-bottom: 3rem !important; }
  </style>
  