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
      'https://img-md.veimg.cn/meadinindex/img5/2021/11/F87B3809081B4AE0BA6DFC64AE06C24E.jpg',
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
      'https://ak-d.tripcdn.com/images/0205i12000890pb39FF65_R_960_660_R5_D.jpg',
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
      'https://www.3wen.com/userfiles/files/TUPIAN/1VIENNA1.jpg',
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
      nameCn: '橘子酒店(徐家汇店)',
      nameEn: 'Swan Love Theme Hotel (Xujiahui)',
      address: '上海市徐汇区肇嘉浜路',
      city: '上海',
      star: 4.5,
      phone: '021-99990000',
      description: '距地铁站步行5分钟，候车快捷小憩，高性价比',
      facilities: [{ name: 'WiFi' } as any, { name: '智能客控' } as any, { name: '情侣浴缸' } as any],
      policies: [],
    },
    images: [
      'https://img-md.veimg.cn/meadinindex/img5/2023/7/96236556ef280c555fe6a23e0237ea8d.jpg',
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
      'https://img-md.veimg.cn/meadinindex/img5/2021/11/A0E40E8494DA46E28ACEB26DF9558733.jpg',
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

  // 🌟 1. 新增：无限滚动相关的状态
  const [loadingMore, setLoadingMore] = useState(false) // 是否正在加载下一页
  const [hasMore, setHasMore] = useState(true)          // 是否还有更多数据
  const [page, setPage] = useState(1)                   // 当前页码

  const handleFiltersChange = useCallback((newFilters: HourlySearchFilters) => {
    setFilters(newFilters)

    // 🌟 2. 现实对接后端时：筛选条件一旦改变，应该重置分页并重新请求第一页的数据
    // setPage(1)
    // setHasMore(true)
    // setLoading(true) // 触发主 Loading
    // fetchFirstPageData(newFilters)
  }, [])

  const handleModifySearch = useCallback(() => {
    navigate('/hourly-search', { state: { filters } })
  }, [filters, navigate])

  const handleItemClick = useCallback((id: string) => {
    navigate(`/hotel/${id}/hourlyHotel`)
  }, [navigate])


  const loadMoreData = useCallback(() => {
    // 防抖保护：如果正在加载，或者已经没有更多数据了，直接 return
    if (loadingMore || !hasMore) return

    setLoadingMore(true)

    // 模拟网络请求（延迟 500ms）
    setTimeout(() => {
      // 模拟后端返回了下一页的数据
      const nextPageData = MOCK_HOURLY_ROOMS.map(item => ({
        ...item,
        _id: `${item._id}_page${page + 1}`, // 给 ID 加个后缀，防止 React 列表循环时 key 报错
      }))

      // 将新数据追加到旧数据后面
      setHourlyHotels(prev => [...prev, ...nextPageData])
      setPage(prev => prev + 1)

      // 模拟最多只有 3 页数据（现实中应该是判断：新请求回来的数组长度 < 每页的 limit 大小，则说明没数据了）
      if (page >= 5) {
        setHasMore(false)
      }

      setLoadingMore(false)
    }, 500)
  }, [page, loadingMore, hasMore])

  return (
    <div className={styles.container}>
      <HourlySearchResultList
        data={hourlyHotels}
        loading={loading}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onModifySearch={handleModifySearch}
        onClick={handleItemClick}

        // 🌟 4. 将无限滚动的数据和回调传递给子组件
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={loadMoreData}
      />
    </div>
  )
}

export default HourlySearchResultPage