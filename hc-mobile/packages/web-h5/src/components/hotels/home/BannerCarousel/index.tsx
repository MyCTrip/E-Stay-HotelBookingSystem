import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'

export interface BannerItem {
  id: string
  title: string
  subtitle?: string
  image: string
  link?: string
}

interface BannerCarouselProps {
  items?: BannerItem[]
  autoPlay?: boolean
  interval?: number
  onBannerClick?: (item: BannerItem) => void
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'hotel-banner-1',
    title: 'Beach Vacation Picks',
    subtitle: 'Limited offers for top-tier hotels',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
    link: '/hotel/search?theme=beach',
  },
  {
    id: 'hotel-banner-2',
    title: 'Luxury Stays',
    subtitle: 'International brands from 20% off',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80',
    link: '/hotel/search?theme=luxury',
  },
  {
    id: 'hotel-banner-3',
    title: 'Family Friendly',
    subtitle: 'Theme park hotels and bundle deals',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80',
    link: '/hotel/search?theme=family',
  },
]

export default function BannerCarousel({
  items,
  autoPlay = true,
  interval = 3500,
  onBannerClick,
}: BannerCarouselProps) {
  const navigate = useNavigate()
  const bannerItems = useMemo(() => (items && items.length > 0 ? items : DEFAULT_BANNERS), [items])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || bannerItems.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % bannerItems.length)
    }, interval)

    return () => window.clearInterval(timer)
  }, [autoPlay, bannerItems.length, interval])

  const handleBannerClick = useCallback(() => {
    const currentBanner = bannerItems[currentIndex]
    if (!currentBanner) {
      return
    }

    if (onBannerClick) {
      onBannerClick(currentBanner)
      return
    }

    if (currentBanner.link) {
      navigate(currentBanner.link)
    }
  }, [bannerItems, currentIndex, navigate, onBannerClick])

  return (
    <div className={styles.headerBanner} onClick={handleBannerClick}>
      <div className={styles.bannerSwiper}>
        {bannerItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.bannerSlide} ${currentIndex === index ? styles.activeSlide : ''}`}
          >
            <img className={styles.bannerBg} src={item.image} alt={item.title} />
            <div className={styles.overlay} />
            <div className={styles.headerContent}>
              <div className={styles.appTitle}>E-Stay Travel</div>
              <div className={styles.bannerTitle}>{item.title}</div>
              {item.subtitle ? <div className={styles.bannerSubtitle}>{item.subtitle}</div> : null}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.swiperIndicators}>
        {bannerItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
            onClick={(event) => {
              event.stopPropagation()
              setCurrentIndex(index)
            }}
            aria-label={`Go to ${item.title}`}
          />
        ))}
      </div>
    </div>
  )
}
