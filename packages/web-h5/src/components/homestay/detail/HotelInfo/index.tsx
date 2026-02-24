/**
 * 酒店核心信息区 - 符合行业规范
 */

import React from 'react'
import PropertyCardContainer from '../PropertyCardContainer'
import { AreaIcon, BedIcon, UserIcon, MapIcon, HouseIcon, StarIcon, PositionIcon } from '../../icons'
import styles from './index.module.scss'

interface HotelInfoProps {
  data: any
}

/**
 * HotelInfo 内容组件 - 不包含容器样式
 */
const HotelInfoContent: React.FC<HotelInfoProps> = ({ data }) => {
  // 安全处理 data 为 undefined 的情况
  if (!data) {
    return null
  }

  return (
    <>
      {/* 名称 & 评分行 */}
      <div className={styles.headerRow}>
        <div className={styles.left}>
          <h1 className={styles.name}>{data.name}</h1>
          <div className={styles.badges}>
            <span className={styles.brand}>{data.brand}</span>
            <span className={styles.stars}>
              <StarIcon width={16} height={16} color="#fa7b1f" />
              <StarIcon width={16} height={16} color="#fa7b1f" />
              <StarIcon width={16} height={16} color="#fa7b1f" />
              <StarIcon width={16} height={16} color="#fa7b1f" />
            </span>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rating}>{data.rating}</div>
          <div className={styles.ratingLabel}>很好</div>
          <div className={styles.reviewCount}>{data.reviewCount}条评价</div>
        </div>
      </div>

      {/* 位置 & 交通行 */}
      <div className={styles.locationRow}>
        <div className={styles.address}>
          <PositionIcon width={14} height={14} color="#8da5cd" />
          <span>{data.address}</span>
        </div>
        <button className={styles.mapBtn} title="查看地图">
          <MapIcon width={14} height={14} color="#333333" /> 地图
        </button>
      </div>

      {/* 核心参数卡片 - 规范化 */}
      <div className={styles.coreParamsCard}>
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>
            <AreaIcon width={20} height={20} color="#333333" />
          </span>
          <span className={styles.paramValue}>{data.area}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>
            <HouseIcon width={20} height={20} color="#333333" />
          </span>
          <span className={styles.paramValue}>{data.room}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>
            <BedIcon width={20} height={20} color="#333333" />
          </span>
          <span className={styles.paramValue}>{data.bed}床</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>
            <UserIcon width={20} height={20} color="#333333" />
          </span>
          <span className={styles.paramValue}>{data.guests}人入住</span>
        </div>
      </div>

      {/* 核心亮点标签 */}
      <div className={styles.highlightsRow}>
        <div className={styles.highlights}>
          {data.tags?.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

const HotelInfo: React.FC<HotelInfoProps> = ({ data }) => {
  return (
    <div style={{ position: 'relative', top: '-140px', zIndex: 10 }}>
      <PropertyCardContainer
        headerConfig={{
          show: false, // HotelInfo 不使用 Header
        }}
      >
        <HotelInfoContent data={data} />
      </PropertyCardContainer>
    </div>
  )
}

export default HotelInfo
