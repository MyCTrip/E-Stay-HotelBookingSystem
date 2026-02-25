import type { IApiService } from '../../api'
import type { HotelDomainModel } from '../../domain/hotel/hotel.types'
import type {
  HotelAdapterContext,
  HotelRoomSPUModel,
  HotelSearchParams,
} from '../../domain/hotel'
import { groupRoomsToSPU, mapHotelDtoToDomain, mapHotelListDtoToDomainList } from './hotel.adapter'
import { hotelApi } from './hotel.api'

export interface HotelListResult {
  list: HotelDomainModel[]
  total: number
  page: number
  limit: number
}

interface ParsedHotelListPayload {
  list: unknown[]
  total: number
  page: number
  limit: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  return fallback
}

const getDataNode = (payload: unknown): unknown =>
  isRecord(payload) && 'data' in payload ? payload.data : payload

const parseListPayload = (payload: unknown): ParsedHotelListPayload => {
  const dataNode = getDataNode(payload)

  if (isRecord(dataNode) && Array.isArray(dataNode.items)) {
    return {
      list: dataNode.items,
      total: toNumber(dataNode.total, dataNode.items.length),
      page: toNumber(dataNode.page, 1),
      limit: toNumber(dataNode.limit, 10),
    }
  }

  if (Array.isArray(dataNode)) {
    const meta = isRecord(payload) && isRecord(payload.meta) ? payload.meta : {}
    return {
      list: dataNode,
      total: toNumber(meta.total, dataNode.length),
      page: toNumber(meta.page, 1),
      limit: toNumber(meta.limit, dataNode.length > 0 ? dataNode.length : 10),
    }
  }

  if (isRecord(dataNode) && Array.isArray(dataNode.data)) {
    const meta = isRecord(dataNode.meta) ? dataNode.meta : {}
    return {
      list: dataNode.data,
      total: toNumber(meta.total, dataNode.data.length),
      page: toNumber(meta.page, 1),
      limit: toNumber(meta.limit, dataNode.data.length > 0 ? dataNode.data.length : 10),
    }
  }

  return {
    list: [],
    total: 0,
    page: 1,
    limit: 10,
  }
}

const parseHotelDetailPayload = (payload: unknown, ctx?: HotelAdapterContext): HotelDomainModel => {
  const dataNode = getDataNode(payload)
  return mapHotelDtoToDomain(dataNode, ctx)
}

const parseHotelRoomsPayload = (payload: unknown): HotelRoomSPUModel[] => {
  const dataNode = getDataNode(payload)

  if (isRecord(dataNode) && Array.isArray(dataNode.items)) {
    return groupRoomsToSPU(dataNode.items)
  }

  if (Array.isArray(dataNode)) {
    return groupRoomsToSPU(dataNode)
  }

  return []
}

export const hotelService = {
  async searchHotels(
    api: IApiService,
    params: HotelSearchParams,
    ctx?: HotelAdapterContext
  ): Promise<HotelListResult> {
    const payload = await hotelApi.getHotelList(api, params)
    const parsed = parseListPayload(payload)

    return {
      ...parsed,
      list: mapHotelListDtoToDomainList(parsed.list, ctx),
    }
  },

  async getHotelDetail(
    api: IApiService,
    hotelId: string,
    ctx?: HotelAdapterContext
  ): Promise<HotelDomainModel> {
    const payload = await hotelApi.getHotelDetail(api, hotelId)
    return parseHotelDetailPayload(payload, ctx)
  },

  async getHotelRooms(api: IApiService, hotelId: string): Promise<HotelRoomSPUModel[]> {
    const payload = await hotelApi.getHotelRooms(api, hotelId)
    return parseHotelRoomsPayload(payload)
  },
}

