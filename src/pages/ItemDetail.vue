<template>
  <div class="detail-page">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading && !task" class="loading-state">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!task && !loading" class="not-found">
        <div class="not-found-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h3>Internship not found</h3>
        <p>It may have been deleted, or you don’t have permission to view it.</p>
        <button @click="back" class="btn-secondary">Go back</button>
      </div>
      
      <!-- Content -->
      <template v-else-if="task">
        <button @click="back" class="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        <div class="content">
          <!-- Header -->
          <div class="header">
            <div class="header-content">
            <div class="title-section">
              <h1>{{ task.title }}</h1>
              
            </div>
            </div>
            
          </div>
        </div>

        <!-- Application Status Banner -->
        <div v-if="applied && appliedStatus" :class="['status-banner', appliedStatus]">
          <div class="status-icon">
            <svg v-if="appliedStatus === 'accepted'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else-if="appliedStatus === 'rejected'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="status-text">
            <h4>
              {{ appliedStatus === 'accepted' ? 'Congratulations! You were accepted' : 
                 appliedStatus === 'rejected' ? 'Unfortunately, you were not accepted' : 
                 'Application is under review' }}
            </h4>
            <p>
              {{ appliedStatus === 'accepted' ? 'The company approved your application. Contact them for next steps.' : 
                 appliedStatus === 'rejected' ? 'Don’t worry — keep exploring other opportunities.' : 
                 'The company will review your application soon and contact you.' }}
            </p>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="main-grid">
          <!-- Left - Form -->
          <div class="main-content">
            <form @submit.prevent="save" class="form">
              <div class="form-section">
                <h2>Basic information</h2>
                
                <div class="field">
                  <label>
                    Title <span class="req">*</span>
                  </label>
                  <input 
                    v-model="local.title" 
                    :disabled="!isCompanyOrAdmin"
                    required 
                    placeholder="Frontend Developer"
                  />
                </div>
                
                <div class="field">
                  <label>
                    Company <span class="req">*</span>
                  </label>
                  <input 
                    v-model="local.companyName" 
                    :disabled="!isCompanyOrAdmin"
                    required 
                    placeholder="Google Kazakhstan"
                  />
                </div>
                
                <div class="field">
                  <label>Location</label>
                  <input 
                    v-model="local.location" 
                    :disabled="!isCompanyOrAdmin"
                    placeholder="Almaty / Remote"
                  />
                </div>
                
                <div class="field">
                  <label>
                    Description <span class="req">*</span>
                  </label>
                  <textarea 
                    v-model="local.description" 
                    :disabled="!isCompanyOrAdmin"
                    required 
                    placeholder="Describe requirements, responsibilities, and conditions..."
                    rows="8"
                  />
                </div>
                
                <div class="field-row">
                  <div class="field">
                    <label>
                      Status <span class="req">*</span>
                    </label>
                    <select v-model="local.status" :disabled="!isCompanyOrAdmin" required>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div class="field">
                    <label>
                      Type <span class="req">*</span>
                    </label>
                    <select v-model="local.type" :disabled="!isCompanyOrAdmin" required>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="actions">
                <button
                  v-if="isCompanyOrAdmin"
                  type="submit"
                  :disabled="loading"
                  class="btn-primary"
                >
                  Save changes
                </button>
                
                <button
                  v-if="canApply && !applied"
                  type="button"
                  @click="apply"
                  :disabled="loading"
                  class="btn-apply"
                >
                  Apply
                </button>
              </div>

              <!-- Messages -->
              <div v-if="error" class="msg error">
                {{ error }}
              </div>
              <div v-if="message" class="msg success">
                {{ message }}
              </div>
            </form>
          </div>

          <!-- Right - Sidebar -->
          <div class="sidebar">
            <!-- Info Card -->
            <div class="card">
              <h3>Quick info</h3>
              <div class="info-list">
                <div class="info-row">
                  <span class="label">Created</span>
                  <span class="value">{{ formatDate(task.createdAt) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Company ID</span>
                  <span class="value">#{{ task.companyId }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Type</span>
                  <span class="value">{{ task.type === 'online' ? 'Online' : 'Offline' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Status</span>
                  <span class="value">{{ task.status === 'active' ? 'Active' : 'Closed' }}</span>
                </div>
              </div>
            </div>

            <!-- Tips Card -->
            <div class="card tips">
              <h3>Tips</h3>
              <ul>
                <li v-if="canApply && !applied">
                  Make sure your resume is up to date before applying
                </li>
                <li v-if="canApply && !applied">
                  Read the internship requirements carefully
                </li>
                <li v-if="applied">
                  Check the status in “My applications”
                </li>
                <li v-if="isCompanyOrAdmin">
                  Keep the internship status updated
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasksStore'
import { useAuthStore } from '@/stores/authStore'
import { useApplicationsStore } from '@/stores/applicationsStore'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const authStore = useAuthStore()
const appsStore = useApplicationsStore()

const task = computed(() => tasksStore.current)
const loading = computed(() => tasksStore.loading)
const error = computed(() => tasksStore.error)
const message = ref('')
const isCompanyOrAdmin = computed(
  () => authStore.user?.role === 'company' || authStore.user?.role === 'admin'
)
const canApply = computed(
  () =>
    authStore.isAuthenticated &&
    authStore.user?.role === 'student' &&
    !!task.value
)
const applied = computed(() =>
  appsStore.list.some(
    (a) =>
      String(a.internshipId) === String(route.params.id) &&
      String(a.studentId) === String(authStore.user?.id)
  )
)
const appliedStatus = computed(() => {
  const found = appsStore.list.find(
    (a) =>
      String(a.internshipId) === String(route.params.id) &&
      String(a.studentId) === String(authStore.user?.id)
  )
  return found?.status
})
const local = reactive({
  title: '',
  companyName: '',
  location: '',
  description: '',
  status: 'active',
  type: 'online',
})

const syncLocal = () => {
  if (!task.value) return
  local.title = task.value.title || ''
  local.companyName = task.value.companyName || ''
  local.location = task.value.location || ''
  local.description = task.value.description || ''
  local.status = task.value.status || 'active'
  local.type = task.value.type || 'online'
}

const save = async () => {
  message.value = ''
  await tasksStore.update(route.params.id, { ...local })
  message.value = 'Saved'
}

const apply = () => {
  if (!canApply.value || !task.value) return
  appsStore.create({ internship: task.value })
  message.value = 'Application submitted'
  router.push('/applications')
}

const back = () => router.back()

const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

onMounted(async () => {
  if (!authStore.isAuthenticated) authStore.loadFromStorage()
  appsStore.loadFromStorage()
  await tasksStore.loadById(route.params.id)
  syncLocal()
})

watch(task, syncLocal)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.detail-page {
  min-height: 100vh;
  background: #fafafa;
  padding: 30px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 5rem 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 0.95rem;
}

/* Not Found */
.not-found {
  text-align: center;
  padding: 5rem 1rem;
  background: white;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
}

.not-found-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  color: #999;
}

.not-found-icon svg {
  width: 100%;
  height: 100%;
}

.not-found h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 0.5rem;
}

.not-found p {
  color: #666;
  margin: 0 0 2rem;
}

/* Header */
.header {
  margin-bottom: 0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  position: absolute;
  left: 10px;
  gap: 0.5rem;
  padding: 0.4rem .8rem;
  background: rgb(255, 255, 255);
  border: none;
  border-radius: 4px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin: 5px 0 0px 20px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
}

.content {
  padding-top: 0;
}


.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.title-section h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 1.5rem;
  line-height: 1.2;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;
}

.separator {
  color: #ccc;
}

.badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge.active {
  background: #dcfce7;
  color: #166534;
}

.badge.closed {
  background: #fee;
  color: #991b1b;
}

.badge.online {
  background: #dbeafe;
  color: #1e40af;
}

.badge.offline {
  background: #f3e8ff;
  color: #6b21a8;
}

/* Status Banner */
.status-banner {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
}

.status-banner.accepted {
  background: #f0fdf4;
  border-color: #86efac;
}

.status-banner.rejected {
  background: #fef2f2;
  border-color: #fca5a5;
}

.status-banner.pending {
  background: #fffbeb;
  border-color: #fde68a;
}

.status-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.status-banner.accepted .status-icon {
  color: #16a34a;
}

.status-banner.rejected .status-icon {
  color: #dc2626;
}

.status-banner.pending .status-icon {
  color: #d97706;
}

.status-text h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.status-banner.accepted .status-text h4 {
  color: #166534;
}

.status-banner.rejected .status-text h4 {
  color: #991b1b;
}

.status-banner.pending .status-text h4 {
  color: #92400e;
}

.status-text p {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.85;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 0;
  align-items: start;
}

/* Form */
.main-content {
  background: white;
  border-radius: 0;
  padding: 2rem;
  border: 1px solid #e0e0e0;
}

.form-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.req {
  color: #dc2626;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: #2563eb;
}

.field input:disabled,
.field textarea:disabled,
.field select:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.field textarea {
  resize: vertical;
  line-height: 1.5;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Actions */
.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.btn-primary,
.btn-secondary,
.btn-apply {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4caf4f;
  color: white;
  padding: 0.55rem 1.1rem;
  border-radius: 4px;
}

.btn-primary:hover:not(:disabled) {
  background: #43a047;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-apply {
  background: #10b981;
  color: white;
}

.btn-apply:hover:not(:disabled) {
  background: #059669;
}

.btn-primary:disabled,
.btn-apply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Messages */
.msg {
  padding: 0.85rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.msg.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.msg.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.card {
  background: white;
  border-radius: 0;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
}

.card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 1rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 0.85rem;
  color: #666;
}

.value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111;
}

.tips ul {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tips li {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #555;
}

/* Responsive */
@media (max-width: 968px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }
}

@media (max-width: 640px) {
  .detail-page {
    padding: 1rem 0.75rem;
  }

  .main-content {
    padding: 1.5rem;
  }

  .title-section h1 {
    font-size: 1.5rem;
  }

  .header-content {
    flex-direction: column;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-apply {
    width: 100%;
  }
}
</style>