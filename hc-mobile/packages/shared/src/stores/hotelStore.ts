import { create } from 'zustand'
import type { IApiService } from '../api'
import type {
  GeoPoint,
  HotelDomainModel,
  HotelRoomSKUModel,
  HotelRoomSPUModel,
  HotelSearchParams,
} from '../domain/hotel'
import { groupRoomsToSPU, hotelApi, hotelService } from '../services/hotel'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const formatDate = (date: Date): string => date.toISOString().slice(0, 10)

const createDefaultSearchParams = (): HotelSearchParams => {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

  return {
    city: 'Beijing',
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
  error instanceof Error ? error.message : 'Hotel request failed'

const dedupeHotels = (hotels: HotelDomainModel[]): HotelDomainModel[] => {
  const map = new Map<string, HotelDomainModel>()
  hotels.forEach((hotel) => {
    map.set(hotel.id, hotel)
  })
  return Array.from(map.values())
}

const MOCK_HOTEL_LIST: HotelDomainModel[] = [
  {
    id: 'mock-hotel-001',
    market: 'domestic',
    baseInfo: {
      name: 'Mock City Center Hotel',
      star: 4.6,
      address: 'Beijing CBD, Chaoyang District',
      description: 'Business hotel near metro and shopping area.',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
      ],
    },
    facilities: [
      { category: 'Star', content: '4 Star', summary: 'Urban business hotel' },
      { category: 'BreakfastIncluded', content: 'Breakfast Included' },
      { category: 'Brand', content: 'Domestic Chain' },
    ],
    policies: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Free cancellation before 18:00 on check-in date',
    },
    surroundings: [
      { surName: 'Metro Line 10', surType: 'metro', distanceMeters: 350, distanceText: '350m' },
      {
        surName: 'International Trade Center',
        surType: 'business',
        distanceMeters: 1200,
        distanceText: '1.2km',
      },
    ],
    rating: {
      score: 4.7,
      count: 1280,
      label: 'Excellent',
    },
    distanceText: '1.2km',
  },
  {
    id: 'mock-hotel-002',
    market: 'international',
    baseInfo: {
      name: 'Mock Marina Bay Hotel',
      star: 4.9,
      address: 'Marina Bay, Singapore',
      description: 'International chain hotel with skyline view.',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80',
      ],
    },
    facilities: [
      { category: 'Star', content: '5 Star' },
      { category: 'BreakfastIncluded', content: 'Breakfast Included' },
      { category: 'Brand', content: 'International Chain' },
    ],
    policies: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      cancellationPolicy: 'Free cancellation up to 24 hours before arrival',
    },
    surroundings: [
      { surName: 'Bayfront MRT', surType: 'metro', distanceMeters: 500, distanceText: '500m' },
      {
        surName: 'Convention Center',
        surType: 'business',
        distanceMeters: 900,
        distanceText: '900m',
      },
    ],
    rating: {
      score: 4.9,
      count: 2034,
      label: 'Outstanding',
    },
    distanceText: '500m',
  },
]

