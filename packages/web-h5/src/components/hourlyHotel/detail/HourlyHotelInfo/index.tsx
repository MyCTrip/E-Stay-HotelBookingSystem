/**
 * 钟点房核心信息区 - 对齐民宿 UI 风格
 */

import React from 'react'
import styles from './index.module.scss'

interface HourlyHotelInfoProps {
  data: any
}

const HourlyHotelInfo: React.FC<HourlyHotelInfoProps> = ({ data }) => {
  // 从 mock 数据或真实数据中提取
  const name = data?.baseInfo?.nameCn || '全季酒店(上海浦东世纪大道店)'
  const rating = data?.baseInfo?.star || 4.5
  const reviewCount = data?.baseInfo?.reviewCount || 320
  const location = data?.baseInfo?.address || '上海市浦东新区潍坊路'
  const timeWindow = data?.baseInfo?.timeWindow || '08:00-20:00'
  const duration = data?.duration || 3
  const price = data?.price || 90

  const tags = data?.baseInfo?.tags || ['秒确认', '近地铁', '免费停车']
  const promotions = ['新用户立减¥10', '钟点房连住优惠']

  // 钟点房特色核心参数
  const coreParams = {
    time: timeWindow,
    duration: `${duration}小时`,
    confirm: '立即确认',
  }

  return (
    <div className={styles.infoCard}>
      {/* 名称 & 评分行 */}
      <div className={styles.headerRow}>
        <div className={styles.left}>
          <h1 className={styles.name}>{name}</h1>
          <div className={styles.badges}>
            <span className={styles.brand}>钟点房</span>
            <span className={styles.stars}>⭐⭐⭐⭐</span>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rating}>{rating.toFixed(1)}</div>
          <div className={styles.ratingLabel}>
            {rating >= 4.5 ? '极好' : rating >= 4.0 ? '很好' : '不错'}
          </div>
          <div className={styles.reviewCount}>{reviewCount}条评价</div>
        </div>
      </div>

      {/* 位置行 */}
      <div className={styles.locationRow}>
        <span className={styles.address}>📍 {location}</span>
        <button className={styles.mapBtn} title="查看地图">
          🗺️ 地图
        </button>
      </div>

      {/* 核心参数卡片 - 替换为钟点房特有属性 */}
      <div className={styles.coreParamsCard}>
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>🕒</span>
          <span className={styles.paramValue}>{coreParams.time}</span>
          <span className={styles.paramLabel}>可用时段</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>⏳</span>
          <span className={styles.paramValue}>{coreParams.duration}</span>
          <span className={styles.paramLabel}>起步时长</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}>⚡</span>
          <span className={styles.paramValue}>{coreParams.confirm}</span>
          <span className={styles.paramLabel}>确认速度</span>
        </div>
      </div>

      {/* 价格信息行 - 突出显示 */}
      <div className={styles.priceRow}>
        <span className={styles.priceLabel}>起价</span>
        <div className={styles.priceBlock}>
          <span className={styles.price}>¥{price}</span>
          <span className={styles.unit}>/{duration}小时</span>
        </div>
      </div>

      {/* 核心亮点标签 */}
      <div className={styles.highlightsRow}>
        <div className={styles.highlights}>
          {tags.map((tag: string, idx: number) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 优惠提示行 */}
      {promotions.length > 0 && (
        <div className={styles.promoRow}>
          {promotions.map((promo, idx) => (
            <div key={idx} className={styles.promoItem}>
              <span className={styles.promoIcon}>🎉</span>
              <span className={styles.promoText}>{promo}</span>
              {idx === 0 && <button className={styles.detailBtn}>详情</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HourlyHotelInfo