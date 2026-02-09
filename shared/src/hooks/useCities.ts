import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

/**
 * 创建获取城市列表的 hook - 工厂函数
 * @param api Axios 实例
 */
export function createUseCities(api: AxiosInstance) {
  return function useCities() {
    return useQuery({
      queryKey: ['cities'],
      queryFn: () => api.get('/hotels/cities') as Promise<string[]>,
      staleTime: 24 * 60 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
    })
  }
}
