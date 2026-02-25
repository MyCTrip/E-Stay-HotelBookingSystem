import { create } from 'zustand'
import type { IApiService } from '../api'
import type { HotelDomainModel } from '../domain/hotel/hotel.types'


import type {
  GeoPoint,
  HotelRoomSKUModel,
  HotelRoomSPUModel,
  HotelSearchParams,
} from '../domain/hotel/hotel.view.types'
import { groupRoomsToSPU, hotelApi, hotelService } from '../services/hotel'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const formatDate = (date: Date): string => date.toISOString().slice(0, 10)

const createDefaultSearchParams = (): HotelSearchParams => {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

  return {
    city: '北京',
    keyword: '',
    checkInDate: formatDate(today),
    checkOutDate: formatDate(tomorrow),
    market: 'domestic',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  }
}

const normalizeStars = (stars?: number[]): string =>
  Array.isArray(stars) ? [...stars].sort((left, right) => left - right).join(',') : ''

const buildInFlightKey = (params: HotelSearchParams): string =>
  [
    'city',
    params.city,
    'keyword',
    params.keyword ?? '',
    'checkInDate',
    params.checkInDate,
    'checkOutDate',
    params.checkOutDate,
    'market',
    params.market,
    'page',
    String(params.page),
    'limit',
    String(params.limit),
    'stars',
    normalizeStars(params.stars),
    'minPrice',
    String(params.minPrice ?? ''),
    'maxPrice',
    String(params.maxPrice ?? ''),
  ].join('|')

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '接口请求失败，请检查网络或后端服务'

const dedupeHotels = (hotels: HotelDomainModel[]): HotelDomainModel[] => {
  const map = new Map<string, HotelDomainModel>()
  hotels.forEach((hotel) => {
    // 在类型定义里 _id 是可选的 (?.)，所以加个兜底以防 TS 严格模式报错
    const uniqueId = hotel._id ?? String(Math.random()); 
    map.set(uniqueId, hotel)
  })
  return Array.from(map.values())
}
const findSkuFromCache = (
  roomSPUList: Record<string, HotelRoomSPUModel[]>,
  roomId: string
): HotelRoomSKUModel | null => {
  const allSpus = Object.values(roomSPUList).flat()

  for (const spu of allSpus) {
    const found = spu.skus.find((sku) => sku.roomId === roomId)
    if (found) {
      return found
    }
  }

  return null
}

export interface HotelStoreState {
  searchParams: HotelSearchParams
  hotelList: HotelDomainModel[]
  hotels: HotelDomainModel[]
  total: number
  hasMore: boolean
  loading: boolean
  currentHotelDetail: HotelDomainModel | null
  roomSPUList: Record<string, HotelRoomSPUModel[]>
  isRoomModalVisible: boolean
  currentSelectedRoomId: string | null
  currentRoom: HotelRoomSKUModel | null
  error: string | null
  inFlightKey: string | null
  setSearchParams: (params: Partial<HotelSearchParams>) => void
  fetchHotels: (ctx?: { append?: boolean; userLocation?: GeoPoint }) => Promise<void>
  fetchHotelDetail: (hotelId: string, ctx?: { userLocation?: GeoPoint }) => Promise<void>
  fetchHotelRooms: (hotelId: string) => Promise<HotelRoomSPUModel[]>
  fetchMoreHotels: (ctx?: { userLocation?: GeoPoint }) => Promise<void>
  fetchRoomSPUListByHotel: (hotelId: string) => Promise<HotelRoomSPUModel[]>
  fetchRoomDetail: (roomId: string) => Promise<void>
  setRoomModalVisible: (visible: boolean) => void
  openRoomModal: (roomId: string) => void
  closeRoomModal: () => void
  setCurrentSelectedRoomId: (roomId: string | null) => void
  clearError: () => void
  resetHotels: () => void
}

export type SearchParams = HotelSearchParams

