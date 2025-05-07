<template>
    <BaseLayout>
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-light" role="status"></div>
      </div>
  
      <div v-else-if="!creator" class="text-center text-secondary py-5">
        Creator not found.
      </div>
  
      <div v-else class="position-relative mb-5">
        <div
          v-if="creator.imageBackground"
          class="detail-banner"
          :style="{ backgroundImage: `url(${creator.imageBackground})` }"
        />
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
  
      <div v-if="creator && creator.description" class="container text-light">
        <p>{{ creator.description }}</p>
      </div>
    </BaseLayout>
  </template>
  
  <script>
  import BaseLayout from './BaseLayout.vue';
  import api        from '@/api';
  
  export default {
    name: 'CreatorDetails',
    components: { BaseLayout },
    props: { id: [String, Number] },
    data() {
      return {
        creator: null,
        loading: true
      };
    },
    async mounted() {
      try {
        const { data } = await api.get(`/creators/${this.id}`);
        this.creator = data;
      } catch (e) {
        console.error('Failed to load creator details:', e);
      } finally {
        this.loading = false;
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
  }
  </style>
  