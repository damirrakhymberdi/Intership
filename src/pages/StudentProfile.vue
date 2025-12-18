<template>
  <div class="page">
    <div class="container">
      <button class="back-btn" type="button" @click="goBack">Back</button>

      <div v-if="loading" class="state">Loading student profile...</div>
      <div v-else-if="error" class="state error">{{ error }}</div>
      <div v-else-if="!student" class="state">Student not found</div>

      <div v-else class="content">
        <div class="card left">
          <div class="avatar">
            <img v-if="student.avatar" :src="student.avatar" alt="avatar" />
            <div v-else class="placeholder">
              {{ student?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
          </div>
          <h2 class="name">{{ student.name || 'Student' }}</h2>
          <div class="role">{{ roleName(student.role) }}</div>
        </div>

        <div class="card right">
          <h3>Profile</h3>

          <div class="row">
            <div class="label">Email</div>
            <div class="value">{{ student.email || '-' }}</div>
          </div>

          <div class="row">
            <div class="label">User ID</div>
            <div class="value">#{{ student.id || '-' }}</div>
          </div>

          <div class="row">
            <div class="label">Description</div>
            <div class="value description">
              {{ student?.description?.trim() ? student.description : 'No description.' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { fetchUserById } from '@/api/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const error = ref('')
const student = ref(null)

const id = computed(() => route.params.id)

const roleName = (role) => {
  if (role === 'student') return 'Student'
  if (role === 'company') return 'Company'
  if (role === 'admin') return 'Admin'
  return role || '-'
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const u = await fetchUserById(id.value)
    // We only want student profiles on this page
    if (!u || String(u.role || '').toLowerCase() !== 'student') {
      student.value = null
      error.value = 'This profile is not a student.'
      return
    }
    student.value = u
  } catch (e) {
    error.value = e?.message || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  // Prefer returning to the company applications page
  router.push('/applications/company')
}

onMounted(() => {
  if (!auth.isAuthenticated) auth.loadFromStorage()
  load()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f9f9f9;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 10px;
}

.back-btn {
  border: none;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}

.back-btn:hover {
  filter: brightness(0.98);
}

.state {
  margin-top: 16px;
  background: white;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.08);
  color: #444;
  font-weight: 600;
}

.state.error {
  color: #b91c1c;
}

.content {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.08);
}

.left {
  padding: 26px 24px;
  text-align: center;
  height: fit-content;
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 14px;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  display: grid;
  place-items: center;
  font-size: 48px;
  font-weight: 800;
  border: 3px solid #f0f0f0;
}

.name {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111;
}

.role {
  margin: 10px auto 0;
  display: inline-block;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 6px 10px;
  color: #555;
  font-weight: 700;
  font-size: 14px;
}

.right {
  padding: 26px 28px;
}

.right h3 {
  margin: 0 0 18px;
  font-size: 22px;
  font-weight: 800;
  color: #111;
}

.row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.row:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-weight: 700;
  font-size: 15px;
}

.value {
  color: #111;
  font-weight: 700;
  font-size: 15px;
  word-break: break-word;
}

.description {
  white-space: pre-wrap;
  font-weight: 600;
  color: #333;
}

@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>


