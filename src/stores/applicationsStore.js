import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

const STORAGE_KEY = 'applications'

export const useApplicationsStore = defineStore('applications', {
  state: () => ({
    list: [],
  }),
  actions: {
    loadFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.list = raw ? JSON.parse(raw) : []
      } catch (e) {
        this.list = []
      }
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list))
    },
    ensureLoaded() {
      if (!this.list || this.list.length === 0) this.loadFromStorage()
    },
    create({ internship }) {
      this.ensureLoaded()
      const auth = useAuthStore()
      if (!auth.user) throw new Error('Не авторизован')
      const exists = this.list.find(
        (a) =>
          String(a.internshipId) === String(internship.id) &&
          String(a.studentId) === String(auth.user.id)
      )
      if (exists) return exists
      const item = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
        internshipId: internship.id,
        internshipTitle: internship.title,
        internshipCompanyId: internship.companyId,
        internshipCompanyName: internship.companyName,
        studentId: auth.user.id,
        studentName: auth.user.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      this.list.unshift(item)
      this.persist()
      return item
    },
    updateStatus(id, status) {
      this.ensureLoaded()
      this.list = this.list.map((a) => (a.id === id ? { ...a, status } : a))
      this.persist()
    },
    remove(id) {
      this.ensureLoaded()
      this.list = this.list.filter((a) => a.id !== id)
      this.persist()
    },
    removeForStudent(appId, studentId) {
      this.ensureLoaded()
      this.list = this.list.filter(
        (a) => !(String(a.id) === String(appId) && String(a.studentId) === String(studentId))
      )
      this.persist()
    },
    clearForStudent(studentId, { status } = {}) {
      this.ensureLoaded()
      this.list = this.list.filter((a) => {
        if (String(a.studentId) !== String(studentId)) return true
        if (!status) return false
        return String(a.status) !== String(status)
      })
      this.persist()
    },
  },
})

