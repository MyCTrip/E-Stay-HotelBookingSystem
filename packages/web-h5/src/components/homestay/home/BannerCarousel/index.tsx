import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'

interface BannerItem {
  id: string
  title: string
  subtitle?: string
  link?: string
  color?: string
}

interface BannerCarouselProps {
  items?: BannerItem[]
  autoPlay?: boolean
  interval?: number
  onBannerClick?: (item: BannerItem) => void
}

/**
 * 民宿首页轮播组件
 * 遵循规范：
 * - 宽度100%，高度480px
 * - 圆角10-12pt
 * - 自动轮播3.5秒，支持手动滑动
 * - 底部indicator显示当前位置
 * - 淡出淡入切换效果
 * - 纯色填充覆盖整个区域
 */
export default function BannerCarousel({
  items,
  autoPlay = true,
  interval = 3500,
  onBannerClick,
}: BannerCarouselProps) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)

  const defaultItems: BannerItem[] = [
    {
      id: '1',
      title: '周末度假专场',
      subtitle: '优质民宿低至5折',
      link: '/search/homestay?discount=weekend',
      color: '#FF6B6B',
    },
    {
      id: '2',
      title: '温暖家庭民宿',
      subtitle: '适合全家欢乐时光',
      link: '/search/homestay?type=family',
      color: '#26A69A',
    },
    {
      id: '3',
      title: '诗意海滨民宿',
      subtitle: '尽享海岸风光',
      link: '/search/homestay?type=beach',
      color: '#F59E0B',
    },
  ]

  const bannerItems = items || defaultItems

  // 自动轮播
  useEffect(() => {
    if (!autoPlay || bannerItems.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, bannerItems.length])

  const handleBannerClick = useCallback(() => {
    const item = bannerItems[currentIndex]
    if (onBannerClick) {
      onBannerClick(item)
    } else if (item.link) {
      navigate(item.link)
    }
  }, [currentIndex, bannerItems, onBannerClick, navigate])

  const goToSlide = (index: number) => {
    setCurrentIndex(index % bannerItems.length)
  }

  return (
    <div className={styles.container} onClick={handleBannerClick}>
      <div className={styles.bannerWrapper}>
        {bannerItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.bannerSlide} ${
              index === currentIndex ? styles.active : ''
            }`}
            style={{
              backgroundColor: item.color || '#FF6B6B',
            }}
          >
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              {item.subtitle && (
                <p className={styles.subtitle}>{item.subtitle}</p>
              )}
            </div>
            <div className={styles.counter}>
              {currentIndex + 1}/{bannerItems.length}
            </div>
          </div>
        ))}
      </div>

      {/* 指示器 */}
      <div className={styles.indicators}>
        {bannerItems.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              index === currentIndex ? styles.active : ''
            }`}
            onClick={(e) => {
              e.stopPropagation()
              goToSlide(index)
            }}
          />
        ))}
      </div>
    </div>
  )
}
