import type { FC } from 'react'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import type { HotelSuggestionItem, InspirationItem } from '../../business/hotel/types'
import styles from './index.module.scss'

interface InputEvent {
  detail: {
    value: string
  }
}

interface SearchModalProps {
  visible: boolean
  keyword: string
  suggestions: HotelSuggestionItem[]
  historyTags: string[]
  hotTags: string[]
  inspirationItems: InspirationItem[]
  onClose: () => void
  onKeywordChange: (value: string) => void
  onSubmit: (keyword: string) => void
  onClearHistory: () => void
}

const SearchModal: FC<SearchModalProps> = ({
  visible,
  keyword,
  suggestions,
  historyTags,
  hotTags,
  inspirationItems,
  onClose,
  onKeywordChange,
  onSubmit,
  onClearHistory,
}) => {
  if (!visible) {
    return null
  }

  return (
    <View className={styles.searchModal}>
      <View className={styles.searchHeader}>
        <View className={styles.searchInputBar}>
          <Text className={styles.searchIcon} onClick={() => onSubmit(keyword)}>🔍</Text>
          <Input className={styles.searchInput} placeholder="试试搜 '汉庭' 或 '环球影城'" focus value={keyword} onInput={(event: InputEvent) => onKeywordChange(event.detail.value)} onConfirm={() => onSubmit(keyword)} />
        </View>
        <Text className={styles.cancelBtn} onClick={onClose}>取消</Text>
      </View>

      <ScrollView scrollY className={styles.searchBody}>
        {keyword.trim().length > 0 ? (
          <View className={styles.suggestionList}>
            {suggestions.length > 0 ? (
              <>
                <Text className={styles.resultGroupTitle}>推荐结果 ({suggestions.length})</Text>
                {suggestions.map((item) => (
                  <View key={item.id} className={styles.suggestionItem} onClick={() => onSubmit(item.name)}>
                    <View className={styles.suggLeft}>{item.name.includes('酒店') ? '🏨' : '📍'}</View>
                    <View className={styles.suggCenter}>
                      <View className={styles.suggTitleRow}>
                        <Text className={styles.suggName}>{item.name}</Text>
                        <Text className={styles.scoreBadge}>{item.score}分</Text>
                      </View>
                      <View className={styles.suggDescRow}>
                        <Text>{item.city}</Text>
                        <Text className={styles.suggDivider}>|</Text>
                        <Text>{item.area}</Text>
                        <Text className={styles.suggDivider}>|</Text>
                        <Text>{item.address}</Text>
                      </View>
                    </View>
                    <View className={styles.suggRight}>
                      <Text className={styles.suggPrice}><Text>¥</Text>{item.price}<Text>起</Text></Text>
                      <Text className={styles.suggDistance}>{item.distance >= 1000 ? '>999km' : `距我${item.distance}km`}</Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View className={styles.emptyResult}>未找到相关结果</View>
            )}
          </View>
        ) : (
          <>
            {historyTags.length > 0 && (
              <View className={styles.searchGroup}>
                <View className={styles.groupHeader}>
                  <Text className={styles.groupTitle}>历史搜索</Text>
                  <View className={styles.clearAction} onClick={onClearHistory}><Text>🗑 清空</Text></View>
                </View>
                <View className={styles.tagsFlow}>
                  {historyTags.map((tag) => (
                    <View key={tag} className={styles.searchTag} onClick={() => onSubmit(tag)}>{tag}</View>
                  ))}
                </View>
              </View>
            )}

            <View className={styles.searchGroup}>
              <Text className={styles.groupTitleLabel}>热门搜索</Text>
              <View className={styles.tagsFlow}>
                {hotTags.map((tag, index) => (
                  <View key={tag} className={`${styles.searchTag} ${index < 3 ? styles.hotTag : ''}`} onClick={() => onSubmit(tag)}>{tag}</View>
                ))}
              </View>
            </View>

            <View className={styles.searchGroup}>
              <Text className={styles.groupTitleLabel}>灵感探索</Text>
              <View className={styles.inspirationGrid}>
                {inspirationItems.map((item) => (
                  <View key={item.title} className={styles.inspirationCard} onClick={() => onSubmit(item.title.split('·')[1] ?? item.title)}>
                    <Image className={styles.cardImg} src={item.img} mode="aspectFill" />
                    <View className={styles.cardMask} />
                    <Text className={styles.cardTag}>{item.tag}</Text>
                    <Text className={styles.cardText}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

export default SearchModal

