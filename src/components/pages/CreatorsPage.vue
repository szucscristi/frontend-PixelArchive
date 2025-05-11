<!-- src/components/pages/CreatorsPage.vue -->
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
          :placeholder="$t('creators.search.placeholder')"
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
          <div class="creator-card">
            <div
              v-if="creator.imageBackground"
              class="banner"
              :style="{ backgroundImage: `url(${creator.imageBackground})` }"
            ></div>
            <img
              v-if="creator.image"
              :src="creator.image"
              class="avatar rounded-circle"
              alt=""
            />
            <div class="card-footer text-center pt-5">
              <h6 class="mb-1 text-white text-truncate">{{ creator.name }}</h6>
              <small class="text-secondary">
                {{ creator.gamesCount }} {{ $t('creators.games') }}
              </small>
            </div>
          </div>
        </router-link>

        <p v-if="!loading && !creators.length" class="text-center text-secondary mt-4">
          {{ $t('creators.empty') }}
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
import { useI18n } from 'vue-i18n';

export default {
  name: 'CreatorsPage',
  components: { BaseLayout },
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
        this.creators.push(...data.results);
        if (!data.next) this.endReached = true;
        else this.page++;
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
.creators-section {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

/* Search bar modern */
.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
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
.modern-search::placeholder {
  color: rgba(255,255,255,0.6);
}
.modern-search:hover,
.modern-search:focus {
  background: rgba(255,255,255,0.08)!important;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
}

/* Card container */
.creator-card {
  position: relative;
  background-color: #1e1e2f;
  border-radius: 1rem;
  overflow: hidden;
  /* umbra normală */
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform, box-shadow;
}

/* hover: scale + glow dublu (roșu + galben) */
.creator-card:hover {
  transform: scale(1.03);
  box-shadow:
    0 0 8px rgba(229, 57, 53, 0.7),
    0 0 16px rgba(255, 215, 0, 0.7),
    0 4px 12px rgba(0,0,0,0.3);
}

/* Banner + avatar + footer */
.banner {
  width: 100%;
  height: 120px;
  background-size: cover;
  background-position: center;
}
.avatar {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 72px;
  height: 72px;
  border: 3px solid #1e1e2f;
  background: #333;
  object-fit: cover;
}
.card-footer {
  margin-top: auto;
  padding: 1rem 0.75rem 1.5rem;
}
.text-secondary {
  color: #bbb!important;
}

/* Sentinel invizibil pentru infinite scroll */
.sentinel {
  height: 1px;
  visibility: hidden;
}
</style>





