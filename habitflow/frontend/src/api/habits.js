import api from './axios.js'

export const getHabits = () => api.get('/habits').then((r) => r.data)
export const createHabit = (data) => api.post('/habits', data).then((r) => r.data)
export const updateHabit = (id, data) => api.put(`/habits/${id}`, data).then((r) => r.data)
export const deleteHabit = (id) => api.delete(`/habits/${id}`).then((r) => r.data)
export const toggleHabit = (id, date) =>
  api.post(`/habits/${id}/toggle`, null, { params: date ? { date } : {} }).then((r) => r.data)