const MOCK_ROOM_SPU_LIST: Record<string, HotelRoomSPUModel[]> = {
  'mock-hotel-001': [
    {
      spuName: 'Deluxe King Room',
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80'],
      headInfo: {
        size: '32m²',
        floor: '8-15',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [{ bedType: 'King Bed', bedNumber: 1, bedSize: '1.8m' }],
      startingPrice: 688,
      skus: [
        {
          roomId: 'mock-room-001-a',
          priceInfo: { nightlyPrice: 688 },
          status: 'available',
          cancellationRule: 'Free cancellation before 18:00 on check-in date',
        },
        {
          roomId: 'mock-room-001-b',
          priceInfo: { nightlyPrice: 768 },
          status: 'sold_out',
          cancellationRule: 'No cancellation',
        },
      ],
    },
    {
      spuName: 'Executive Twin Room',
      images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80'],
      headInfo: {
        size: '36m²',
        floor: '16-20',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [{ bedType: 'Twin Bed', bedNumber: 2, bedSize: '1.2m' }],
      startingPrice: 758,
      skus: [
        {
          roomId: 'mock-room-001-c',
          priceInfo: { nightlyPrice: 758 },
          status: 'available',
          cancellationRule: 'Free cancellation before 18:00 on check-in date',
        },
      ],
    },
  ],
  'mock-hotel-002': [
    {
      spuName: 'Skyline Suite',
      images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80'],
      headInfo: {
        size: '48m²',
        floor: '20-30',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [{ bedType: 'King Bed', bedNumber: 1, bedSize: '2.0m' }],
      startingPrice: 1288,
      skus: [
        {
          roomId: 'mock-room-002-a',
          priceInfo: { nightlyPrice: 1288 },
          status: 'available',
          cancellationRule: 'Free cancellation up to 24 hours before arrival',
        },
      ],
    },
    {
      spuName: 'Family Connecting Room',
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80'],
      headInfo: {
        size: '58m²',
        floor: '10-18',
        wifi: true,
        windowAvailable: true,
        smokingAllowed: false,
      },
      bedInfo: [{ bedType: 'Family Bed', bedNumber: 2, bedSize: '1.5m' }],
      startingPrice: 1688,
      skus: [
        {
          roomId: 'mock-room-002-b',
          priceInfo: { nightlyPrice: 1688 },
          status: 'available',
          cancellationRule: 'Free cancellation up to 24 hours before arrival',
        },
      ],
    },
  ],
}

const toLowerCase = (value: string): string => value.trim().toLowerCase()

const includesText = (source: string, keyword: string): boolean =>
  toLowerCase(source).includes(toLowerCase(keyword))

const getHotelStartingPrice = (hotelId: string): number => {
  const spuList = MOCK_ROOM_SPU_LIST[hotelId] ?? []
  if (spuList.length === 0) {
    return 0
  }
  return Math.min(...spuList.map((spu) => spu.startingPrice))
}

const filterMockHotels = (params: HotelSearchParams): HotelDomainModel[] =>
  MOCK_HOTEL_LIST.filter((hotel) => {
    if (hotel.market !== params.market) {
      return false
    }

    if (params.city && !includesText(hotel.baseInfo.address, params.city) && !includesText(hotel.baseInfo.name, params.city)) {
      return false
    }

    if (
      params.keyword &&
      !includesText(hotel.baseInfo.name, params.keyword) &&
      !includesText(hotel.baseInfo.address, params.keyword) &&
      !includesText(hotel.baseInfo.description, params.keyword)
    ) {
      return false
    }

    if (params.stars && params.stars.length > 0) {
      const starBucket = Math.floor(hotel.baseInfo.star)
      if (!params.stars.includes(starBucket)) {
        return false
      }
    }

    const startingPrice = getHotelStartingPrice(hotel.id)

    if (params.minPrice !== undefined && startingPrice < params.minPrice) {
      return false
    }

    if (params.maxPrice !== undefined && startingPrice > params.maxPrice) {
      return false
    }

    return true
  })

const getMockHotelListResult = (params: HotelSearchParams): {
  list: HotelDomainModel[]
  total: number
  page: number
  limit: number
} => {
  const filtered = filterMockHotels(params)
  const startIndex = (params.page - 1) * params.limit
  const endIndex = startIndex + params.limit

  return {
    list: filtered.slice(startIndex, endIndex),
    total: filtered.length,
    page: params.page,
    limit: params.limit,
  }
}

const getMockHotelDetail = (hotelId: string, market: HotelSearchParams['market']): HotelDomainModel =>
  MOCK_HOTEL_LIST.find((hotel) => hotel.id === hotelId) ??
  MOCK_HOTEL_LIST.find((hotel) => hotel.market === market) ??
  MOCK_HOTEL_LIST[0]

const getMockRoomsByHotelId = (hotelId: string): HotelRoomSPUModel[] =>
  MOCK_ROOM_SPU_LIST[hotelId] ?? MOCK_ROOM_SPU_LIST[MOCK_HOTEL_LIST[0].id] ?? []

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
        const result =
          serviceResult.list.length > 0 ? serviceResult : getMockHotelListResult(state.searchParams)

        set((currentState) => {
          const mergedHotels = ctx?.append
            ? dedupeHotels([...currentState.hotelList, ...result.list])
            : result.list

          return {
            hotelList: mergedHotels,
            hotels: mergedHotels,
            total: result.total,
            hasMore: result.page * result.limit < result.total,
            loading: false,
            inFlightKey: null,
          }
        })
      } catch {
        const fallbackResult = getMockHotelListResult(state.searchParams)
        const mergedFallbackHotels = ctx?.append
          ? dedupeHotels([...state.hotelList, ...fallbackResult.list])
          : fallbackResult.list

        set({
          hotelList: mergedFallbackHotels,
          hotels: mergedFallbackHotels,
          total: fallbackResult.total,
          hasMore: fallbackResult.page * fallbackResult.limit < fallbackResult.total,
          loading: false,
          inFlightKey: null,
          error: null,
        })
      }
    },

    fetchHotelDetail: async (hotelId, ctx) => {
      set({ loading: true, error: null })

      try {
        const serviceDetail = await hotelService.getHotelDetail(api, hotelId, {
          userLocation: ctx?.userLocation,
        })
        const detail =
          serviceDetail.id && serviceDetail.baseInfo.name
            ? serviceDetail
            : getMockHotelDetail(hotelId, get().searchParams.market)

        set({
          currentHotelDetail: detail,
          loading: false,
        })
      } catch {
        const fallbackDetail = getMockHotelDetail(hotelId, get().searchParams.market)
        set({
          currentHotelDetail: fallbackDetail,
          loading: false,
          error: null,
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
        const groupedRooms = serviceRooms.length > 0 ? serviceRooms : getMockRoomsByHotelId(hotelId)

        set((state) => ({
          roomSPUList: {
            ...state.roomSPUList,
            [hotelId]: groupedRooms,
          },
        }))

        return groupedRooms
      } catch {
        const fallbackRooms = getMockRoomsByHotelId(hotelId)
        set((state) => ({
          roomSPUList: {
            ...state.roomSPUList,
            [hotelId]: fallbackRooms,
          },
          error: null,
        }))
        return fallbackRooms
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

