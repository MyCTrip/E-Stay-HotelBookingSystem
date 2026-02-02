import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 👈 引入 path 模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 👇 关键配置：告诉 Vite，遇到 "@" 就去找 "src" 目录
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // 将 /api 的请求代理到后端开发服务器（默认后端运行在 3000）
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
