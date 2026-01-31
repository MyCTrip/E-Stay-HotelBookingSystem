import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000,
});

// 请求拦截（鉴权）
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：返回 data 或抛出错误
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 可在此统一处理错误通知 / 登出逻辑
    return Promise.reject(error?.response?.data || error);
  }
);

export default request;
