<!-- src/components/ReviewForm.vue -->
<template>
    <div class="mb-3">
      <textarea
        v-model="text"
        rows="3"
        class="form-control"
        :placeholder="editing ? '' : 'Write a review...'"
      ></textarea>
      <div class="mt-2 d-flex gap-2">
        <button class="btn btn-sm btn-primary" @click="submit">
          {{ editing ? 'Save' : 'Post Review' }}
        </button>
        <button
          v-if="editing"
          class="btn btn-sm btn-secondary"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </template>
  
  <script>

  import api from '@/api';
  
  export default {
    props: {
      gameId:    { type: Number, default: null },
      review:    { type: Object, default: null }
    },
    data() {
      return { text: this.review?.content || '' };
    },
    computed: {
      editing() { return !!this.review; }
    },
    methods: {
      async submit() {
        if (!this.text.trim()) return;
        try {
          if (this.editing) {
            const res = await api.updateReview(this.review.id, this.text);
            this.$emit('updated', res.data);
          } else {
            const res = await api.postReview(this.gameId, this.text);
            this.$emit('posted', res.data);
            this.text = '';
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };
  </script>
  