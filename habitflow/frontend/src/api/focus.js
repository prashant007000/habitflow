import api from './axios.js'

export const getFocusSessions = () => api.get('/focus-sessions').then((r) => r.data)
export const createFocusSession = (data) => api.post('/focus-sessions', data).then((r) => r.data)
