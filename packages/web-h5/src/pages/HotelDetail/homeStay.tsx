/**
 * 民宿详情页 - HomeStay类型
 */

import React from 'react'
import { useParams } from 'react-router-dom'
import DetailPage from '../../components/homestay/detail'

const HomeStayDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  // 在实际应用中，这里应该从API获取数据
  // const { data, loading } = useFetchHomeStayDetail(id)

  return <DetailPage />
}

export default HomeStayDetailPage
