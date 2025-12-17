import { defineStore } from 'pinia'
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '@/api/tasks'
import { useAuthStore } from './authStore'

export const useTasksStore = defineStore('placements', {
  state: () => ({
    list: [],
    current: null,
    loading: false,
    error: null,
  }),
  getters: {
    filteredList(state) {
      const auth = useAuthStore()
      if (!auth.isAuthenticated || auth.isAdmin) return state.list
      if (auth.user?.role === 'company') {
        return state.list.filter((t) => String(t.companyId) === String(auth.user?.id))
      }
      // student / user: показываем все
      return state.list
    },
  },
  actions: {
    async loadList(params = {}) {
      this.loading = true
      this.error = null
      try {
        const data = await fetchTasks(params)
        this.list = data
      } catch (e) {
        this.error = e?.message || 'Не удалось загрузить стажировки'
      } finally {
        this.loading = false
      }
    },
    async loadById(id) {
      this.loading = true
      this.error = null
      try {
        this.current = await fetchTaskById(id)
      } catch (e) {
        this.error = e?.message || 'Не удалось загрузить стажировку'
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      this.loading = true
      this.error = null
      try {
        const created = await createTask(payload)
        this.list.unshift(created)
        return created
      } catch (e) {
        this.error = e?.message || 'Не удалось создать стажировку'
        throw e
      } finally {
        this.loading = false
      }
    },
    async update(id, payload) {
      this.loading = true
      this.error = null
      try {
        const updated = await updateTask(id, payload)
        this.list = this.list.map((t) => (t.id === id ? updated : t))
        if (this.current?.id === id) this.current = updated
        return updated
      } catch (e) {
        this.error = e?.message || 'Не удалось обновить стажировку'
        throw e
      } finally {
        this.loading = false
      }
    },
    async remove(id) {
      this.loading = true
      this.error = null
      try {
        await deleteTask(id)
        this.list = this.list.filter((t) => t.id !== id)
      } catch (e) {
        this.error = e?.message || 'Не удалось удалить стажировку'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})

