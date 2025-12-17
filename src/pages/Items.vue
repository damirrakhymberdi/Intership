<template>
  <div class="items-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-title">
          <h1>Internships</h1>
        </div>

        <div class="header-search">
          <label class="search-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              v-model="search"
              type="search"
              placeholder="Search by title or company"
            />
          </label>
        </div>

        <div class="header-actions">
          <button @click="refresh" :disabled="loading" class="btn-refresh">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Refresh
          </button>

          <button
            v-if="isCompanyOrAdmin"
            class="btn-primary"
            @click="openModal"
          >
            Add internship
          </button>
        </div>
      </div>

      <div class="page-body">
        <!-- Sidebar (20%) -->
        <aside class="sidebar">
          <section class="filters-section">
            <div class="filters-grid">
              <div class="filter-group">
                <select v-model="status">
                  <option value="">All statuses</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div class="filter-group">
                <select v-model="type">
                  <option value="">All types</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </section>
        </aside>

        <!-- Main (80%) -->
        <main class="main-content">
          <div class="status-messages">
            <span v-if="loading" class="loading-badge">
              <span class="spinner"></span>
              Loading...
            </span>
            <span v-if="error" class="error-badge">{{ error }}</span>
            <span v-if="message" class="success-badge">{{ message }}</span>
          </div>

          <div class="items-list">
            <div v-for="item in filtered" :key="item.id" class="item-card">
              <div class="card-content">
                <div class="card-header">
                  <div class="card-info">
                    <h3 class="item-title">{{ item.title }}</h3>
                    <div class="company-info">
                      <span class="meta-label">Company</span>
                      <span>{{ item.companyName }}</span>
                    </div>
                    <div class="location-info">
                      <span class="meta-label">Location</span>
                      <span>{{ item.location }}</span>
                    </div>
                  </div>
                  <div class="badges">
                    <span :class="['badge', 'status', item.status]">
                      {{ item.status === 'active' ? 'Active' : 'Closed' }}
                    </span>
                    <span :class="['badge', 'type', item.type]">
                      {{ item.type === 'online' ? 'Online' : 'Offline' }}
                    </span>
                  </div>
                </div>

                <p class="item-description">{{ item.description }}</p>

                <div class="card-footer">
                  <div class="card-actions">
                    <button @click="goDetail(item.id)" class="btn-detail">
                      Details
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                    <button
                      v-if="canDelete(item)"
                      @click="remove(item.id)"
                      :disabled="loading"
                      class="btn-delete"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!loading && filtered.length === 0" class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <h3>Nothing found</h3>
              <p>Try changing your filters</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <h3>Add internship</h3>
        <button @click="closeModal" class="btn-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="createNew" class="modal-form">
        <div class="form-group">
          <label>Internship title</label>
          <input v-model="form.title" required placeholder="Frontend Developer" />
        </div>
        
        <div class="form-group">
          <label>Company</label>
          <input v-model="form.companyName" required placeholder="Google Kazakhstan" />
        </div>
        
        <div class="form-group">
          <label>Location</label>
          <input v-model="form.location" placeholder="Almaty / Remote" />
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" required placeholder="Describe requirements and responsibilities..." rows="4" />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status" required>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Type</label>
            <select v-model="form.type" required>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
        
        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
          <button type="submit" :disabled="loading" class="btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasksStore'
import { useAuthStore } from '@/stores/authStore'

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const router = useRouter()

const isCompanyOrAdmin = computed(
  () => authStore.user?.role === 'company' || authStore.user?.role === 'admin'
)
const showModal = ref(false)

const canDelete = (item) => {
  if (authStore.user?.role === 'admin') return true
  if (authStore.user?.role === 'company') {
    return String(item.companyId) === String(authStore.user?.id)
  }
  return false
}

const search = ref('')
const status = ref('')
const type = ref('')
const message = ref('')
const form = reactive({
  title: '',
  companyName: '',
  location: '',
  description: '',
  status: 'active',
  type: 'online',
})

const loading = computed(() => tasksStore.loading)
const error = computed(() => tasksStore.error)

const refresh = () => tasksStore.loadList()

const filtered = computed(() => {
  return tasksStore.filteredList
    .filter((t) =>
      search.value
        ? t.title?.toLowerCase().includes(search.value.toLowerCase()) ||
          (t.companyName || '').toLowerCase().includes(search.value.toLowerCase())
        : true
    )
    .filter((t) => (status.value ? t.status === status.value : true))
    .filter((t) => (type.value ? t.type === type.value : true))
})

