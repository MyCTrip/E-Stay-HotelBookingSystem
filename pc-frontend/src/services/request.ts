// src/services/request.ts
import axios from 'axios';
import { message } from 'antd';

// 创建实例
const request = axios.create({
  baseURL: '/api', // 配合 Vite Proxy
  timeout: 10000,
});

// 请求拦截器：注入 Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // FormData 上传时，让浏览器自动设置 Content-Type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (response) => {
    // 后端规范：直接返回 response.data，或者根据 result_code 判断
    // 根据文档，成功直接返回 JSON 数据
    return response.data;
  },
  (error) => {
    // 处理 401 未授权 -> 跳转登录
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // 不在拦截器中显示错误，让调用方处理
    // 这样组件可以自定义错误处理
    return Promise.reject(error);
  }
);

export default request;