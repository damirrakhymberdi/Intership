<template>
  <div>
    <h1>Мои стажировки</h1>
    <div style="margin: 12px 0; display:flex; gap:8px; align-items:center;">
      <button @click="refresh" :disabled="loading">Обновить</button>
      <span v-if="loading">Загрузка...</span>
      <span v-if="error" style="color:red">{{ error }}</span>
    </div>
    <ul style="display:grid; gap:12px; padding:0; list-style:none; max-width:720px;">
      <li
        v-for="item in placements"
        :key="item.id"
        style="border:1px solid #ddd; border-radius:6px; padding:12px;"
      >
        <div style="font-weight:600">{{ item.title }}</div>
        <div style="color:#555; margin:6px 0;">{{ item.companyName }} — {{ item.location }}</div>
        <div style="color:#555; margin:4px 0;">{{ item.description }}</div>
        <div style="display:flex; gap:12px; font-size:14px; color:#333;">
          <span>Тип: {{ item.type }}</span>
          <span>Статус: {{ item.status }}</span>
          <span v-if="item.stipend">Стипендия: {{ item.stipend }}</span>
        </div>
      </li>
      <li v-if="!loading && placements.length === 0">Нет стажировок</li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useTasksStore } from '@/stores/tasksStore'
import { useAuthStore } from '@/stores/authStore'

const tasksStore = useTasksStore()
const authStore = useAuthStore()

const placements = computed(() => tasksStore.filteredList)
const loading = computed(() => tasksStore.loading)
const error = computed(() => tasksStore.error)

const refresh = () => tasksStore.loadList()

onMounted(() => {
  if (!authStore.isAuthenticated) authStore.loadFromStorage()
  tasksStore.loadList()
})
</script>