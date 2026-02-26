/**
 * 房东介绍区域
 * 展示房东信息、评价和联系方式
 */

import React from 'react'
import PropertyCardContainer from '../PropertyCardContainer'
import styles from './index.module.scss'

interface HostInfoProps {
  data?: any
  hostInfo?: any  // 中间件数据
}

/**
 * HostInfo 内容组件
 */
const HostInfoContent: React.FC<HostInfoProps> = ({ hostInfo }) => {
  // 安全处理 hostInfo 为 undefined 的情况
  if (!hostInfo) {
    return <div className={styles.hostInfo} />
  }

  return (
    <div className={styles.hostInfo}>
      {/* 房东头卡 */}
      <div className={styles.hostCard}>
        {/* 头部信息 */}
        <div className={styles.hostHeader}>
          <div className={styles.avatarSection}>
            <img src={hostInfo.avatar} alt={hostInfo.name} className={styles.avatar} />
            <div className={styles.badgeSection}>
              <h2 className={styles.name}>{hostInfo.name}</h2>
              {/* 房东标签 */}
              <div className={styles.tagsRow}>
                {hostInfo.tags?.map((tag, idx) => (
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
              <span className={styles.rating}>{hostInfo.overallRating}</span>
              <span className={styles.totalReviews}>共{hostInfo.totalReviews}条点评</span>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.label}>回复率</div>
            <div className={styles.value}>{hostInfo.responseRate}%</div>
          </div>

          <div className={styles.stat}>
            <div className={styles.label}>订单确认率</div>
            <div className={styles.value}>{hostInfo.orderConfirmationRate}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HostInfo: React.FC<HostInfoProps> = ({ data, hostInfo }) => {
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
      <HostInfoContent data={data} hostInfo={hostInfo} />
    </PropertyCardContainer>
  )
}

export default HostInfo
