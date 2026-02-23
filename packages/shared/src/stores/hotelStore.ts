import { create, StoreApi, UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { IApiService } from '../api'
// 严格引入我们在 models.ts 中定义的所有强类型
import { Hotel, Room, HotelQuery, PropertyType } from '../types/models'

// ==========================================
// 1️⃣ 数据分层定义 (Types)
// ==========================================

// 将 loading 状态细分，防止“拉取热门酒店”时，整个列表页转圈圈
export interface HotelUIState {
  listLoading: boolean
  moreLoading: boolean    // 专门用于上拉加载更多
  detailLoading: boolean
  roomLoading: boolean
  error: string | null
}

export interface HotelPagination {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// 完整的 Store 状态树 (完美融合了你的全场景数据)
export interface HotelStoreState {
  // ===== 核心配置 =====
  isInternational: boolean

  // ===== 查询条件 =====
  searchParams: HotelQuery

  // ===== 列表数据 =====
  hotels: Hotel[]
  hotelsPagination: HotelPagination

  // ===== 详情与房型数据 =====
  currentHotel: Hotel | null
  currentHotelRooms: Room[]
  currentRoom: Room | null

  // ===== 扩展数据 =====
  hotHotels: Hotel[]

  // ===== UI 状态 =====
  ui: HotelUIState

  // ===== Actions (同步) =====
  setMode: (isInternational: boolean) => void
  setSearchParams: (params: Partial<HotelQuery>) => void
  clearError: () => void
  resetHotels: () => void

  // ===== Actions (异步) =====
  fetchHotels: (overrideQuery?: Partial<HotelQuery>) => Promise<void>
  fetchMoreHotels: () => Promise<void>
  fetchHotelDetail: (id: string) => Promise<void>
  fetchRoomDetail: (id: string) => Promise<void>
  fetchHotHotels: (limit?: number) => Promise<void>
}

// ==========================================
// 2️⃣ Store 工厂函数 (无任何 `any`)
// ==========================================

export function createHotelStore(api: IApiService) {
  const store = create<HotelStoreState>((set: any, get: any) => ({
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
          propertyType: 'hotel' as PropertyType,
        },
        hotels: [],
        hotelsPagination: { page: 1, limit: 10, total: 0, hasMore: true },
        currentHotel: null,
        currentHotelRooms: [],
        currentRoom: null,
        hotHotels: [],
        ui: {
          listLoading: false,
          moreLoading: false,
          detailLoading: false,
          roomLoading: false,
          error: null,
        },

        // --- 同步 Actions ---
        setMode: (isInternational) => {
          set({ isInternational }, false, 'hotel/setMode')
          // 切换模式时清空现有数据并重新拉取
          get().resetHotels()
          get().fetchHotels()
        },

        setSearchParams: (params) => {
          set((state) => ({
            searchParams: { ...state.searchParams, ...params },
          }), false, 'hotel/setSearchParams')
        },

        clearError: () => set((s) => ({ ui: { ...s.ui, error: null } }), false, 'hotel/clearError'),

        resetHotels: () => set((s) => ({
          hotels: [],
          hotelsPagination: { page: 1, limit: s.searchParams.limit || 10, total: 0, hasMore: true },
        }), false, 'hotel/resetHotels'),

        // --- 异步 Actions ---
        
        // 1. 获取首屏列表
        fetchHotels: async (overrideQuery) => {
          const state = get()
          // 智能合并：Store内部参数 + 外部强行覆盖的参数 + isInternational注入
          const query: HotelQuery = {
            ...state.searchParams,
            ...overrideQuery,
            isInternational: state.isInternational,
            page: 1, // 首屏强制第一页
          }

          set((s) => ({ ui: { ...s.ui, listLoading: true, error: null } }), false, 'hotel/fetchHotels_start')

          try {
            // 类型严密的 API 调用，res 被推导为 ApiResponse<PaginatedResponse<Hotel>>
            const res = await api.getHotels(query)
            
            set((s) => ({
              hotels: res.data.items,
              hotelsPagination: {
                page: res.data.page,
                limit: res.data.limit,
                total: res.data.total,
                hasMore: (res.data.page * res.data.limit) < res.data.total,
              },
              // 同步更新最新的查询参数到 state
              searchParams: query,
              ui: { ...s.ui, listLoading: false },
            }), false, 'hotel/fetchHotels_success')
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error'
            set((s) => ({ ui: { ...s.ui, listLoading: false, error: errorMsg } }), false, 'hotel/fetchHotels_error')
          }
        },

        // 2. 加载更多 (无限滚动)
        fetchMoreHotels: async () => {
          const state = get()
          if (!state.hotelsPagination.hasMore || state.ui.moreLoading) return

          const nextPage = state.hotelsPagination.page + 1
          const query: HotelQuery = {
            ...state.searchParams,
            isInternational: state.isInternational,
            page: nextPage,
          }

          set((s) => ({ ui: { ...s.ui, moreLoading: true, error: null } }), false, 'hotel/fetchMore_start')

          try {
            const res = await api.getHotels(query)
            set((s) => ({
              // 追加数据
              hotels: [...s.hotels, ...res.data.items],
              hotelsPagination: {
                page: nextPage,
                limit: res.data.limit,
                total: res.data.total,
                hasMore: (nextPage * res.data.limit) < res.data.total,
              },
              ui: { ...s.ui, moreLoading: false },
            }), false, 'hotel/fetchMore_success')
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error'
            set((s) => ({ ui: { ...s.ui, moreLoading: false, error: errorMsg } }), false, 'hotel/fetchMore_error')
          }
        },

        // 3. 酒店详情 & 房型列表联动
        fetchHotelDetail: async (id: string) => {
          const { isInternational } = get()
          set((s) => ({ ui: { ...s.ui, detailLoading: true, error: null } }), false, 'hotel/fetchDetail_start')

          try {
            // 优雅的并发请求：同时拉取酒店基本信息和房型列表
            const [hotelRes, roomsRes] = await Promise.all([
              api.getHotelDetail(id, isInternational),
              api.getRoomsByHotel(id, {}, isInternational) // 传入空 params
            ])

            set((s) => ({
              currentHotel: hotelRes.data,
              currentHotelRooms: roomsRes.data.items, // 注意解包 PaginatedResponse
              ui: { ...s.ui, detailLoading: false },
            }), false, 'hotel/fetchDetail_success')
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error'
            set((s) => ({ ui: { ...s.ui, detailLoading: false, error: errorMsg } }), false, 'hotel/fetchDetail_error')
          }
        },

        // 4. 单一房型详情
        fetchRoomDetail: async (id: string) => {
          const { isInternational } = get()
          set((s) => ({ ui: { ...s.ui, roomLoading: true, error: null } }), false, 'hotel/fetchRoom_start')

          try {
            const res = await api.getRoomDetail(id, isInternational)
            set((s) => ({
              currentRoom: res.data,
              ui: { ...s.ui, roomLoading: false },
            }), false, 'hotel/fetchRoom_success')
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error'
            set((s) => ({ ui: { ...s.ui, roomLoading: false, error: errorMsg } }), false, 'hotel/fetchRoom_error')
          }
        },

        // 5. 热门酒店
        fetchHotHotels: async (limit = 10) => {
          const { isInternational } = get()
          try {
            const res = await api.getHotHotels(limit, isInternational)
            set({ hotHotels: res.data }, false, 'hotel/fetchHotHotels_success')
          } catch (err: unknown) {
            console.error('Failed to fetch hot hotels:', err)
          }
        },
      }),
  }))
  return store
}

// 全局 store hook（惰性初始化，支持 reset）
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
 * 重置 Store 状态（用于测试、用户登出或全局强制清理）
 */
export function resetHotelStore(): void {
  if (!storeHook) return
  const state = storeHook.getState() as any
  state.resetHotels?.()
  state.clearError?.()
}
