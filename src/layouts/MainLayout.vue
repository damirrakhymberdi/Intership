<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <router-link to="/" class="brand">
            <span class="brand-text">Internship Portal</span>
          </router-link>

          <!-- Navigation -->
          <nav class="nav">
            <router-link to="/items" class="nav-link">Internships</router-link>
            <router-link v-if="isStudent" to="/applications" class="nav-link">My applications</router-link>
            <router-link v-if="isCompany" to="/applications/company" class="nav-link">Applications</router-link>
            <router-link v-if="isAuth" to="/profile" class="nav-link">Profile</router-link>
            <router-link v-if="isAdmin" to="/admin" class="nav-link admin">Admin</router-link>
          </nav>

          <!-- Actions -->
          <div class="actions">
            <router-link v-if="!isAuth" to="/login" class="btn-login">
              Sign in
            </router-link>
            <div v-else class="user-menu">
              <button @click="toggleMenu" class="user-btn">
                <div class="user-domain">{{ auth.user?.email || 'user@example.com' }}</div>
                <svg class="chevron" :class="{ open: menuOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              <div v-if="menuOpen" class="dropdown">
                <div class="dropdown-header">
                  <div class="user-name">{{ auth.user?.email }}</div>
                  <div class="user-role">{{ getRoleText(auth.user?.role) }}</div>
                </div>
                <div class="dropdown-divider"></div>
                <router-link to="/profile" class="dropdown-item" @click="menuOpen = false">
                  Profile
                </router-link>
                <button @click="logout" class="dropdown-item logout">
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="mobile-menu">
          <router-link to="/items" class="mobile-link" @click="closeMobileMenu">Internships</router-link>
          <router-link v-if="isStudent" to="/applications" class="mobile-link" @click="closeMobileMenu">My applications</router-link>
          <router-link v-if="isCompany" to="/applications/company" class="mobile-link" @click="closeMobileMenu">Applications</router-link>
          <router-link v-if="isAuth" to="/profile" class="mobile-link" @click="closeMobileMenu">Profile</router-link>
          <router-link v-if="isAdmin" to="/admin" class="mobile-link admin" @click="closeMobileMenu">Admin</router-link>
        </div>
      </div>
    </header>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const menuOpen = ref(false)
const mobileMenuOpen = ref(false)

const isAuth = computed(() => auth.isAuthenticated)
const isAdmin = computed(() => auth.isAdmin)
const isCompany = computed(() => auth.isCompany)
const isStudent = computed(() => auth.user?.role === 'student')

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const logout = () => {
  menuOpen.value = false
  auth.logout()
  router.push('/login')
}

const getRoleText = (role) => {
  const roles = {
    student: 'Student',
    company: 'Company',
    admin: 'Admin'
  }
  return roles[role] || role
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #e5e5e5;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.5rem 0;
}

/* Brand */
.brand {
  text-decoration: none;
  color: #111;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4caf4f;
}

/* Navigation */
.nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.nav-link {
  padding: 0.3rem 1.1rem;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: #4caf4f;
  background: #f5f5f5;
}

.nav-link.router-link-active {
  color: #4caf4f;
  background: #e8f5e9;
}

.nav-link.admin {
  color: #dc2626;
}

.nav-link.admin:hover {
  background: #fef2f2;
}

.nav-link.admin.router-link-active {
  background: #fef2f2;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
}

.btn-login {
  padding: 0.6rem 1.5rem;
  background: #4caf4f;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-login:hover {
  background: #43a047;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.6rem 0.35rem 0.35rem;
  background: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-btn:hover {
  border-color: #d1d5db;
  background: #fafafa;
}

.user-domain {
  padding: 0.35rem 0.6rem;
  color: #2e7d32;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  width: 14px;
  height: 14px;
  color: #666;
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  animation: dropdownFade 0.2s ease;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 0.85rem 1rem;
  background: #fafafa;
  border-bottom: 1px solid #e5e5e5;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  font-size: 0.8rem;
  color: #666;
}

.dropdown-divider {
  height: 1px;
  background: #e5e5e5;
}

.dropdown-item {
  width: 100%;
  display: block;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  text-decoration: none;
}

.dropdown-item:hover {
  background: #f5f5f5;
  color: #111;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  background: #fafafa;
}

.mobile-menu-btn svg {
  width: 20px;
  height: 20px;
  color: #333;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  border-top: 1px solid #e5e5e5;
  animation: mobileMenuSlide 0.2s ease;
}

@keyframes mobileMenuSlide {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

.mobile-link {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.mobile-link:hover {
  color: #4caf4f;
  background: #f5f5f5;
}

.mobile-link.router-link-active {
  color: #4caf4f;
  background: #e8f5e9;
}

.mobile-link.admin {
  color: #dc2626;
}

.mobile-link.admin:hover {
  background: #fef2f2;
}

/* Main Content */
main {
  flex: 1;
}

/* Responsive */
@media (max-width: 968px) {
  .header-content {
    gap: 1rem;
  }

  .nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  .brand-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 1rem;
  }

  .btn-login {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .dropdown {
    right: -0.5rem;
  }
}
</style>