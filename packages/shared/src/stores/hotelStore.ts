import { create } from 'zustand'
import { IApiService } from '../api'
import { Hotel, Room, HotelQuery, PropertyType } from '../types'
import type { HotelSearchParams, HotelStoreState } from './types'

/**
 * 旧版搜索参数（保留兼容性，不推荐使用）
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
 * 导出 Hotel 专用类型（推荐使用）
 */
export type { HotelSearchParams, HotelStoreState }

/**
 * 创建酒店 Store（工厂函数）
 */
export function createHotelStore(api: IApiService) {
  const store = create<HotelStoreState>((set: any, get: any) => ({
    // ===== 初始状态 =====
    searchParams: {
      city: 'Beijing',
      keyword: '',
      checkInDate: new Date().toISOString().slice(0, 10),
      checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      market: 'domestic',
      page: 1,
      limit: 10,
    },
    hotelList: [],
    hotels: [],
    total: 0,
    hasMore: true,
    currentHotelDetail: null,
    roomSPUList: {},
    currentSelectedRoomId: null,
    currentRoom: null,
    isRoomModalVisible: false,
    loading: false,
    error: null,
    inFlightKey: null,

    // ===== Actions: 搜索和过滤 =====
    setSearchParams: (params: Partial<HotelSearchParams>) =>
      set((state: HotelStoreState) => ({
        searchParams: { ...state.searchParams, ...params },
      })),

    // ===== Actions: 获取数据 =====
    fetchHotels: async (ctx?: { append?: boolean; userLocation?: any; city?: string; checkInDate?: string; checkOutDate?: string }) => {
      const state = get()
      
      // 如果提供了具体的搜索参数，先更新store的searchParams
      if (ctx?.city || ctx?.checkInDate || ctx?.checkOutDate) {
        set((currentState: HotelStoreState) => ({
          searchParams: {
            ...currentState.searchParams,
            ...(ctx.city && { city: ctx.city }),
            ...(ctx.checkInDate && { checkInDate: ctx.checkInDate }),
            ...(ctx.checkOutDate && { checkOutDate: ctx.checkOutDate }),
          },
        }))
      }
      
      const updatedState = get()
      const requestKey = buildInFlightKey(updatedState.searchParams)

      if (state.loading && state.inFlightKey === requestKey) {
        return
      }

      set({ loading: true, error: null, inFlightKey: requestKey })
      try {
        // 使用更新后的searchParams进行请求
        const mergedQuery = { ...updatedState.searchParams }
        const res = await api.getHotels(mergedQuery as any as HotelQuery)
        
        set((currentState: HotelStoreState) => {
          const mergedHotels = ctx?.append
            ? dedupeHotels([...currentState.hotelList, ...res.data])
            : res.data

          return {
            hotelList: mergedHotels,
            hotels: mergedHotels,
            total: res.meta.total,
            hasMore: res.meta.page * res.meta.limit < res.meta.total,
            loading: false,
            inFlightKey: null,
          }
        })
      } catch (err: any) {
        set({
          error: err.message,
          loading: false,
          inFlightKey: null,
        })
      }
    },

    fetchHotelDetail: async (hotelId: string, ctx?: { userLocation?: any }) => {
      set({ loading: true, error: null })
      try {
        const hotel = await api.getHotelDetail(hotelId)
        set({ currentHotelDetail: hotel, loading: false })
      } catch (err: any) {
        set({
          error: err.message,
          currentHotelDetail: null,
          loading: false,
        })
      }
    },

    fetchHotelRooms: async (hotelId: string) => {
      const cachedRooms = get().roomSPUList[hotelId]
      if (cachedRooms) {
        return cachedRooms
      }

      try {
        const rooms = await api.getRoomsByHotel(hotelId)
        const spuList: any[] = rooms.data || []

        set((state: HotelStoreState) => ({
          roomSPUList: {
            ...state.roomSPUList,
            [hotelId]: spuList,
          },
        }))

        return spuList
      } catch (err: any) {
        set({
          error: err.message,
        })
        return []
      }
    },

    fetchMoreHotels: async (ctx?: { userLocation?: any }) => {
      const state = get()
      if (state.loading || !state.hasMore) {
        return
      }

      set((currentState: HotelStoreState) => ({
        searchParams: {
          ...currentState.searchParams,
          page: currentState.searchParams.page + 1,
        },
      }))

      await get().fetchHotels({ append: true, userLocation: ctx?.userLocation })
    },

    fetchRoomSPUListByHotel: async (hotelId: string) => {
      return get().fetchHotelRooms(hotelId)
    },

    fetchRoomDetail: async (roomId: string) => {
      const roomSPUList = get().roomSPUList
      const cachedSku = findSkuFromCache(roomSPUList, roomId)
      
      if (cachedSku) {
        set({ currentRoom: cachedSku })
        return
      }

      try {
        const room = await api.getRoomDetail(roomId)
        set({ currentRoom: room })
      } catch (err: any) {
        set({
          error: err.message,
          currentRoom: null,
        })
      }
    },

    // ===== Actions: 房间模态框 =====
    setRoomModalVisible: (visible: boolean) =>
      set((state: HotelStoreState) => ({
        isRoomModalVisible: visible,
        currentSelectedRoomId: visible ? state.currentSelectedRoomId : null,
      })),

    openRoomModal: (roomId: string) =>
      set({
        isRoomModalVisible: true,
        currentSelectedRoomId: roomId,
      }),

    closeRoomModal: () =>
      set({
        isRoomModalVisible: false,
        currentSelectedRoomId: null,
      }),

    setCurrentSelectedRoomId: (roomId: string | null) =>
      set({ currentSelectedRoomId: roomId }),

    // ===== Actions: 其他 =====
    clearError: () => set({ error: null }),

    resetHotels: () =>
      set({
        searchParams: {
          city: 'Beijing',
          keyword: '',
          checkInDate: new Date().toISOString().slice(0, 10),
          checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          market: 'domestic',
          page: 1,
          limit: 10,
        },
        hotelList: [],
        hotels: [],
        total: 0,
        hasMore: true,
        currentHotelDetail: null,
        roomSPUList: {},
        currentSelectedRoomId: null,
        currentRoom: null,
      }),
  }))
  return store
}

