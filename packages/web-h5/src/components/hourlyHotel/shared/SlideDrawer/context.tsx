/**
 * SlideDrawer 上下文 - 管理页面内 SlideDrawer 的互斥
 */

import React, { createContext, useContext, useRef, useCallback } from 'react'

interface DrawerInstance {
  id: string
  onClose: () => void
}

interface SlideDrawerContextType {
  registerDrawer: (drawer: DrawerInstance) => void
  unregisterDrawer: (id: string) => void
  openDrawer: (id: string) => void
}

const SlideDrawerContext = createContext<SlideDrawerContextType | undefined>(undefined)

/**
 * SlideDrawer 上下文提供者
 */
export const SlideDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const drawersRef = useRef<Map<string, DrawerInstance>>(new Map())

  const registerDrawer = useCallback((drawer: DrawerInstance) => {
    drawersRef.current.set(drawer.id, drawer)
  }, [])

  const unregisterDrawer = useCallback((id: string) => {
    drawersRef.current.delete(id)
  }, [])

  const openDrawer = useCallback((id: string) => {
    // 关闭所有其他打开的 drawer
    drawersRef.current.forEach((drawer, drawerId) => {
      if (drawerId !== id) {
        drawer.onClose()
      }
    })
  }, [])

  const value: SlideDrawerContextType = {
    registerDrawer,
    unregisterDrawer,
    openDrawer,
  }

  return <SlideDrawerContext.Provider value={value}>{children}</SlideDrawerContext.Provider>
}

/**
 * 使用 SlideDrawer 上下文的 Hook
 */
export const useSlideDrawerContext = () => {
  const context = useContext(SlideDrawerContext)
  if (!context) {
    // 将 context 值改为 undefined，这样如果在没有 Provider 的情况下使用，会返回 undefined
    // 这样组件可以检查是否在 Provider 中
    return undefined
  }
  return context
}
