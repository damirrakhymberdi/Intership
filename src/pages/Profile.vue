<template>
  <div class="profile-page">
    <div class="breadcrumb">
      <router-link to="/">Main page</router-link>
      <span>/</span>
      <span>Profile</span>
    </div>

    <div class="profile-container">
      <!-- Сол жақ - профиль карточкасы -->
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar-large">
            <img v-if="user?.avatar" :src="user.avatar" alt="avatar" />
            <div v-else class="placeholder-large">
              {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
          </div>
          <h2>{{ user?.name || 'User' }}</h2>
          <p class="role">{{ getRoleName(user?.role) }}</p>
        </div>

        <div class="social-links">
          <div class="social-item">
            <span class="icon">📧</span>
            <div>
              <div class="label">Email</div>
              <div class="value">{{ user?.email || '-' }}</div>
            </div>
          </div>
         
        </div>
      </div>

      <!-- Оң жақ - ақпарат -->
      <div class="info-section">
        <div class="info-card">
          <div class="info-header">
            <h3>Personal information</h3>
            <div class="info-actions">
              <button v-if="!editing" class="btn-edit" type="button" @click="startEdit">
                Edit profile
              </button>
              <template v-else>
                <button class="btn-save" type="button" @click="saveEdit">Save</button>
                <button class="btn-cancel" type="button" @click="cancelEdit">Cancel</button>
              </template>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-row">
              <span class="label">Full name</span>
              <span class="value">
                <template v-if="editing">
                  <input v-model="draft.name" type="text" placeholder="Full name" />
                </template>
                <template v-else>{{ user?.name || '-' }}</template>
              </span>
            </div>
            <div class="info-row">
              <span class="label">Email</span>
              <span class="value">{{ user?.email || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Role</span>
              <span class="value">
                <template v-if="editing && canEditRole">
                  <select v-model="draft.role">
                    <option value="student">Student</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                  </select>
                </template>
                <template v-else>{{ getRoleName(user?.role) }}</template>
              </span>
            </div>
            <div v-if="showCompanyRow" class="info-row">
              <span class="label">Your company</span>
              <span class="value">
                <template v-if="editing">
                  <input v-model="draft.companyName" type="text" placeholder="Company name" />
                </template>
                <template v-else>{{ user?.companyName || '-' }}</template>
              </span>
            </div>
            <div class="info-row">
              <span class="label">User ID</span>
              <span class="value">#{{ user?.id || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

const user = computed(() => auth.user)
const editing = ref(false)
const draft = reactive({
  name: '',
  role: 'student',
  companyName: '',
})

const syncDraft = () => {
  draft.name = user.value?.name || ''
  draft.role = user.value?.role || 'student'
  draft.companyName = user.value?.companyName || ''
}

const canEditRole = computed(() => user.value?.role === 'admin')

const showCompanyRow = computed(() => {
  // Students never see company field.
  // Company users can edit "Your company".
  // Admin can see it only if they switch role to company (optional).
  const baseRole = user.value?.role
  const role = editing.value && canEditRole.value ? draft.role : baseRole
  return role === 'company'
})

const getRoleName = (role) => {
  const roles = { 
    student: 'Student',
    company: 'Company',
    admin: 'Admin'
  }
  return roles[role] || '-'
}

onMounted(() => {
  if (!auth.isAuthenticated) auth.loadFromStorage()
  syncDraft()
})

watch(user, syncDraft)

watch(
  () => draft.role,
  (r) => {
    if (r === 'student') draft.companyName = ''
  }
)

const startEdit = () => {
  syncDraft()
  editing.value = true
}

const cancelEdit = () => {
  editing.value = false
  syncDraft()
}

const saveEdit = () => {
  const baseRole = user.value?.role || 'student'
  const nextRole = canEditRole.value ? draft.role : baseRole
  const nextCompanyName =
    nextRole === 'company' ? (draft.companyName?.trim() || '') : undefined

  auth.updateProfile({
    name: draft.name?.trim() || 'User',
    ...(canEditRole.value ? { role: nextRole } : {}),
    companyName: nextCompanyName,
  })
  editing.value = false
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.breadcrumb {
  max-width: 1400px;
  margin: 0 auto 20px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #2196f3;
  text-decoration: none;
}

.breadcrumb span {
  margin: 0 8px;
  color: #999;
}

.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 10px;
}

/* Сол жақ профиль карточкасы */
.profile-card {
  background: white;
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: fit-content;
}

.avatar-section {
  text-align: center;
  
  margin-bottom: 3px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-large {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
}

.avatar-large img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.placeholder-large {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 600;
  border: 3px solid #f0f0f0;
}

.avatar-section h2 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.role {
  font-size: 14px;
  color: #666;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 4px;
  display: inline-block;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.social-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 0;
  border-bottom: 1px solid #f5f5f5;
}

.social-item:last-child {
  border-bottom: none;
}

.icon {
  font-size: 22px;
  width: 32px;
  text-align: center;
}

.social-item .label {
  font-size: 12px;
  color: #999;
  margin-bottom: 3px;
}

.social-item .value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  word-break: break-word;
}

/* Оң жақ ақпарат бөлімі */
.info-section {
  display: flex;
  flex-direction: column;
}

.info-card {
  background: white;
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.info-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.info-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.info-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-edit,
.btn-save,
.btn-cancel {
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-edit {
  background: #e8f5e9;
  color: #2e7d32;
}

.btn-save {
  background: #4caf4f;
  color: white;
}

.btn-cancel {
  background: #f3f4f6;
  color: #111;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-row .value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  text-align: right;
}

.info-row .value input,
.info-row .value select {
  width: min(360px, 100%);
  padding: 8px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
}

.info-row .value input:focus,
.info-row .value select:focus {
  border-color: #4caf4f;
  box-shadow: 0 0 0 3px rgba(76, 175, 79, 0.12);
}

@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 15px;
  }

  .profile-card,
  .info-card {
    padding: 20px;
  }

  .avatar-section h2 {
    font-size: 20px;
  }

  .info-card h3 {
    font-size: 18px;
  }
}
</style>