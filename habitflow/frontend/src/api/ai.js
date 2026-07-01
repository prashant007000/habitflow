import api from './axios.js'

export const getAiRecommendations = (goal) =>
  api.post('/ai/recommendations', { goal }).then((r) => r.data)
export const getWeeklySummary = () => api.get('/ai/weekly-summary').then((r) => r.data)
