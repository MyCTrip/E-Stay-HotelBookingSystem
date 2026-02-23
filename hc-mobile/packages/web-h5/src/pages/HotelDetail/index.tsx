import { useParams } from 'react-router-dom'
import HotelDetailHotelPage from './hotel'
import HotelDetailHourlyPage from './hourlyHotel'
import HotelDetailHomeStayPage from './homeStay'

/**
 * 酒店详情页 - 根据类型分发到对应子页面
 * 如果没有明确指定类型，默认显示酒店类型（hotel）
 */
export default function HotelDetailPage() {
  const params = useParams()
  const type = params.type || 'hotel'

  // 根据类型返回对应的详情页
  switch (type) {
    case 'hourlyHotel':
      return <HotelDetailHourlyPage />
    case 'homeStay':
      return <HotelDetailHomeStayPage />
    case 'hotel':
    default:
      return <HotelDetailHotelPage />
  }
}
