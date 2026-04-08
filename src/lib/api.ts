import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',   // Vite dev server proxies /api → http://localhost:4000/api
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cd_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear stored credentials and redirect to login
// BUT skip this for auth endpoints themselves (login/signup) so their
// error messages can reach the component catch blocks
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url: string = err.config?.url ?? ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/signup')
    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('cd_token')
      localStorage.removeItem('cd_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
