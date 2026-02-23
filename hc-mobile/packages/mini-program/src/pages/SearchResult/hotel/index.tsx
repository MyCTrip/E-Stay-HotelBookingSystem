import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Input, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useHotelStore } from '@estay/shared'
import type { Hotel } from '@estay/shared'

import MainLayout from '../../../layouts/MainLayout'
import VirtualHotelList from '../../../components/VirtualHotelList'
import styles from './index.module.scss'

export default function SearchResultHotel() {
  const router = useRouter()
  
  // --- 全局状态 ---
  const ui = useHotelStore(state => state.ui)
  const searchParams = useHotelStore(state => state.searchParams)
  const setSearchParams = useHotelStore(state => state.setSearchParams)
  const fetchHotels = useHotelStore(state => state.fetchHotels)
  const fetchMoreHotels = useHotelStore(state => state.fetchMoreHotels)

  // --- 本地状态 ---
  const [activeFilter, setActiveFilter] = useState<string>('welcome')
  const [activeTag, setActiveTag] = useState<string>('天安门广场')

  // ==========================================
  // 价格/星级筛选下拉框状态
  // ==========================================
  const [showFilter, setShowFilter] = useState(false)
  const [selectedStars, setSelectedStars] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  // 筛选选项配置
  const starOptions = [
    { value: '2', label: '2钻/星及以下', sub: '经济' },
    { value: '3', label: '3钻/星', sub: '舒适' },
    { value: '4', label: '4钻/星', sub: '高档' },
    { value: '5', label: '5钻/星', sub: '豪华' }
  ]

  const priceOptions = [
    { label: '¥150以下', min: '0', max: '150' },
    { label: '¥150-300', min: '150', max: '300' },
    { label: '¥300-600', min: '300', max: '600' },
    { label: '¥600-1000', min: '600', max: '1000' },
    { label: '¥1000以上', min: '1000', max: '' },
  ]

  // ==========================================
  // 筛选交互逻辑
  // ==========================================
  // 切换星级选中状态
  const toggleStar = (value: string) => {
    setSelectedStars(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value])
  }

  // 选择预设价格区间
  const selectPrice = (min: string, max: string) => {
    setPriceRange({ min, max })
  }

  // 清空筛选条件
  const resetFilter = () => {
    setSelectedStars([])
    setPriceRange({ min: '', max: '' })
  }

  // 确认筛选（对接接口）
  const confirmFilter = () => {
    console.log('应用筛选条件:', { priceRange, selectedStars })

    // 🚀 核心修复：进行数据类型转换，满足 TS 接口约束
    // 如果为空字符串则传 undefined，否则用 Number() 转为数字
    const parsedMinPrice = priceRange.min !== '' ? Number(priceRange.min) : undefined;
    const parsedMaxPrice = priceRange.max !== '' ? Number(priceRange.max) : undefined;
    
    // 将 ['3', '4'] 转换为 [3, 4]，如果没有选中则传 undefined
    const parsedStars = selectedStars.length > 0 ? selectedStars.map(star => Number(star)) : undefined;

    // 合并筛选条件到搜索参数
    setSearchParams({
      ...searchParams,
      page: 1, // 筛选后重置页码
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      stars: parsedStars
    })
    
    // 重新请求酒店数据
    fetchHotels({
      city: displayCity,
      page: 1,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      stars: parsedStars
    })
    
    setShowFilter(false)
  }

  // 筛选按钮点击逻辑
  const handleFilterClick = (id: string) => {
    if (id === 'price') {
      // 点击“价格/星级”：展开/收起下拉
      setShowFilter(activeFilter === 'price' ? !showFilter : true)
    } else {
      // 点击其他标签：收起下拉框
      setShowFilter(false)
    }
    setActiveFilter(id)
  }

  // ==========================================
  // 城市转换 & Mock 数据
  // ==========================================
  // 修复英文城市名：强制转换
  const displayCity = searchParams.city === 'Beijing' || router.params.city === 'Beijing' 
    ? '北京' 
    : (searchParams.city || '北京');

  // 高保真 Mock 数据（保留完整）
  const mockHotels: Hotel[] = [
    {
      _id: 'm1',
      baseInfo: {
        nameCn: '北京王府井文华东方酒店',
        city: '北京',
        star: 5,
        images: ['https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?auto=format&fit=crop&w=400&q=80'],
        address: '王府井大街269号', phone: '', description: '', facilities: [], policies: []
      },
      displayInfo: {
        rating: 4.9, reviewCount: 3200, lowestPrice: 2888, originalPrice: 3500,
        distanceText: '王府井/故宫 · 距您直线 100m',
        tags: ['紫禁城景观', '米其林餐厅', '室内泳池', '极速确认']
      }
    },
    {
      _id: 'm2',
      baseInfo: {
        nameCn: '全季酒店 (北京天安门广场店)',
        city: '北京',
        star: 3,
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'],
        address: '前门大街1号', phone: '', description: '', facilities: [], policies: []
      },
      displayInfo: {
        rating: 4.6, reviewCount: 1560, lowestPrice: 450,
        distanceText: '前门/天安门广场 · 距您直线 800m',
        tags: ['近地铁', '免费停车', '极速退房']
      }
    },
    {
      _id: 'm3',
      baseInfo: {
        nameCn: '7天连锁酒店 (北京国贸CBD店)',
        city: '北京',
        star: 2,
        images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80'],
        address: '建国路88号', phone: '', description: '', facilities: [], policies: []
      },
      displayInfo: {
        rating: 4.2, reviewCount: 890, lowestPrice: 199, originalPrice: 259,
        distanceText: '国贸地区 · 距您直线 4.5km',
        tags: ['特卖', '含双早']
      }
    }
  ] as unknown as Hotel[]

  // ==========================================
  // 初始化加载
  // ==========================================
  useEffect(() => {
    setSearchParams({ city: displayCity, page: 1 })
    fetchHotels({ city: displayCity, page: 1 }) // 恢复真实接口请求
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ==========================================
  // 通用交互逻辑
  // ==========================================
  // 跳转到酒店详情
  const goToDetail = (id: string) => Taro.navigateTo({ url: `/pages/HotelDetail/hotel/index?id=${id}` })

  return (
    <MainLayout hideBottomNav hideFooter>
      <View className={styles.pageContainer}>
        
        {/* ================= 1. 顶部核心条件筛选头（完整版本） ================= */}
        <View className={styles.coreHeader}>
          <View className={styles.searchCapsule}>
            {/* 城市选择 */}
            <View className={styles.cityBlock} onClick={() => console.log('切换城市')}>
              <Text className={styles.cityText}>{displayCity}</Text>
              <Text className={styles.arrowDown}>▾</Text>
            </View>

            {/* 日期与间夜数 */}
            <View className={styles.dateBlock} onClick={() => console.log('修改日期')}>
              <View className={styles.dateCol}>
                <Text className={styles.dateValue}>02-17</Text>
                <Text className={styles.dateValue}>02-18</Text>
              </View>
              <View className={styles.nightCol}>
                <Text className={styles.nightText}>1间</Text>
                <Text className={styles.nightText}>1人</Text>
              </View>
            </View>

            {/* 搜索词 */}
            <View className={styles.searchInput} onClick={() => console.log('进入文字搜索')}>
              <Text className={styles.searchIcon}>🔍</Text>
              <Text className={styles.placeholder}>位置/品牌/酒店</Text>
            </View>

            {/* 地图按钮 */}
            <View className={styles.mapBtn}>
              <Text className={styles.mapIcon}>🗺️</Text>
              <Text className={styles.mapText}>地图</Text>
            </View>
          </View>
        </View>

        {/* ================= 2. 详细筛选区域（带价格/星级下拉） ================= */}
        <View className={styles.filterSection}>
          <View className={styles.mainFilters}>
            {[
              { id: 'welcome', label: '欢迎度排序' },
              { id: 'distance', label: '位置距离' },
              { id: 'price', label: '价格/星级' },
              { id: 'filter', label: '筛选' }
            ].map(item => (
              <View 
                key={item.id} 
                className={`${styles.filterItem} ${activeFilter === item.id ? styles.activeFilter : ''}`}
                onClick={() => handleFilterClick(item.id)}
              >
                <Text>{item.label}</Text>
                <Text className={styles.arrowIcon}>
                  {activeFilter === item.id && item.id === 'price' && showFilter ? '▴' : '▾'}
                </Text>
              </View>
            ))}
          </View>

          {/* 横向快捷标签（完整内容） */}
          <ScrollView scrollX className={styles.tagScroll} showScrollbar={false}>
            <View className={styles.tagWrapper}>
              {['天安门广场', '双床房', '含早餐', '亲子酒店', '返10倍积分', '免费取消'].map(tag => (
                <View 
                  key={tag} 
                  className={`${styles.quickTag} ${activeTag === tag ? styles.activeTag : ''}`}
                  onClick={() => setActiveTag(tag)}
                >
                  <Text>{tag}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* 价格/星级下拉抽屉 */}
          {showFilter && activeFilter === 'price' && (
            <View className={styles.dropdownOverlay}>
              {/* 半透明遮罩层 (点击收起) */}
              <View className={styles.dropdownMask} onClick={() => setShowFilter(false)} />
              
              {/* 下拉内容区 */}
              <View className={styles.dropdownContent}>
                {/* 价格区间 */}
                <View className={styles.dropdownBlock}>
                  <Text className={styles.blockTitle}>价格</Text>
                  <View className={styles.priceInputRow}>
                    <Input 
                      className={styles.priceInput} 
                      type="number" 
                      placeholder="¥0" 
                      value={priceRange.min} 
                      onInput={(e) => setPriceRange(p => ({...p, min: e.detail.value}))} 
                    />
                    <Text className={styles.priceDivider}>-</Text>
                    <Input 
                      className={styles.priceInput} 
                      type="number" 
                      placeholder="¥不限" 
                      value={priceRange.max} 
                      onInput={(e) => setPriceRange(p => ({...p, max: e.detail.value}))} 
                    />
                  </View>
                  <View className={styles.tagsGrid}>
                    {priceOptions.map((opt, i) => (
                      <View 
                        key={i} 
                        className={`${styles.filterTagBtn} ${(priceRange.min === opt.min && priceRange.max === opt.max) ? styles.tagActive : ''}`} 
                        onClick={() => selectPrice(opt.min, opt.max)}
                      >
                        <Text>{opt.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 星级/钻级 */}
                <View className={styles.dropdownBlock}>
                  <View className={styles.blockTitleRow}>
                    <Text className={styles.blockTitle}>星级/钻级</Text>
                    <Text className={styles.blockDesc}>国内星级/钻级说明 &gt;</Text>
                  </View>
                  <View className={styles.tagsGrid}>
                    {starOptions.map((star, i) => {
                      const isActive = selectedStars.includes(star.value)
                      return (
                        <View 
                          key={i} 
                          className={`${styles.filterTagBtn} ${styles.starBtn} ${isActive ? styles.tagActive : ''}`} 
                          onClick={() => toggleStar(star.value)}
                        >
                          <Text className={styles.starLabel}>{star.label}</Text>
                          <Text className={styles.starSub}>{star.sub}</Text>
                        </View>
                      )
                    })}
                  </View>
                </View>

                {/* 底部按钮 */}
                <View className={styles.dropdownFooter}>
                  <Button className={styles.btnReset} onClick={resetFilter}>清空</Button>
                  <Button className={styles.btnConfirm} onClick={confirmFilter}>完成</Button>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ================= 3. 酒店列表区域 ================= */}
        <View className={styles.listSection}>
          <VirtualHotelList 
            hotels={mockHotels} 
            hasMore={true}      
            moreLoading={ui.moreLoading} 
            onLoadMore={() => fetchMoreHotels()}
            onHotelClick={goToDetail}
          />
        </View>

      </View>
    </MainLayout>
  )
}