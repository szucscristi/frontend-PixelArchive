<template>
    <div class="game-card">
        <img :src="game.backgroundImage" alt="Game cover" />
        <div class="game-info">
            <h3>{{ game.name }}</h3>
            <p class="rating">⭐ {{ game.rating }}</p>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'GameCard',
        props: {
            game: Object
        }
    }

</script>

<style scoped>
.game-card {
    background-color: #1e1e2f;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: transform 0.3s;
}
.game-card:hover {
    transform: scale(1.03);
}
.game-card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
}
.game-info {
    padding: 1rem;
    color: white;
}
.rating {
    font-size: 0.9rem;
    color: #ffce00;
}
</style>