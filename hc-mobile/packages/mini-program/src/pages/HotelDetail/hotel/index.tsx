import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components'
import Taro, { useRouter, usePageScroll } from '@tarojs/taro'
import { useHotelStore } from '@estay/shared'
import MainLayout from '../../../layouts/MainLayout'
import styles from './index.module.scss'

// ==========================================
// 📦 1. 高保真 Mock 数据 (严格匹配截图)
// ==========================================
const MOCK_DATA = {
  name: '上海陆家嘴禧玥酒店',
  star: 5,
  rank: '上海美景酒店榜 No.16',
  images: [
    'https://images.unsplash.com/photo-1542314831-c6a4d27ece50?auto=format&fit=crop&w=800&q=80', // 外景
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', // 房间
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'  // 泳池
  ],
  facilities: ['2020年开业', '新中式风', '免费停车', '一线江景', '江景餐厅'],
  score: 4.8,
  scoreDesc: '超棒',
  reviewCount: 4695,
  quote: '“中式风格装修，舒适安逸”',
  distance: '距塘桥地铁站步行1.5公里, 约22分钟',
  address: '浦东新区浦明路868弄3号楼',
  price: 936
}

const MOCK_ROOMS = [
  { id: 'r1', name: '经典双床房', beds: '2张1.2米单人床', area: '40㎡', capacity: '2人入住', floor: '5-15层', img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=200&q=80' }
]

// ==========================================
// 🧩 2. 专属展示组件层 (Dumb Components)
// ⚠️ 实际开发请抽离到 components/ 目录下
// ==========================================

// 2.1 顶部渐变导航
const DetailNavbar = React.memo(({ opacity, title }: { opacity: number, title: string }) => {
  const isDark = opacity > 0.5;
  return (
    <View className={styles.navbar} style={{ backgroundColor: `rgba(255,255,255,${opacity})` }}>
      <View className={styles.navContent}>
        <View className={styles.navIconBg} onClick={() => Taro.navigateBack()}>
          <Text style={{ color: isDark ? '#333' : '#fff', fontWeight: 'bold' }}>&lt;</Text>
        </View>
        <Text className={styles.navTitle} style={{ opacity }}>{title}</Text>
        <View className={styles.navIconBg}>
          <Text style={{ color: isDark ? '#333' : '#fff' }}>♡</Text>
        </View>
      </View>
      {isDark && <View className={styles.navBorder} />}
    </View>
  )
})

// 2.2 大图与媒体轮播
const BannerSection = React.memo(({ images }: { images: string[] }) => {
  return (
    <View className={styles.bannerWrapper}>
      <Swiper className={styles.swiper} circular autoplay>
        {images.map((img, idx) => (
          <SwiperItem key={idx}>
            <Image src={img} mode="aspectFill" className={styles.swiperImg} lazyLoad />
          </SwiperItem>
        ))}
      </Swiper>
      {/* 底部遮罩与指示器 */}
      <View className={styles.bannerBottomGradient} />
      <View className={styles.bannerTags}>
        <Text className={`${styles.bTag} ${styles.bTagActive}`}>封面</Text>
        <Text className={styles.bTag}>精选</Text>
        <Text className={styles.bTag}>位置</Text>
      </View>
      {/* 右侧浮动的榜单徽章 */}
      <View className={styles.rankBadge}>
        <Text className={styles.rankIcon}>🏆</Text>
        <Text className={styles.rankTitle}>口碑榜</Text>
        <Text className={styles.rankSub}>上海酒店</Text>
      </View>
    </View>
  )
})

// 2.3 核心信息区
const CoreInfoSection = React.memo(({ data }: { data: typeof MOCK_DATA }) => {
  return (
    <View className={styles.coreInfoCard}>
      <View className={styles.titleRow}>
        <Text className={styles.hotelName}>{data.name}</Text>
        <Text className={styles.starText}>⭐⭐⭐⭐⭐</Text>
      </View>
      <View className={styles.rankRow}>
        <Text className={styles.rankLabel}>{data.rank} &gt;</Text>
      </View>
      <ScrollView scrollX className={styles.facilityScroll} showScrollbar={false}>
        <View className={styles.facilityList}>
          {data.facilities.map((f, i) => (
            <View key={i} className={styles.facilityItem}>
              <Text className={styles.fIcon}>🏢</Text>
              <Text className={styles.fText}>{f}</Text>
            </View>
          ))}
          <View className={styles.facilityMore}>
            <Text className={styles.fText}>设施政策 &gt;</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
})

// 2.4 评分与位置卡片 (左右分栏)
const ScoreLocationSection = React.memo(({ data }: { data: typeof MOCK_DATA }) => {
  return (
    <View className={styles.scoreLocWrapper}>
      <View className={styles.scoreCard}>
        <View className={styles.scoreTop}>
          <Text className={styles.scoreNum}>{data.score}</Text>
          <Text className={styles.scoreDesc}>{data.scoreDesc}</Text>
          <Text className={styles.scoreCount}>{data.reviewCount}条 &gt;</Text>
        </View>
        <Text className={styles.scoreQuote}>{data.quote}</Text>
      </View>
      <View className={styles.locCard}>
        <View className={styles.locInfo}>
          <Text className={styles.locDistance}>{data.distance}</Text>
          <Text className={styles.locAddress}>| {data.address}</Text>
        </View>
        <View className={styles.locMap}>
          <Text className={styles.mapIcon}>📍</Text>
          <Text className={styles.mapText}>地图</Text>
        </View>
      </View>
    </View>
  )
})

// 2.5 吸顶筛选与日期栏 (关键交互)
const FilterSection = React.memo(() => {
  return (
    <View className={styles.filterSticky}>
      <View className={styles.dateRow}>
        <View className={styles.dateBlock}>
          <Text className={styles.dateMain}>1月9日</Text>
          <Text className={styles.dateSub}>今天</Text>
        </View>
        <View className={styles.nightBadge}><Text className={styles.nightText}>1晚</Text></View>
        <View className={styles.dateBlock}>
          <Text className={styles.dateMain}>1月10日</Text>
          <Text className={styles.dateSub}>明天</Text>
        </View>
        <Text className={styles.dateArrow}>&gt;</Text>
      </View>
      <View className={styles.warningTip}>
        <Text className={styles.warningText}>🌙 当前已过0点，如需今天凌晨6点前入住，请选择“今天凌晨”</Text>
      </View>
      <ScrollView scrollX className={styles.tagScroll} showScrollbar={false}>
        <View className={styles.tagRow}>
          {['含早餐', '立即确认', '大床房', '双床房', '免费取消'].map((t, i) => (
            <Text key={i} className={styles.filterTag}>{t}</Text>
          ))}
          <Text className={styles.filterTagMore}>筛选 ▾</Text>
        </View>
      </ScrollView>
    </View>
  )
})

// 2.6 房型卡片列表
const RoomListSection = React.memo(({ rooms }: { rooms: typeof MOCK_ROOMS }) => {
  return (
    <View className={styles.roomList}>
      {rooms.map((r) => (
        <View key={r.id} className={styles.roomCard}>
          <Image src={r.img} className={styles.roomImg} mode="aspectFill" lazyLoad />
          <View className={styles.roomInfo}>
            <View className={styles.rHeader}>
              <Text className={styles.rName}>{r.name}</Text>
              <Text className={styles.rArrow}>⌃</Text>
            </View>
            <Text className={styles.rDesc}>{r.beds} {r.area} {r.capacity} {r.floor}</Text>
            {/* 底部交互区 */}
            <View className={styles.rFooter}></View>
          </View>
        </View>
      ))}
      <View className={styles.listBottomHolder}></View>
    </View>
  )
})

// 2.7 底部悬浮操作栏
const BottomActionBar = React.memo(({ price }: { price: number }) => {
  return (
    <View className={styles.bottomBar}>
      <View className={styles.bLeft}>
        <Text className={styles.bAskIcon}>💬</Text>
        <Text className={styles.bAskText}>问酒店</Text>
      </View>
      <View className={styles.bRight}>
        <Text className={styles.bPriceLabel}>¥</Text>
        <Text className={styles.bPriceValue}>{price}</Text>
        <Text className={styles.bPriceSuffix}>起</Text>
        <View className={styles.bBookBtn}>
          <Text className={styles.bBookText}>查看房型</Text>
        </View>
      </View>
    </View>
  )
})

// ==========================================
// 🏢 3. 页面容器层 (Page Controller)
// ==========================================
export default function HotelDetailPage() {
  const router = useRouter()
  const [navOpacity, setNavOpacity] = useState(0)

  // 监听滚动计算透明度 (节流交给 Taro 底层)
  usePageScroll((res) => {
    let opacity = res.scrollTop / 100
    if (opacity > 1) opacity = 1
    if (opacity < 0) opacity = 0
    setNavOpacity(opacity)
  })

  return (
    <MainLayout hideBottomNav hideFooter>
      <View className={styles.pageContainer}>
        {/* Level 1: 吸顶导航 */}
        <DetailNavbar opacity={navOpacity} title={MOCK_DATA.name} />

        {/* Level 4: 页面内容滚动区 */}
        <ScrollView scrollY className={styles.mainScroll}>
          <BannerSection images={MOCK_DATA.images} />
          
          <View className={styles.contentBody}>
            <CoreInfoSection data={MOCK_DATA} />
            <ScoreLocationSection data={MOCK_DATA} />
            
            {/* Level 2: 滚动吸顶的筛选器 */}
            <FilterSection />
            
            <RoomListSection rooms={MOCK_ROOMS} />
          </View>
        </ScrollView>

        {/* Level 1: 底部悬浮 */}
        <BottomActionBar price={MOCK_DATA.price} />
      </View>
    </MainLayout>
  )
}
