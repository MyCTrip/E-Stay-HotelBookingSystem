import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
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

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')

    // 1. 初始化配置系统
    const useMockApi = true // 小程序默认使用 mock API
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

    // 6. 初始化 stores
    initHotelStore(api)
  })

  // 在 Taro 4.x 中，App 组件需要返回 children
  return children
}



export default App
