import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCities } from '../../hooks/useCities'
import { useSearchStore } from '../../stores/searchStore'
import { cn } from '../../utils/cn'

export default function Home() {
  const navigate = useNavigate()
  const { city, setCity } = useSearchStore()
  const { data: cities, isLoading } = useCities()
  const [selectedCity, setSelectedCity] = useState(city)

  const handleSearch = () => {
    setCity(selectedCity)
    navigate(`/hotels?city=${selectedCity}`)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* 大 Banner */}
      <div className="h-48 bg-gradient-to-b from-blue-500 to-blue-400 rounded-lg flex items-center justify-center text-white text-center px-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">找到你的理想酒店</h1>
          <p className="text-sm opacity-90">全国 1000+ 酒店，随时预订</p>
        </div>
      </div>

      {/* 搜索卡片 */}
      <div className="bg-white rounded-lg shadow-md p-5 space-y-4">
        <h2 className="text-lg font-semibold">搜索酒店</h2>

        {/* 城市选择 */}
        <div>
          <label className="block text-sm font-medium mb-2">目的地</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={cn(
              'w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              isLoading && 'opacity-50'
            )}
          >
            {cities?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 日期选择（暂称占位） */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">入住</label>
            <input type="date" className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">离店</label>
            <input type="date" className="w-full p-3 border rounded-lg" />
          </div>
        </div>

        {/* 搜索按钮 */}
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          查询
        </button>
      </div>

      {/* 快捷标签 */}
      <div className="bg-white rounded-lg shadow-md p-5 space-y-4">
        <h3 className="font-semibold">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {['亲子', '豪华', '免费停车', '近地铁', '商务'].map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-blue-500 hover:text-blue-500 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
