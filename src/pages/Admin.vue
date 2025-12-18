<template>
  <div class="page">
    <div class="container">
      

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Company</th>
              <th>Type</th>
              <th>Status</th>
              <th>Company ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tasks" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.companyName }}</td>
              <td>{{ item.type === 'online' ? 'Online' : 'Offline' }}</td>
              <td>
                <span :class="['status-badge', item.status]">
                  {{ item.status === 'active' ? 'Active' : 'Closed' }}
                </span>
              </td>
              <td>{{ item.companyId }}</td>
              <td class="actions">
                <button @click="open(item.id)" class="btn-open">Open</button>
                <button @click="remove(item.id)" :disabled="loading" class="btn-delete">Delete</button>
              </td>
            </tr>
            <tr v-if="!loading && tasks.length === 0">
              <td colspan="7" class="empty">No records found</td>
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
  message.value = 'Refreshed'
}

const remove = async (id) => {
  if (!confirm('Are you sure you want to delete this record?')) return
  await tasksStore.remove(id)
  message.value = 'Deleted successfully'
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
  background: #f5f5f5;
  padding: 15px 0;
}

.container {
  max-width: 1500px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #000;
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
  background: #000;
  color: #fff;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-refresh:hover:not(:disabled) {
  background: #333;
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
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.status.loading {
  background: #e0e0e0;
  color: #666;
}

.status.success {
  background: #22c55e;
  color: #fff;
}

.status.error {
  background: #ef4444;
  color: #fff;
}

.table-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9f9f9;
  border-bottom: 2px solid #ddd;
}

th {
  padding: 1rem;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;
  font-size: 0.9rem;
  color: #000;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #fafafa;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background: #22c55e;
  color: #fff;
}

.status-badge.closed {
  background: #666;
  color: #fff;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-open,
.btn-delete {
  padding: 0.5rem 0.9rem;
  border: 1px solid;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-open {
  background: #fff;
  border-color: #000;
  color: #000;
}

.btn-open:hover {
  background: #000;
  color: #fff;
}

.btn-delete {
  background: #fff;
  border-color: #000;
  color: #000;
}

.btn-delete:hover:not(:disabled) {
  background: #000;
  color: #fff;
}

.btn-delete:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty {
  text-align: center;
  color: #666;
  padding: 2rem;
}

@media (max-width: 1200px) {
  .table-container {
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

  th, td {
    padding: 0.75rem;
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