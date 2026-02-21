/**
 * 酒店核心信息区 - 符合行业规范
 */

import React from 'react'
import { AreaIcon, BedIcon, UserIcon, MapIcon, HouseIcon, StarIcon } from '../../icons'
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
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="14"
            height="14"
          >
            <path
              d="M513.024 1024h-1.024c-17.92 0-34.816-7.168-47.104-20.48-9.728-10.24-97.28-102.912-184.832-219.648C162.304 625.664 102.4 499.2 102.4 409.088 102.4 183.296 286.208 0 512 0s409.6 183.296 409.6 409.088c0 54.784-20.992 121.856-62.976 199.68-39.936 74.752-100.352 161.792-179.712 258.048l-0.512 0.512-117.76 134.144c-11.776 14.336-29.184 22.528-47.616 22.528z m-1.024-423.936c105.984 0 191.488-86.016 191.488-191.488S617.984 217.6 512 217.6 320 303.104 320 409.088s86.016 190.976 192 190.976z"
              fill="#333333"
            />
          </svg>
          <span>{location}</span>
        </div>
        <button className={styles.mapBtn} title="查看地图">
          <MapIcon width={14} height={14} color="#333333" /> 地图
        </button>
      </div>

      {/* 核心参数卡片 - 规范化 */}
      <div className={styles.coreParamsCard}>
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}><AreaIcon width={20} height={20} color="#333333" /></span>
          <span className={styles.paramValue}>{coreParams.area}</span>
          <span className={styles.paramLabel}>面积</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}><HouseIcon width={20} height={20} color="#333333" /></span>
          <span className={styles.paramValue}>{coreParams.rooms}</span>
          <span className={styles.paramLabel}>房间</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}><BedIcon width={20} height={20} color="#333333" /></span>
          <span className={styles.paramValue}>{coreParams.beds}</span>
          <span className={styles.paramLabel}>床位</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.paramItem}>
          <span className={styles.paramIcon}><UserIcon width={20} height={20} color="#333333" /></span>
          <span className={styles.paramValue}>{coreParams.guests}</span>
          <span className={styles.paramLabel}>人数</span>
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
    </div>
  )
}

export default HotelInfo
