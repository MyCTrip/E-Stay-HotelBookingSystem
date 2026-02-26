import React from 'react'
import type { CheckinInfoModel, HotelEntityBaseInfoModel } from '@estay/shared'
import styles from './index.module.scss'

interface RoomFeaturesProps {
  data?: {
    baseInfo?: Pick<HotelEntityBaseInfoModel, 'description' | 'images'>
    checkinInfo?: Pick<CheckinInfoModel, 'checkinTime' | 'checkoutTime' | 'breakfastType'>
  } | null
}

const RoomFeatures: React.FC<RoomFeaturesProps> = ({ data }) => {
  const description =
    data?.baseInfo?.description?.trim() || '\u9152\u5e97\u6682\u672a\u63d0\u4f9b\u8be6\u7ec6\u4eae\u70b9\u4ecb\u7ecd\u3002'
  const breakfastType =
    data?.checkinInfo?.breakfastType?.trim() || '\u65e9\u9910\u4fe1\u606f\u4ee5\u524d\u53f0\u5b9e\u9645\u4e3a\u51c6'
  const checkinWindow = data?.checkinInfo?.checkinTime ?? '14:00'
  const checkoutWindow = data?.checkinInfo?.checkoutTime ?? '12:00'

  const features = [
    {
      title: '\u9152\u5e97\u4eae\u70b9',
      subtitle: '\u6838\u5fc3\u6982\u89c8',
      icon: '\ud83c\udfe8',
      description,
      image: data?.baseInfo?.images[0] ?? 'https://picsum.photos/300/200?random=feature1',
    },
    {
      title: '\u5165\u79bb\u4e0e\u65e9\u9910',
      subtitle: '\u5165\u4f4f\u4fe1\u606f',
      icon: '\ud83c\udf74',
      description: `\u5165\u4f4f\uff1a${checkinWindow} | \u9000\u623f\uff1a${checkoutWindow} | ${breakfastType}`,
      image: data?.baseInfo?.images[1] ?? 'https://picsum.photos/300/200?random=feature2',
    },
  ]

  return (
    <div className={styles.roomFeatures}>
      <div className={styles.header}>
        <h2 className={styles.title}>{'\u9152\u5e97\u7279\u8272'}</h2>
      </div>

      <div className={styles.featuresList}>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.featureCard}>
            <div className={styles.featureHeader}>
              <span className={styles.icon}>{feature.icon}</span>
              <div className={styles.titleSection}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.subtitle}>{feature.subtitle}</p>
              </div>
            </div>

            <p className={styles.description}>{feature.description}</p>

            {feature.image && (
              <div className={styles.imageContainer}>
                <img src={feature.image} alt={feature.title} className={styles.image} />
              </div>
            )}
          </div>
        ))}
      </div>

      <button className={styles.viewMoreBtn}>{'\u67e5\u770b\u5168\u90e8\u7279\u8272'}</button>
    </div>
  )
}

export default RoomFeatures
