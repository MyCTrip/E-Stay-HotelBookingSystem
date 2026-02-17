/**
 * 搜索按钮组件 - Web H5版本
 */

import React, { useState } from 'react'
import { Loading } from '@nutui/nutui-react'
import styles from './index.module.scss'

interface SearchButtonProps {
  loading?: boolean
  disabled?: boolean
  onClick?: () => void | Promise<void>
  label?: string
}

const SearchButton: React.FC<SearchButtonProps> = ({
  loading = false,
  disabled = false,
  onClick,
  label = '查询',
}) => {
  const [isLoading, setIsLoading] = useState(loading)

  const handleClick = async () => {
    if (disabled || isLoading) return {}

    setIsLoading(true)
    try {
      const result = onClick?.()
      if (result instanceof Promise) {
        await result
      }
    } catch (error) {
      console.error('Search button error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${isLoading || disabled ? styles.disabled : ''}`}
        onClick={handleClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <div className={styles.loadingContent}>
            <span>⏳ {label}</span>
          </div>
        ) : (
          <span>{label}</span>
        )}
      </button>
    </div>
  )
}

export default React.memo(SearchButton)
