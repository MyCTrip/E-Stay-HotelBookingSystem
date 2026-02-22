/**
 * 设施区模块 - 点击全部设施打开详情抽屉
 */

import React, { useState } from 'react'
import PropertyCardContainer from '../PropertyCardContainer'
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay'
import { CheckIcon, CrossIcon } from '../../../homestay/icons/FacilityIcons'
import { FACILITY_CATEGORIES } from '../../../../constants/facilities'
import styles from './index.module.scss'

interface FacilitiesSectionProps {
  data?: any
  onOpenFullFacilities?: () => void
  roomName?: string
}

/**
 * FacilitiesSection 内容组件
 */
const FacilitiesSectionContent: React.FC<FacilitiesSectionProps> = ({ data }) => {
  // 只显示服务、基础、卫浴三个类别，并优先显示有的设施，最多两行（6个）
  const displayCategories = FACILITY_CATEGORIES.filter((c) =>
    ['service', 'basic', 'bathroom'].includes(c.id)
  ).map((category) => {
    const sortedFacilities = [
      ...category.facilities.filter((f) => f.available),
      ...category.facilities.filter((f) => !f.available),
    ]
    return {
      ...category,
      facilities: sortedFacilities.slice(0, 6), // 每个分类最多显示 6 个设施
    }
  })

  return (
    <div className={styles.facilitiesList}>
      {displayCategories.map((category) => (
        <div key={category.id} className={styles.categoryBlock}>
          {/* 分类名 - 左侧 */}
          <div className={styles.categoryName}>{category.name}</div>

          {/* 分类设施 - 右侧，一行三个 */}
          <div className={styles.itemsGrid}>
            {category.facilities.map((facility) => (
              <div key={facility.id} className={styles.facilityItem}>
                {facility.available ? (
                  <CheckIcon width={18} height={18} color="#43ae4a" />
                ) : (
                  <CrossIcon width={18} height={18} color="#d3d3d3" />
                )}
                <span className={styles.itemName}>{facility.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ data, onOpenFullFacilities, roomName = '' }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // 创建虚拟room对象用于显示设施信息
  const facilitiesRoom = {
    id: 'facilities',
    name: '所有设施',
    area: '',
    beds: '',
    guests: '',
    image: data?.images?.[0] || '',
    price: 0,
    priceNote: '',
    benefits: [],
    packageCount: 0,
  }

  const handleOpenAllFacilities = () => {
    setIsDrawerOpen(true)
    onOpenFullFacilities?.()
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      <PropertyCardContainer
        headerConfig={{
          show: true,
          title: {
            text: '服务/设施',
            show: true,
          },
          textButton: {
            text: '全部设施',
            show: true,
            onClick: handleOpenAllFacilities,
          },
        }}
      >
        <FacilitiesSectionContent data={data} />
      </PropertyCardContainer>

      {/* 设施详情抽屉 - 使用RoomDetailDrawer展示 */}
      <RoomDetailDrawer
        room={isDrawerOpen ? facilitiesRoom : null}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        scrollToFacilities={true}
        facilitiesExpanded={true}
        actualRoomName={roomName}
      />
    </>
  )
}

export default FacilitiesSection
