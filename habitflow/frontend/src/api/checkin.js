import api from './axios.js'

export const upsertCheckIn = (data) => api.post('/checkins', data).then((r) => r.data)
export const getTodayCheckIn = () =>
  api.get('/checkins/today').then((r) => r.data).catch((e) => {
    if (e.response?.status === 204) return null
    throw e
  })
export const getCheckInHistory = () => api.get('/checkins').then((r) => r.data)
