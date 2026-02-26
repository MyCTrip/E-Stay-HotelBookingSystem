import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import {
  registerStorage,
  webStorageImpl,
  createApiService,
  createMockApiService,
  initHotelStore,
  initializeConfig,
  initializeDefaultMiddlewares,
  initHomestayStoreApi,
} from '@estay/shared'
import { SlideDrawerProvider } from './components/homestay/shared/SlideDrawer'
import App from './App'
import './index.css'

// 1. 初始化配置系统
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'
initializeConfig({
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  },
})

// 2. 初始化中间件
initializeDefaultMiddlewares()

// 3. 注册平台存储适配器
registerStorage(webStorageImpl)

// 4. 创建 API 实例
const api = useMockApi
  ? createMockApiService()
  : createApiService({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      storage: webStorageImpl, // ✨ 使用存储适配器获取认证 token
    })

// 5. 初始化 stores
initHotelStore(api)
initHomestayStoreApi(api)

// 6. 创建 React Query 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
})

// 7. 启动应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SlideDrawerProvider>
        <App />
      </SlideDrawerProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
