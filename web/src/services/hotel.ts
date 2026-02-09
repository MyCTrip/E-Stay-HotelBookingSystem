import api from './api'
import { createHotelService, type Hotel, type HotelQuery, type HotelListResponse } from '@estay/shared/services'

// 使用 api 实例创建酒店服务
const hotelService = createHotelService(api)

// 导出这些函数以保持向后兼容
export { type Hotel, type HotelQuery, type HotelListResponse }

export const fetchHotels = hotelService.fetchHotels
export const fetchHotHotels = hotelService.fetchHotHotels
export const fetchCities = hotelService.fetchCities
export const fetchHotelDetail = hotelService.fetchHotelDetail
export const fetchRoomsByHotel = hotelService.fetchRoomsByHotel
