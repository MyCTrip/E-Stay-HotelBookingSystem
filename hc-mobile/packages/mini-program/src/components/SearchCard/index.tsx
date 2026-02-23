import type { FC } from 'react'
import { Button, Picker, Text, View } from '@tarojs/components'
import styles from './index.module.scss'

interface PickerChangeEvent {
  detail: {
    value: string | number
  }
}

interface SearchCardProps {
  activeTab: number
  cityName: string
  cityLabels: string[]
  checkInDate: string
  checkInWeek: string
  checkOutDate: string
  checkOutWeek: string
  checkInRaw: string
  checkOutRaw: string
  nights: number
  priceStarDisplay: string
  keywords: string
  quickTags: string[]
  selectedQuickTags: string[]
  loadingLocation: boolean
  onTabChange: (tab: number) => void
  onCityChange: (index: number) => void
  onLocationClick: () => void
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
  onOpenFilter: () => void
  onOpenSearch: () => void
  onToggleQuickTag: (tag: string) => void
  onSubmit: () => void
}

const SearchCard: FC<SearchCardProps> = ({
  activeTab,
  cityName,
  cityLabels,
  checkInDate,
  checkInWeek,
  checkOutDate,
  checkOutWeek,
  checkInRaw,
  checkOutRaw,
  nights,
  priceStarDisplay,
  keywords,
  quickTags,
  selectedQuickTags,
  loadingLocation,
  onTabChange,
  onCityChange,
  onLocationClick,
  onCheckInChange,
  onCheckOutChange,
  onOpenFilter,
  onOpenSearch,
  onToggleQuickTag,
  onSubmit,
}) => {
  const startDate = new Date().toISOString().split('T')[0]

  return (
    <View className={styles.searchCard}>
      <View className={styles.tabHeader}>
        <View className={`${styles.tabItem} ${activeTab === 0 ? styles.active : ''}`} onClick={() => onTabChange(0)}>
          <Text className={styles.tabText}>国内</Text>
          {activeTab === 0 && <View className={styles.activeBar} />}
        </View>
        <View className={`${styles.tabItem} ${activeTab === 1 ? styles.active : ''}`} onClick={() => onTabChange(1)}>
          <Text className={styles.tabText}>国际/中国港澳台</Text>
          {activeTab === 1 && <View className={styles.activeBar} />}
        </View>
      </View>

      <View className={styles.formContent}>
        <View className={`${styles.rowItem} ${styles.borderBottom}`}>
          <View className={styles.inputWrapper}>
            <Text className={styles.label}>目的地</Text>
            <Picker mode="selector" range={cityLabels} onChange={(event: PickerChangeEvent) => onCityChange(Number(event.detail.value))}>
              <View className={styles.cityValue}>{cityName}</View>
            </Picker>
          </View>

          <View className={styles.verticalDivider} />

          <View className={styles.locationBtn} onClick={onLocationClick}>
            <Text className={styles.locIcon}>{loadingLocation ? '⏳' : '📍'}</Text>
            <Text className={styles.locText}>我的位置</Text>
          </View>
        </View>

        <View className={`${styles.rowItem} ${styles.borderBottom}`}>
          <View className={styles.dateSection}>
            <View className={styles.dateCol}>
              <Text className={styles.label}>入住</Text>
              <Picker mode="date" value={checkInRaw} start={startDate} onChange={(event: PickerChangeEvent) => onCheckInChange(String(event.detail.value))}>
                <View className={styles.dateValGroup}>
                  <Text className={styles.bigNum}>{checkInDate}</Text>
                  <Text className={styles.smallDesc}>{checkInWeek}</Text>
                </View>
              </Picker>
            </View>

            <View className={styles.durationBadge}>
              <Text className={styles.badgeText}>{nights}晚</Text>
            </View>

            <View className={styles.dateCol}>
              <Text className={styles.label}>离店</Text>
              <Picker mode="date" value={checkOutRaw} start={checkInRaw} onChange={(event: PickerChangeEvent) => onCheckOutChange(String(event.detail.value))}>
                <View className={styles.dateValGroup}>
                  <Text className={styles.bigNum}>{checkOutDate}</Text>
                  <Text className={styles.smallDesc}>{checkOutWeek}</Text>
                </View>
              </Picker>
            </View>
          </View>
        </View>

        <View className={`${styles.rowItem} ${styles.borderBottom}`}>
          <View className={styles.inputWrapper} style={{ flex: 1 }} onClick={onOpenFilter}>
            <Text className={priceStarDisplay === '价格/星级' ? styles.placeholderText : styles.valueText}>{priceStarDisplay}</Text>
          </View>

          <View className={styles.verticalDivider} />

          <View className={styles.inputWrapper} style={{ flex: 1.5 }} onClick={onOpenSearch}>
            <Text className={keywords ? styles.valueText : styles.placeholderText} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {keywords || '关键字/位置/品牌'}
            </Text>
          </View>
        </View>

        <View className={styles.quickTagsRow}>
          {quickTags.map((tag) => {
            const isActive = selectedQuickTags.includes(tag)
            return (
              <View key={tag} className={`${styles.quickTagItem} ${isActive ? styles.quickTagItemActive : ''}`} onClick={() => onToggleQuickTag(tag)}>
                <Text>{tag}</Text>
              </View>
            )
          })}
        </View>

        <Button className={styles.submitBtn} onClick={onSubmit}>
          查询{activeTab === 0 ? '国内' : '国际'}酒店
        </Button>
      </View>
    </View>
  )
}

export default SearchCard
