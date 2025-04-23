<template>
    <layout-container>
        <h2 class="text-center mt-5 mb-3">Create Item</h2>
            <div class="card">
                <div class="card-header">
                    <router-link to = "/" class="btn btn-outline-info float-right">
                        All Items
                    </router-link>
                </div>
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label for ="itemTitle">Title</label>
                        <input type="text" 
                            v-model="item.title"
                            class="form-control"
                            id="itemTitle"
                            name="itemTitle"
                        />

                    </div>

                    <div class="form-group">
                        <label for ="itemDescription">Description</label>
                        <input type="text" 
                            v-model="item.description"
                            class="form-control"
                            id="itemDescription"
                            name="itemDescription"
                        />

                    </div>

                    <button @click="createItem()"
                            :disabled="isSubmitting"
                            type="button"
                            class="btn btn-outline-warning mt-3"
                    >Submit</button>
                </form>
            </div>
    </layout-container>
</template>

<script>
    import LayoutContainer from '../LayoutContainer.vue';
    import axios from 'axios';
    import Swal from 'sweetalert2';
    
    export default {
        name: 'CreateItem',
        components: {
            LayoutContainer
        },
        data() {
            return {
                item: {
                    title: '',
                    description: ''
                },
                isSubmitting: false
            }
        },
        methods: {
            createItem() {
                this.isSubmitting = true;
                axios.post('/api/items', this.item)
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Item created successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.isSubmitting = false;
                    this.item.title = '';
                    this.item.description = '';
                    return response;
                })
                .catch(error => {
                    this.isSubmitting = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Some error occurred',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    return error;
                })
            }
        }
    };
</script>