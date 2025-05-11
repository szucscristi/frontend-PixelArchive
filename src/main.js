// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'

import { createRouter, createWebHistory } from 'vue-router'
import TrendingGames   from './components/pages/TrendingGames.vue'
import GameDetails     from './components/pages/GameDetails.vue'
import UserLogin       from './components/pages/UserLogin.vue'
import UserProfile     from './components/pages/UserProfile.vue'
import UserRegister    from './components/pages/UserRegister.vue'
import CreatorsPage    from './components/pages/CreatorsPage.vue'
import CreatorDetails  from './components/pages/CreatorDetails.vue'
import AiAssistant     from './components/pages/AiAssistant.vue'
import GamesChart      from './components/pages/GamesChart.vue'

import i18n from './i18n'    // ← importul instanței de i18n

// configurează baza pentru toate cererile HTTP
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

// configurarea router-ului
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',                     component: TrendingGames },
    { path: '/games/:id', name: 'game-details', component: GameDetails,     props: true },
    { path: '/login',                component: UserLogin },
    { path: '/register',             component: UserRegister },
    { path: '/profile',              component: UserProfile },
    { path: '/creators',             component: CreatorsPage },
    { path: '/creators/:id', name: 'creator-details', component: CreatorDetails, props: true },
    { path: '/ai-assistant',         component: AiAssistant },
    { path: '/charts',      name: 'games-chart', component: GamesChart },
  ]
})

// creează aplicația și montează plugin-urile
const app = createApp(App)
app
  .use(router)
  .use(i18n)        // ← montează vue-i18n
  .mount('#app')
