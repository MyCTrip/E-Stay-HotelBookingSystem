import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import styles from './MainLayout.module.css'
import { useState, useEffect } from 'react'
import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children?: ReactNode
}

/**
 * 主布局组件
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState('domestic')

  const categories = [
    { id: 'domestic', label: '国内', icon: '🇨🇳' },
    { id: 'hourly', label: '钟点房', icon: '⏰' },
    { id: 'homestay', label: '民宿', icon: '🏡' },
  ]

  useEffect(() => {
    // 根据当前路径设置 activeCategory
    if (
      location.pathname.startsWith('/hourlyHotel') ||
      location.pathname.includes('/hourlyHotel')
    ) {
      setActiveCategory('hourly')
    } else if (
      location.pathname.startsWith('/homeStay') ||
      location.pathname.includes('/homeStay')
    ) {
      setActiveCategory('homestay')
    } else {
      setActiveCategory('domestic')
    }
  }, [location.pathname])

  return (
    <div className={styles.container}>
      {/* 顶部导航 - 仅在桌面端显示 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            🏨 E-Stay
          </Link>
          <nav className={styles.nav}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.navItem} ${activeCategory === cat.id ? styles.active : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id)
                  if (cat.id === 'domestic') navigate('/hotel')
                  if (cat.id === 'hourly') navigate('/hourlyHotel')
                  if (cat.id === 'homestay') navigate('/homeStay')
                }}
              >
                <span className={styles.icon}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 主要内容 */}
      <main className={styles.main}>{children || <Outlet />}</main>

      {/* 底部导航 - 仅在移动端显示 */}
      <nav className={styles.mobileNav}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.mobileNavItem} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => {
              setActiveCategory(cat.id)
              if (cat.id === 'domestic') navigate('/hotel')
              if (cat.id === 'hourly') navigate('/hourlyHotel')
              if (cat.id === 'homestay') navigate('/homeStay')
            }}
            title={cat.label}
          >
            <span className={styles.mobileNavIcon}>{cat.icon}</span>
            <span className={styles.mobileNavLabel}>{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* 底部 */}
      <footer className={styles.footer}>
        <p>&copy; 2024 E-Stay Hotel Booking System. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default MainLayout;