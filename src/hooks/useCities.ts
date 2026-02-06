import { useQuery } from '@tanstack/react-query'
import { fetchCities } from '../services/hotel'

/**
 * 获取城市列表的 hook
 * 缓存 24 小时（后端已设），前端额外缓存
 */
export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })
}
