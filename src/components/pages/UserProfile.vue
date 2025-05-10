<!-- src/components/pages/UserProfile.vue -->
<template>
  <BaseLayout>
    <div class="container py-5 text-light">
       <!-- Header -->
       <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {{ username }}!</h2>
        <button class="btn btn-logout" @click="doLogout">
          Logout
        </button>
      </div>

 <!-- Tabs -->
      <ul class="nav nav-tabs">
        <li class="nav-item wishlist-tab">
          <button class="nav-link" :class="{ active: currentTab==='wishlist' }" @click="currentTab='wishlist'">
            <img src="@/assets/wishlist.png" class="tab-icon me-1" alt="Wishlist" />
            Wishlist ({{ wishlistGames.length }})
          </button>
        </li>
        <li class="nav-item completed-tab">
          <button class="nav-link" :class="{ active: currentTab==='completed' }" @click="currentTab='completed'">
            <img src="@/assets/completed.png" class="tab-icon me-1" alt="Completed" />
            Completed ({{ completedGames.length }})
          </button>
        </li>
        <li class="nav-item reviews-tab"> <!-- adăugăm clasa reviews-tab -->
        <button
          class="nav-link"
          :class="{ active: currentTab === 'reviews' }"
          @click="currentTab = 'reviews'"
        >
          <!-- icon chat în stânga, folosind Bootstrap Icons -->
          <i class="bi bi-chat-dots tab-icon"></i>
          My Reviews ({{ myReviews.length }})
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

              <router-link
                :to="{ name: 'game-details', params: { id: game.id } }"
                class="user-game-card text-decoration-none d-block"
                >
                <img :src="game.backgroundImage" alt="Cover" class="cover" />
                <div class="info">
                  <h5 class="name text-truncate">{{ game.name }}</h5>
                  <p class="rating">⭐ {{ game.rating }}</p>
                </div>
              </router-link>

              <button
                class="btn btn-sm btn-danger mt-2 w-100"
                @click="removeFromWishlist(game.id)"
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
          <p v-else class="text-center text-secondary">
            Your wishlist is empty.
          </p>
        </div>

        <!-- Completed -->
        <div v-else-if="currentTab === 'completed'">
          <div v-if="completedGames.length" class="row g-3">
            <div
              v-for="game in completedGames"
              :key="game.id"
              class="col-6 col-md-4 col-lg-3"
            >

              <router-link
                :to="{ name: 'game-details', params: { id: game.id } }"
                class="user-game-card text-decoration-none d-block"
                >
                <img :src="game.backgroundImage" alt="Cover" class="cover" />
                <div class="info">
                  <h5 class="name text-truncate">{{ game.name }}</h5>
                  <p class="rating">⭐ {{ game.rating }}</p>
                </div>
              </router-link>

              <button
                class="btn btn-sm btn-warning mt-2 w-100"
                @click="removeFromCompleted(game.id)"
              >
                Remove from Completed
              </button>
            </div>
          </div>
          <p v-else class="text-center text-secondary">
            No completed games yet.
          </p>
        </div>

  <!-- My Reviews -->
  <div v-else-if="currentTab === 'reviews'">
    <div v-if="myReviews.length" class="list-group">
      <div
        v-for="r in myReviews"
        :key="r.id"
        class="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-start"
      >
        <div>
          <p class="mb-1">{{ r.content }}</p>
          <small class="text-secondary">
            on
            <router-link
              :to="{ name: 'game-details', params: { id: r.gameId } }"
            >
            {{ r.gameName }}
            </router-link>
            at {{ new Date(r.createdAt).toLocaleString() }}
          </small>
        </div>
        <button
          class="btn btn-sm btn-outline-light"
          @click="editMyReview(r)"
        >
          Edit
        </button>
      </div>
    </div>
    <p v-else class="text-center text-secondary">
      You haven’t written any reviews yet.
    </p>
  </div>
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



      <!-- Admin Panel -->
<div v-if="isAdmin" class="admin-panel mt-5">
  <h3 class="admin-panel__title">Admin Panel</h3>
  <hr class="admin-panel__divider"/>

  <!-- butoane centrate -->
  <div class="d-flex justify-content-center mb-4 admin-panel__tabs">
    <button
      type="button"
      class="btn btn-outline-light admin-panel__tab-btn"
      :class="{ active: adminTab==='games' }"
      @click="adminTab = 'games'"
    >
      Manage Games
    </button>
    <button
      type="button"
      class="btn btn-outline-light admin-panel__tab-btn"
      :class="{ active: adminTab==='users' }"
      @click="adminTab = 'users'"
    >
      Manage Users
    </button>
  </div>


        <!-- Form creare joc -->
        <div v-if="adminTab==='games'" class="admin-panel__section">
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

        <!-- Modern Admin Search Bar, centrat -->
