/**
 * 钟点房详情页 - HourlyHotel类型
 */

import React from 'react'
import { useParams } from 'react-router-dom'

const HourlyHotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return <div>钟点房详情页 - 开发中</div>
}

export default HourlyHotelDetailPage
