/**
 * 房东介绍区域
 * 展示房东信息、评价和联系方式
 */

import React from 'react'
import styles from './index.module.scss'

interface HostInfoProps {
  data?: any
}

const HostInfo: React.FC<HostInfoProps> = ({ data }) => {
  const hostData = {
    name: '逸可民宿',
    avatar: 'https://picsum.photos/80/80?random=host',
    badge: '超赞房东',
    responseRate: 92,
    responseTime: '平均2分钟回复',
    totalReviews: 90,
    overallRating: 4.9,
    tags: [
      '女 90后',
      '白羊座',
      '上海',
      '汉族',
      '大学本科',
      'ENFP',
    ],
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
              <h3 className={styles.name}>{hostData.name}</h3>
              <span className={styles.badge}>{hostData.badge}</span>
            </div>
          </div>

          {/* 关于房东 */}
          <button className={styles.aboutBtn}>关于房东 ›</button>
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
            <div className={styles.label}>聊天回复率</div>
            <div className={styles.value}>{hostData.responseRate}%</div>
          </div>

          <div className={styles.stat}>
            <div className={styles.label}>订单认证率</div>
            <div className={styles.value}>100%</div>
          </div>
        </div>

        {/* 房东标签 */}
        <div className={styles.tagsRow}>
          {hostData.tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* 房东信息 */}
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <span className={styles.emoji}>✏️</span>
            <span className={styles.text}>{hostData.introduction}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.emoji}>💼</span>
            <span className={styles.text}>我的工作: {hostData.work}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.emoji}>❤️</span>
            <span className={styles.text}>我能: {hostData.canOffer}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.emoji}>⭐</span>
            <span className={styles.text}>高光时刻: {hostData.vlog}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.emoji}>🎯</span>
            <span className={styles.text}>技能: {hostData.skills}</span>
          </div>
        </div>

        {/* 预订信息 */}
        <div className={styles.bookingInfo}>
          <div className={styles.timeSlot}>
            <span className={styles.label}>+1分钟内回复</span>
            <span className={styles.text}>住 {hostData.hottestTime}</span>
          </div>
          <div className={styles.timeSlot}>
            <span className={styles.label}></span>
            <span className={styles.text}>离 {hostData.closestTime}</span>
          </div>
        </div>
      </div>

      {/* 底部预订栏信息 */}
      <div className={styles.priceInfo}>
        <div className={styles.priceLeft}>
          <span className={styles.hot}>🔥 热销房源，仅剩1套</span>
        </div>
        <div className={styles.priceRight}>
          <button className={styles.bookMonthBtn}>
            <span className={styles.hotPrice}>{hostData.hotPrice}</span>
            <span className={styles.action}>抄底价抢订</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HostInfo
