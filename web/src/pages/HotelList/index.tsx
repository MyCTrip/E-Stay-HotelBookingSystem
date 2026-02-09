import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useHotelList } from '../../hooks/useHotelList'
import { useSearchStore } from '../../stores/searchStore'
import HotelCard from '../../components/HotelCard'
import { cn } from '../../utils/cn'

export default function HotelList() {
  const [searchParams] = useSearchParams()
  const { city } = useSearchStore()
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price')

  const queryCity = searchParams.get('city') || city
  const { data, isLoading, error } = useHotelList(
    {
      city: queryCity,
      limit: 15,
      page,
    },
    { staleTime: 5 * 60 * 1000 }
  )

  const hotels = useMemo(() => {
    if (!data?.data) return []
    const sorted = [...data.data]
    if (sortBy === 'price') {
      sorted.sort((a, b) => (a.baseInfo?.price || 0) - (b.baseInfo?.price || 0))
    }
    return sorted
  }, [data, sortBy])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">加载失败，请稍后重试</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          重新加载
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 搜索条件头 */}
      <div className="bg-white rounded-lg p-4 shadow sticky top-16 z-5">
        <h2 className="font-semibold text-sm">{queryCity} · 不限日期 · 1 房</h2>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setSortBy('price')}
            className={cn(
              'px-3 py-1 text-xs rounded',
              sortBy === 'price'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            价格低到高
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={cn(
              'px-3 py-1 text-xs rounded',
              sortBy === 'rating'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            评分高到低
          </button>
        </div>
      </div>

      {/* 酒店列表 */}
      <div className="space-y-3 pb-4">
        {hotels.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无搜索结果
          </div>
        ) : (
          hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
        )}
      </div>

      {/* 分页 */}
      {data?.meta && (
        <div className="flex justify-between items-center py-4 border-t">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600">
            第 {page} 页 / 共 {Math.ceil((data.meta.total || 0) / 15)} 页
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil((data.meta.total || 0) / 15)}
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
