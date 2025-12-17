<template>
  <div class="page">
    <div class="container">
      <div class="header">
        <h1>Админ панель</h1>
        <div class="toolbar">
          <button @click="refresh" :disabled="loading" class="btn-refresh">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Жаңарту
          </button>
          <span v-if="loading" class="status loading">Жүктелуде...</span>
          <span v-if="message" class="status success">{{ message }}</span>
          <span v-if="error" class="status error">{{ error }}</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Атауы</th>
              <th>Компания</th>
              <th>Түрі</th>
              <th>Статус</th>
              <th>Компания ID</th>
              <th>Әрекеттер</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tasks" :key="item.id">
              <td><span class="id">#{{ item.id }}</span></td>
              <td class="title">{{ item.title }}</td>
              <td>{{ item.companyName }}</td>
              <td>
                <span :class="['badge', item.type]">
                  {{ item.type === 'online' ? 'Онлайн' : 'Оффлайн' }}
                </span>
              </td>
              <td>
                <span :class="['badge', item.status]">
                  {{ item.status === 'active' ? 'Белсенді' : 'Жабық' }}
                </span>
              </td>
              <td>#{{ item.companyId }}</td>
              <td class="actions">
                <button @click="open(item.id)" class="btn-open">Ашу</button>
                <button @click="remove(item.id)" :disabled="loading" class="btn-delete">
                  Жою
                </button>
              </td>
            </tr>
            <tr v-if="!loading && tasks.length === 0">
              <td colspan="7" class="empty">Жазбалар жоқ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasksStore'
import { useAuthStore } from '@/stores/authStore'

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const router = useRouter()

const tasks = computed(() => tasksStore.list)
const loading = computed(() => tasksStore.loading)
const error = computed(() => tasksStore.error)
const message = ref('')

const refresh = async () => {
  message.value = ''
  await tasksStore.loadList()
  message.value = 'Жаңартылды'
}

const remove = async (id) => {
  if (!confirm('Жазбаны жою керек пе?')) return
  await tasksStore.remove(id)
  message.value = 'Жойылды'
}

const open = (id) => router.push(`/items/${id}`)

onMounted(() => {
  if (!authStore.isAuthenticated) authStore.loadFromStorage()
  tasksStore.loadList()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #fafafa;
  padding: 2rem 1rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-refresh svg {
  width: 16px;
  height: 16px;
}

.status {
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status.loading {
  background: #f0f0f0;
  color: #666;
}

.status.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.status.error {
  background: #ffebee;
  color: #c62828;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #e5e5e5;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
  color: #333;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #fafafa;
}

.id {
  color: #2563eb;
  font-weight: 500;
}

.title {
  font-weight: 500;
  color: #111;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.online {
  background: #dbeafe;
  color: #1e40af;
}

.badge.offline {
  background: #f3e8ff;
  color: #6b21a8;
}

.badge.active {
  background: #dcfce7;
  color: #166534;
}

.badge.closed {
  background: #fee;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-open,
.btn-delete {
  padding: 0.45rem 0.85rem;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-open {
  background: #2563eb;
  color: white;
}

.btn-open:hover {
  background: #1d4ed8;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background: #dc2626;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty {
  text-align: center;
  color: #666;
  padding: 2rem;
}

@media (max-width: 1200px) {
  .table-wrapper {
    overflow-x: auto;
  }

  table {
    min-width: 1000px;
  }
}

@media (max-width: 640px) {
  .page {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  h1 {
    font-size: 1.5rem;
  }

  th, td {
    padding: 0.65rem;
    font-size: 0.85rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-open,
  .btn-delete {
    width: 100%;
  }
}
</style>