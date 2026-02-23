import { useMemo, useState } from 'react'
import type { HotelSuggestionItem } from '../business/hotel/types'
import { DEFAULT_HISTORY_TAGS } from '../services/hotel.constants'
import { searchHotelsByKeyword } from '../services/hotel.service'

interface UseHotelSearchResult {
  keyword: string
  history: string[]
  suggestions: HotelSuggestionItem[]
  setKeyword: (value: string) => void
  submitKeyword: (value: string) => string | null
  clearHistory: () => void
}

export const useHotelSearch = (): UseHotelSearchResult => {
  const [keyword, setKeywordState] = useState<string>('')
  const [history, setHistory] = useState<string[]>(DEFAULT_HISTORY_TAGS)

  const suggestions = useMemo<HotelSuggestionItem[]>(() => {
    return searchHotelsByKeyword(keyword)
  }, [keyword])

  const setKeyword = (value: string): void => {
    setKeywordState(value)
  }

  const submitKeyword = (value: string): string | null => {
    const normalizedKeyword = value.trim()
    if (!normalizedKeyword) {
      return null
    }

    const newHistory = [normalizedKeyword, ...history.filter((item) => item !== normalizedKeyword)].slice(0, 10)
    setHistory(newHistory)
    setKeywordState(normalizedKeyword)
    return normalizedKeyword
  }

  const clearHistory = (): void => {
    setHistory([])
  }

  return {
    keyword,
    history,
    suggestions,
    setKeyword,
    submitKeyword,
    clearHistory,
  }
}