const createNew = async () => {
  message.value = ''
  if (!authStore.isAuthenticated) authStore.loadFromStorage()
  if (!isCompanyOrAdmin.value) {
    message.value = 'Only a company or admin can create internships'
    return
  }
  const payload = {
    ...form,
    companyId: authStore.user?.id || '2',
    createdAt: new Date().toISOString(),
  }
  await tasksStore.create(payload)
  Object.assign(form, {
    title: '',
    companyName: '',
    location: '',
    description: '',
    status: 'active',
    type: 'online',
  })
  message.value = 'Saved'
  showModal.value = false
}

const remove = async (id) => {
  if (!confirm('Delete this item?')) return
  await tasksStore.remove(id)
  message.value = 'Deleted'
}

const goDetail = (id) => {
  router.push(`/items/${id}`)
}

const openModal = () => {
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

onMounted(() => {
  if (!authStore.isAuthenticated) authStore.loadFromStorage()
  tasksStore.loadList()
})
</script>

<style scoped>
.items-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 30px 0;
}

.container {
  max-width: auto;
  margin: 0 auto;
  padding: 0px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 20px;
}

.header-title {
  min-width: 260px;
}

.header-search {
  flex: 1;
  min-width: 260px;
  max-width: 560px;
}

.search-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.search-label:focus-within {
  border-color: #4caf4f;
  background: white;
}

.search-label svg {
  width: 20px;
  height: 20px;
  color: #717171;
}

.search-label input {
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
  flex: 1;
  color: #18191f;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #18191f;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  color: #717171;
  margin-top: 8px;
}

/* Layout: Sidebar (20%) + Main (80%) */
.page-body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 0px 20px;
}

.sidebar {
  flex: 0 0 20%;
  padding-top: 15px;
  max-width: 320px;
}

.main-content {
  flex: 1 1 80%;
  min-width: 0;
  border-left: 1px solid #e0e0e0;
  padding-left: 20px;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: #4caf4f;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 79, 0.25);
}

.btn-primary:hover {
  background: #43a047;
  transform: translateY(-2px);
}

.btn-primary svg {
  width: 20px;
  height: 20px;
}

.btn-secondary {
  padding: 12px 24px;
  background: white;
  color: #4caf4f;
  border: 2px solid #4caf4f;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #4caf4f;
  color: white;
}

/* Filters Section */
.filters-section {
  background: white;
  padding: 10px 0px ;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.filter-group label:focus-within {
  border-color: #4caf4f;
  background: white;
}

.filter-group label svg {
  width: 20px;
  height: 20px;
  color: #717171;
}

.filter-group input,
.filter-group select {
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
  flex: 1;
  color: #18191f;
}

.filter-group select {
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-group select:hover {
  border-color: #4caf4f;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  background: white;
  color: #4caf4f;
  border: 2px solid #4caf4f;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-refresh:hover:not(:disabled) {
  background: #4caf4f;
  color: white;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-refresh svg {
  width: 18px;
  height: 18px;
}

/* Status Messages */
.status-messages {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.loading-badge,
.error-badge,
.success-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.loading-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.error-badge {
  background: #ffebee;
  color: #c62828;
}

.success-badge {
  background: #e8f5e9;
  color: #2e7d32;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #1976d2;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Items List */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-card {
  background: white;
  overflow: hidden;
  box-shadow: 0 0px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #848484;
}

.card-content {
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.card-info {
  flex: 1;
}

.item-title {
  font-size: 22px;
  font-weight: 700;
  color: #18191f;
  margin: 0 0 12px;
}

.company-info,
.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #717171;
  margin-bottom: 6px;
}

.meta-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #4caf4f;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 12px;
  border-radius: 1px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.status.active {
  background: #4caf4f;
  color: #ffffff;
}

.badge.status.closed {
  background: #ffffff;
  color: #4caf4f;
}

.badge.type.online {
  background: #e3f2fd;
  color: #1976d2;
}

.badge.type.offline {
  background: #ececec;
  color: #348c37;
}

.item-description {
  font-size: 15px;
  line-height: 1;
  color: #4d5e80;
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-detail,
.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-detail {
  background: #4caf4f;
  color: white;
}

.btn-detail:hover {
  background: #43a047;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background: #c62828;
  color: white;
}

.btn-detail svg,
.btn-delete svg {
  width: 16px;
  height: 16px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  background: white;
  border-radius: 12px;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: #bdbdbd;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #18191f;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 16px;
  color: #717171;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  width: min(560px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #18191f;
  margin: 0;
}

.btn-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e0e0e0;
}

.btn-close svg {
  width: 20px;
  height: 20px;
  color: #717171;
}

.modal-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #18191f;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #4caf4f;
  box-shadow: 0 0 0 3px rgba(76, 175, 79, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

/* Responsive */
@media (max-width: 968px) {
  .page-body {
    flex-direction: column;
  }

  .sidebar {
    flex: 1 1 auto;
    max-width: none;
    width: 100%;
  }

  .card-header {
    flex-direction: column;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>