import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'

interface BannerItem {
  id: string
  title: string
  subtitle?: string
  image: string
  link?: string
  color?: string
}

interface BannerCarouselProps {
  items?: BannerItem[]
  autoPlay?: boolean
  interval?: number
  onBannerClick?: (item: BannerItem) => void
}

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
      title: '春节特惠',
      subtitle: '限时7折起',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
      link: '/search/hourlyHotel?discount=weekend',
      color: '#FF6B6B',
    },
    {
      id: '2',
      title: '机场高铁中转',
      subtitle: '快速缓解出行疲惫',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80',
      link: '/search/hourlyHotel?type=transit',
      color: '#26A69A',
    },
    {
      id: '3',
      title: '聚会团建',
      subtitle: '春节举杯欢聚',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80',
      link: '/search/hourlyHotel?type=beach',
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
            className={`${styles.bannerSlide} ${index === currentIndex ? styles.active : ''
              }`}
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
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
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''
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
