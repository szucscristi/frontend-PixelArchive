<!-- src/components/pages/UserProfile.vue -->
<template>
  <BaseLayout>
    <div class="container py-5 text-light">

      <!-- Notification Alert -->
      <div
        v-if="alertMessage"
        :class="['alert', alertType === 'success' ? 'alert-success' : 'alert-danger', 'alert-dismissible', 'fade', 'show']"
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

      <div v-if="isAdmin" class="admin-panel mt-5">
        <h3>Admin Panel</h3>
        <hr />

        <!-- Create Form -->
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

        <!-- Search Admin -->
        <div class="mt-4 mb-2">
          <input
            v-model="adminSearch"
            @input="fetchAdminGames"
            type="text"
            class="form-control bg-dark text-light border-secondary"
            placeholder="Search games..."
          />
        </div>

        <!-- Update/Delete Table -->
        <div class="mt-2">
          <h4>Existing Games</h4>
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Rating</th><th>Released</th><th>Actions</th>
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
                <td>
                  <button
                    class="btn btn-sm btn-primary me-1"
                    @click="promptUpdate(game)"
                  >
                    Update
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="promptDelete(game)"
                  >
                    Delete
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

    <!-- Confirmation Modal -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0,0,0,0.5);"
      v-if="showConfirm"
      @click.self="showConfirm = false"
    >
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">Confirm {{ confirmAction }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="showConfirm = false"></button>
          </div>
          <div class="modal-body">
            <p>{{ confirmMessage }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showConfirm = false">Cancel</button>
            <button class="btn"
                    :class="confirmAction === 'Delete' ? 'btn-danger' : 'btn-primary'"
                    @click="doConfirm">
              Yes, {{ confirmAction }}
            </button>
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

export default {
  name: 'UserProfile',
  components: { BaseLayout },
  data() {
    return {
      username: getUsername(),
      adminSearch: '',
      adminGames: [],
      newGame: { id: null, name: '', backgroundImage: '', rating: 0, released: '' },

      // modal state
      showConfirm: false,
      confirmAction: '',      // "Update" or "Delete"
      confirmMessage: '',
      confirmPayload: null,   // game object or id

      // alert
      alertMessage: '',
      alertType: 'success'    // or 'danger'
    };
  },
  computed: {
    isAdmin() {
      return isAdmin();
    }
  },
  methods: {
    doLogout() {
      logout();
      this.$router.push('/login');
    },
    fetchAdminGames() {
      api.get('/games/trending', {
        params: { size: 100, page: 1, search: this.adminSearch.trim() || null }
      })
      .then(res => {
        this.adminGames = res.data.map(g => ({
          ...g,
          released: g.released ? g.released.substring(0,10) : ''
        }));
      })
      .catch(console.error);
    },
    createGame() {
      api.post('/games', this.newGame)
        .then(() => {
          this.showAlert('Game created successfully.', 'success');
          this.newGame = { id: null, name: '', backgroundImage: '', rating: 0, released: '' };
          this.fetchAdminGames();
        })
        .catch(err => {
          console.error(err);
          this.showAlert('Error creating game: ' + (err.response?.data?.message || err.message), 'danger');
        });
    },
    promptUpdate(game) {
      this.confirmAction = 'Update';
      this.confirmPayload = { ...game };
      this.confirmMessage = `Are you sure you want to update "${game.name}"?`;
      this.showConfirm = true;
    },
    promptDelete(game) {
      this.confirmAction = 'Delete';
      this.confirmPayload = game.id;
      this.confirmMessage = `Are you sure you want to DELETE "${game.name}"? This action cannot be undone.`;
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
          this.showAlert(`"${game.name}" updated successfully.`, 'success');
          this.fetchAdminGames();
        })
        .catch(err => {
          console.error(err);
          this.showAlert(`Error updating "${game.name}": ${err.response?.data?.message || err.message}`, 'danger');
        });
    },
    deleteGameConfirmed(id) {
      api.delete(`/games/${id}`)
        .then(() => {
          this.showAlert(`Game deleted successfully.`, 'success');
          this.fetchAdminGames();
        })
        .catch(err => {
          console.error(err);
          this.showAlert(`Error deleting game: ${err.response?.data?.message || err.message}`, 'danger');
        });
    },
    showAlert(message, type) {
      this.alertMessage = message;
      this.alertType = type;
      setTimeout(() => this.alertMessage = '', 4000);
    }
  },
  mounted() {
    if (this.isAdmin) {
      this.fetchAdminGames();
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!getUsername()) return next('/login');
    next();
  }
};
</script>

<style scoped>
.admin-panel hr { border-color: #444; }
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}
</style>
