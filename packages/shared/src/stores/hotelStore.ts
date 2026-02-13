import { create } from 'zustand'
import { IApiService } from '../api'
import { Hotel, Room, HotelQuery, PropertyType } from '../types'

/**
 * 搜索参数
 */
export interface SearchParams {
  city: string
  keyword: string
  checkInDate?: Date
  checkOutDate?: Date
  filters: {
    star?: number
    priceRange?: [number, number]
    tags?: string[]
  }
}

// 扩展 search params，支持 propertyType 以便不同类型页面自动注入
export interface ExtendedSearchParams extends SearchParams {
  propertyType?: PropertyType
}

/**
 * 酒店 Store 状态
 */
interface HotelStoreState {
  // ===== 查询条件 =====
  searchParams: ExtendedSearchParams

  // ===== 列表数据 =====
  hotels: Hotel[]
  hotelsPagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }

  // ===== 详情数据 =====
  currentHotel: Hotel | null
  currentHotelRooms: Room[]

  // ===== 当前房型 =====
  currentRoom: Room | null

  // ===== 热门酒店 =====
  hotHotels: Hotel[]

  // ===== UI 状态 =====
  loading: boolean
  error: string | null

  // ===== Actions =====
  setSearchParams: (params: Partial<ExtendedSearchParams>) => void
  fetchHotels: (query: HotelQuery) => Promise<void>
  fetchMoreHotels: () => Promise<void>
  fetchHotelDetail: (id: string) => Promise<void>
  fetchRoomDetail: (id: string) => Promise<void>
  fetchHotHotels: () => Promise<void>
  clearError: () => void
  resetHotels: () => void
}

/**
 * 创建酒店 Store（工厂函数）
 */
export function createHotelStore(api: IApiService) {
  return create<HotelStoreState>((set: any, get: any) => ({
    // 初始状态
    searchParams: {
      city: 'Beijing',
      keyword: '',
      filters: {},
      propertyType: undefined,
    },
    hotels: [],
    hotelsPagination: {
      page: 1,
      limit: 10,
      total: 0,
      hasMore: true,
    },
    currentHotel: null,
    currentHotelRooms: [],
    currentRoom: null,
    hotHotels: [],
    loading: false,
    error: null,

    // ===== Actions =====
    setSearchParams: (params: Partial<ExtendedSearchParams>) =>
      set((state: HotelStoreState) => ({
        searchParams: { ...state.searchParams, ...(params as any) },
      })),

    fetchHotels: async (query: any) => {
      set({ loading: true, error: null })
      try {
        // 如果调用方未传 propertyType，则优先从 store.searchParams 中注入
        const state = get()
        const mergedQuery = { ...(query || {}) }
        if (!mergedQuery.propertyType && state.searchParams?.propertyType) {
          mergedQuery.propertyType = state.searchParams.propertyType
        }
        const res = await api.getHotels(mergedQuery as HotelQuery)
        set({
          hotels: res.data,
          hotelsPagination: {
            page: res.meta.page,
            limit: res.meta.limit,
            total: res.meta.total,
            hasMore: res.meta.page * res.meta.limit < res.meta.total,
          },
        })
      } catch (err: any) {
        set({ error: err.message })
      } finally {
        set({ loading: false })
      }
    },

    fetchMoreHotels: async () => {
      const state = get()
      if (!state.hotelsPagination.hasMore) return

      set({ loading: true })
      try {
        const nextPage = state.hotelsPagination.page + 1
        const merged = {
          ...(state.searchParams as any),
          page: nextPage,
          limit: state.hotelsPagination.limit,
        }
        const res = await api.getHotels(merged as HotelQuery)
        set({
          hotels: [...state.hotels, ...res.data],
          hotelsPagination: {
            page: nextPage,
            limit: res.meta.limit,
            total: res.meta.total,
            hasMore: nextPage * res.meta.limit < res.meta.total,
          },
        })
      } catch (err: any) {
        set({ error: err.message })
      } finally {
        set({ loading: false })
      }
    },

    fetchHotelDetail: async (id: string) => {
      set({ loading: true, error: null })
      try {
        const hotel = await api.getHotelDetail(id)
        set({ currentHotel: hotel })

        // 同时获取房型列表
        const rooms = await api.getRoomsByHotel(id)
        set({ currentHotelRooms: rooms.data || [] })
      } catch (err: any) {
        set({ error: err.message })
      } finally {
        set({ loading: false })
      }
    },

    fetchRoomDetail: async (id: string) => {
      set({ loading: true, error: null })
      try {
        const room = await api.getRoomDetail(id)
        set({ currentRoom: room })
      } catch (err: any) {
        set({ error: err.message })
      } finally {
        set({ loading: false })
      }
    },

    fetchHotHotels: async () => {
      try {
        const hotels = await api.getHotHotels(10)
        set({ hotHotels: hotels })
      } catch (err: any) {
        console.error('Failed to fetch hot hotels:', err.message)
      }
    },

    clearError: () => set({ error: null }),

    resetHotels: () =>
      set({
        hotels: [],
        hotelsPagination: {
          page: 1,
          limit: 10,
          total: 0,
          hasMore: true,
        },
      }),
  }))
}

// 全局 store 实例（惰性初始化，支持 reset）
let storeInstance: ReturnType<typeof createHotelStore> | null = null
let apiInstance: IApiService | null = null

/**
 * 获取 Hotel Store 实例（惰性初始化）
 * @throws 如果 Store 未初始化，抛出错误
 */
export function useHotelStore(): ReturnType<typeof createHotelStore> {
  if (!storeInstance) {
    throw new Error(
      '🔴 HotelStore not initialized! Call initHotelStore(api) in app startup.'
    )
  }
  return storeInstance
}

/**
 * 初始化 Hotel Store（幂等性）
 * @param api API 服务实例
 */
export function initHotelStore(api: IApiService): void {
  if (storeInstance) {
    console.warn('⚠️ HotelStore already initialized, skipping...')
    return
  }
  apiInstance = api
  storeInstance = createHotelStore(api)
}

/**
 * 重置 Store 状态（用于测试或用户登出）
 */
export function resetHotelStore(): void {
  if (!storeInstance) return
  const store = storeInstance as any
  store.resetHotels?.()
  store.clearError?.()
}