export function createHotelStore(api: IApiService) {
  const store = create<HotelStoreState>((set, get) => ({
    searchParams: createDefaultSearchParams(),
    hotelList: [],
    hotels: [],
    total: 0,
    hasMore: true,
    loading: false,
    currentHotelDetail: null,
    roomSPUList: {},
    isRoomModalVisible: false,
    currentSelectedRoomId: null,
    currentRoom: null,
    error: null,
    inFlightKey: null,

    setSearchParams: (params: Partial<HotelSearchParams>) =>
      set((state) => {
        const previous = state.searchParams
        const merged: HotelSearchParams = {
          ...previous,
          ...params,
        }

        const filterChanged =
          normalizeStars(previous.stars) !== normalizeStars(merged.stars) ||
          previous.minPrice !== merged.minPrice ||
          previous.maxPrice !== merged.maxPrice

        const shouldResetPage =
          previous.city !== merged.city ||
          previous.keyword !== merged.keyword ||
          previous.checkInDate !== merged.checkInDate ||
          previous.checkOutDate !== merged.checkOutDate ||
          previous.market !== merged.market ||
          filterChanged

        if (shouldResetPage && params.page === undefined) {
          merged.page = DEFAULT_PAGE
        }

        return {
          searchParams: merged,
        }
      }),

    fetchHotels: async (ctx) => {
      const state = get()
      const requestKey = buildInFlightKey(state.searchParams)

      if (state.loading && state.inFlightKey === requestKey) {
        return
      }

      set({ loading: true, error: null, inFlightKey: requestKey })

      try {
        const serviceResult = await hotelService.searchHotels(api, state.searchParams, {
          userLocation: ctx?.userLocation,
        })
        
        set((currentState) => {
          const mergedHotels = ctx?.append
            ? dedupeHotels([...currentState.hotelList, ...serviceResult.list])
            : serviceResult.list

          return {
            hotelList: mergedHotels,
            hotels: mergedHotels,
            total: serviceResult.total,
            hasMore: serviceResult.page * serviceResult.limit < serviceResult.total,
            loading: false,
            inFlightKey: null,
          }
        })
      } catch (error) {
        console.error('Fetch Hotels Error:', error)
        set({
          loading: false,
          inFlightKey: null,
          error: getErrorMessage(error),
        })
      }
    },

    fetchHotelDetail: async (hotelId, ctx) => {
      set({ loading: true, error: null })

      try {
        const serviceDetail = await hotelService.getHotelDetail(api, hotelId, {
          userLocation: ctx?.userLocation,
        })
        
        // 严格校验新版数据结构中的 nameCn
        if (!serviceDetail || !serviceDetail.baseInfo?.nameCn) {
          throw new Error('获取到的酒店详情数据结构不完整或后端返回为空')
        }

        set({
          currentHotelDetail: serviceDetail,
          loading: false,
        })
      } catch (error) {
        console.error(`Fetch Hotel Detail Error [ID: ${hotelId}]:`, error)
        set({
          currentHotelDetail: null,
          loading: false,
          error: getErrorMessage(error),
        })
      }
    },

    fetchHotelRooms: async (hotelId) => {
      const cachedRooms = get().roomSPUList[hotelId]
      if (cachedRooms) {
        return cachedRooms
      }

      try {
        const serviceRooms = await hotelService.getHotelRooms(api, hotelId)

        set((state) => ({
          roomSPUList: {
            ...state.roomSPUList,
            [hotelId]: serviceRooms,
          },
        }))

        return serviceRooms
      } catch (error) {
        console.error(`Fetch Hotel Rooms Error [ID: ${hotelId}]:`, error)
        set({ error: getErrorMessage(error) })
        return []
      }
    },

    fetchMoreHotels: async (ctx) => {
      const state = get()
      if (state.loading || !state.hasMore) {
        return
      }

      set((currentState) => ({
        searchParams: {
          ...currentState.searchParams,
          page: currentState.searchParams.page + 1,
        },
      }))

      await get().fetchHotels({ append: true, userLocation: ctx?.userLocation })
    },

    fetchRoomSPUListByHotel: async (hotelId) => get().fetchHotelRooms(hotelId),

    fetchRoomDetail: async (roomId) => {
      const cachedSku = findSkuFromCache(get().roomSPUList, roomId)
      if (cachedSku) {
        set({ currentRoom: cachedSku })
        return
      }

      try {
        const payload = await hotelApi.getRoomDetail(api, roomId)
        const dataNode = isRecord(payload) && 'data' in payload ? payload.data : payload
        const grouped = groupRoomsToSPU([dataNode])

        const matchedSku =
          grouped.flatMap((spu) => spu.skus).find((sku) => sku.roomId === roomId) ??
          grouped[0]?.skus[0] ??
          null

        set({ currentRoom: matchedSku })
      } catch (error) {
        console.error(`Fetch Room Detail Error [ID: ${roomId}]:`, error)
        set({
          error: getErrorMessage(error),
          currentRoom: null,
        })
      }
    },

    setRoomModalVisible: (visible) =>
      set((state) => ({
        isRoomModalVisible: visible,
        currentSelectedRoomId: visible ? state.currentSelectedRoomId : null,
      })),

    openRoomModal: (roomId) =>
      set({
        isRoomModalVisible: true,
        currentSelectedRoomId: roomId,
      }),

    closeRoomModal: () =>
      set({
        isRoomModalVisible: false,
        currentSelectedRoomId: null,
      }),

    setCurrentSelectedRoomId: (roomId) => set({ currentSelectedRoomId: roomId }),

    clearError: () => set({ error: null }),

    resetHotels: () =>
      set((state) => ({
        searchParams: {
          ...state.searchParams,
          page: DEFAULT_PAGE,
        },
        hotelList: [],
        hotels: [],
        total: 0,
        hasMore: true,
      })),
  }))

  return store
}

let storeHook: ReturnType<typeof createHotelStore> | null = null

export function useHotelStore() {
  if (!storeHook) {
    throw new Error('HotelStore not initialized. Call initHotelStore(api) before use.')
  }
  return storeHook()
}

export function initHotelStore(api: IApiService): void {
  if (storeHook) {
    return
  }
  storeHook = createHotelStore(api)
}

export function resetHotelStore(): void {
  if (!storeHook) {
    return
  }
  storeHook.getState().resetHotels()
  storeHook.getState().clearError()
}

export const __internal__ = {
  buildInFlightKey,
}