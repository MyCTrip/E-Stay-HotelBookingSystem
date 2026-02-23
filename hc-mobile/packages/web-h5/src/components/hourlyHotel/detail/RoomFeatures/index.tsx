/**
 * 房屋特色区域
 * 展示民宿的特色设施和房间亮点
 */

import React from 'react'
import styles from './index.module.scss'

interface RoomFeaturesProps {
  data?: any
}

const RoomFeatures: React.FC<RoomFeaturesProps> = ({ data }) => {
  const features = [
    {
      title: '4K高清摄影',
      subtitle: '房间视听',
      icon: '📷',
      description: '1、交通便捷：步行到10分钟内某处下车入口广场\n2、房间内高端设施和视听设备\n3、商业汇集：主要卖场、百货等\n4、东方明珠、浦东跨江大桥等可直观看到',
      image: 'https://picsum.photos/300/200?random=feature1',
    },
    {
      title: '游戏娱乐室',
      subtitle: '家庭活动',
      icon: '🎮',
      description: '宽敞的游戏娱乐室，配备最新游戏设备',
      image: 'https://picsum.photos/300/200?random=feature2',
    },
  ]

  return (
    <div className={styles.roomFeatures}>
      <div className={styles.header}>
        <h2 className={styles.title}>房屋特色</h2>
      </div>

      <div className={styles.featuresList}>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.featureCard}>
            {/* 特色标题 */}
            <div className={styles.featureHeader}>
              <span className={styles.icon}>{feature.icon}</span>
              <div className={styles.titleSection}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.subtitle}>{feature.subtitle}</p>
              </div>
            </div>

            {/* 特色描述 */}
            <p className={styles.description}>
              {feature.description}
            </p>

            {/* 特色图片 */}
            {feature.image && (
              <div className={styles.imageContainer}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={styles.image}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 查看更多 */}
      <button className={styles.viewMoreBtn}>展开查看全部房间</button>
    </div>
  )
}

export default RoomFeatures
