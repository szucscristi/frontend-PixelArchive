<template>
  <div class="reviews-section mt-5">
    <h4 class="text-light mb-4">{{ $t('reviews.title') }}</h4>
    <div v-if="!reviews.length" class="text-secondary">
      {{ $t('reviews.empty') }}
    </div>

    <div v-for="rev in reviews" :key="rev.id" class="card review-card mb-4">
      <div class="card-header d-flex align-items-center p-3">
        <div class="avatar flex-shrink-0 me-3">
          <i class="bi bi-person-circle"></i>
        </div>
        <div>
          <div class="fw-semibold text-white">{{ rev.displayName }}</div>
          <small class="text-secondary">
            {{ $t('profile.review.on') }} {{ new Date(rev.createdAt).toLocaleString() }}
          </small>
        </div>
        <div class="ms-auto">
          <button
            v-if="rev.username === currentUser"
            class="btn btn-sm btn-outline-light me-1"
            @click="startEdit(rev)"
            :title="$t('reviews.edit')"
          >
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button
            v-if="isAdmin"
            class="btn btn-sm btn-outline-danger"
            @click="onDelete(rev.id)"
            :title="$t('reviews.delete')"
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>

      <div class="card-body p-3">
        <div v-if="editingId === rev.id">
          <ReviewForm
            :review="rev"
            @updated="onUpdate"
            @cancel="editingId = null"
          />
        </div>
        <div v-else class="text-white">
          <p class="mb-0">{{ rev.content }}</p>
        </div>
      </div>
    </div>

    <div v-if="isLoggedIn" class="mt-4">
      <ReviewForm :gameId="gameId" @posted="onPost" />
    </div>
    <p v-else class="text-secondary">
      {{ $t('reviews.loginPrompt') }}
    </p>
  </div>
</template>


<script>
import api from '@/api';
import ReviewForm from './ReviewForm.vue';
import { isLoggedIn, getUsername, isAdmin } from '@/auth';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ReviewList',
  components: { ReviewForm },
  props: { gameId: { type: Number, required: true } },
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
      reviews: [],
      editingId: null
    };
  },
  computed: {
    isLoggedIn() { return isLoggedIn(); },
    currentUser() { return getUsername(); },
    isAdmin()    { return isAdmin(); }
  },
  methods: {
    async fetch() {
      try {
        const res = await api.getReviews(this.gameId);
        this.reviews = res.data;
      } catch (e) {
        console.error('Failed to load reviews:', e);
      }
    },
    startEdit(rev) {
      this.editingId = rev.id;
    },
    async onPost(newReview) {
      this.reviews.unshift(newReview);
    },
    async onUpdate(updated) {
      const i = this.reviews.findIndex(r => r.id === updated.id);
      if (i !== -1) this.reviews.splice(i, 1, updated);
      this.editingId = null;
    },
    async onDelete(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await api.deleteReview(id);
        this.reviews = this.reviews.filter(r => r.id !== id);
      } catch (e) {
        console.error('Failed to delete review:', e);
      }
    }
  },
  mounted() {
    this.fetch();
  }
};
</script>

<style scoped>
.review-card {
  border: none;
  border-radius: 0.75rem;
  background-color: #242526;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  overflow: hidden;
}
.card-header {
  background: transparent;
  border-bottom: none;
}
.avatar {
  width: 40px;
  height: 40px;
  font-size: 1.75rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-outline-light { border-color: rgba(255,255,255,0.5); }
.btn-outline-light:hover { background: rgba(255,255,255,0.1); }
.btn-outline-danger { border-color: #dc3545; }
.btn-outline-danger:hover { background: rgba(220,53,69,0.1); }
</style>
