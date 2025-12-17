import api from './axios'

// Используем ресурс internships
export const fetchTasks = async (params = {}) => {
  const { data } = await api.get('/interships', { params })
  return data
}

export const fetchTaskById = async (id) => {
  const { data } = await api.get(`/interships/${id}`)
  return data
}

export const createTask = async (payload) => {
  const { data } = await api.post('/interships', payload)
  return data
}

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/interships/${id}`, payload)
  return data
}

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/interships/${id}`)
  return data
}


