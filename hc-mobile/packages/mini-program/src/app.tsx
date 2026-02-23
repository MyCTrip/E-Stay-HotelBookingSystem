import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  registerStorage,
  createTaroStorageImpl,
  createApiService,
  createMockApiService,
  initHotelStore,
  initializeConfig,
  initializeDefaultMiddlewares,
} from '@estay/shared'

import './app.scss'

// ==========================================
// 将初始化逻辑提取到文件顶层（全局作用域）
//==========================================

const useMockApi = true // 小程序默认使用 mock API

// 1. 初始化配置系统
initializeConfig({
  api: {
    baseURL: 'http://localhost:3000/api',
  },
})

// 2. 初始化中间件
initializeDefaultMiddlewares()

// 3. 创建 Taro 存储适配器
const taroStorage = createTaroStorageImpl(Taro)

// 4. 注册存储适配器
registerStorage(taroStorage)

// 5. 创建 API 实例
const api = useMockApi
  ? createMockApiService()
  : createApiService({
      baseURL: 'http://localhost:3000/api',
      storage: taroStorage, // 使用 Taro 存储适配器
    })

// 6. 初始化 stores (关键！)
initHotelStore(api)

// ==========================================

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
})

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    // 这里只留那些真正需要在应用启动完成时才上报的逻辑，比如日志、统计代码等
    console.log('App launched.')
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default App