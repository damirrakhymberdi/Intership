import { defineStore } from 'pinia'
import { loginRequest, registerRequest, updateUserRequest } from '@/api/auth'

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
        async register(email, password) {
            this.loading = true
            this.error = null
            try {
                const { token, user } = await registerRequest(email, password)
                this.token = token
                this.user = user
                localStorage.setItem(TOKEN_KEY, token)
                localStorage.setItem(USER_KEY, JSON.stringify(user))
            } catch (e) {
                this.error = e?.message || 'Registration error'
                this.resetStorage()
                throw e
            } finally {
                this.loading = false
            }
        },
        async updateProfile(patch) {
            if (!this.user) return

            const incoming = { ...(patch || {}) }

            // never allow changing email/password from profile editor
            if ('email' in incoming) delete incoming.email
            if ('password' in incoming) delete incoming.password

            // role can be changed only by admin user
            if ('role' in incoming && this.user?.role !== 'admin') {
                delete incoming.role
            }

            // if next role is student, remove companyName
            const nextRole = incoming.role || this.user?.role
            if (nextRole === 'student') {
                if ('companyName' in incoming) delete incoming.companyName
            }

            // do not send undefined values to API
            const payload = Object.fromEntries(
                Object.entries(incoming).filter(([, v]) => v !== undefined)
            )

            // Persist to MockAPI
            const updated = await updateUserRequest(this.user.id, payload)

            // Ensure email never changes locally even if API returns something odd
            updated.email = this.user.email
            if ('password' in updated) delete updated.password

            this.user = updated
            localStorage.setItem(USER_KEY, JSON.stringify(updated))
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

