import { defineStore } from 'pinia'
import { loginRequest } from '@/api/auth'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        loading: false,
        error: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        isAdmin: (state) => state.user?.role === 'admin',
        isCompany: (state) => state.user?.role === 'company',
    },
    actions: {
        loadFromStorage() {
            const token = localStorage.getItem(TOKEN_KEY)
            const userRaw = localStorage.getItem(USER_KEY)
            if (token && userRaw) {
                try {
                    this.token = token
                    this.user = JSON.parse(userRaw)
                } catch (e) {
                    this.resetStorage()
                }
            }
        },
        async login(email, password) {
            this.loading = true
            this.error = null
            try {
                const { token, user } = await loginRequest(email, password)
                this.token = token
                this.user = user
                localStorage.setItem(TOKEN_KEY, token)
                localStorage.setItem(USER_KEY, JSON.stringify(user))
            } catch (e) {
                this.error = e?.message || 'Ошибка входа'
                this.resetStorage()
                throw e
            } finally {
                this.loading = false
            }
        },
        logout() {
            this.reset()
            this.resetStorage()
        },
        reset() {
            this.user = null
            this.token = null
            this.loading = false
            this.error = null
        },
        resetStorage() {
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
        },
    },
})

