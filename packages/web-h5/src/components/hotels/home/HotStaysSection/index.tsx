/**
 * 热门民宿推荐区组件 - Web H5版本
 */

import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { HotelDomainModel } from '@estay/shared'
import HotelCard from '../HotelCard'
import styles from './index.module.scss'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface HotStaysSectionProps {
  title?: string
  data: HotelDomainModel[]
  onCardClick?: (id: string) => void
  loading?: boolean
}

const HotStaysSection: React.FC<HotStaysSectionProps> = ({
  title = '推荐',
  data = [],
  onCardClick,
  loading = false,
}) => {
  const swiperRef = useRef(null)

  if (!data || data.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <a href="#all" className={styles.viewAll}>
          全部 &gt;
        </a>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      ) : (
        <div className={styles.swiperWrapper}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={'auto'}
            spaceBetween={12}
            centeredSlidesBounds={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
            }}
            grabCursor
            className={styles.swiper}
          >
            {data.map((hotel) => (
              <SwiperSlide key={hotel.id} className={styles.slide}>
                <HotelCard data={hotel} onClick={onCardClick} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}

export default React.memo(HotStaysSection)
