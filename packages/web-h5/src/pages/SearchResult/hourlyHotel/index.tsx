/**
 * 钟点房搜索结果页面 - Web H5版本
 */

import React, { useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import HourlySearchResultList from '../../../components/hourlyHotel/search/SearchResultList'
import type { HourlyRoom } from '@estay/shared'
import styles from './index.module.scss'

export interface HourlySearchFilters {
  city?: string
  checkInDate?: string
  checkInTime?: string
  duration?: number
  priceMin?: number
  priceMax?: number
  stars?: number[]
  facilities?: string[]
}

const MOCK_HOURLY_ROOMS: HourlyRoom[] = [
  {
    _id: 'h1',
    merchantId: 'merchant_h1',
    baseInfo: {
      nameCn: '全季酒店(上海浦东世纪大道店)',
      nameEn: 'JI Hotel (Shanghai Pudong Century Avenue)',
      address: '上海市浦东新区张杨路',
      city: '上海',
      star: 4.5,
      phone: '021-55556666',
      description: '商务优选，3小时特惠钟点房',
      facilities: [{ name: 'WiFi' } as any, { name: '免费停车' } as any, { name: '24小时前台' } as any],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    ],
    durationOptions: [3, 4],
    rooms: [
      {
        _id: 'r1',
        hotelId: 'h1',
        baseInfo: {
          type: 'double',
          price: 128,
          images: [],
          maxOccupancy: 2,
          facilities: [{ name: '窗户' } as any],
          windowAvailable: true,
        },
        durationOptions: [3],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h2',
    merchantId: 'merchant_h2',
    baseInfo: {
      nameCn: '如家精选酒店(静安寺店)',
      nameEn: 'Home Inn Selected (Jingan Temple)',
      address: '上海市静安区延安中路',
      city: '上海',
      star: 4.2,
      phone: '021-77778888',
      description: '逛街小憩，静安寺核心商圈4小时钟点房',
      facilities: [{ name: 'WiFi' } as any, { name: '行李寄存' } as any],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c0d13c05?w=400&h=300&fit=crop',
    ],
    durationOptions: [4, 6],
    rooms: [
      {
        _id: 'r2',
        hotelId: 'h2',
        baseInfo: {
          type: 'single',
          price: 98,
          images: [],
          maxOccupancy: 1,
          facilities: [],
          windowAvailable: false,
        },
        durationOptions: [4, 6],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h3',
    merchantId: 'merchant_h3',
    baseInfo: {
      nameCn: '维也纳国际酒店(上海浦东机场店)',
      nameEn: 'Vienna International Hotel (Pudong Airport)',
      address: '上海市浦东新区祝桥镇',
      city: '上海',
      star: 4.0,
      phone: '021-33334444',
      description: '转机/候机优选，免费机场接送，4-6小时舒适休息',
      facilities: [{ name: 'WiFi' } as any, { name: '免费机场大巴' } as any, { name: '餐厅' } as any],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1542314831-c6a4d14d8373?w=400&h=300&fit=crop',
    ],
    durationOptions: [4, 6],
    rooms: [
      {
        _id: 'r3_1',
        hotelId: 'h3',
        baseInfo: {
          type: 'double',
          price: 158,
          images: [],
          maxOccupancy: 2,
          facilities: [{ name: '独立卫浴' } as any],
          windowAvailable: false,
        },
        durationOptions: [4],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'r3_2',
        hotelId: 'h3',
        baseInfo: {
          type: 'twin',
          price: 188,
          images: [],
          maxOccupancy: 2,
          facilities: [{ name: '独立卫浴' } as any, { name: '隔音窗户' } as any],
          windowAvailable: true,
        },
        durationOptions: [4, 6],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h4',
    merchantId: 'merchant_h4',
    baseInfo: {
      nameCn: '天鹅恋情侣主题酒店(徐家汇店)',
      nameEn: 'Swan Love Theme Hotel (Xujiahui)',
      address: '上海市徐汇区肇嘉浜路',
      city: '上海',
      star: 4.5,
      phone: '021-99990000',
      description: '浪漫情侣约会，氛围感拉满，超大圆床',
      facilities: [{ name: 'WiFi' } as any, { name: '智能客控' } as any, { name: '情侣浴缸' } as any],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    ],
    durationOptions: [4],
    rooms: [
      {
        _id: 'r4',
        hotelId: 'h4',
        baseInfo: {
          type: 'theme',
          price: 258,
          images: [],
          maxOccupancy: 2,
          facilities: [{ name: '超大圆床' } as any, { name: '巨幕投影' } as any],
          windowAvailable: true,
        },
        durationOptions: [4],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'h5',
    merchantId: 'merchant_h5',
    baseInfo: {
      nameCn: '汉庭酒店(上海火车站店)',
      nameEn: 'Hanting Hotel (Shanghai Railway Station)',
      address: '上海市静安区天目西路',
      city: '上海',
      star: 4.0,
      phone: '021-22221111',
      description: '距火车站步行5分钟，候车快捷小憩，高性价比',
      facilities: [{ name: 'WiFi' } as any, { name: '行李寄存' } as any],
      policies: [],
    },
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=300&fit=crop',
    ],
    durationOptions: [3],
    rooms: [
      {
        _id: 'r5',
        hotelId: 'h5',
        baseInfo: {
          type: 'single',
          price: 88,
          images: [],
          maxOccupancy: 1,
          facilities: [{ name: '24小时热水' } as any],
          windowAvailable: false,
        },
        durationOptions: [3],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

const HourlySearchResultPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [filters, setFilters] = useState<HourlySearchFilters>({
    city: searchParams.get('city') || '上海',
    checkInDate: searchParams.get('checkInDate') || dayjs().format('YYYY-MM-DD'),
    checkInTime: searchParams.get('checkInTime') || '14:00',
    duration: Number(searchParams.get('duration')) || 3,
  })

  const [hourlyHotels, setHourlyHotels] = useState<HourlyRoom[]>(MOCK_HOURLY_ROOMS)
  const [loading, setLoading] = useState(false)

  const handleFiltersChange = useCallback((newFilters: HourlySearchFilters) => {
    setFilters(newFilters)
  }, [])

  const handleModifySearch = useCallback(() => {
    navigate('/hourly-search', { state: { filters } })
  }, [filters, navigate])

  // 新增：处理卡片点击跳转
  const handleItemClick = useCallback((id: string) => {
    // 假设你在 router 里配的是 path: 'hourlyHotel/:id'
    // navigate(`/hourlyHotel/${id}`)
    navigate(`/hotel/${id}/hourlyHotel`)
    // 如果点过去是 404，请改成 navigate(`/hotel/${id}/hourlyHotel`) 试试
  }, [navigate])

  return (
    <div className={styles.container}>
      <HourlySearchResultList
        data={hourlyHotels}
        loading={loading}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onModifySearch={handleModifySearch}
        onClick={handleItemClick} // 传递给列表组件去触发跳转
      />
    </div>
  )
}

export default HourlySearchResultPage
