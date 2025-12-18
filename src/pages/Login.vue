<template>
  <div class="login-container">
    <!-- Сол жақ - Дизайн бөлімі -->
    <div class="left-section">
      <div class="design-content">
        <img 
          :src="leftImage"
          @error="onLeftImageError"
          alt="Design workspace" 
          class="design-image"
        />
      </div>
    </div>

    <!-- Оң жақ - Login форма -->
    <div class="right-section">
      <div class="login-card">
        <div class="welcome-title">
          <h1>Login</h1>
        </div>

        <form @submit.prevent="onSubmit" class="form">
          <div class="field">
            <label>Email Address</label>
            <input
              v-model="email"
              type="email"
              placeholder="your.email@example.com"
              required
              autofocus
            />
          </div>

          <div class="field">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="loading" class="loader"></span>
            <span v-else>Sign in</span>
          </button>

          <transition name="error-fade">
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </transition>
        </form>

        <div class="signup-link">
          Not registered yet?
          <button class="link-btn" type="button" @click="openRegister">Sign up</button>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <transition name="modal-fade">
      <div v-if="registerOpen" class="modal-backdrop" @click.self="closeRegister">
        <div class="modal">
          <div class="modal-header">
            <h2>Sign up</h2>
            <button class="modal-close" type="button" @click="closeRegister" aria-label="Close">×</button>
          </div>

          <form class="modal-form" @submit.prevent="onRegister">
            <div class="field">
              <label>Email Address</label>
              <input v-model="regEmail" type="email" placeholder="you@gmail.com" required autocomplete="email" />
            </div>

            <div class="field">
              <label>Create password</label>
              <input
                v-model="regPassword"
                type="password"
                placeholder="••••••••"
                required
                minlength="6"
                autocomplete="new-password"
              />
            </div>

            <button type="submit" :disabled="regLoading" class="submit-btn">
              <span v-if="regLoading" class="loader"></span>
              <span v-else>Create account</span>
            </button>

            <transition name="error-fade">
              <div v-if="regError" class="error-message">
                {{ regError }}
              </div>
            </transition>

            <div class="switch-auth">
              Already registered?
              <button class="link-btn" type="button" @click="closeRegister">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

// Put your desired image here: src/assets/login-left.jpg
const leftImage = ref(new URL('../assets/login-left.jpg', import.meta.url).href)
const onLeftImageError = () => {
  leftImage.value = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=900&fit=crop'
}

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const registerOpen = ref(false)
const regEmail = ref('')
const regPassword = ref('')
const regLoading = ref(false)
const regError = ref(null)

const onSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    await auth.login(email.value, password.value)
    router.push('/items')
  } catch (e) {
    error.value = e?.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}

const openRegister = () => {
  regError.value = null
  regEmail.value = email.value || ''
  regPassword.value = ''
  registerOpen.value = true
}

const closeRegister = () => {
  registerOpen.value = false
}

const onRegister = async () => {
  regLoading.value = true
  regError.value = null
  try {
    await auth.register(regEmail.value, regPassword.value)
    closeRegister()
    router.push('/items')
  } catch (e) {
    regError.value = e?.message || 'Registration failed'
  } finally {
    regLoading.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Сол жақ - Дизайн бөлімі */
.left-section {
  flex: 0 0 40%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.left-section::before {
  content: none;
}

@keyframes wave {
  0% { transform: translateX(0) translateY(0); }
  100% { transform: translateX(-50px) translateY(-50px); }
}

.design-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  max-width: none;
  width: 100%;
  height: 100%;
}

.design-image {
  width: 100%;
  max-width: none;
  height: 100%;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 0;
  object-fit: cover;
}

.design-content h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.design-content p {
  font-size: 18px;
  opacity: 0.95;
  line-height: 1.6;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Оң жақ - Login форма */
.right-section {
  flex: 0 0 60%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo h2 {
  font-size: 28px;
  color: #4caf4f;
  font-weight: 700;
  margin-bottom: 8px;
}

.logo-subtitle {
  font-size: 14px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.welcome-title {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-title h1 {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-weight: 700;
}

.welcome-subtitle {
  color: #666;
  font-size: 15px;
}

.form {
  display: grid;
  gap: 24px;
}

.field {
  display: grid;
  gap: 8px;
}

label {
  display: block;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
}

input:focus {
  border-color: #4caf4f;
  box-shadow: 0 0 0 4px rgba(76, 175, 79, 0.16);
}

input::placeholder {
  color: #aaa;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4caf4f 0%, #2e7d32 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 79, 0.35);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loader {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.signup-link {
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;
}

.link-btn {
  background: none;
  border: none;
  padding: 0;
  margin-left: 6px;
  color: #2e7d32;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.3s;
  cursor: pointer;
}

.link-btn:hover {
  color: #1b5e20;
  text-decoration: underline;
}

/* Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 200;
}

.modal {
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #eeeeee;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #111;
}

.modal-close {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: #111;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-form {
  padding: 18px;
  display: grid;
  gap: 16px;
}

.switch-auth {
  text-align: center;
  color: #666;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 968px) {
  .login-container {
    flex-direction: column;
  }

  .left-section {
    min-height: 300px;
    padding: 0;
    flex: 0 0 auto;
  }

  .design-image {
    max-width: none;
  }

  .design-content h1 {
    font-size: 28px;
  }

  .design-content p {
    font-size: 16px;
  }

  .right-section {
    padding: 30px 20px;
    flex: 0 0 auto;
  }

  .welcome-title h1 {
    font-size: 26px;
  }
}

@media (max-width: 480px) {
  .logo h2 {
    font-size: 24px;
  }

  .welcome-title h1 {
    font-size: 24px;
  }

  input {
    padding: 12px 14px;
  }

  .submit-btn {
    padding: 14px;
  }
}
</style>