import React from 'react'
import { Loading } from '@nutui/nutui-react'
import styles from './index.module.scss'

interface SearchButtonProps {
  loading: boolean
  onClick: () => void
  label: string
}

const SearchButton: React.FC<SearchButtonProps> = ({ loading, onClick, label }) => {
  const handleClick = () => {
    if (loading) return
    onClick()
  }

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${loading ? styles.disabled : ''}`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <div className={styles.loadingContent}>
            <Loading />
            <span>{label}</span>
          </div>
        ) : (
          <span>{label}</span>
        )}
      </button>
    </div>
  )
}

export default React.memo(SearchButton)
