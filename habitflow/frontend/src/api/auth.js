import api from './axios.js'

export const signup = (data) => api.post('/auth/signup', data).then((r) => r.data)
export const login = (data) => api.post('/auth/login', data).then((r) => r.data)
export const getProfile = () => api.get('/users/me').then((r) => r.data)