<div class="admin-search-container mb-4 d-flex justify-content-center">
  <div class="input-group bg-secondary bg-opacity-25 rounded-pill p-1" style="max-width: 400px; width: 100%;">
    <span class="input-group-text bg-transparent border-0">
      <i class="bi bi-search text-light"></i>
    </span>
    <input
      v-model="adminSearch"
      @input="fetchAdminGames"
      type="text"
      class="form-control bg-transparent border-0 text-light"
      placeholder="Search games..."
    />
  </div>
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


    <!-- Users Management -->
    <div v-else-if="adminTab==='users'" class="admin-panel__section">
      <!-- 1) Search bar -->
      <div class="admin-search-container mb-4 d-flex justify-content-center">
        <div class="input-group bg-secondary bg-opacity-25 rounded-pill p-1"
             style="max-width: 400px; width: 100%;">
          <span class="input-group-text bg-transparent border-0">
            <i class="bi bi-search text-light"></i>
          </span>
          <input
            v-model="userSearch"
            type="text"
            class="form-control bg-transparent border-0 text-light"
            placeholder="Search users..."
          />
        </div>
      </div>

      <h4 class="mt-4">Users</h4>
      <table class="table table-dark table-striped">
        <thead>
            <tr>
              <th>Username</th>
              <th>Display Name</th>
              <th>Locked?</th>
              <th>Actions</th>
            </tr>
          </thead>
        <tbody>
          <!-- 2) iterate over filteredUsers -->
          <tr v-for="user in filteredUsers" :key="user.username">
            <td>{{ user.username }}</td>
            <td>{{ user.displayName }}</td>
            <td>
              <span :class="{'text-danger': user.locked, 'text-success': !user.locked}">
                {{ user.locked ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="d-flex gap-2">
              <button
                class="btn btn-sm"
                :class="user.locked ? 'btn-success' : 'btn-warning'"
                @click="toggleUserLock(user)"
              >
                {{ user.locked ? 'Unban' : 'Ban' }}
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteUser(user)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="!filteredUsers.length">
            <td colspan="4" class="text-center text-secondary">No users found.</td>
          </tr>
        </tbody>
      </table>
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
import { getUsername, logout, isAdmin } from '@/auth';
import api from '@/api';
import wishlistIcon     from '@/assets/wishlist.png';
import completedIcon    from '@/assets/completed.png';

export default {
  name: 'UserProfile',
  components: { BaseLayout },
  data() {
    return {
      username: getUsername(),
      currentTab: 'wishlist',
      wishlistGames: [],
      completedGames: [],
      adminTab: 'games',
      userSearch: '',
      users: [],

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
      alertType: 'success',

      // --- reviews ---

      myReviews: [],
      wishlistIcon,
      completedIcon
      
    };
  },
  computed: {
    isAdmin() {
      return isAdmin();
    },
    filteredUsers() {
      const term = this.userSearch.toLowerCase().trim()
      if (!term) return this.users
      return this.users.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.displayName.toLowerCase().includes(term)
      )
    }
  },
  methods: {
    // logout
    doLogout() {
      logout();
      this.$router.push('/login');
    },

     /** Load all users for the admin panel */
  async fetchAdminUsers() {
    try {
      const res = await api.get('/admin/users');
      this.users = res.data; 
    } catch (e) {
      console.error('Failed to load users:', e);
      this.showAlert('Could not load users', 'danger');
    }
  },

  /** Toggle lock/unlock on a user by username */
/** Toggle lock/unlock on a user by username */
async toggleUserLock(user) {
  try {
    if (user.locked) {
      // dacă e blocat, de-blocăm
      await api.put(`/admin/users/${user.username}/unlock`);
      this.showAlert(`Unbanned ${user.username}`, 'success');
    } else {
      // dacă e de-blocat, blocăm
      await api.put(`/admin/users/${user.username}/lock`);
      this.showAlert(`Banned ${user.username}`, 'success');
    }
    // reîncarcă lista cu utilizatori actualizați
    await this.fetchAdminUsers();
  } catch (e) {
    console.error('Failed to toggle lock:', e);
    this.showAlert('Operation failed', 'danger');
  }
},


  /** Permanently delete a user */
  async deleteUser(user) {
    if (!confirm(`Delete user ${user.username}?`)) return;
    try {
      await api.delete(`/admin/users/${user.username}`);
      this.showAlert(`Deleted ${user.username}`, 'success');
      this.users = this.users.filter(u => u.username !== user.username);
    } catch (e) {
      console.error('Failed to delete user:', e);
      this.showAlert('Delete failed', 'danger');
    }
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
    },

     // 1) încărcarea review-urilor user-ului
  async fetchMyReviews() {
    try {
      // 1) ia review-urile
      const { data: reviews } = await api.getMyReviews(this.username);

     // 2) pentru fiecare review, preia detaliile jocului
      const withNames = await Promise.all(
        reviews.map(async r => {
          try {
            const { data: game } = await api.getGameDetails(r.gameId);
            return { ...r, gameName: game.name };
          } catch {
            // fallback: dacă nu găsim jocul, păstrăm id-ul
            return { ...r, gameName: `Game #${r.gameId}` };
          }
        })
      );
 
      // 3) salvează
      this.myReviews = withNames;
    } catch (e) {
      console.error('Failed to load my reviews:', e);
    }
  },
  watch: {
    currentTab(newTab) {
      if (newTab === 'reviews') {
        this.fetchMyReviews();
      }
    },
  },
  async editMyReview(review) {
    const updatedText = prompt('Edit your review:', review.content);
    if (updatedText != null && updatedText.trim()) {
      try {
        const res = await api.updateReview(review.id, updatedText);
        // actualizează în myReviews
        this.myReviews = this.myReviews.map(r =>
          r.id === review.id ? res.data : r
        );
        this.showAlert('Review updated.', 'success');
      } catch (e) {
        console.error('Failed to update review:', e);
        this.showAlert('Error updating review.', 'danger');
      }
    }
  },
  },
  async mounted() {
    await this.fetchLists();
    await  this.fetchMyReviews();
    if (this.isAdmin) {
    this.fetchAdminGames();
    this.fetchAdminUsers();
  }
  },
  beforeRouteEnter(to, from, next) {
    if (!getUsername()) return next('/login');
    next();
  }
};
</script>

<style scoped>
/* New simple card for user's games */
.user-game-card {
  position: relative;        /* for the pseudo-element */
  background-color: #1e1e2f;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.user-game-card:hover {
  transform: scale(1.03);
}

/* Gradient-only border on hover */
.user-game-card:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;                /* border thickness */
  border-radius: 1rem;         /* match card radius */
  background: linear-gradient(
    45deg,
    #e53935 0%,
    #ffd700 100%
  );
  /* cut out the inside so you only see the border */
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
          mask-composite: exclude;
  pointer-events: none;
}

