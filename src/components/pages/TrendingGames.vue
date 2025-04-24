<template>
    <layout-container>
        <div class="trending-section">
            <div class="header">
                <h2>🔥 Trending Now</h2>
                <div class="sort-dropdown">
                    <select v-model="ordering" @change="resetGames">
                    <option value="">Order by:</option>
                    <option value="-relevance">Relevance</option>
                    <option value="-added">Date added</option>
                    <option value="name">Name</option>
                    <option value="released">Release date</option>
                    <option value="-rating">Average rating</option>
                    </select>
                </div>
            </div>
        <div class="games-grid">
            <GameCard
            v-for="game in games"
            :key="game.id"
            :game="game"
            />
        </div>
        <div v-if="loading" class="loading">Loading more...</div>sd
        </div>
    </layout-container>
</template>

<script>
    import axios from 'axios';
    import LayoutContainer from '../LayoutContainer.vue';
    import GameCard from './GameCard.vue';

    const api = axios.create({
        baseURL: 'http://localhost:8081/api',
    });

    export default {
        name: 'TrendingGames',
        components: {
            LayoutContainer,
            GameCard
        },
        data() {
            return {
                games: [],
                page: 1,
                pageSize: 12,
                ordering: '',
                loading: false,
                endReached: false
            };
        },
        mounted() {
            this.fetchGames();
            window.addEventListener('scroll', this.handleScroll);
        },
        beforeUnmount() {
            window.removeEventListener('scroll', this.handleScroll);
        },
        
        methods: {

            async fetchGames() {
                if (this.loading || this.endReached) return;
                this.loading = true;
                try {
                    const res = await api.get('/games/trending', {
                        params: {
                            size: this.pageSize,
                            page: this.page,
                            ordering: this.ordering
                        }
                    });

                    const filteredGames = res.data.filter(game => game.backgroundImage && game.backgroundImage.trim() !== '');

                    if (res.data.length < this.pageSize) {
                        this.endReached = true;
                    }

                    this.games.push(...filteredGames);
                    this.page++;
                } catch (e) {
                    console.error('Error fetching games:', e);
                } finally {
                    this.loading = false;
                }
            },




            handleScroll() {
                const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
                if (scrollBottom) {
                    this.fetchGames();
                }
            },
            resetGames() {
                this.games = [];
                this.page = 1;
                this.endReached = false;
                this.fetchGames();
            }
            
        }
    }
</script>

<style scoped>
.trending-section {
    padding: 2rem;
    color: white;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.sort-dropdown select {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #1e1e2f;
    color: white;
    border: 1px solid #444;
}
.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}
.loading {
    text-align: center;
    margin: 2rem 0;
    color: #bbb;
}
</style>  