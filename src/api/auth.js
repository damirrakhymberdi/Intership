import api from './axios'

const makeToken = () =>
  (crypto.randomUUID && crypto.randomUUID()) || `token-${Date.now()}`

// Login via /users (MockAPI), filtered on client
export const loginRequest = async (email, password) => {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const pwd = String(password || '')

  const { data: users } = await api.get('/users')
  const user = users.find(
    (u) =>
      String(u.email || '').trim().toLowerCase() === normalizedEmail &&
      String(u.password || '') === pwd
  )
  if (!user) {
    const error = new Error('Invalid email or password')
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }
  return {
    token: makeToken(),
    user,
  }
}

// Register via /users (MockAPI)
export const registerRequest = async (email, password) => {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const pwd = String(password || '')

  if (!normalizedEmail) {
    const error = new Error('Email is required')
    error.code = 'EMAIL_REQUIRED'
    throw error
  }
  if (pwd.length < 6) {
    const error = new Error('Password must be at least 6 characters')
    error.code = 'WEAK_PASSWORD'
    throw error
  }

  const { data: users } = await api.get('/users')
  const exists = users.some(
    (u) => String(u.email || '').trim().toLowerCase() === normalizedEmail
  )
  if (exists) {
    const error = new Error('Email is already registered')
    error.code = 'EMAIL_EXISTS'
    throw error
  }

  const payload = {
    email: normalizedEmail,
    password: pwd,
    role: 'student',
    name: normalizedEmail.split('@')[0] || 'User',
  }

  const { data: created } = await api.post('/users', payload)

  return {
    token: makeToken(),
    user: created,
  }
}

export const fetchUsers = async () => {
  const { data } = await api.get('/users')
  return data
}
