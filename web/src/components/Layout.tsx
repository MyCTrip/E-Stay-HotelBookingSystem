import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { cn } from '../utils/cn'

/**
 * 全局布局组件（顶部 Header + 内容区 + 安全区）
 */
export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600">
            E-Stay
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              首页
            </Link>
            <Link to="/hotels" className="text-gray-600 hover:text-blue-600">
              搜索
            </Link>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-4">
        <Outlet />
      </main>

      {/* 安全区底部（iPhone notch 处理） */}
      <div className="pb-[max(1rem,env(safe-area-inset-bottom))]" />
    </div>
  )
}
