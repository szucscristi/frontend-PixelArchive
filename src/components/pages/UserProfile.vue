<!-- src/components/pages/UserProfile.vue -->
<template>
  <BaseLayout>
    <div class="container py-5 text-light">

      <!-- Alert notificare -->
      <div
        v-if="alertMessage"
        :class="['alert', alertType==='success'?'alert-success':'alert-danger', 'alert-dismissible', 'fade', 'show']"
        role="alert"
      >
        {{ alertMessage }}
        <button type="button" class="btn-close" @click="alertMessage = ''"></button>
      </div>

      <h2>Welcome, {{ username }}!</h2>
      <p>You are logged in.</p>
      <button class="btn btn-outline-light mb-4" @click="doLogout">Logout</button>

      <div v-if="isAdmin" class="admin-panel mt-5">
        <h3>Admin Panel</h3>
        <hr />

        <!-- CREARE JOC -->
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

        <!-- SEARCH JOCURI -->
        <div class="mt-4 mb-2">
          <input
            v-model="adminSearch"
            @input="fetchAdminGames"
            type="text"
            class="form-control bg-dark text-light border-secondary"
            placeholder="Search games..."
          />
        </div>

        <!-- TABEL JOCURI -->
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
                <td><input v-model="game.name" class="form-control bg-dark text-light border-secondary" /></td>
                <td><input v-model.number="game.rating" type="number" step="0.1" class="form-control bg-dark text-light border-secondary" /></td>
                <td><input v-model="game.released" type="date" class="form-control bg-dark text-light border-secondary" /></td>
                <td class="d-flex flex-wrap gap-1">
                  <button class="btn btn-sm btn-primary" @click="promptUpdate(game)">Update</button>
                  <button class="btn btn-sm btn-danger" @click="promptDelete(game)">Delete</button>
                  <button class="btn btn-sm btn-info" @click="openDetailModal(game)">Details</button>
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

    <!-- MODAL CONFIRMARE UPDATE/DELETE -->
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
            <button class="btn" :class="confirmAction==='Delete'?'btn-danger':'btn-primary'" @click="doConfirm">
              Yes, {{ confirmAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL CRUD DETALII JOC -->
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
                  placeholder="https://example.com/cover.jpg"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="detailForm.name" type="text" class="form-control bg-secondary text-light" required/>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea
                  v-model="detailForm.description"
                  class="form-control bg-secondary text-light"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Metacritic</label>
                  <input v-model.number="detailForm.metacritic" type="number" class="form-control bg-secondary text-light"/>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Rating</label>
                  <input v-model.number="detailForm.rating" step="0.1" type="number" class="form-control bg-secondary text-light" required/>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Top Rating</label>
                  <input v-model.number="detailForm.ratingTop" type="number" class="form-control bg-secondary text-light" required/>
                </div>
              </div>
              <div class="row g-3 mt-3">
                <div class="col-md-6">
                  <label class="form-label">Release Date</label>
                  <input v-model="detailForm.released" type="date" class="form-control bg-secondary text-light" required/>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Additional Image URL</label>
                  <input v-model="detailForm.backgroundImageAdditional" type="url" class="form-control bg-secondary text-light"/>
                </div>
              </div>
              <div class="mb-3 mt-3">
                <label class="form-label">Platforms (JSON Array)</label>
                <textarea
                  v-model="detailForm.platformsJson"
                  class="form-control bg-secondary text-light"
                  rows="3"
                  placeholder='[{"platform":{"id":1,"name":"PC"},"released_at":"YYYY-MM-DD"}, …]'
                ></textarea>
              </div>
              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-danger" @click="deleteDetail" v-if="detailExists">
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

export default {
  name: 'UserProfile',
  components: { BaseLayout },
  data() {
    return {
      username:    getUsername(),
      adminSearch: '',
      adminGames:  [],
      newGame:     { id:null,name:'',backgroundImage:'',rating:0,released:'' },

      // confirm modal
      showConfirm:    false,
      confirmAction:  '',
      confirmMessage: '',
      confirmPayload: null,

      // details CRUD
      showDetailModal: false,
      detailForm: {
        id:                         null,
        name:                       '',
        description:                '',
        metacritic:                 null,
        released:                   '',
        rating:                     null,
        ratingTop:                  null,
        backgroundImage:            '',  // URL principal
        backgroundImageAdditional:  '',
        platformsJson:              '[]'
      },
      detailExists: false,

      // alert
      alertMessage: '',
      alertType:    'success'
    };
  },
  computed: {
    isAdmin() { return isAdmin(); }
  },
  methods: {
    // autentificare
    doLogout() {
      logout();
      this.$router.push('/login');
    },

    // jocuri
    fetchAdminGames() {
      api.get('/games/trending', { params:{ size:100,page:1,search:this.adminSearch.trim()||null }})
        .then(res=>{
          this.adminGames = res.data.map(g=>({
            ...g,
            released: g.released? g.released.substring(0,10):''
          }));
        }).catch(console.error);
    },
    createGame() {
      api.post('/games', this.newGame)
        .then(()=>{
          this.showAlert('Game created.','success');
          this.newGame = { id:null,name:'',backgroundImage:'',rating:0,released:'' };
          this.fetchAdminGames();
        }).catch(err=>this.showAlert('Error: '+(err.response?.data?.message||err.message),'danger'));
    },
    promptUpdate(game) {
      this.confirmAction  = 'Update';
      this.confirmPayload = {...game};
      this.confirmMessage = `Update "${game.name}"?`;
      this.showConfirm   = true;
    },
    promptDelete(game) {
      this.confirmAction  = 'Delete';
      this.confirmPayload = game.id;
      this.confirmMessage = `Delete "${game.name}"?`;
      this.showConfirm   = true;
    },
    doConfirm() {
      this.showConfirm = false;
      if(this.confirmAction==='Update') this.updateGameConfirmed(this.confirmPayload);
      else                               this.deleteGameConfirmed(this.confirmPayload);
    },
    updateGameConfirmed(game) {
      api.put(`/games/${game.id}`, game)
        .then(()=>{
          this.showAlert(`"${game.name}" updated.`, 'success');
          this.fetchAdminGames();
        }).catch(err=>this.showAlert('Error: '+(err.response?.data?.message||err.message),'danger'));
    },
    deleteGameConfirmed(id) {
      api.delete(`/games/${id}`)
        .then(()=>{
          this.showAlert('Game deleted.','success');
          this.fetchAdminGames();
        }).catch(err=>this.showAlert('Error: '+(err.response?.data?.message||err.message),'danger'));
    },

    // detalii joc
    openDetailModal(game) {
      // inițializez form
      this.detailForm = {
        id:                         game.id,
        name:                       game.name,
        description:                '',
        metacritic:                 null,
        released:                   game.released,
        rating:                     game.rating,
        ratingTop:                  game.rating,
        backgroundImage:            '',
        backgroundImageAdditional:  '',
        platformsJson:              '[]'
      };
      api.get(`/games/${game.id}/detail`)
        .then(res=>{
          const d = res.data;
          this.detailForm = {
            id:                         d.id,
            name:                       d.name,
            description:                d.description||'',
            metacritic:                 d.metacritic,
            released:                   d.released,
            rating:                     d.rating,
            ratingTop:                  d.ratingTop,
            backgroundImage:            d.backgroundImage||'',
            backgroundImageAdditional:  d.backgroundImageAdditional||'',
            platformsJson:              JSON.stringify(d.platforms,null,2)
          };
          this.detailExists = true;
        })
        .catch(()=>{
          this.detailExists = false;
        })
        .finally(()=>{
          this.showDetailModal = true;
        });
    },
    saveDetail() {
      // construiesc payload snake_case
      const d = this.detailForm;
      const payload = {
        id:                         d.id,
        name:                       d.name,
        description:                d.description,
        metacritic:                 d.metacritic,
        released:                   d.released,
        background_image:           d.backgroundImage,
        background_image_additional:d.backgroundImageAdditional,
        rating:                     d.rating,
        rating_top:                 d.ratingTop,
        platforms:                  JSON.parse(d.platformsJson)
      };
      const call = this.detailExists
        ? api.put(`/games/${d.id}/detail`, payload)
        : api.post(`/games/${d.id}/detail`, payload);

      call.then(()=>{
        this.showAlert(this.detailExists?'Details updated.':'Details created.','success');
        // actualizez form cu valorile trimise
        this.detailForm.backgroundImage           = payload.background_image;
        this.detailForm.backgroundImageAdditional = payload.background_image_additional;
        this.detailForm.platformsJson             = JSON.stringify(payload.platforms,null,2);
        this.detailExists = true;
      })
      .catch(err=>{
        this.showAlert('Error: '+(err.response?.data?.message||err.message),'danger');
      });
    },
    deleteDetail() {
      api.delete(`/games/${this.detailForm.id}/detail`)
        .then(()=>{
          this.showAlert('Details deleted.','success');
          this.showDetailModal = false;
        })
        .catch(err=>{
          this.showAlert('Error: '+(err.response?.data?.message||err.message),'danger');
        });
    },

    // helper alert
    showAlert(msg,type='success') {
      this.alertMessage = msg;
      this.alertType    = type;
      setTimeout(()=>this.alertMessage='',4000);
    }
  },

  mounted() {
    if(this.isAdmin) this.fetchAdminGames();
  },
  beforeRouteEnter(to, from, next) {
    if(!getUsername()) return next('/login');
    next();
  }
};
</script>

<style scoped>
.admin-panel hr { border-color: #444; }
/* backdrop implicit */
.modal-backdrop {
  position: fixed; top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.5);
}
</style>
