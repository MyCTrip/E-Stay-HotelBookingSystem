import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchHotels, HotelQuery, Hotel, HotelListResponse } from '../services/hotel'

export interface UseHotelListOptions {
  staleTime?: number
  gcTime?: number
  retry?: number
}

/**
 * 获取酒店列表的 hook（包含缓存、重试等）
 * 开发建议：所有依赖服务端数据的页面都应通过 hook 获取，方便日后平台迁移
 */
export function useHotelList(
  query: HotelQuery,
  options: UseHotelListOptions = {}
): UseQueryResult<HotelListResponse, Error> {
  const { staleTime = 5 * 60 * 1000, gcTime = 30 * 60 * 1000, retry = 2 } = options

  return useQuery({
    queryKey: ['hotels', query],
    queryFn: () => fetchHotels(query),
    staleTime,
    gcTime,
    retry,
    enabled: !!query.city, // 有查询条件才触发
  })
}

/**
 * 获取单个酒店详情的 hook
 */
export function useHotelDetail(hotelId: string | null) {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: async () => {
      // 这里后期换成 fetchHotelDetail
      const res = await fetch(`/api/hotels/${hotelId}`)
      return res.json()
    },
    enabled: !!hotelId,
    staleTime: 10 * 60 * 1000,
  })
}
