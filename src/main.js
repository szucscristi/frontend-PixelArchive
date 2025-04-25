import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import {createRouter, createWebHistory} from 'vue-router';

/*
import CreateItem from './components/pages/CreateItem.vue';
import UpdateItem from './components/pages/UpdateItem.vue';
import ItemDetail from './components/pages/ItemDetail.vue';
import ItemsOverview from './components/pages/ItemsOverview.vue';
*/
import TrendingGames from './components/pages/TrendingGames.vue';
import GameDetails from './components/pages/GameDetails.vue';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

const router = createRouter({
    history: createWebHistory(),
    routes: [
        /*
        { path: '/', component: ItemsOverview},
        { path: '/create', component: CreateItem},
        { path: '/edit/:id', component: UpdateItem},
        { path: '/detail/:id', component: ItemDetail}
         */
        { path: '/', component: TrendingGames},
        { path: '/games/:id', name: 'game-details', component: GameDetails, props: true }
    ]
});

createApp(App).use(router).mount('#app')
