import { Outlet, Link } from 'react-router-dom'
import styles from './MainLayout.module.css'
import { useState } from 'react'

/**
 * 主布局组件
 */
export default function MainLayout() {
  const [activeCategory, setActiveCategory] = useState('domestic')

  const categories = [
    { id: 'domestic', label: '国内', icon: '🇨🇳' },
    { id: 'hourly', label: '钟点房', icon: '⏰' },
    { id: 'homestay', label: '民宿', icon: '🏡' },
  ]

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
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className={styles.icon}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 主要内容 */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* 底部导航 - 仅在移动端显示 */}
      <nav className={styles.mobileNav}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.mobileNavItem} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat.id)}
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
