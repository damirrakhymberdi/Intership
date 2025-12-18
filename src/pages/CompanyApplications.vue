<template>
  <div class="page">
    <div class="container">
      <h1>Applications for my internships</h1>
      
      <div v-if="apps.length === 0" class="empty">
        No applications yet
      </div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Internship</th>
              <th>Student</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in apps" :key="app.id">
              <td>{{ app.internshipTitle }}</td>
              <td>
                <button
                  class="student-link"
                  type="button"
                  @click="openStudent(app.studentId)"
                >
                  {{ app.studentName }}
                </button>
              </td>
              <td>
                <span :class="['status', app.status]">
                  {{ getStatusText(app.status) }}
                </span>
              </td>
              <td>{{ formatDate(app.createdAt) }}</td>
              <td>
                <button @click="setStatus(app.id, 'accepted')" class="btn btn-accept">
                  Accept
                </button>
                <button @click="setStatus(app.id, 'rejected')" class="btn btn-reject">
                  Reject
                </button>
                <button @click="setStatus(app.id, 'pending')" class="btn btn-pending">
                  Pending
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicationsStore } from '@/stores/applicationsStore'
import { useAuthStore } from '@/stores/authStore'

const appsStore = useApplicationsStore()
const auth = useAuthStore()
const router = useRouter()

const apps = computed(() =>
  appsStore.list.filter(
    (a) =>
      String(a.internshipCompanyId) === String(auth.user?.id) &&
      a.status !== 'rejected'
  )
)

const setStatus = (id, status) => {
  appsStore.updateStatus(id, status)
}

const openStudent = (studentId) => {
  if (!studentId) return
  router.push(`/students/${studentId}`)
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected'
  }
  return texts[status] || status
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US')
}

onMounted(() => {
  if (!auth.isAuthenticated) auth.loadFromStorage()
  appsStore.loadFromStorage()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  padding: 0px;
}

.container {
  max-width: 100%;
  margin: 0 auto;
  background: white;
  padding: 20px 0px 0px 0px;
  border-radius: 4px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-left: 10px;

}

.empty {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

thead {
  background: #f9f9f9;
}

th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
  border-right: 1px solid #e0e0e0;
  font-size: 14px;
}

td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  font-size: 14px;
  color: #444;
}

.student-link {
  background: transparent;
  border: none;
  padding: 0;
  color: #2e7d32;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.student-link:hover {
  color: #1b5e20;
}

th:last-child,
td:last-child {
  border-right: none;
}

tbody tr:last-child td {
  border-bottom: none;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.status.pending {
  background: #fff4e6;
  color: #e67700;
  border: 1px solid rgba(227, 225, 222, 0.45);
}

.status.accepted {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid rgba(215, 223, 215, 0.45);
}

.status.rejected {
  background: #ffebee;
  color: #c62828;
  border: 1px solid rgba(213, 207, 206, 0.45);
}

.btn {
  padding: 0.35rem 1.1rem;
  margin-right: 6px;
  border: none;
  background: #ffffff;
  color: #333;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease,
    border-color 0.2s ease;
  box-shadow: 0 2px 8px rgba(85, 85, 85, 0.08);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-accept {
  color: #2e7d32;
  border-color: rgba(76, 175, 80, 0.55);
  background: #e8f5e9;
}

.btn-accept:hover {
  background: #dff3e2;
}

.btn-reject {
  color: #c62828;
  border-color: rgba(244, 67, 54, 0.55);
  background: #ffebee;
}

.btn-reject:hover {
  background: #ffe1e6;
}

.btn-pending {
  color: #e67700;
  border-color: rgba(255, 152, 0, 0.55);
  background: #fff4e6;
}

.btn-pending:hover {
  background: #ffedd6;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  h1 {
    font-size: 20px;
  }

  th, td {
    padding: 8px;
    font-size: 13px;
  }

  .btn {
    padding: 5px 10px;
    font-size: 12px;
    margin-bottom: 4px;
  }
}
</style>