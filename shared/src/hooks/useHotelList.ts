import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { HotelQuery, Hotel, HotelListResponse } from '../services/hotel'

export interface UseHotelListOptions {
  staleTime?: number
  gcTime?: number
  retry?: number
}

/**
 * 创建获取酒店列表的 hook - 工厂函数
 * @param api Axios 实例
 */
export function createUseHotelList(api: AxiosInstance) {
  return function useHotelList(
    query: HotelQuery,
    options: UseHotelListOptions = {}
  ): UseQueryResult<HotelListResponse, Error> {
    const { staleTime = 5 * 60 * 1000, gcTime = 30 * 60 * 1000, retry = 2 } = options

    return useQuery({
      queryKey: ['hotels', query],
      queryFn: () => api.get('/hotels', { params: query }) as Promise<HotelListResponse>,
      staleTime,
      gcTime,
      retry,
      enabled: !!query.city,
    })
  }
}

/**
 * 创建获取单个酒店详情的 hook - 工厂函数
 */
export function createUseHotelDetail(api: AxiosInstance) {
  return function useHotelDetail(hotelId: string | null) {
    return useQuery({
      queryKey: ['hotel', hotelId],
      queryFn: () => api.get(`/hotels/${hotelId}`),
      enabled: !!hotelId,
      staleTime: 10 * 60 * 1000,
    })
  }
}
