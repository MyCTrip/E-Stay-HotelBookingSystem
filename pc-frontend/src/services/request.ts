import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '/api', // Vite 代理指向后端 Node 服务
  timeout: 10000,
});

// 请求拦截：自动携带 JWT Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期处理
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    message.error(error.response?.data?.message || '请求失败');
    return Promise.reject(error);
  }
);

export default request;
