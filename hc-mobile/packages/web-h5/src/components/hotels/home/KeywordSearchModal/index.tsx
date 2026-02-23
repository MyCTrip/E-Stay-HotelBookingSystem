import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'

export interface KeywordSearchModalProps {
  visible: boolean
  keyword: string
  historyKeywords: string[]
  hotKeywords: string[]
  onClose: () => void
  onKeywordChange: (value: string) => void
  onSubmit: (value: string) => void
  onClearHistory: () => void
}

const toLowerCase = (value: string): string => value.trim().toLowerCase()

const dedupe = (values: string[]): string[] => Array.from(new Set(values))

export default function KeywordSearchModal({
  visible,
  keyword,
  historyKeywords,
  hotKeywords,
  onClose,
  onKeywordChange,
  onSubmit,
  onClearHistory,
}: KeywordSearchModalProps) {
  const suggestions = useMemo(() => {
    const normalizedKeyword = toLowerCase(keyword)
    if (!normalizedKeyword) {
      return []
    }

    return dedupe([...historyKeywords, ...hotKeywords])
      .filter((item) => toLowerCase(item).includes(normalizedKeyword))
      .slice(0, 8)
  }, [historyKeywords, hotKeywords, keyword])

  const handleSubmit = (value: string) => {
    const normalized = value.trim()
    if (!normalized) {
      return
    }
    onSubmit(normalized)
  }

  if (!visible || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.searchInputBar}>
            <button
              type="button"
              className={styles.searchIcon}
              onClick={() => handleSubmit(keyword)}
              aria-label="Search keyword"
            >
              Search
            </button>
            <input
              className={styles.searchInput}
              placeholder="Search hotel / landmark / brand"
              value={keyword}
              autoFocus
              onChange={(event) => onKeywordChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleSubmit(keyword)
                }
              }}
            />
          </div>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>

        <div className={styles.body}>
          {keyword.trim().length > 0 ? (
            <div className={styles.group}>
              <div className={styles.groupTitle}>Suggestions ({suggestions.length})</div>
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={styles.suggestionItem}
                    onClick={() => handleSubmit(item)}
                  >
                    <span className={styles.suggestionIcon}>HOTEL</span>
                    <span className={styles.suggestionText}>{item}</span>
                  </button>
                ))
              ) : (
                <div className={styles.emptyResult}>No results found.</div>
              )}
            </div>
          ) : (
            <>
              {historyKeywords.length > 0 ? (
                <div className={styles.group}>
                  <div className={styles.groupHeader}>
                    <span className={styles.groupTitle}>Recent Searches</span>
                    <button type="button" className={styles.clearAction} onClick={onClearHistory}>
                      Clear
                    </button>
                  </div>
                  <div className={styles.tagsFlow}>
                    {historyKeywords.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={styles.tag}
                        onClick={() => handleSubmit(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={styles.group}>
                <div className={styles.groupTitle}>Popular Searches</div>
                <div className={styles.tagsFlow}>
                  {hotKeywords.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={styles.tag}
                      onClick={() => handleSubmit(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
