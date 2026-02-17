/**
 * 民宿搜索结果页面 - Web H5版本
 * 使用新的SearchResultList组件实现完整的搜索列表界面
 */

import React, { useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import SearchResultList from '../../../components/homestay/search/SearchResultList'
import type { HomeStay } from '@estay/shared'
import styles from './index.module.scss'

interface SearchFilters {
  city?: string
  checkInDate?: string
  checkOutDate?: string
  roomCount?: number
  guestCount?: number
  priceMin?: number
  priceMax?: number
  stars?: number[]
  facilities?: string[]
}

// 模拟数据
const MOCK_HOMESTAYS: HomeStay[] = [
  {
    _id: '1',
    merchantId: 'merchant1',
    baseInfo: {
      nameCn: '西方大厦内精致公寓',
      nameEn: 'Elegant Studio in Western Tower',
      address: '上海市浦东新区世纪大道',
      city: '上海',
      star: 4.8,
      phone: '021-12345678',
      description: '位于浦东新区核心商业地段',
      facilities: [],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    ],
    rooms: [
      {
        _id: '1',
        hotelId: '1',
        category: 'homestay',
        baseInfo: {
          type: 'single',
          price: 358,
          images: [],
          maxOccupancy: 1,
          facilities: [],
          policies: [],
          bedRemark: ['1张单人床'],
        },
        bedInfo: [
          {
            bedType: '单人床',
            bedNumber: 1,
            bedSize: '0.9m*2m',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    merchantId: 'merchant2',
    baseInfo: {
      nameCn: '浦东新区温暖舒适民宿',
      nameEn: 'Cozy Apartment in Pudong',
      address: '上海市浦东新区张江路',
      city: '上海',
      star: 4.6,
      phone: '021-87654321',
      description: '舒适温暖的现代民宿',
      facilities: [],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    ],
    rooms: [
      {
        _id: '2',
        hotelId: '2',
        category: 'homestay',
        baseInfo: {
          type: 'double',
          price: 428,
          images: [],
          maxOccupancy: 2,
          facilities: [],
          policies: [],
          bedRemark: ['1张双人床'],
        },
        bedInfo: [
          {
            bedType: '双人床',
            bedNumber: 1,
            bedSize: '1.8m*2m',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    merchantId: 'merchant3',
    baseInfo: {
      nameCn: '魔都中心豪华享受',
      nameEn: 'Luxury Living in Shanghai Center',
      address: '上海市黄浦区南京路',
      city: '上海',
      star: 4.9,
      phone: '021-11111111',
      description: '城市中心的豪华住宅',
      facilities: [],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1551632786-de41eccbe386?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1577720643272-265fbe6f2d95?w=400&h=300&fit=crop',
    ],
    rooms: [
      {
        _id: '3',
        hotelId: '3',
        category: 'homestay',
        baseInfo: {
          type: 'suite',
          price: 658,
          images: [],
          maxOccupancy: 4,
          facilities: [],
          policies: [],
          bedRemark: ['1张大床', '1张沙发床'],
        },
        bedInfo: [
          {
            bedType: '双人床',
            bedNumber: 1,
            bedSize: '2.0m*2.2m',
          },
          {
            bedType: '沙发床',
            bedNumber: 1,
            bedSize: '1.5m*2m',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    merchantId: 'merchant4',
    baseInfo: {
      nameCn: '浪漫古镇风情民宿',
      nameEn: 'Ancient Town Charm',
      address: '上海市静安区新闸路',
      city: '上海',
      star: 4.7,
      phone: '021-22222222',
      description: '古镇风情的特色民宿',
      facilities: [],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1566043666747-338369b0c0b0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop',
    ],
    rooms: [
      {
        _id: '4',
        hotelId: '4',
        category: 'homestay',
        baseInfo: {
          type: 'single',
          price: 298,
          images: [],
          maxOccupancy: 1,
          facilities: [],
          policies: [],
          bedRemark: ['1张单人床'],
        },
        bedInfo: [
          {
            bedType: '单人床',
            bedNumber: 1,
            bedSize: '0.9m*2m',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    merchantId: 'merchant5',
    baseInfo: {
      nameCn: '现代简约风格公寓',
      nameEn: 'Modern Minimalist Apartment',
      address: '上海市杨浦区控江路',
      city: '上海',
      star: 4.5,
      phone: '021-33333333',
      description: '现代简约风格的精品公寓',
      facilities: [],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    ],
    rooms: [
      {
        _id: '5',
        hotelId: '5',
        category: 'homestay',
        baseInfo: {
          type: 'studio',
          price: 388,
          images: [],
          maxOccupancy: 2,
          facilities: [],
          policies: [],
          bedRemark: ['1张双人床'],
        },
        bedInfo: [
          {
            bedType: '双人床',
            bedNumber: 1,
            bedSize: '1.8m*2m',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6',
    merchantId: 'merchant6',
    baseInfo: {
      nameCn: '阳光舒适度假屋',
      nameEn: 'Sunny Holiday House',
      address: '上海市长宁区仙霞路',
      city: '上海',
      star: 4.4,
      phone: '021-44444444',
      description: '阳光充足的舒适度假屋',
      facilities: [],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1559005588-f56ef2c2c8a4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621314500996-3d6635d78bbd?w=400&h=300&fit=crop',
    ],
    rooms: [
      {
        _id: '6',
        hotelId: '6',
        category: 'homestay',
        baseInfo: {
          type: 'double',
          price: 498,
          images: [],
          maxOccupancy: 2,
          facilities: [],
          policies: [],
          bedRemark: ['1张双人床'],
        },
        bedInfo: [
          {
            bedType: '双人床',
            bedNumber: 1,
            bedSize: '1.8m*2m',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const SearchResultPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 搜索条件
  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get('city') || '上海',
    checkInDate: searchParams.get('checkIn') || dayjs().format('YYYY-MM-DD'),
    checkOutDate: searchParams.get('checkOut') || dayjs().add(1, 'day').format('YYYY-MM-DD'),
    roomCount: Number(searchParams.get('rooms')) || 1,
    guestCount: Number(searchParams.get('guests')) || 1,
  })

  // 结果状态
  const [homestays, setHomestays] = useState<HomeStay[]>(MOCK_HOMESTAYS)
  const [loading, setLoading] = useState(false)

  // 加载搜索结果
  const loadSearchResults = useCallback(async () => {
    setLoading(true)
    try {
      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 500))
      // 使用模拟数据
      setHomestays(MOCK_HOMESTAYS)
    } catch (error) {
      console.error('Failed to load search results:', error)
      alert('加载搜索结果失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // 处理筛选条件变化
  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters)
  }, [])

  // 处理修改搜索条件
  const handleModifySearch = useCallback(() => {
    // 返回到搜索页面修改搜索条件
    navigate('/search', { state: { filters } })
  }, [filters, navigate])

  return (
    <SearchResultList
      data={homestays}
      loading={loading}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onModifySearch={handleModifySearch}
    />
  )
}

export default SearchResultPage
