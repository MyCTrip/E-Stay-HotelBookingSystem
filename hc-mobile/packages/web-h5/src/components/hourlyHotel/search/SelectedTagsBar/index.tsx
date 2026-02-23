/**
 * 已选条件标签栏
 */

import React from 'react'
import styles from './index.module.scss'

interface SelectedTagsBarProps {
  tags: Array<{ key: string; label: string }>
  onTagRemove: (key: string) => void
  onResetAll: () => void
}

const SelectedTagsBar: React.FC<SelectedTagsBarProps> = ({ tags, onTagRemove, onResetAll }) => {
  if (tags.length === 0) return null

  return (
    <div className={styles.tagsWrapper}>
      <div className={styles.tagsList}>
        {tags.map(tag => (
          <div key={tag.key} className={styles.tag}>
            <span>{tag.label}</span>
            <button
              className={styles.removeBtn}
              onClick={() => onTagRemove(tag.key)}
              title="删除"
            >
              ×
            </button>
          </div>
        ))}

        {/* 重置按钮 */}
        <button className={styles.resetBtn} onClick={onResetAll}>
          重置
        </button>
      </div>
    </div>
  )
}

export default SelectedTagsBar
