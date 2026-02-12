import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 👈 引入 path 模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 前端端口
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // 如果后端路由本身不带 /api 前缀才需要重写，根据文档看后端路由是 /api/auth/... 所以不需要重写
      },
      // 如果有静态资源 (图片)
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      // 👇 关键配置：告诉 Vite，遇到 "@" 就去找 "src" 目录
      '@': path.resolve(__dirname, './src')
    }
  }
})