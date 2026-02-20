import { useState, useEffect } from 'react'
import { View, Text, Image, Button, ScrollView, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import MainLayout from '../../../layouts/MainLayout'
import { useHotelStore } from '@estay/shared'
import { calculateHomeStayTotalPrice } from '@estay/shared'
import './index.scss'

/**
 * 房间详情页 - 民宿类型（Taro mini-program版本）
 */
export default function RoomDetailHomeStayPage() {
  const route = Taro.getCurrentInstance().router
  const roomId = route?.params?.roomId
  const checkInStr = route?.params?.checkIn || '2024-12-20'
  const checkOutStr = route?.params?.checkOut || '2024-12-22'

  const { currentRoom, fetchRoom, loading } = useHotelStore()
  const [guests, setGuests] = useState(1)
  const [guestIndex, setGuestIndex] = useState(0)
  const [selectedTab, setSelectedTab] = useState<'info' | 'amenities' | 'policy'>('info')

  const checkIn = new Date(checkInStr)
  const checkOut = new Date(checkOutStr)
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) || 1

  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId)
    }
  }, [roomId, fetchRoom])

  const handleGuestChange = (e: any) => {
    setGuestIndex(e.detail.value)
    setGuests(parseInt(e.detail.value) + 1)
  }

  const handleBook = () => {
    Taro.navigateTo({
      url: `/pages/Checkout/index?roomId=${roomId}&checkIn=${checkInStr}&checkOut=${checkOutStr}&guests=${guests}`,
    })
  }

  if (loading) {
    return (
      <MainLayout>
        <View className="loadingContainer">
          <Text>加载中...</Text>
        </View>
      </MainLayout>
    )
  }

  if (!currentRoom) {
    return (
      <MainLayout>
        <View className="notFound">
          <Text>房间未找到</Text>
          <Button onClick={() => Taro.navigateBack()}>返回</Button>
        </View>
      </MainLayout>
    )
  }

  const basePrice = currentRoom.baseInfo?.basePrice || 200
  const roomConfig = currentRoom.typeConfig?.homeStay
  const maxGuests = roomConfig?.maxGuests || 2
  const cleaningFee = roomConfig?.cleaningFee || 50
  const securityDeposit = roomConfig?.securityDeposit || 300
  const images = currentRoom.baseInfo?.images || []

  const priceInfo = calculateHomeStayTotalPrice(basePrice, nights, cleaningFee, securityDeposit)

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => String(i + 1))

  return (
    <MainLayout>
      <ScrollView scrollY className="roomDetailContainer">
        {/* 图片 */}
        {images.length > 0 && (
          <View className="imageContainer">
            <Image src={images[0]} mode="aspectFill" style={{ width: '100%', height: '300rpx' }} />
          </View>
        )}

        {/* 基本信息 */}
        <View className="basicInfo">
          <Text className="roomName">{currentRoom.baseInfo?.nameCn}</Text>
          <View className="dateInfo">
            <Text>📅 {checkInStr} 至 {checkOutStr}</Text>
            <Text className="nights">({nights}晚)</Text>
          </View>
        </View>

        {/* 宾客选择 */}
        <View className="guestSection">
          <Text className="label">宾客数量</Text>
          <Picker
            mode="selector"
            range={guestOptions}
            value={guestIndex}
            onChange={handleGuestChange}
          >
            <View className="pickerInput">
              <Text>{guests}人</Text>
              <Text className="arrow">›</Text>
            </View>
          </Picker>
          <Text className="maxGuests">最多容纳{maxGuests}人</Text>
        </View>

        {/* Tab标签页 */}
        <View className="tabBar">
          <Button
            className={`tab ${selectedTab === 'info' ? 'active' : ''}`}
            onClick={() => setSelectedTab('info')}
          >
            房间信息
          </Button>
          <Button
            className={`tab ${selectedTab === 'amenities' ? 'active' : ''}`}
            onClick={() => setSelectedTab('amenities')}
          >
            设施
          </Button>
          <Button
            className={`tab ${selectedTab === 'policy' ? 'active' : ''}`}
            onClick={() => setSelectedTab('policy')}
          >
            政策
          </Button>
        </View>

        {/* Tab内容 */}
        {selectedTab === 'info' && (
          <View className="tabContent">
            <View className="paramGrid">
              <View className="paramCard">
                <Text className="paramIcon">📏</Text>
                <Text className="paramLabel">面积</Text>
                <Text className="paramValue">{currentRoom.baseInfo?.size || 25}㎡</Text>
              </View>
              <View className="paramCard">
                <Text className="paramIcon">🛏️</Text>
                <Text className="paramLabel">床型</Text>
                <Text className="paramValue">{currentRoom.baseInfo?.bed || '双人床'}</Text>
              </View>
              <View className="paramCard">
                <Text className="paramIcon">👥</Text>
                <Text className="paramLabel">容纳</Text>
                <Text className="paramValue">{maxGuests}人</Text>
              </View>
              <View className="paramCard">
                <Text className="paramIcon">🚭</Text>
                <Text className="paramLabel">禁烟</Text>
                <Text className="paramValue">禁烟房</Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'amenities' && (
          <View className="tabContent">
            <View className="amenitiesGrid">
              {['📶 WiFi', '❄️ 空调', '📺 电视', '🧊 冰箱', '🍳 厨房', '🚿 浴室', '🧴 洗漱用品', '🔌 充电器'].map(
                (item) => (
                  <View key={item} className="amenityCard">
                    {item}
                  </View>
                )
              )}
            </View>
          </View>
        )}

        {selectedTab === 'policy' && (
          <View className="tabContent">
            <View className="policyBlock">
              <Text className="policyTitle">入住规则</Text>
              <Text className="policyItem">✓ 入住: 下午14:00</Text>
              <Text className="policyItem">✓ 退房: 上午11:00</Text>
            </View>
            <View className="policyBlock">
              <Text className="policyTitle">取消政策</Text>
              <Text className="policyItem">✓ 7天前免费取消</Text>
              <Text className="policyItem">✓ 3-6天前扣50%</Text>
              <Text className="policyItem">✓ 3天内不可取消</Text>
            </View>
          </View>
        )}

        {/* 价格明细 */}
        <View className="priceBreakdown">
          <Text className="breakdownTitle">价格明细</Text>
          <View className="priceRow">
            <Text>￥{basePrice} × {nights}晚</Text>
            <Text>￥{priceInfo.subtotal.toFixed(0)}</Text>
          </View>
          {cleaningFee > 0 && (
            <View className="priceRow">
              <Text>清洁费</Text>
              <Text>￥{cleaningFee}</Text>
            </View>
          )}
          {securityDeposit > 0 && (
            <View className="priceRow">
              <Text>押金（可退）</Text>
              <Text>￥{securityDeposit}</Text>
            </View>
          )}
          <View className="priceRowTotal">
            <Text>总价</Text>
            <Text>￥{priceInfo.total.toFixed(0)}</Text>
          </View>
        </View>

        <View className="spacer"></View>
      </ScrollView>

      {/* 浮动预订栏 */}
      <View className="stickyBar">
        <View className="totalPrice">
          <Text className="label">总计</Text>
          <Text className="price">￥{priceInfo.total.toFixed(0)}</Text>
        </View>
        <Button className="bookBtn" onClick={handleBook}>
          预订
        </Button>
      </View>
    </MainLayout>
  )
}
