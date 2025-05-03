<!-- src/components/pages/GameCard.vue -->
<template>
    <div
      class="game-card"
      :class="{ wishlisted: isWishlisted, completed: isCompleted }"
    >
      <!-- game cover -->
      <img :src="game.backgroundImage" alt="Game cover" class="cover" />
  
      <div class="game-info">
        <!-- title -->
        <h3 class="title">{{ game.name }}</h3>
  
        <!-- rating -->
        <p class="rating">⭐ {{ game.rating }}</p>
  
        <!-- icons row -->
        <div class="icon-row">
          <!-- wishlist toggle -->
          <button
            type="button"
            class="btn-icon"
            @click.prevent.stop="$emit('toggle-wishlist', game)"
            :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
            :title="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
          >
            <img
              :src="wishlistIcon"
              :class="{ active: isWishlisted }"
              alt="Wishlist"
            />
          </button>
  
          <!-- completed toggle -->
          <button
            type="button"
            class="btn-icon"
            @click.prevent.stop="$emit('toggle-completed', game)"
            :aria-label="isCompleted ? 'Unmark completed' : 'Add to completed games'"
            :title="isCompleted ? 'Unmark completed' : 'Add to completed games'"
          >
            <img
              :src="completedIcon"
              :class="{ active: isCompleted }"
              alt="Completed"
            />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import wishlistIcon from '@/assets/wishlist.png';
  import completedIcon from '@/assets/completed.png';
  
  export default {
    name: 'GameCard',
    props: {
      game:           { type: Object,  required: true },
      isWishlisted:   { type: Boolean, default: false },
      isCompleted:    { type: Boolean, default: false }
    },
    data() {
      return {
        wishlistIcon,
        completedIcon
      };
    }
  };
  </script>
  
  <style scoped>
  .game-card {
    background-color: #1e1e2f;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: transform 0.3s;
    display: flex;
    flex-direction: column;
  }
  .game-card:hover {
    transform: scale(1.03);
  }
  
  .cover {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  
  .game-info {
    padding: 1rem;
    color: white;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .title {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }
  
  .rating {
    margin: 0 0 0.75rem;
    color: #ffce00;
    font-size: 0.9rem;
  }
  
  .icon-row {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-icon {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  
  .btn-icon img {
    width: 24px;
    height: 24px;
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.2s;
  }
  
  .btn-icon img.active {
    opacity: 1;
    transform: scale(1.2);
  }
  
  .btn-icon:hover img {
    opacity: 1;
  }
  </style>
  