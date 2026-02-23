import type { FC } from 'react'
import { Text, View } from '@tarojs/components'
import type { GridMenuItem } from '../../business/hotel/types'
import styles from './index.module.scss'

interface IconGridProps {
  items: GridMenuItem[]
  onItemClick: (item: GridMenuItem) => void
}

const IconGrid: FC<IconGridProps> = ({ items, onItemClick }) => {
  return (
    <View className={styles.gridMenu}>
      {items.map((item, index) => (
        <View key={item.title} className={styles.gridItem} onClick={() => onItemClick(item)}>
          <View className={styles.iconCircle} style={{ backgroundColor: index === 1 ? '#fff0e5' : '#f2f4f6' }}>
            <Text style={{ fontSize: '32rpx' }}>{item.icon}</Text>
          </View>
          <Text className={styles.gridTitle}>{item.title}</Text>
        </View>
      ))}
    </View>
  )
}

export default IconGrid

