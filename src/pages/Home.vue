<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">Internship & Practice Portal</p>
        <h1>Найди свою практику в лучших компаниях</h1>
        <p class="lead">
          Единая платформа для поиска стажировок и практик. Проверенные работодатели, актуальные предложения, простой отклик.
        </p>
        <div class="actions">
          <button class="btn-primary" @click="goPrimary">{{ ctaLabel }}</button>
          <button v-if="!auth.isAuthenticated" class="btn-secondary" @click="goLogin">
            Войти
          </button>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="stat-item">
        <div class="stat-number">500+</div>
        <div class="stat-label">Студентов</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">150+</div>
        <div class="stat-label">Компаний</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">1000+</div>
        <div class="stat-label">Откликов</div>
      </div>
    </section>

    <section class="problem">
      <div class="section-header">
        <h2>Почему это нужно</h2>
      </div>
      <div class="problem-grid">
        <div class="problem-card">
          <div class="icon-wrapper red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>Практику ищут по чатам и слухам</h3>
        </div>
        <div class="problem-card">
          <div class="icon-wrapper red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>Нет единой базы предложений</h3>
        </div>
        <div class="problem-card">
          <div class="icon-wrapper red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>Трудно понять, где актуально</h3>
        </div>
      </div>

      <div class="section-header solution">
        <h2>Наше решение</h2>
      </div>
      <div class="solution-grid">
        <div class="solution-card">
          <div class="icon-wrapper green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Одна платформа для всех предложений</h3>
        </div>
        <div class="solution-card">
          <div class="icon-wrapper green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Фильтры по типу, статусу, компании</h3>
        </div>
        <div class="solution-card">
          <div class="icon-wrapper green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Простой отклик и контроль заявок</h3>
        </div>
      </div>
    </section>

    <section class="steps">
      <div class="section-header">
        <h2>Как это работает</h2>
        <p>Три простых шага к твоей практике</p>
      </div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Авторизуешься</h3>
          <p>Создай аккаунт за минуту и получи доступ ко всем предложениям</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Выбираешь стажировку</h3>
          <p>Используй фильтры и найди идеальный вариант для себя</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Откликаешься и отслеживаешь статус</h3>
          <p>Отправь заявку одним кликом и следи за откликами</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="cta-content">
        <h2>Готов начать поиск практики?</h2>
        <p>Присоединяйся к сотням студентов, которые уже нашли свою практику</p>
        <button class="btn-cta" @click="goPrimary">Перейти к списку практик</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const ctaLabel = computed(() =>
  auth.isAuthenticated ? 'Открыть практики' : 'Найти практику'
)

const goPrimary = () => {
  if (auth.isAuthenticated) {
    router.push('/items')
  } else {
    router.push('/login')
  }
}

const goLogin = () => router.push('/login')
</script>

<style scoped>
.home {
  width: 100%;
  background: #fff;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 2rem;
  background: linear-gradient(rgba(0, 0, 0, 0.69), rgba(0, 0, 0, 0.542)),
              url('/images/second.webp') center/cover no-repeat;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  color: white;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1.5rem;
}

.highlight {
  color: #4caf4f;
}

.lead {
  font-size: 1.15rem;
  line-height: 1.6;
  margin: 0 0 2rem;
  opacity: 0.95;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4caf4f;
  color: white;
}

.btn-primary:hover {
  background: #43a047;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #4caf4f;
}

/* Stats Section */
.stats {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #4caf4f;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #666;
}

/* Problem & Solution Section */
.problem {
  width: auto;
  padding: 5rem 2rem;
  background: #f9fafb;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.75rem;
}

.section-header p {
  font-size: 1.1rem;
  color: #666;
}

.section-header.solution {
  margin-top: 5rem;
}

.problem-grid,
.solution-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.problem-card,
.solution-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.problem-card:hover,
.solution-card:hover {
  transform: translateY(-4px);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.icon-wrapper svg {
  width: 28px;
  height: 28px;
}

.icon-wrapper.red {
  background: #ffebee;
  color: #f44336;
}

.icon-wrapper.green {
  background: #e8f5e9;
  color: #4caf4f;
}

.problem-card h3,
.solution-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111;
  line-height: 1.4;
}

/* Steps Section */
.steps {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.step-card {
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s;
  position: relative;
}

.step-card::after {
  content: '→';
  position: absolute;
  right: -2rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: #4caf4f;
  font-weight: bold;
}

.step-card:last-child::after {
  display: none;
}

.step-card:hover {
  transform: translateY(-4px);
}

.step-number {
  width: 60px;
  height: 60px;
  background: #4caf4f;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
}

.step-card h3 {
  font-size: 1.35rem;
  font-weight: 600;
  color: #111;
  margin-bottom: 0.75rem;
}

.step-card p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}

/* CTA Section */
.cta {
  width: auto;
  padding: 4rem 0rem;
  background: #111;
  position: relative;
  overflow: hidden;
}

.cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(76, 175, 79, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(76, 175, 79, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.cta-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%);
  pointer-events: none;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(76, 175, 79, 0.15);
  border: 1px solid rgba(76, 175, 79, 0.3);
  border-radius: 50px;
  color: #4caf4f;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}

.cta h2 {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: white;
  line-height: 1;
}

.highlight-text {
  color: #4caf4f;
  position: relative;
}

.cta p {
  font-size: 1.15rem;
  margin-bottom: 1.5rem;
  color: #aaa;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 2.5rem;
  background: #ffffff;
  color: rgb(0, 0, 0);
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(255, 255, 255, 0.4);
}

.btn-cta:hover {
  background: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(60, 60, 60, 0.5);
}

.btn-cta svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.btn-cta:hover svg {
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 968px) {
  .hero h1 {
    font-size: 2.25rem;
  }

  .stats,
  .problem-grid,
  .solution-grid,
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .step-card::after {
    display: none;
  }

  .section-header h2,
  .cta h2 {
    font-size: 2rem;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 500px;
    padding: 3rem 1rem;
  }

  .hero h1 {
    font-size: 1.75rem;
  }

  .lead {
    font-size: 1rem;
  }

  .stats,
  .problem,
  .steps {
    padding: 3rem 1rem;
  }

  .cta {
    padding: 4rem 1.5rem;
  }

  .cta h2 {
    font-size: 1.85rem;
  }

  .cta p {
    font-size: 1rem;
  }

  .btn-cta {
    padding: 0.9rem 1.8rem;
    font-size: 0.95rem;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }
}
</style>