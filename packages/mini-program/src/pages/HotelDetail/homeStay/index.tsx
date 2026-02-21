import { useState, useEffect } from 'react'
import { View, Text, Image, Swiper, SwiperItem, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import MainLayout from '../../../layouts/MainLayout'
import { useHotelStore } from '@estay/shared'
import './index.scss'

/**
 * 酒店详情页 - 民宿类型（Taro mini-program版本）
 */
export default function HotelDetailHomeStayPage() {
  const route = Taro.getCurrentInstance().router
  const hotelId = route?.params?.hotelId
  const checkIn = route?.params?.checkIn || '2024-12-20'
  const checkOut = route?.params?.checkOut || '2024-12-22'

  const { currentHotel, fetchHotel, loading } = useHotelStore()
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (hotelId) {
      fetchHotel(hotelId)
    }
  }, [hotelId, fetchHotel])

  if (loading) {
    return (
      <MainLayout>
        <View className="loadingContainer">
          <Text>加载中...</Text>
        </View>
      </MainLayout>
    )
  }

  if (!currentHotel) {
    return (
      <MainLayout>
        <View className="notFound">
          <Text>房源未找到</Text>
          <Button onClick={() => Taro.navigateBack()}>返回</Button>
        </View>
      </MainLayout>
    )
  }

  const images = currentHotel.baseInfo?.images || []
  const hostProfile = currentHotel.baseInfo?.hostProfile
  const homeStayConfig = currentHotel.typeConfig?.homeStay
  const rooms = currentHotel.rooms || []
  const basePrice = currentHotel.baseInfo?.basePrice || 200

  const handleRoomClick = (roomId: string) => {
    Taro.navigateTo({
      url: `/pages/RoomDetail/homeStay/index?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`,
    })
  }

  return (
    <MainLayout>
      <ScrollView scrollY className="hotelDetailContainer">
        {/* 图片轮播 */}
        {images.length > 0 && (
          <View className="imageSection">
            <Swiper
              className="swiper"
              current={currentImageIndex}
              onChange={(e: any) => setCurrentImageIndex(e.detail.current)}
              autoplay={false}
            >
              {images.map((img, idx) => (
                <SwiperItem key={idx}>
                  <Image src={img} mode="aspectFill" style={{ width: '100%', height: '360rpx' }} />
                </SwiperItem>
              ))}
            </Swiper>
            <View className="imageCounter">
              {currentImageIndex + 1}/{images.length}
            </View>
          </View>
        )}

        {/* 基本信息 */}
        <View className="basicInfo">
          <Text className="title">{currentHotel.baseInfo?.nameCn}</Text>
          <View className="infoRow">
            <Text className="rating">⭐ {currentHotel.baseInfo?.star || 4.8}</Text>
            <Text className="location">📍 {currentHotel.baseInfo?.city}</Text>
          </View>
        </View>

        {/* 民宿主 */}
        {hostProfile && (
          <View className="hostSection">
            <Text className="sectionTitle">民宿主</Text>
            <View className="hostCard">
              <View className="hostAvatar">
                <Image src={hostProfile.avatar} mode="aspectFill" />
              </View>
              <View className="hostInfo">
                <View className="hostTop">
                  <Text className="hostName">{hostProfile.name}</Text>
                  <Text className="hostBadge">顶级房东</Text>
                </View>
                <Text className="hostStats">
                  ⭐ {hostProfile.rating?.toFixed(1) || 5.0} · {hostProfile.reviewCount || 0}条评价
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 房间选择 */}
        <View className="roomsSection">
          <Text className="sectionTitle">选择房间</Text>
          {rooms.map((room) => (
            <View
              key={room.id}
              className="roomTypeCard"
              onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}
            >
              <View className="roomTypeHeader">
                <View className="roomName">
                  <Text className="roomTitle">{room.baseInfo?.nameCn}</Text>
                  <Text className="roomDesc">{room.baseInfo?.description}</Text>
                </View>
                <View className="roomPrice">
                  <Text className="price">¥{room.baseInfo?.basePrice || 200}</Text>
                  <Text className="unit">/晚</Text>
                </View>
              </View>
              {expandedRoom === room.id && (
                <View className="roomDetails">
                  <View className="roomParams">
                    <Text>👥 容纳 {room.typeConfig?.homeStay?.maxGuests || 2} 人</Text>
                    <Text>📐 {room.baseInfo?.size || 25}㎡</Text>
                  </View>
                  <Button className="selectBtn" onClick={() => handleRoomClick(room.id)}>
                    选择此房间
                  </Button>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 设施 */}
        <View className="facilitiesSection">
          <Text className="sectionTitle">房间设施</Text>
          <View className="facilitiesGrid">
            {['📶 WiFi', '❄️ 空调', '🛁 浴室', '📺 电视', '🧊 冰箱', '🍳 厨房'].map((item) => (
              <View key={item} className="facilityItem">
                {item}
              </View>
            ))}
          </View>
        </View>

        {/* 政策 */}
        <View className="policiesSection">
          <Text className="sectionTitle">重要提示</Text>
          <View className="policyBlock">
            <Text className="policyTitle">入住规则</Text>
            <Text className="policyItem">✓ 入住时间: 下午14:00</Text>
            <Text className="policyItem">✓ 退房时间: 上午11:00</Text>
          </View>
          <View className="policyBlock">
            <Text className="policyTitle">取消政策</Text>
            <Text className="policyItem">✓ 7天前免费取消</Text>
            <Text className="policyItem">✓ 3-6天前扣50%</Text>
            <Text className="policyItem">✓ 3天内扣100%</Text>
          </View>
        </View>

        {/* 浮动预订栏 */}
        <View className="spacer"></View>
      </ScrollView>

      <View className="stickyBar">
        <View className="priceInfo">
          <Text className="price">¥{basePrice}</Text>
          <Text className="unit">/晚</Text>
        </View>
        <Button className="bookBtn" onClick={() => handleRoomClick(rooms[0]?.id)}>
          立即预订
        </Button>
      </View>
    </MainLayout>
  )
}
