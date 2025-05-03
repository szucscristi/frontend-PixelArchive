<!-- src/components/pages/UserProfile.vue -->
<template>
  <BaseLayout>
    <div class="container py-5 text-light">
       <!-- Header -->
       <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {{ username }}!</h2>
        <button class="btn btn-outline-light" @click="doLogout">
          Logout
        </button>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentTab === 'wishlist' }"
            @click="currentTab = 'wishlist'"
          >
            Wishlist ({{ wishlistGames.length }})
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentTab === 'completed' }"
            @click="currentTab = 'completed'"
          >
            Completed ({{ completedGames.length }})
          </button>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="mt-4">
        <!-- Wishlist -->
        <div v-if="currentTab === 'wishlist'">
          <div v-if="wishlistGames.length" class="row g-3">
            <div
              v-for="game in wishlistGames"
              :key="game.id"
              class="col-6 col-md-4 col-lg-3"
            >
              <GameCard :game="game" />
              <button
                class="btn btn-sm btn-danger mt-2 w-100"
                @click="removeFromWishlist(game.id)"
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
          <p v-else class="text-center text-secondary">Your wishlist is empty.</p>
        </div>

        <!-- Completed -->
        <div v-else>
          <div v-if="completedGames.length" class="row g-3">
            <div
              v-for="game in completedGames"
              :key="game.id"
              class="col-6 col-md-4 col-lg-3"
            >
              <GameCard :game="game" />
              <button
                class="btn btn-sm btn-warning mt-2 w-100"
                @click="removeFromCompleted(game.id)"
              >
                Remove from Completed
              </button>
            </div>
          </div>
          <p v-else class="text-center text-secondary">No completed games yet.</p>
        </div>
      </div>
      <!-- Alert notificare -->
      <div
        v-if="alertMessage"
        :class="[
          'alert',
          alertType === 'success' ? 'alert-success' : 'alert-danger',
          'alert-dismissible','fade','show'
        ]"
        role="alert"
      >
        {{ alertMessage }}
        <button type="button" class="btn-close" @click="alertMessage = ''"></button>
      </div>

      <h2>Welcome, {{ username }}!</h2>
      <p>You are logged in.</p>
      <button class="btn btn-outline-light mb-4" @click="doLogout">
        Logout
      </button>

      <!-- Admin Panel -->
      <div v-if="isAdmin" class="admin-panel mt-5">
        <h3>Admin Panel</h3>
        <hr />

        <!-- Form creare joc -->
        <form @submit.prevent="createGame" class="row g-3 align-items-end">
          <div class="col-md-2">
            <label class="form-label">ID</label>
            <input v-model.number="newGame.id" type="number" class="form-control" required />
          </div>
          <div class="col-md-3">
            <label class="form-label">Name</label>
            <input v-model="newGame.name" type="text" class="form-control" required />
          </div>
          <div class="col-md-3">
            <label class="form-label">Image URL</label>
            <input v-model="newGame.backgroundImage" type="url" class="form-control" required />
          </div>
          <div class="col-md-2">
            <label class="form-label">Rating</label>
            <input v-model.number="newGame.rating" type="number" step="0.1" class="form-control" required />
          </div>
          <div class="col-md-2">
            <label class="form-label">Released</label>
            <input v-model="newGame.released" type="date" class="form-control" required />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-success">Create Game</button>
          </div>
        </form>

        <!-- Căutare jocuri -->
        <div class="mt-4 mb-2">
          <input
            v-model="adminSearch"
            @input="fetchAdminGames"
            type="text"
            class="form-control bg-dark text-light border-secondary"
            placeholder="Search games..."
          />
        </div>

        <!-- Tabel jocuri -->
        <div class="mt-2">
          <h4>Existing Games</h4>
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Rating</th>
                <th>Released</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in adminGames" :key="game.id">
                <td>{{ game.id }}</td>
                <td>
                  <input
                    v-model="game.name"
                    class="form-control bg-dark text-light border-secondary"
                  />
                </td>
                <td>
                  <input
                    v-model.number="game.rating"
                    type="number"
                    step="0.1"
                    class="form-control bg-dark text-light border-secondary"
                  />
                </td>
                <td>
                  <input
                    v-model="game.released"
                    type="date"
                    class="form-control bg-dark text-light border-secondary"
                  />
                </td>
                <td class="d-flex flex-wrap gap-1">
                  <button class="btn btn-sm btn-primary" @click="promptUpdate(game)">
                    Update
                  </button>
                  <button class="btn btn-sm btn-danger" @click="promptDelete(game)">
                    Delete
                  </button>
                  <button class="btn btn-sm btn-info" @click="openDetailModal(game)">
                    Details
                  </button>
                </td>
              </tr>
              <tr v-if="adminGames.length === 0">
                <td colspan="5" class="text-center text-secondary">No games found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="alert alert-info mt-4">
        You are a regular user. Admin panel is hidden.
      </div>
    </div>

    <!-- Modal confirmare Update/Delete -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display:block; background:rgba(0,0,0,0.5)"
      v-if="showConfirm"
      @click.self="showConfirm=false"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">Confirm {{ confirmAction }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="showConfirm=false"></button>
          </div>
          <div class="modal-body">
            <p>{{ confirmMessage }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showConfirm=false">Cancel</button>
            <button
              class="btn"
              :class="confirmAction==='Delete' ? 'btn-danger' : 'btn-primary'"
              @click="doConfirm"
            >
              Yes, {{ confirmAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal CRUD Detalii Joc -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display:block; background:rgba(0,0,0,0.5)"
      v-if="showDetailModal"
      @click.self="showDetailModal=false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">Manage Details for #{{ detailForm.id }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="showDetailModal=false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveDetail">
              <!-- Main Image URL -->
              <div class="mb-3">
                <label class="form-label">Main Image URL</label>
                <input
                  v-model="detailForm.backgroundImage"
                  type="url"
                  class="form-control bg-secondary text-light"
                  required
                />
              </div>
              <!-- Name -->
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  v-model="detailForm.name"
                  type="text"
                  class="form-control bg-secondary text-light"
                  required
                />
              </div>
              <!-- Description -->
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="detailForm.description"
                  class="form-control bg-secondary text-light"
                  rows="4"
                  required
                ></textarea>
              </div>
              <!-- Metadate -->
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Metacritic</label>
                  <input
                    v-model.number="detailForm.metacritic"
                    type="number"
                    class="form-control bg-secondary text-light"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Rating</label>
                  <input
                    v-model.number="detailForm.rating"
                    step="0.1"
                    type="number"
                    class="form-control bg-secondary text-light"
                    required
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Top Rating</label>
                  <input
                    v-model.number="detailForm.ratingTop"
                    type="number"
                    class="form-control bg-secondary text-light"
                    required
                  />
                </div>
              </div>
              <!-- Releașe + Additional Image -->
              <div class="row g-3 mt-3">
                <div class="col-md-6">
                  <label class="form-label">Release Date</label>
                  <input
                    v-model="detailForm.released"
                    type="date"
                    class="form-control bg-secondary text-light"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Additional Image URL</label>
                  <input
                    v-model="detailForm.backgroundImageAdditional"
                    type="url"
                    class="form-control bg-secondary text-light"
                  />
                </div>
              </div>
              <!-- Platforms JSON -->
              <div class="mb-3 mt-3">
                <label class="form-label">Platforms (JSON Array)</label>
                <textarea
                  v-model="detailForm.platformsJson"
                  class="form-control bg-secondary text-light"
                  rows="3"
                  placeholder='[{"platform":{"id":1,"name":"PC"},"released_at":"YYYY-MM-DD"}, …]'
                ></textarea>
              </div>
              <!-- Butoane -->
              <div class="d-flex justify-content-between">
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="deleteDetail"
                  v-if="detailExists"
                >
                  Delete Details
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ detailExists ? 'Update Details' : 'Create Details' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </BaseLayout>
</template>

<script>
import BaseLayout from './BaseLayout.vue';
import GameCard from './GameCard.vue';
import { getUsername, logout, isAdmin } from '@/auth';
import api from '@/api';

export default {
  name: 'UserProfile',
  components: { BaseLayout, GameCard },
  data() {
    return {
      username: getUsername(),
      currentTab: 'wishlist',
      wishlistGames: [],
      completedGames: [],

      // --- admin panel ---
      adminSearch: '',
      adminGames: [],
      newGame: { id: null, name: '', backgroundImage: '', rating: 0, released: '' },

      // --- confirm modal ---
      showConfirm: false,
      confirmAction: '',
      confirmMessage: '',
      confirmPayload: null,

      // --- details CRUD ---
      showDetailModal: false,
      detailForm: {
        id: null,
        name: '',
        description: '',
        metacritic: null,
        released: '',
        rating: null,
        ratingTop: null,
        backgroundImage: '',
        backgroundImageAdditional: '',
        platformsJson: '[]'
      },
      detailExists: false,

      // --- alert ---
      alertMessage: '',
      alertType: 'success'
    };
  },
  computed: {
    isAdmin() {
      return isAdmin();
    }
  },
  methods: {
    // logout
    doLogout() {
      logout();
      this.$router.push('/login');
    },

    // ---- user lists ----
    async fetchLists() {
      try {
        const user = this.username;
        const [wRes, cRes] = await Promise.all([
          api.get(`/users/${user}/games`, { params: { status: 'WISHLIST' } }),
          api.get(`/users/${user}/games`, { params: { status: 'COMPLETED' } })
        ]);
        this.wishlistGames = wRes.data;
        this.completedGames = cRes.data;
      } catch (e) {
        console.error('Failed to load lists:', e);
      }
    },
    async removeFromWishlist(gameId) {
      try {
        await api.delete(`/users/${this.username}/games/${gameId}`, {
          params: { status: 'WISHLIST' }
        });
        this.wishlistGames = this.wishlistGames.filter(g => g.id !== gameId);
      } catch (e) {
        console.error('Failed to remove from wishlist:', e);
      }
    },
    async removeFromCompleted(gameId) {
      try {
        await api.delete(`/users/${this.username}/games/${gameId}`, {
          params: { status: 'COMPLETED' }
        });
        this.completedGames = this.completedGames.filter(g => g.id !== gameId);
      } catch (e) {
        console.error('Failed to remove from completed:', e);
      }
    },

    // ---- admin-games ----
    fetchAdminGames() {
      api.get('/games/trending', {
        params: { size: 100, page: 1, search: this.adminSearch.trim() || null }
      })
      .then(res => {
        this.adminGames = res.data.map(g => ({
          ...g,
          released: g.released ? g.released.substring(0, 10) : ''
        }));
      })
      .catch(console.error);
    },
    createGame() {
      api.post('/games', this.newGame)
      .then(() => {
        this.showAlert('Game created.', 'success');
        this.newGame = { id: null, name: '', backgroundImage: '', rating: 0, released: '' };
        this.fetchAdminGames();
      })
      .catch(err => this.showAlert('Error: ' + (err.response?.data?.message || err.message), 'danger'));
    },
    promptUpdate(game) {
      this.confirmAction = 'Update';
      this.confirmPayload = { ...game };
      this.confirmMessage = `Update "${game.name}"?`;
      this.showConfirm = true;
    },
    promptDelete(game) {
      this.confirmAction = 'Delete';
      this.confirmPayload = game.id;
      this.confirmMessage = `Delete "${game.name}"?`;
      this.showConfirm = true;
    },
    doConfirm() {
      this.showConfirm = false;
      if (this.confirmAction === 'Update') {
        this.updateGameConfirmed(this.confirmPayload);
      } else {
        this.deleteGameConfirmed(this.confirmPayload);
      }
    },
    updateGameConfirmed(game) {
      api.put(`/games/${game.id}`, game)
      .then(() => {
        this.showAlert(`"${game.name}" updated.`, 'success');
        this.fetchAdminGames();
      })
      .catch(err => this.showAlert('Error: ' + (err.response?.data?.message || err.message), 'danger'));
    },
    deleteGameConfirmed(id) {
      api.delete(`/games/${id}`)
      .then(() => {
        this.showAlert('Game deleted.', 'success');
        this.fetchAdminGames();
      })
      .catch(err => this.showAlert('Error: ' + (err.response?.data?.message || err.message), 'danger'));
    },

    // ---- details CRUD ----
    openDetailModal(game) {
      // initializez cu valorile game
      this.detailForm = {
        id: game.id,
        name: game.name,
        description: '',
        metacritic: null,
        released: game.released,
        rating: game.rating,
        ratingTop: game.rating,
        backgroundImage: '',
        backgroundImageAdditional: '',
        platformsJson: '[]'
      };
      api.get(`/games/${game.id}/detail`)
      .then(res => {
        const d = res.data;
        this.detailForm = {
          id: d.id,
          name: d.name,
          description: d.description || '',
          metacritic: d.metacritic,
          released: d.released,
          rating: d.rating,
          ratingTop: d.rating_top,
          backgroundImage: d.background_image || '',
          backgroundImageAdditional: d.background_image_additional || '',
          platformsJson: JSON.stringify(d.platforms, null, 2)
        };
        this.detailExists = true;
      })
      .catch(() => {
        this.detailExists = false;
      })
      .finally(() => {
        this.showDetailModal = true;
      });
    },
    saveDetail() {
      const d = this.detailForm;
      const payload = {
        id: d.id,
        name: d.name,
        description: d.description,
        metacritic: d.metacritic,
        released: d.released,
        background_image: d.backgroundImage,
        background_image_additional: d.backgroundImageAdditional,
        rating: d.rating,
        rating_top: d.ratingTop,
        platforms: JSON.parse(d.platformsJson)
      };
      const call = this.detailExists
        ? api.put(`/games/${d.id}/detail`, payload)
        : api.post(`/games/${d.id}/detail`, payload);

      call.then(() => {
        this.showAlert(this.detailExists ? 'Details updated.' : 'Details created.', 'success');
        // păstrează URL-urile în formular
        this.detailForm.backgroundImage = payload.background_image;
        this.detailForm.backgroundImageAdditional = payload.background_image_additional;
        this.detailForm.platformsJson = JSON.stringify(payload.platforms, null, 2);
        this.detailExists = true;
      })
      .catch(err => {
        this.showAlert('Error: ' + (err.response?.data?.message || err.message), 'danger');
      });
    },
    deleteDetail() {
      api.delete(`/games/${this.detailForm.id}/detail`)
      .then(() => {
        this.showAlert('Details deleted.', 'success');
        this.showDetailModal = false;
      })
      .catch(err => {
        this.showAlert('Error: ' + (err.response?.data?.message || err.message), 'danger');
      });
    },

    // ---- helper alert ----
    showAlert(msg, type = 'success') {
      this.alertMessage = msg;
      this.alertType = type;
      setTimeout(() => (this.alertMessage = ''), 4000);
    }
  },
  async mounted() {
    await this.fetchLists();
    if (this.isAdmin) this.fetchAdminGames();
  },
  beforeRouteEnter(to, from, next) {
    if (!getUsername()) return next('/login');
    next();
  }
};
</script>

<style scoped>
.admin-panel hr {
  border-color: #444;
}
/* cursoare pentru taburi */
.nav-tabs .nav-link {
  cursor: pointer;
}
/* backdrop implicit */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
}
</style>