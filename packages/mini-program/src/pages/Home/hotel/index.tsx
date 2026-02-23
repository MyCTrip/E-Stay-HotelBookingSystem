import type { FC } from 'react'
import MainLayout from '../../../layouts/MainLayout'
import styles from './index.module.scss'

/**
 * 酒店首页
 */
export default function HomeHotelPage() {
  const [formData, setFormData] = useState({
    city: 'Beijing',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 2,
  })

  const cities = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Xian']
  const cityLabels = ['北京', '上海', '广州', '深圳', '成都', '西安']
  const cityIndex = cities.indexOf(formData.city)

  const handleCityChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      city: cities[e.detail.value],
    }))
  }

  const handleInputChange = (e: any, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(e.detail.value) : e.detail.value,
    }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams(
      Object.entries(formData).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value)
          return acc
        },
        {} as Record<string, string>
      )
    )
    Taro.navigateTo({
      url: `/pages/SearchResult/hotel/index?${params.toString()}`,
    })
  }

const HomeHotelPage: FC = () => {
  return (
    <MainLayout>
      <HotelHomeLayout />
    </MainLayout>
  )
}

export default HomeHotelPage

