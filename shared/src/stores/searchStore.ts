import { create, StateCreator } from 'zustand'
import { type IStorage } from '../services/api'

export interface SearchState {
  city: string
  checkIn: string
  checkOut: string
  setCity: (city: string) => void
  setCheckIn: (date: string) => void
  setCheckOut: (date: string) => void
  reset: () => void
}

/**
 * 存储中间件 - 持久化搜索状态
 */
function storageMiddleware(
  storage: IStorage | null,
  key: string
): (config: StateCreator<SearchState>) => StateCreator<SearchState> {
  return (config) => {
    return (set, get, api) => {
      const state = config(set, get, api)

      // 从存储恢复初始状态
      if (storage) {
        try {
          const saved = storage.getItem(key)
          if (saved) {
            const parsed = JSON.parse(saved)
            set(parsed)
          }
        } catch (e) {
          console.warn('Failed to restore search state:', e)
        }
      }

      // 拦截 set 进行持久化
      const originalSet = set
      set = ((updates: any) => {
        originalSet(updates)
        if (storage) {
          try {
            const state = get()
            storage.setItem(key, JSON.stringify(state))
          } catch (e) {
            console.warn('Failed to persist search state:', e)
          }
        }
      }) as any

      return {
        ...state,
      }
    }
  }
}

/**
 * 创建搜索状态 Store - 工厂函数
 * @param storage 存储实现（可选，用于持久化）
 * @param key 存储键名
 */
export function createSearchStore(storage?: IStorage, key = '__estay_search_state__') {
  const initialState = {
    city: '上海',
    checkIn: '',
    checkOut: '',
  }

  return create<SearchState>((set) => ({
    ...initialState,
    setCity: (city) => set({ city }),
    setCheckIn: (checkIn) => set({ checkIn }),
    setCheckOut: (checkOut) => set({ checkOut }),
    reset: () => set(initialState),
  }))
}

/**
 * 创建带持久化的搜索 Store
 */
export function createPersistentSearchStore(storage: IStorage, key = '__estay_search_state__') {
  const initialState = {
    city: '上海',
    checkIn: '',
    checkOut: '',
  }

  return create<SearchState>((set, get) => {
    // 从存储恢复初始状态
    let restoredState = { ...initialState }
    try {
      const saved = storage.getItem(key)
      if (saved) {
        restoredState = { ...initialState, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.warn('Failed to restore search state:', e)
    }

    return {
      ...restoredState,
      setCity: (city) => {
        set({ city })
        try {
          storage.setItem(key, JSON.stringify(get()))
        } catch (e) {
          console.warn('Failed to persist search state:', e)
        }
      },
      setCheckIn: (checkIn) => {
        set({ checkIn })
        try {
          storage.setItem(key, JSON.stringify(get()))
        } catch (e) {
          console.warn('Failed to persist search state:', e)
        }
      },
      setCheckOut: (checkOut) => {
        set({ checkOut })
        try {
          storage.setItem(key, JSON.stringify(get()))
        } catch (e) {
          console.warn('Failed to persist search state:', e)
        }
      },
      reset: () => {
        set(initialState)
        try {
          storage.removeItem(key)
        } catch (e) {
          console.warn('Failed to clear search state:', e)
        }
      },
    }
  })
}
