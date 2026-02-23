import type { FC } from 'react'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import type { BannerItem } from '../../business/hotel/types'
import styles from './index.module.scss'

interface SwiperChangeEvent {
  detail: {
    current: number
  }
}

interface BannerSwiperProps {
  items: BannerItem[]
  current: number
  onChange: (current: number) => void
  onItemClick: (item: BannerItem) => void
}

const BannerSwiper: FC<BannerSwiperProps> = ({ items, current, onChange, onItemClick }) => {
  return (
    <View className={styles.headerBanner}>
      <Swiper
        className={styles.bannerSwiper}
        circular
        autoplay
        interval={4000}
        duration={800}
        indicatorDots={false}
        onChange={(event: SwiperChangeEvent) => onChange(event.detail.current)}
      >
        {items.map((item) => (
          <SwiperItem key={item.id} onClick={() => onItemClick(item)}>
            <Image className={styles.bannerBg} src={item.img} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>
      <View className={styles.overlay} />
      <View className={styles.headerContent}>
        <Text className={styles.appTitle}>E-Stay 旅行</Text>
      </View>
      <View className={styles.swiperIndicators}>
        {items.map((item, index) => (
          <View key={item.id} className={`${styles.dot} ${current === index ? styles.activeDot : ''}`} />
        ))}
      </View>
    </View>
  )
}

export default BannerSwiper

