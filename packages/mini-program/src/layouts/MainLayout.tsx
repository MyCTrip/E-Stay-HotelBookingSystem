import { View, Text } from '@tarojs/components'
import { useState, ReactNode, useEffect } from 'react'
import styles from './MainLayout.module.scss'
import { navigate } from '../router'
import Taro from '@tarojs/taro'

// 新增接口定义，添加控制底部的开关
interface MainLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean; // 是否隐藏底部 Tab 导航
  hideFooter?: boolean;    // 是否隐藏底部的版权 Footer
}

/**
 * 主布局组件
 * 页面框架：header(导航) + main(内容) + footer
 * 每个页面都应该用这个组件包裹内容
 */
export default function MainLayout({ 
  children, 
  hideBottomNav = false,  // 默认不隐藏底部导航
  hideFooter = false      // 默认不隐藏底部版权
}: MainLayoutProps) {
  const [activeCategory, setActiveCategory] = useState('domestic')

  const categories = [
    { id: 'domestic', label: '酒店', icon: '🏨' },
    { id: 'hourly', label: '钟点房', icon: '⏰' },
    { id: 'homestay', label: '民宿', icon: '🏡' },
  ]

  // 在页面加载时根据当前页面的路径来更新activeCategory状态
  useEffect(() => {
    const currentPath = Taro.getCurrentInstance().page?.router?.path || ''
    if (currentPath.includes('hourlyHotel')) {
      setActiveCategory('hourly')
    } else if (currentPath.includes('homeStay')) {
      setActiveCategory('homestay')
    } else {
      setActiveCategory('domestic')
    }
  }, [])

  return (
    <View className={styles.container}>
      {/* 顶部导航 */}
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <View className={styles.logo}>
            🏨 E-Stay
          </View>
          <View className={styles.nav}>
            {categories.map((cat) => (
              <View
                key={cat.id}
                className={`${styles.navItem} ${activeCategory === cat.id ? styles.active : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id)
                  if (cat.id === 'domestic') navigate.go('HOME_HOTEL')
                  if (cat.id === 'hourly') navigate.go('HOME_HOURLY')
                  if (cat.id === 'homestay') navigate.go('HOME_HOMESTAY')
                }}
              >
                <Text className={styles.icon}>{cat.icon}</Text>
                <Text>{cat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 主要内容 - 显示页面内容 */}
      <View className={styles.main}>
        {children}
      </View>

      {/* 底部导航 - 仅在移动端显示（新增开关控制） */}
      {!hideBottomNav && (
        <View className={styles.mobileNav}>
          {categories.map((cat) => (
            <View
              key={cat.id}
              className={`${styles.mobileNavItem} ${activeCategory === cat.id ? styles.active : ''}`}
              onClick={() => {
                setActiveCategory(cat.id)
                if (cat.id === 'domestic') navigate.go('HOME_HOTEL')
                if (cat.id === 'hourly') navigate.go('HOME_HOURLY')
                if (cat.id === 'homestay') navigate.go('HOME_HOMESTAY')
              }}
            >
              <Text className={styles.mobileNavIcon}>{cat.icon}</Text>
              <Text className={styles.mobileNavLabel}>{cat.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 底部版权信息（新增开关控制） */}
      {!hideFooter && (
        <View className={styles.footer}>
          <Text>&copy; 2024 E-Stay Hotel Booking System. All rights reserved.</Text>
        </View>
      )}
    </View>
  )
}