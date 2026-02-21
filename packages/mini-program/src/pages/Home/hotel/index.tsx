import type { FC } from 'react'
import MainLayout from '../../../layouts/MainLayout'
import HotelHomeLayout from '../../../business/hotel/HotelHomeLayout'

const HomeHotelPage: FC = () => {
  return (
    <MainLayout>
      <HotelHomeLayout />
    </MainLayout>
  )
}

export default HomeHotelPage

