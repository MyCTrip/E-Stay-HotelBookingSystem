import React, { useMemo, useRef, useState } from 'react'
import type { HotelFacilityModel } from '@estay/shared'
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay'
import { CheckIcon, CrossIcon } from '../../../homestay/icons/FacilityIcons'
import type { FacilityCategory } from '../../../../constants/facilities'
import { FACILITY_CATEGORIES } from '../../../../constants/facilities'
import styles from './index.module.scss'

interface FacilitiesSectionProps {
  facilities: HotelFacilityModel[]
  previewImage?: string
  onOpenFullFacilities?: () => void
}

interface LegacyDrawerRoom {
  id: string
  name: string
  area: string
  beds: string
  guests: string
  image: string
  price: number
  priceNote: string
  benefits: string[]
  packageCount: number
}

const splitTokens = (text: string): string[] =>
  text
    .split(/[,\uFF0C\/\u3001;|\n]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

const normalizeText = (text: string): string => text.replace(/\s+/g, '').toLowerCase()

const buildFacilityTokenSet = (facilities: HotelFacilityModel[]): Set<string> => {
  const tokens = new Set<string>()

  facilities.forEach((item) => {
    splitTokens(item.category).forEach((token) => tokens.add(normalizeText(token)))
    splitTokens(item.content).forEach((token) => tokens.add(normalizeText(token)))
    splitTokens(item.summary ?? '').forEach((token) => tokens.add(normalizeText(token)))
  })

  return tokens
}

const matchFacility = (facilityName: string, tokenSet: Set<string>): boolean => {
  const normalizedName = normalizeText(facilityName)
  if (tokenSet.has(normalizedName)) {
    return true
  }

  for (const token of tokenSet) {
    if (token.includes(normalizedName) || normalizedName.includes(token)) {
      return true
    }
  }
  return false
}

const mapFacilitiesToCategories = (
  facilities: HotelFacilityModel[],
  categories: FacilityCategory[]
): FacilityCategory[] => {
  if (facilities.length === 0) {
    return categories
  }

  const tokenSet = buildFacilityTokenSet(facilities)

  return categories.map((category) => ({
    ...category,
    facilities: category.facilities.map((facility) => ({
      ...facility,
      available: matchFacility(facility.name, tokenSet),
    })),
  }))
}

const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
  previewImage = '',
  onOpenFullFacilities,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const mappedCategories = useMemo(
    () => mapFacilitiesToCategories(facilities, FACILITY_CATEGORIES),
    [facilities]
  )

  const facilitiesRoom: LegacyDrawerRoom = {
    id: 'facilities',
    name: '全部设施',
    area: '',
    beds: '',
    guests: '',
    image: previewImage,
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

  const displayCategories = mappedCategories
    .filter((c) => ['service', 'basic', 'bathroom'].includes(c.id))
    .map((category) => {
      const sortedFacilities = [
        ...category.facilities.filter((f) => f.available),
        ...category.facilities.filter((f) => !f.available),
      ]
      return {
        ...category,
        facilities: sortedFacilities.slice(0, 6),
      }
    })

  return (
    <>
      <div className={styles.facilitiesSection} ref={sectionRef}>
        <div className={styles.header}>
          <h3 className={styles.title}>服务/设施</h3>
          <button className={styles.viewAllBtn} onClick={handleOpenAllFacilities}>
            全部设施 <span className={styles.arrow}>›</span>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.facilitiesList}>
            {displayCategories.map((category) => (
              <div key={category.id} className={styles.categoryBlock}>
                <div className={styles.categoryName}>{category.name}</div>

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
        </div>
      </div>

      <RoomDetailDrawer
        room={isDrawerOpen ? facilitiesRoom : null}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        scrollToFacilities={true}
        facilitiesExpanded={true}
      />
    </>
  )
}

export default FacilitiesSection
