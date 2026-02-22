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
  // 模拟品牌/星级
  const brand = '精选'
  const highlights = ['复式loft房', '可带宠物', '有停车位', '24小时前台']

  // 核心参数（规范化展示）
  const coreParams = {
    area: '190㎡',
    rooms: '3间卧室',
    beds: '5张床',
    guests: '12人',
  }

  // 获取基础信息
  const name = data?.baseInfo?.nameCn || '民宿名称'
  const rating = data?.baseInfo?.star || 4.9
  const reviewCount = data?.baseInfo?.reviewCount || 128
  const location = data?.baseInfo?.address || '城市位置'

  return (
    <>
      {/* 名称 & 评分行 */}
      <div className={styles.headerRow}>
        <div className={styles.left}>
          <h1 className={styles.name}>{name}</h1>
          <div className={styles.badges}>
            <span className={styles.brand}>{brand}</span>
            <span className={styles.stars}>
              <StarIcon width={16} height={16} color="#fa7b1f" />
              <StarIcon width={16} height={16} color="#fa7b1f" />
              <StarIcon width={16} height={16} color="#fa7b1f" />
              <StarIcon width={16} height={16} color="#fa7b1f" />
            </span>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rating}>{rating}</div>
          <div className={styles.ratingLabel}>很好</div>
          <div className={styles.reviewCount}>{reviewCount}条评价</div>
        </div>
      </div>

      {/* 位置 & 交通行 */}
      <div className={styles.locationRow}>
        <div className={styles.address}>
          <PositionIcon width={14} height={14} color="#8da5cd" />
          <span>{location}</span>
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
          <span className={styles.paramValue}>{coreParams.area}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>
            <HouseIcon width={20} height={20} color="#333333" />
          </span>
          <span className={styles.paramValue}>{coreParams.rooms}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>
            <BedIcon width={20} height={20} color="#333333" />
          </span>
          <span className={styles.paramValue}>{coreParams.beds}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>
            <UserIcon width={20} height={20} color="#333333" />
          </span>
          <span className={styles.paramValue}>{coreParams.guests}</span>
        </div>
      </div>

      {/* 核心亮点标签 */}
      <div className={styles.highlightsRow}>
        <div className={styles.highlights}>
          {highlights.map((highlight, idx) => (
            <span key={idx} className={styles.tag}>
              {highlight}
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
