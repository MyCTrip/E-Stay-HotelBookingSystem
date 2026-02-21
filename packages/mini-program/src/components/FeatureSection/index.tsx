import type { FC } from 'react'
import { Text, View } from '@tarojs/components'
import type { FeatureItem } from '../../business/hotel/types'
import styles from './index.module.scss'

interface FeatureSectionProps {
  title: string
  items: FeatureItem[]
}

const FeatureSection: FC<FeatureSectionProps> = ({ title, items }) => {
  return (
    <View className={styles.featuresSection}>
      <Text className={styles.featuresTitle}>{title}</Text>
      <View className={styles.featureGrid}>
        {items.map((item) => (
          <View key={item.title} className={styles.featureCard}>
            <Text className={styles.featureIcon}>{item.icon}</Text>
            <Text className={styles.featureCardTitle}>{item.title}</Text>
            <Text className={styles.featureCardDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default FeatureSection