// ===== 辅助函数 =====

const buildInFlightKey = (params: HotelSearchParams): string =>
  [
    'city', params.city,
    'keyword', params.keyword ?? '',
    'checkInDate', params.checkInDate,
    'checkOutDate', params.checkOutDate,
    'market', params.market,
    'page', String(params.page),
    'limit', String(params.limit),
    'stars', Array.isArray(params.stars) ? params.stars.sort((a, b) => a - b).join(',') : '',
    'minPrice', String(params.minPrice ?? ''),
    'maxPrice', String(params.maxPrice ?? ''),
  ].join('|')

const dedupeHotels = (hotels: Hotel[]): Hotel[] => {
  const map = new Map<string, Hotel>()
  hotels.forEach((hotel) => {
    map.set(hotel._id, hotel)
  })
  return Array.from(map.values())
}

const findSkuFromCache = (
  roomSPUList: Record<string, any[]>,
  roomId: string
): any | null => {
  const allSpus = Object.values(roomSPUList).flat()

  for (const spu of allSpus) {
    const found = spu.skus?.find((sku: any) => sku.roomId === roomId)
    if (found) {
      return found
    }
  }

  return null
}

// ===== 全局 Store Hook =====

let storeHook: ReturnType<typeof createHotelStore> | null = null
let apiInstance: IApiService | null = null

/**
 * 获取 Hotel Store Hook（作为 React Hook 使用）
 * @throws 如果 Store 未初始化，抛出错误
 */
export function useHotelStore() {
  if (!storeHook) {
    throw new Error('🔴 HotelStore not initialized! Call initHotelStore(api) in app startup.')
  }
  return storeHook() // ✅ 调用 hook 获取 state
}

/**
 * 获取 store 实例（用于非-React 上下文）
 */
function getStoreInstance() {
  if (!storeHook) {
    throw new Error('HotelStore not initialized')
  }
  return storeHook
}

/**
 * 初始化 Hotel Store（幂等性）
 * @param api API 服务实例
 */
export function initHotelStore(api: IApiService): void {
  if (storeHook) {
    console.warn('⚠️ HotelStore already initialized, skipping...')
    return
  }
  apiInstance = api
  storeHook = createHotelStore(api)
}

/**
 * 重置 Store 状态（用于测试或用户登出）
 */
export function resetHotelStore(): void {
  if (!storeHook) return
  const state = storeHook.getState() as any
  state.resetHotels?.()
  state.clearError?.()
}
