/**
 * 酒店详情页 - Hotel类型
 */

import React from 'react'
import { useParams } from 'react-router-dom'

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return <div>酒店详情页 - 开发中</div>
}

export default HotelDetailPage
