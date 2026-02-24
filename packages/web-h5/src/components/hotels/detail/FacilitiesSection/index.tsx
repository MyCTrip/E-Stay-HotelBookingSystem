import React, { useMemo, useState } from 'react'
import type { FacilityModel } from '@estay/shared'
import BottomDrawer from '../../shared/BottomDrawer'
import { CheckIcon, CrossIcon } from '../../icons/FacilityIcons'
import { facilitiesData } from './facilitiesData'
import styles from './index.module.scss'

interface FacilitiesSectionProps {
  facilities: FacilityModel[]
  previewImage?: string
  onOpenFullFacilities?: () => void
}

interface DisplayFacilityItem {
  id: string
  name: string
  description?: string
  icon?: string
  available: boolean
}

interface DisplayFacilityCategory {
  id: string
  category: string
  icon?: string
  items: DisplayFacilityItem[]
}

const normalizeFacilityData = (facilities: FacilityModel[]): DisplayFacilityCategory[] =>
  facilities
    .filter((facility) => facility.category.trim().length > 0)
    .map((facility, categoryIndex) => ({
      id: `${facility.category}-${categoryIndex}`,
      category: facility.category,
      icon: facility.icon,
      items: (facility.items ?? [])
        .filter((item) => item.name.trim().length > 0)
        .map((item, itemIndex) => ({
          id: `${facility.category}-${item.name}-${itemIndex}`,
          name: item.name,
          description: item.description?.trim(),
          icon: item.icon,
          available: item.available !== false,
        })),
    }))
    .filter((facility) => facility.items.length > 0)

const normalizeMockData = (): DisplayFacilityCategory[] =>
  facilitiesData.map((category, categoryIndex) => ({
    id: `${category.name}-${categoryIndex}`,
    category: category.name,
    icon: category.icon,
    items: category.items.map((item, itemIndex) => ({
      id: `${category.name}-${item.name}-${itemIndex}`,
      name: item.name,
      description: item.description?.trim(),
      icon: item.icon,
      available: item.available ?? item.has ?? true,
    })),
  }))

const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
  previewImage,
  onOpenFullFacilities,
}) => {
  void previewImage

  const [drawerOpen, setDrawerOpen] = useState(false)

  const normalizedCategories = useMemo(() => {
    const fromDomain = normalizeFacilityData(facilities)
    return fromDomain.length > 0 ? fromDomain : normalizeMockData()
  }, [facilities])

  const previewCategories = useMemo(
    () =>
      normalizedCategories.slice(0, 3).map((category) => ({
        ...category,
        items: category.items.slice(0, 4),
      })),
    [normalizedCategories]
  )

  const handleOpenAll = () => {
    setDrawerOpen(true)
    onOpenFullFacilities?.()
  }

  const renderCategory = (category: DisplayFacilityCategory, compact = false) => (
    <div key={category.id} className={styles.categoryBlock}>
      <div className={styles.categoryHeader}>
        <div className={styles.categoryIcon}>{category.icon || '🏨'}</div>
        <h4 className={styles.categoryTitle}>{category.category}</h4>
      </div>

      <div className={styles.itemsGrid}>
        {category.items.map((item) => {
          const isFree = Boolean(item.description?.includes('免费'))
          return (
            <div key={item.id} className={styles.itemCard}>
              <span className={styles.itemStatusIcon}>
                {item.available ? (
                  <CheckIcon width={16} height={16} color="#2bb24c" />
                ) : (
                  <CrossIcon width={16} height={16} color="#b8bec8" />
                )}
              </span>
              <div className={styles.itemBody}>
                <div className={`${styles.itemName} ${item.available ? '' : styles.itemNameDisabled}`}>
                  {item.name}
                </div>
                {item.description ? (
                  <div className={`${styles.itemDesc} ${isFree ? styles.itemDescFree : ''}`}>
                    {item.description}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
      {!compact ? <div className={styles.categoryDivider} /> : null}
    </div>
  )

  if (normalizedCategories.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>服务/设施</h3>
        <button type="button" className={styles.viewAllBtn} onClick={handleOpenAll}>
          全部设施 &gt;
        </button>
      </div>

      <div className={styles.cardWrapper}>
        {previewCategories.map((category) => renderCategory(category, true))}
      </div>

      <BottomDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="所有设施"
        showBackButton={true}
        showHeader={true}
        maxHeight="78vh"
      >
        <div className={styles.drawerContent}>
          {normalizedCategories.map((category) => renderCategory(category))}
        </div>
      </BottomDrawer>
    </section>
  )
}

export default FacilitiesSection
