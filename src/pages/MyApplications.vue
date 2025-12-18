<template>
    <div class="page">
      <div class="container">
        <div class="header">
          <h1>My applications</h1>

          <div v-if="myAppsAll.length" class="header-actions">
            
          </div>
        </div>
        
        <div v-if="apps.length === 0" class="empty">
          No applications yet
        </div>
  
        <div v-else class="list">
          <div v-for="app in apps" :key="app.id" class="card">
            <div class="card-header">
              <h3>{{ app.internshipTitle }}</h3>
              <div class="card-header-right">
                <span :class="['status', app.status]">
                  {{ statusLabel(app.status) }}
                </span>
                <button class="btn-remove" type="button" @click="removeApp(app.id)">
                  Delete
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="info">
                <span class="label">Company:</span>
                <span class="value">{{ app.internshipCompanyName }}</span>
              </div>
              <div class="info">
                <span class="label">Sent date:</span>
                <span class="value">{{ formatDate(app.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useApplicationsStore } from '@/stores/applicationsStore'
  import { useAuthStore } from '@/stores/authStore'
  
  const appsStore = useApplicationsStore()
  const auth = useAuthStore()
  
  const showRejected = ref(false)

  const myAppsAll = computed(() =>
    appsStore.list.filter((a) => String(a.studentId) === String(auth.user?.id))
  )

  const apps = computed(() => {
    const list = myAppsAll.value
    if (showRejected.value) return list
    return list.filter((a) => a.status !== 'rejected')
  })
  
  const statusLabel = (s) => {
    if (s === 'accepted') return 'Accepted'
    if (s === 'rejected') return 'Rejected'
    return 'Pending'
  }
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US')
  }

  const removeApp = (id) => {
    if (!confirm('Delete this application?')) return
    appsStore.removeForStudent(id, auth.user?.id)
  }

  const clearRejected = () => {
    if (!confirm('Remove all rejected applications?')) return
    appsStore.clearForStudent(auth.user?.id, { status: 'rejected' })
  }

  const clearAll = () => {
    if (!confirm('Remove ALL your applications?')) return
    appsStore.clearForStudent(auth.user?.id)
  }
  
  onMounted(() => {
    if (!auth.isAuthenticated) auth.loadFromStorage()
    appsStore.loadFromStorage()
  })
  </script>
  
  <style scoped>
  .page {
    min-height: 100vh;
    background: #f8f8f8;
    padding: 2rem 1rem;
  }
  
  .container {
    max-width: 1100px;
    margin: 0 auto;
    

  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin: 0 0 1.5rem;
  }
  
  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #111;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #444;
    font-weight: 600;
    user-select: none;
  }

  .toggle input {
    width: 16px;
    height: 16px;
    accent-color: #4caf4f;
  }

  .btn-clear {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    background: #e8f5e9;
    color: #2e7d32;
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
    box-shadow: 0 2px 8px rgba(85, 85, 85, 0.08);
  }

  .btn-clear:hover {
    transform: translateY(-1px);
  }

  .btn-clear.danger {
    background: #ffebee;
    color: #c62828;
  }
  
  .empty {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 10px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30vh;
    box-shadow: 0 1px 10px rgba(105, 105, 105, 0.129);
    color: #666;
  }
  
  .list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: .5rem;
  }
  
  .card {
    background: white;
    border: none;
    border-radius: 5px;
    padding: 1.5rem;
    transition: border-color 0.2s;

  }
  
  .card:hover {
    border-color: #d1d5db;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .card-header-right {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .btn-remove {
    padding: 7px 10px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    background: #ffebee;
    color: #c62828;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 2px 8px rgba(85, 85, 85, 0.08);
  }

  .btn-remove:hover {
    transform: translateY(-1px);
  }
  
  .card-header h3 {
    font-size: 1.15rem;
    font-weight: 600;
    color: #111;
    margin: 0;
    line-height: 1.4;
  }
  
  .status {
    display: inline-block;
    padding: 0.35rem 0.8rem;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .status.accepted {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .status.rejected {
    background: #ffebee;
    color: #c62828;
  }
  
  .status.pending {
    background: #f5f5f5;
    color: #666;
  }
  
  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .label {
    font-size: 0.9rem;
    color: #666;
  }
  
  .value {
    font-size: 0.9rem;
    font-weight: 500;
    color: #111;
  }
  
  @media (max-width: 640px) {
    .list {
      grid-template-columns: 1fr;
    }

    .page {
      padding: 1rem;
    }
  
    h1 {
      font-size: 1.5rem;
    }
  
    .card {
      padding: 1.25rem;
    }
  
    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .header {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .info {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }
  </style>