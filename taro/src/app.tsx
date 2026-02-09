// 定义全局环境变量，防止库文件中的环境检查错误
if (typeof (global as any).development === 'undefined') {
  (global as any).development = process.env.NODE_ENV === 'development'
}
if (typeof (global as any).production === 'undefined') {
  (global as any).production = process.env.NODE_ENV === 'production'
}

import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import './app.css'

/**
 * Taro 应用入口
 * 在小程序环境下，这个组件主要处理应用级别的逻辑，页面由 app.config.ts 配置
 */
const App: React.FC<{ children?: any }> = ({ children }) => {
  useEffect(() => {
    // 应用启动时的初始化
    Taro.eventCenter?.on?.('__taroRouteChange', () => {
      // 处理路由变更
    })

    return () => {
      Taro.eventCenter?.off?.('__taroRouteChange')
    }
  }, [])

  // 小程序环境下，App 应返回 children，让 Taro 渲染页面组件
  return children as any
}

export default App
