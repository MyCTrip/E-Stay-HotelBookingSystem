import type { FC } from 'react'
import { Text, View } from '@tarojs/components'
import type { PromoInfo } from '../../business/hotel/types'
import styles from './index.module.scss'

interface PromoBannerProps {
  promoInfo: PromoInfo
}

const PromoBanner: FC<PromoBannerProps> = ({ promoInfo }) => {
  return (
    <View className={styles.promoBanner}>
      <View className={styles.promoLeft}>
        <Text className={styles.promoTag}>{promoInfo.tag}</Text>
        <Text className={styles.promoTitle}>{promoInfo.title}</Text>
      </View>
      <View className={styles.promoRight}><Text className={styles.promoBtn}>{promoInfo.buttonText}</Text></View>
    </View>
  )
}

export default PromoBanner

