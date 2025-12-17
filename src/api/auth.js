import api from './axios'

// Логин через /users (MockAPI), фильтрация на клиенте
export const loginRequest = async (email, password) => {
  const { data: users } = await api.get('/users', { params: { email } })
  const user = users.find((u) => u.password === password)
  if (!user) {
    const error = new Error('Неверный email или пароль')
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }
  return {
    token: (crypto.randomUUID && crypto.randomUUID()) || `token-${Date.now()}`,
    user,
  }
}

export const fetchUsers = async () => {
  const { data } = await api.get('/users')
  return data
}
