import type { IApiService } from '../../api'
import type { HotelSearchParams } from '../../domain/hotel'

export interface HotelApiListQuery {
  city: string
  keyword?: string
  search?: string
  checkIn: string
  checkOut: string
  market: 'domestic' | 'international'
  page: number
  limit: number
  stars?: number[]
  minPrice?: number
  maxPrice?: number
  propertyType: 'hotel'
}

const buildListQuery = (params: HotelSearchParams): HotelApiListQuery => ({
  city: params.city,
  keyword: params.keyword?.trim() || undefined,
  search: params.keyword?.trim() || undefined,
  checkIn: params.checkInDate,
  checkOut: params.checkOutDate,
  market: params.market,
  page: params.page,
  limit: params.limit,
  stars: params.stars,
  minPrice: params.minPrice,
  maxPrice: params.maxPrice,
  propertyType: 'hotel',
})

export const hotelApi = {
  getHotelList(api: IApiService, params: HotelSearchParams): Promise<unknown> {
    return api.getHotels(buildListQuery(params))
  },

  getHotelDetail(api: IApiService, hotelId: string): Promise<unknown> {
    return api.getHotelDetail(hotelId)
  },

  getHotelRooms(api: IApiService, hotelId: string): Promise<unknown> {
    return api.getRoomsByHotel(hotelId, { propertyType: 'hotel' as const })
  },

  getRoomDetail(api: IApiService, roomId: string): Promise<unknown> {
    return api.getRoomDetail(roomId)
  },
}

