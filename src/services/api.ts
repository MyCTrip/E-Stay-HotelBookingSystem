import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api',
  timeout: 10000,
})

// 响应拦截：统一错误处理
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const { response } = err

    if (response?.status === 401) {
      // 未授权：跳转登录或清除 token
      console.warn('Unauthorized, please login.')
    }

    if (response?.status === 403) {
      console.error('Forbidden:', response?.data?.message)
    }

    if (response?.status >= 500) {
      console.error('Server error:', response?.statusText)
    }

    return Promise.reject(err)
  }
)

export default api
