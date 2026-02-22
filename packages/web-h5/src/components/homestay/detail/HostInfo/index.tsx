/**
 * 房东介绍区域
 * 展示房东信息、评价和联系方式
 */

import React from 'react'
import PropertyCardContainer from '../PropertyCardContainer'
import styles from './index.module.scss'

interface HostInfoProps {
  data?: any
}

/**
 * HostInfo 内容组件
 */
const HostInfoContent: React.FC<HostInfoProps> = ({ data }) => {
  const hostData = {
    name: '逸可民宿',
    avatar: 'https://picsum.photos/80/80?random=host',
    badge: '超赞房东',
    responseRate: 92,
    responseTime: '平均2分钟回复',
    totalReviews: 90,
    overallRating: 4.9,
    tags: ['自然人房东', '实名验证', '14套房屋'],
    introduction: '喜欢挑战、探索未知、人生无限！',
    work: '室内设计师',
    canOffer: '本地人提供全方位景点和美食攻略',
    vlog: '走过20几个国家',
    skills: '旅游规划大师',
    hottestTime: '住 02-16',
    closestTime: '离 02-17',
    hotPrice: '¥990 ¥1800',
  }

  return (
    <div className={styles.hostInfo}>
      {/* 房东头卡 */}
      <div className={styles.hostCard}>
        {/* 头部信息 */}
        <div className={styles.hostHeader}>
          <div className={styles.avatarSection}>
            <img src={hostData.avatar} alt={hostData.name} className={styles.avatar} />
            <div className={styles.badgeSection}>
              <h2 className={styles.name}>{hostData.name}</h2>
              {/* 房东标签 */}
              <div className={styles.tagsRow}>
                {hostData.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 关于房东 */}
          <button className={styles.aboutBtn}>联系房东</button>
        </div>

        {/* 统计信息 */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <div className={styles.label}>整体评分</div>
            <div className={styles.value}>
              <span className={styles.rating}>{hostData.overallRating}</span>
              <span className={styles.totalReviews}>共{hostData.totalReviews}条点评</span>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.label}>回复率</div>
            <div className={styles.value}>{hostData.responseRate}%</div>
          </div>

          <div className={styles.stat}>
            <div className={styles.label}>订单确认率</div>
            <div className={styles.value}>100%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HostInfo: React.FC<HostInfoProps> = ({ data }) => {
  return (
    <PropertyCardContainer
      headerConfig={{
        show: true, 
        title:{
          show: true,
          text: '房东介绍',
        },
        textButton: {
          show: true,
          text: '房东主页',
          onClick: () => {}
        }
      }}
    >
      <HostInfoContent data={data} />
    </PropertyCardContainer>
  )
}

export default HostInfo