.user-game-card .cover {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.user-game-card .info {
  padding: 0.75rem;
  color: #fff;
}

.user-game-card .name {
  margin: 0;
  font-size: 1rem;
}

.user-game-card .rating {
  margin: 0.25rem 0 0;
  color: #ffce00;
  font-size: 0.9rem;
}

/* Tab styling */
.nav-tabs .nav-link {
  cursor: pointer;
  color: #fff !important;             /* default tabs white */
  transition: color 0.2s ease;
}

/* Make active tab black text on white bg */
.nav-tabs .nav-link.active {
  color: #000 !important;             /* active tab text black for contrast */
  background-color: #fff !important;  /* active tab bg white */
  border-color: #fff !important;      /* active border white */
}

/* Tab Icons */
.tab-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
  vertical-align: middle;
  margin-right: 0.5rem;
}

/* Wishlist Tab */
.wishlist-tab .nav-link {
  color: #e53935 !important;          /* wishlist text red */
}
.wishlist-tab .nav-link .tab-icon {
  filter: none;                       /* preserve original icon color */
}
.wishlist-tab .nav-link:hover .tab-icon {
  transform: scale(1.2);
}

/* Completed Tab */
.completed-tab .nav-link {
  color: #ffd700 !important;          /* completed text gold */
}
.completed-tab .nav-link .tab-icon {
  filter: none;
}
.completed-tab .nav-link:hover .tab-icon {
  transform: scale(1.2);
}

/* Reviews Tab */
.reviews-tab .nav-link {
  color: #0dcaf0 !important;          /* culoare turcoaz specifcă Reviews */
}
.reviews-tab .nav-link .tab-icon {
  color: #0dcaf0;                     /* icon turcoaz */
}
.reviews-tab .nav-link:hover .tab-icon {
  transform: scale(1.2);
}

/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
}

/* Admin search placeholder */
.admin-search-container .form-control::placeholder {
  color: rgba(255,255,255,0.6);
}

.admin-panel {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1rem;
}

.admin-panel__title {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.admin-panel__divider {
  width: 3rem;
  border-top: 2px solid #fff;
  margin: 0.25rem auto 1.5rem;
}

.admin-panel__tabs {
  gap: 1rem;
}

.admin-panel__tab-btn {
  min-width: 130px;
  transition: background 0.2s, color 0.2s;
}
.admin-panel__tab-btn.active,
.admin-panel__tab-btn:hover {
  background: #fff/*linear-gradient(45deg, #e53935, #ffd700)*/;
  color: #000;
  border-color: transparent;
}

.admin-panel__section {
  margin-top: 2rem;
}

/* Dacă vrei să mai subțiezi tabelele */
.admin-panel__section table {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  overflow: hidden;
}

/* New logout button styling */
.btn-logout {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: #fff;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.btn-logout:hover {
  background-color: #c82333 !important;
  border-color: #c82333 !important;
}

</style>

