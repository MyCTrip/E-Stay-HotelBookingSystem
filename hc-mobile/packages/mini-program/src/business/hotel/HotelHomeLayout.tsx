import type { FC } from 'react'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import BannerSwiper from '../../components/BannerSwiper'
import IconGrid from '../../components/IconGrid'
import PromoBanner from '../../components/PromoBanner'
import FeatureSection from '../../components/FeatureSection'
import HotelSearchPanel from './HotelSearchPanel'
import { BANNER_LIST, FEATURE_ITEMS, GRID_MENU_ITEMS, PROMO_INFO } from '../../services/hotel.constants'
import type { BannerItem, GridMenuItem } from './types'
import styles from './HotelHomeLayout.module.scss'

const HotelHomeLayout: FC = () => {
  const [currentSwiper, setCurrentSwiper] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<number>(0)

  const handleBannerClick = (item: BannerItem): void => {
    if (!item.link) return
    Taro.navigateTo({ url: item.link }).catch(() => {
      Taro.showToast({ title: `跳转到: ${item.title}`, icon: 'none' })
    })
  }

  const handleGridClick = (item: GridMenuItem): void => {
    if (item.url) {
      Taro.navigateTo({ url: item.url })
      return
    }
    Taro.showToast({ title: '功能开发中...', icon: 'none' })
  }

  return (
    <View className={styles.container}>
      <BannerSwiper items={BANNER_LIST} current={currentSwiper} onChange={setCurrentSwiper} onItemClick={handleBannerClick} />
      <HotelSearchPanel activeTab={activeTab} onActiveTabChange={setActiveTab} />
      <IconGrid items={GRID_MENU_ITEMS} onItemClick={handleGridClick} />
      <PromoBanner promoInfo={PROMO_INFO} />
      <FeatureSection title="为什么选择我们的酒店？" items={FEATURE_ITEMS} />
    </View>
  )
}

export default HotelHomeLayout

