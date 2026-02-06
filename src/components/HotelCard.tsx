import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/format'
import { cn } from '../utils/cn'

interface HotelCardProps {
  hotel: any
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const minPrice = hotel.baseInfo?.price || 0
  const star = hotel.baseInfo?.star || 4
  const image = hotel.baseInfo?.images?.[0]

  return (
    <Link
      to={`/hotels/${hotel._id}`}
      className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
    >
      {/* 图片区 */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={hotel.baseInfo?.nameCn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            无图片
          </div>
        )}

        {/* 星级标签 */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
          <span className="font-bold text-yellow-500">★ {star}</span>
        </div>
      </div>

      {/* 信息区 */}
      <div className="p-3 space-y-2">
        <h4 className="font-semibold text-sm line-clamp-2 text-gray-900">
          {hotel.baseInfo?.nameCn}
        </h4>

        <p className="text-xs text-gray-600 line-clamp-1 flex items-center gap-1">
          📍 {hotel.baseInfo?.address}
        </p>

        {/* 设施标签 */}
        <div className="flex gap-1 flex-wrap pt-1">
          {hotel.baseInfo?.facilities?.slice(0, 2).map((fac: any, idx: number) => (
            <span
              key={idx}
              className="inline-block px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded"
            >
              {fac.category || '设施'}
            </span>
          ))}
          {(hotel.baseInfo?.facilities?.length || 0) > 2 && (
            <span className="text-xs text-gray-500">
              +{(hotel.baseInfo?.facilities?.length || 0) - 2}
            </span>
          )}
        </div>

        {/* 价格 */}
        <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">起价</span>
          <div className="text-xl font-bold text-red-500">
            {formatPrice(minPrice)}
            <span className="text-xs ml-1">/ 晚</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
