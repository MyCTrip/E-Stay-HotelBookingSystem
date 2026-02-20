/**
 * 酒店核心信息区 - 符合行业规范
 */

import React from 'react'
import styles from './index.module.scss'

interface HotelInfoProps {
  data: any
}

const HotelInfo: React.FC<HotelInfoProps> = ({ data }) => {
  // 模拟品牌/星级
  const brand = '精选'
  const highlights = ['复式loft房', '可带宠物', '有停车位', '24小时前台']
  const promotions = ['新用户立减¥100', '会员优惠20%']
  
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
  const price = data?.price || 1280

  return (
    <div className={styles.infoCard}>
      {/* 名称 & 评分行 */}
      <div className={styles.headerRow}>
        <div className={styles.left}>
          <h1 className={styles.name}>{name}</h1>
          <div className={styles.badges}>
            <span className={styles.brand}>{brand}</span>
            <span className={styles.stars}>⭐⭐⭐⭐</span>
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
        <span className={styles.address}>📍 {location}</span>
        <button className={styles.mapBtn} title="查看地图">
          🗺️ 地图
        </button>
      </div>

      {/* 核心参数卡片 - 规范化 */}
      <div className={styles.coreParamsCard}>
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>📐</span>
          <span className={styles.paramValue}>{coreParams.area}</span>
          <span className={styles.paramLabel}>面积</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>🚪</span>
          <span className={styles.paramValue}>{coreParams.rooms}</span>
          <span className={styles.paramLabel}>房间</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>🛏️</span>
          <span className={styles.paramValue}>{coreParams.beds}</span>
          <span className={styles.paramLabel}>床位</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>👥</span>
          <span className={styles.paramValue}>{coreParams.guests}</span>
          <span className={styles.paramLabel}>人数</span>
        </div>
      </div>

      {/* 价格信息行 - 突出显示 */}
      <div className={styles.priceRow}>
        <span className={styles.priceLabel}>起价</span>
        <div className={styles.priceBlock}>
          <span className={styles.price}>¥{price}</span>
          <span className={styles.unit}>/晚</span>
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

      {/* 优惠提示行 */}
      <div className={styles.promoRow}>
        {promotions.map((promo, idx) => (
          <div key={idx} className={styles.promoItem}>
            <span className={styles.promoIcon}>🎉</span>
            <span className={styles.promoText}>{promo}</span>
            {idx === 0 && <button className={styles.detailBtn}>详情</button>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HotelInfo
