/**
 * 快捷筛选标签组件 - Web H5版本
 */

import React, { useState } from 'react'
import type { QuickFilterTag } from '@estay/shared'
import { QUICK_FILTER_TAGS } from '@estay/shared'
import styles from './index.module.scss'

interface QuickFiltersProps {
  tags?: QuickFilterTag[]
  selectedTags?: string[]
  onTagSelect?: (tagId: string, selected: boolean) => void
  maxSelect?: number
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  tags = QUICK_FILTER_TAGS,
  selectedTags = [],
  onTagSelect,
  maxSelect,
}) => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedTags)
  )

  const handleTagClick = (tagId: string) => {
    const newSelected = new Set(selected)
    const isCurrentlySelected = newSelected.has(tagId)

    // 如果已选且达到最大数量，不允许添加
    if (!isCurrentlySelected && maxSelect && newSelected.size >= maxSelect) {
      return
    }

    if (isCurrentlySelected) {
      newSelected.delete(tagId)
    } else {
      newSelected.add(tagId)
    }

    setSelected(newSelected)
    onTagSelect?.(tagId, !isCurrentlySelected)
  }

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        {tags.map((tag) => {
          const isSelected = selected.has(tag.id)
          return (
            <div
              key={tag.id}
              className={`${styles.tag} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleTagClick(tag.id)}
            >
              {tag.badge && <span className={styles.badge}>{tag.badge}</span>}
              <span className={styles.label}>{tag.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(QuickFilters)
