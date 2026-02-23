import type { FC } from 'react'
import { Button, Input, ScrollView, Text, View } from '@tarojs/components'
import type { PriceOption, PriceRange, StarOption } from '../../business/hotel/types'
import styles from './index.module.scss'

interface InputEvent {
  detail: {
    value: string
  }
}

interface FilterPopupProps {
  visible: boolean
  priceRange: PriceRange
  selectedStars: string[]
  priceOptions: PriceOption[]
  starOptions: StarOption[]
  onClose: () => void
  onPriceChange: (range: PriceRange) => void
  onSelectPrice: (min: string, max: string) => void
  onToggleStar: (value: string) => void
  onReset: () => void
  onConfirm: () => void
}

const FilterPopup: FC<FilterPopupProps> = ({
  visible,
  priceRange,
  selectedStars,
  priceOptions,
  starOptions,
  onClose,
  onPriceChange,
  onSelectPrice,
  onToggleStar,
  onReset,
  onConfirm,
}) => {
  if (!visible) {
    return null
  }

  return (
    <View className={styles.popupContainer}>
      <View className={styles.popupMask} onClick={onClose} />
      <View className={styles.popupContent}>
        <View className={styles.popupHeader}>
          <Text className={styles.popupTitle}>选择价格/星级</Text>
          <Text className={styles.closeBtn} onClick={onClose}>✕</Text>
        </View>

        <ScrollView scrollY className={styles.popupBody}>
          <View className={styles.popupInner}>
            <View className={styles.filterSection}>
              <Text className={styles.sectionTitle}>价格范围（每晚）</Text>
              <View className={styles.priceInputRow}>
                <Input className={styles.priceInput} type="number" placeholder="¥0" value={priceRange.min} onInput={(event: InputEvent) => onPriceChange({ ...priceRange, min: event.detail.value })} />
                <Text className={styles.priceDivider}>-</Text>
                <Input className={styles.priceInput} type="number" placeholder="¥不限" value={priceRange.max} onInput={(event: InputEvent) => onPriceChange({ ...priceRange, max: event.detail.value })} />
              </View>
              <View className={styles.tagsGrid}>
                {priceOptions.map((option) => (
                  <View key={option.label} className={`${styles.tagItem} ${priceRange.min === option.min && priceRange.max === option.max ? styles.tagActive : ''}`} onClick={() => onSelectPrice(option.min, option.max)}>
                    <Text>{option.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.filterSection}>
              <Text className={styles.sectionTitle}>星级（多选）</Text>
              <View className={styles.tagsGrid}>
                {starOptions.map((star) => {
                  const isActive = selectedStars.includes(star.value)
                  return (
                    <View key={star.value} className={`${styles.tagItem} ${isActive ? styles.tagActive : ''}`} onClick={() => onToggleStar(star.value)}>
                      <Text className={styles.starIcon}>{star.icon}</Text>
                      <Text>{star.label}</Text>
                      {isActive && <Text className={styles.checkIcon}>✓</Text>}
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
        </ScrollView>

        <View className={styles.popupFooter}>
          <Button className={styles.resetBtn} onClick={onReset}>重置</Button>
          <Button className={styles.confirmBtn} onClick={onConfirm}>确定</Button>
        </View>
      </View>
    </View>
  )
}

export default FilterPopup

